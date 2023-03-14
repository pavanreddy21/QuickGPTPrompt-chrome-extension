import React, { useEffect, useState } from "react";
import SavedPrompts from "./SavedPrompts";
import AddPrompt from "./AddPrompt";

const Tabs = () => {
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
    return <div>
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
                Prompts
            </button>
        </div>

        {selectedTab === 0 ? (
            <div className="mt-8">
                <AddPrompt />
            </div>
        ) : (
            <SavedPrompts />
        )}
    </div>
}

export default Tabs;