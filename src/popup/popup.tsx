import React, { useState, useEffect } from "react";
import './popup.css'

const Popup = () => {
    const [inputValue, setInputValue] = useState("");
    const [showSuccess, setShowSuccess] = useState(false);

    const handleInputChange = (event) => {
        setInputValue(event.target.value);
    }

    const handleFormSubmit = () => {
        chrome.storage.sync.get(['prompts'], (result) => {
            let prompts = result.prompts || [];
            const newPrompt = { id: Date.now(), value: inputValue };
            chrome.storage.sync.set({ prompts: [newPrompt, ...prompts] }, () => {
                setInputValue("");
                setShowSuccess(true);
                console.log('Value is set to ' + prompts);
            });
        });
    }

    return (
        <div>
            <div className="p-4">
                <label htmlFor="message" className="block mb-2 text-sm font-medium">Your Prompt</label>
                <textarea id="message" rows={4} autoFocus className="block p-2.5 w-full text-sm border" value={inputValue} onChange={handleInputChange} placeholder="Enter prompt ... "></textarea>
                <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2" onClick={handleFormSubmit}>
                    Save
                </button>
                {showSuccess && <div className="text-green-500">Prompt saved successfully!</div>}
            </div>
            <div className="footer" style={{ cursor: "pointer" }} onClick={() => window.open("https://pavanreddy21.vercel.app/")}>
                Made by <span className="underline">Pavan Reddy</span>
            </div>
        </div >
    )
};

export default Popup;
