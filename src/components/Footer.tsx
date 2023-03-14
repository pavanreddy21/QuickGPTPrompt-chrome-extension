import React from "react";
import { CONSTANTS } from "../utils";

const Footer = () => {
    return (
        <div className="footer" style={{ cursor: "pointer" }}>
            <span className="footer-left" onClick={() => window.open(CONSTANTS.BUY_ME_COFEE)}>
                Made by <span className="underline">Pavan Reddy</span> with ❤️
            </span>
            <a href={CONSTANTS.BUY_ME_COFEE} target="_blank" rel="noopener noreferrer">
                <img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" height="40" width="150" />
            </a>
        </div>)
}

export default Footer;