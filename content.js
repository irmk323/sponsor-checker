import { add } from "./lib/utils";

console.log('add', add);


document.addEventListener('mouseup', function (event) {
  const selectedText = window.getSelection().toString().trim();
  if (selectedText !== '') {
    // Create a popup div
    const popupDiv = createPopup(event.clientX, event.clientY + 10, selectedText);

    // Send message to background script with selected word
    chrome.runtime.sendMessage({ action: 'setSelectedWord', selectedWord: selectedText });

    // Listen for response from background script
    chrome.runtime.onMessage.addListener(function (message) {
      if (message.action === 'matchResult') {
        popupDiv.innerHTML += `<p>Match Result: ${message.matchResult}</p>`;
      }
    });
  }
});

function createPopup(x, y, selectedText) {
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
