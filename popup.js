// popup.js

document.addEventListener('DOMContentLoaded', function () {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { action: 'getSelectedWord' }, function (response) {
        const selectedWord = response.selectedWord;
        document.getElementById('selectedWord').innerText = `Selected Word: ${selectedWord}`;
  
        // Match with CSV data (replace this with your matching logic)
        const matchResult = matchWithCSV(selectedWord);
        document.getElementById('matchResult').innerText = `Match Result: ${matchResult}`;
      });
    });
  });
  
  function matchWithCSV(selectedWord) {
    // Implement your CSV matching logic here
    // For simplicity, a sample matching logic is provided below
    const csvData = "word1,definition1\nword2,definition2\nword3,definition3";
    const lines = csvData.split('\n');
    for (const line of lines) {
      const [word, definition] = line.split(',');
      if (word === selectedWord) {
        return definition;
      }
    }
    return 'No match found';
  }
  