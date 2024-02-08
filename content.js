chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.action === "searchCSV") {
      // Perform your CSV search logic here
      // For simplicity, let's assume you have a CSV array named csvData
      const csvData = [
        ["a", "Result1"],
        ["b", "Result2"],
        // Add more data as needed
      ];
  
      const searchText = request.searchText;
      const result = searchCSVData(searchText, csvData);
      sendResponse({ result: result });
    }
  });
  
  function searchCSVData(searchText, csvData) {
    for (let i = 0; i < csvData.length; i++) {
      if (csvData[i][0] === searchText) {
        return csvData[i][1];
      }
    }
    return "No matching data found.";
  }
  