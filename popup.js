document.addEventListener('DOMContentLoaded', function () {
    chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
      if (request.searchText) {
        document.getElementById("result").innerText = "Selected Text: " + request.searchText;
      } else {
        document.getElementById("result").innerText = "No text selected.";
      }
    });
  });