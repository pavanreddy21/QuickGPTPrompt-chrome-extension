import React, { useEffect, useState } from "react";
import SavedPrompts from "../components/SavedPrompts";
import Popup from "./Popup";
import { CONSTANTS } from '../utils'


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
                    Prompts
                </button>
            </div>

            {selectedTab === 0 ? (
                <div className="mt-8">
                    <Popup />
                </div>
            ) : (
                <div>
                    <SavedPrompts />
                </div>
            )}
            <div className="footer" style={{ cursor: "pointer" }}>
                <span className="footer-left" onClick={() => window.open(CONSTANTS.BUY_ME_COFEE)}>
                    Made by <span className="underline">Pavan Reddy</span> with ❤️
                </span>
                <a href={CONSTANTS.BUY_ME_COFEE} target="_blank" rel="noopener noreferrer">
                    <img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" height="40" width="150" />
                </a>
            </div>

        </div>
    );
};

export default App;