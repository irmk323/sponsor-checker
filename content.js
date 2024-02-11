import { add } from "./lib/utils";

console.log('add', add);

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === 'setSelectedWord') {
    const selectedWord = request.selectedWord;

    // Match with CSV data (replace this with your matching logic)
    const matchResult = matchWithCSV(selectedWord);

    // Send the match result back to content script
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { action: 'matchResult', matchResult: matchResult });
    });
  }
});

function matchWithCSV(selectedWord) {
  // Implement your CSV matching logic here
  // For simplicity, a sample matching logic is provided below
  const csvData = "word1,description1\nword2,description2\nword3,description3";
  const lines = csvData.split('\n');
  for (const line of lines) {
    const [word, definition] = line.split(',');
    if (word === selectedWord) {
      return definition;
    }
  }
  return 'No match found';
}
