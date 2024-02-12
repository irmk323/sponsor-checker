import React from "react";
import { createRoot } from "react-dom/client";

const Popup: React.FC<{}> = () => {
    // const [savedStuff, setSavedStuff] = React.useState("");
    // const saveFakeData = React.useCallback(async () => {
    //     await chrome.storage.local.set({ miLines: ["line 1", "line 2"] });
    //     console.log("Value is set");
    // }, []);
    // React.useEffect(() => {
    //     async function fetchStuff() {
    //         chrome.storage.local.get('miLines', (res) => {
    //             setSavedStuff(JSON.stringify(res));
    //         });
    //     }
    //     fetchStuff();
    // }, [setSavedStuff]);
    return (
        <div className="popup-page">
            <SaveData />
        </div>
    );
}

const SaveData: React.FC<{}> = () => {
    const [inputText, setInputText] = React.useState("");
    const [sampleData, setSampleData] = React.useState("no data");
    const saveFakeData = React.useCallback(async () => {
        console.log('fetching:', inputText);
        const res = await fetch(inputText, {
            mode: "cors"
        });
        const body = await res.text();
        setSampleData(body);
        console.log(res);
    }, [inputText, setSampleData]);

    return (
        <div>
            <span>No CSV is found.</span>
            <div>
                <input value={inputText} onChange={e => setInputText(e.target.value)}></input>
                <button onClick={saveFakeData}>Fetch</button>
            </div>
            {sampleData}
        </div>
    );
}

const ROOT_DIV_ID = 'popup-root';
const rawRootDiv = document.getElementById(ROOT_DIV_ID);
if (rawRootDiv != null) {
    const root = createRoot(rawRootDiv);
    root.render(<Popup />);
} else {
    console.log(`No element found in the document with the id: "${ROOT_DIV_ID}"`);
}
