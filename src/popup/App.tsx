import React, { useEffect, useMemo, useState } from "react";
import Popup from "./Popup";
import Papa from 'papaparse';


const SavedPrompts = () => {
    const [prompts, setPrompts] = React.useState([]);
    const [gitPrompts, setGitPrompts] = useState([]);
    const [searchText, setSearchText] = useState('');

    // fetch local prompts and set state
    React.useEffect(() => {
        chrome.storage.sync.get(["prompts"], (result) => {
            setPrompts(result.prompts || []);
        });
    }, []);

    // fetch github prompts and set state
    React.useEffect(() => {
        const fetchPrompts = async () => {
            const response = await fetch(
                "https://raw.githubusercontent.com/f/awesome-chatgpt-prompts/main/prompts.csv"
            );
            const csvText = await response.text();
            const parsedCsv = Papa.parse(csvText, { header: true });
            const csvPrompts = parsedCsv.data.map((row, id) => ({
                id: id,
                value: row.prompt,
                source: "github"
            }));

            setGitPrompts(csvPrompts);
        };
        fetchPrompts();
    }, []);

    // delete prompt handler
    const handleDeletePrompt = (id) => {
        chrome.storage.sync.get(['prompts'], (result) => {
            const prompts = result.prompts || [];
            const updatedPrompts = prompts.filter((prompt) => prompt.id !== id);
            chrome.storage.sync.set({ prompts: updatedPrompts }, () => {
                setPrompts(updatedPrompts);
            });
        });
    };

    // copy to clipboard function
    const copyToClipboard = (text) => {
        const textField = document.createElement("textarea");
        textField.innerText = text;
        document.body.appendChild(textField);
        textField.select();
        document.execCommand("copy");
        textField.remove();
    };

    // memoized combined prompts array
    const combinedPrompts = useMemo(() => {
        return [...prompts, ...gitPrompts];
    }, [prompts, gitPrompts]);

    // filtered prompts based on search text
    const filteredPrompts = combinedPrompts.filter((prompt) => {
        return prompt.value.toLowerCase().includes(searchText.toLowerCase());
    });

    return (
        <>
            <div className="p-4">
                <label htmlFor="search" className="block mb-2 text-sm font-medium">Search Prompts</label>
                <input type="text" id="search" className="block p-2.5 w-full text-sm border" value={searchText} onChange={(event) => setSearchText(event.target.value)} placeholder="Enter search text ... " />
            </div>
            {filteredPrompts.map((prompt) => {
                return (
                    <div key={prompt.id} className="relative justify-between rounded-xl border border-gray-100 p-4 pr-8 shadow-sm mb-2">
                        <button onClick={() => copyToClipboard(prompt.value)} className="absolute top-4 left-4 h-4 w-4">
                            <img src="copy-icon.svg" className="h-4 w-4 mr-2" alt="Copy icon" />
                        </button>
                        {prompt.source !== 'github' ?
                            <button onClick={() => handleDeletePrompt(prompt.id)} className="absolute top-4 right-0 pr-2">
                                <img src="delete-icon.png" className="h-5 w-5 mr-0" alt="Delete icon" />
                            </button> : ''
                        }
                        <span className="ml-8 mr-10">
                            {prompt.value}
                        </span>
                    </div>
                )
            })}
        </>
    );
};






const App = () => {
    const [selectedTab, setSelectedTab] = useState(0);

    useEffect(() => {
        chrome.storage.sync.get("selectedTab", ({ selectedTab }) => {
            if (selectedTab !== undefined) {
                setSelectedTab(selectedTab);
            }
        });
    }, []);

    useEffect(() => {
        chrome.storage.sync.set({ selectedTab });
    }, [selectedTab]);

    const handleTabSelect = (index) => {
        setSelectedTab(index);
    };

    return (
        <div>
            <div className="flex border-b mb-4 font-medium text-lg">
                <button
                    className={`py-2 px-4 font-semibold ${selectedTab === 0
                        ? "border-b-2 border-blue-500"
                        : "border-b-2 border-transparent hover:border-blue-500"
                        }`}
                    onClick={() => handleTabSelect(0)}
                >
                    New
                </button>
                <button
                    className={`py-2 px-4 font-semibold ${selectedTab === 1
                        ? "border-b-2 border-blue-500"
                        : "border-b-2 border-transparent hover:border-blue-500"
                        }`}
                    onClick={() => handleTabSelect(1)}
                >
                    Saved Prompts
                </button>
            </div>

            {selectedTab === 0 ? (
                <div className="mt-8">
                    <Popup />
                </div>
            ) : (
                <div className="overflow-y-auto">
                    <SavedPrompts />
                </div>
            )}
        </div>
    );
};

export default App;