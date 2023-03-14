import React, { useEffect, useMemo, useState } from "react";
import {CONSTANTS} from '../utils';
import Papa from 'papaparse';

const SavedPrompts = () => {
    const [prompts, setPrompts] = React.useState([]);
    const [gitPrompts, setGitPrompts] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [showCopySuccess, setShowCopySuccess] = useState(false);


    // fetch local prompts and set state
    useEffect(() => {
        chrome.storage.sync.get(["prompts"], (result) => {
            setPrompts(result.prompts || []);
        });
    }, []);

    // fetch github prompts and set state
    useEffect(() => {
        const fetchPrompts = async () => {
            const response = await fetch(CONSTANTS.PROMPTS_URL);
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

        setShowCopySuccess(true);
    };

    useEffect(() => {
        let timerId;
        if (showCopySuccess) {
            timerId = setTimeout(() => {
                setShowCopySuccess(false);
            }, 3000);
        }
        return () => {
            clearTimeout(timerId);
        };
    }, [showCopySuccess]);


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
            {showCopySuccess && <div className="ml-4 text-green-600">Copied to clipboard!</div>}
            <div className="overflow-y-auto" style={{ maxHeight: '430px' }} >
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
            </div>
        </>
    );
};



export default SavedPrompts;