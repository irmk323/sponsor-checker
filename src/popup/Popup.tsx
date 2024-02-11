import React from "react";
import { createRoot } from "react-dom/client";

const Popup: React.FC<{}> = () => <div>Popup</div>;

const ROOT_DIV_ID = 'popup-root';
const rawRootDiv = document.getElementById(ROOT_DIV_ID);
if (rawRootDiv != null) {
    const root = createRoot(rawRootDiv);
    root.render(<Popup />);
} else {
    console.log(`No element found in the document with the id: "${ROOT_DIV_ID}"`);
}
