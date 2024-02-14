import { isExtensionEnabled } from "./storage/localStorage";

document.addEventListener('mouseup', async function (event) {
    const isEnabled = await isExtensionEnabled();
    const selectedText = window.getSelection()?.toString().trim() ?? "";
    if (isEnabled !== true) {
        return;
    }

    if (selectedText !== '') {
        // Calculate adjusted coordinates based on scroll position
        const x = event.clientX + window.scrollX;
        const y = event.clientY + window.scrollY + 10;
        const popupDiv = createPopup(x, y, selectedText);

        // Send message to background script with selected word
        chrome.runtime.sendMessage({ action: 'setSelectedWord', selectedWord: selectedText });

        // Listen for response from background script
        chrome.runtime.onMessage.addListener(function (message) {
            if (message.action === 'matchResult') {
                popupDiv.innerHTML += `<p>Match Result: ${message.matchResult}</p>`;
            }
            return undefined;
        });
        const outsideClickListener = function (e) {
            if (!popupDiv.contains(e.target)) {
                document.removeEventListener('mousedown', outsideClickListener);
                popupDiv.remove();
            }
        };
        document.addEventListener('mousedown', outsideClickListener);
    }
});

function createPopup(x: number, y: number, selectedText: string) {
    // Create a new popup div
    const popupDiv = document.createElement('div');
    popupDiv.style.position = 'absolute';
    popupDiv.style.left = x + 'px';
    popupDiv.style.top = y + 'px';
    popupDiv.style.background = '#ffffff';
    popupDiv.style.border = '1px solid #000000';
    popupDiv.style.padding = '5px';
    popupDiv.innerHTML = `<p>Selected Word: ${selectedText}</p>`;

    // Append the popup to the body
    document.body.appendChild(popupDiv);

    return popupDiv;
}
