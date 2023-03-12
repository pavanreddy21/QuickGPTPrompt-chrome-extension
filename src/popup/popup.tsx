import React, { useState, useEffect } from "react";
import './popup.css'

const Popup = () => {
    const [inputValue, setInputValue] = useState("");
    const [showSuccess, setShowSuccess] = useState(false);

    const handleInputChange = (event) => {
        setInputValue(event.target.value);
    }

    const handleFormSubmit = () => {
        const trimmedValue = inputValue.trim();
      
        if (!trimmedValue) {
          // If inputValue is empty, show an error message or handle it in any other way
          console.log("Input value cannot be empty");
          return;
        }
      
        chrome.storage.sync.get(['prompts'], (result) => {
          let prompts = result.prompts || [];
          const newPrompt = { id: Date.now(), value: trimmedValue };
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
                <textarea id="message" rows={8} autoFocus className="block p-2.5 w-full text-sm border resize-none" value={inputValue} onChange={handleInputChange} placeholder="Enter prompt ... "></textarea>
                <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2" onClick={handleFormSubmit}>
                    Save
                </button>
                {showSuccess && <div className="text-green-500">Prompt saved successfully!</div>}
            </div>
        </div >
    )
};

export default Popup;
