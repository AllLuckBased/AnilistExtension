chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  if (request.action === 'sortComparison') {
    let meanDifference = 0;

    // This is the table which contains all the entries (header included) like anime_name, my_score, his_score
    const compareElement = document.querySelector('.compare');
    if (compareElement) {
      const allEntries = Array.from(compareElement.querySelectorAll('.entry:not(.header)'));

      let sumOfDifferences = 0;
      let consideredEntriesCount = 0;

      allEntries.forEach(entry => {
        const yourStatus = entry.querySelector('.status:nth-child(4)').textContent.trim();
        const theirStatus = entry.querySelector('.status:nth-child(5)').textContent.trim();
        const yourScore = parseFloat(entry.querySelector('.score:nth-child(2)').getAttribute('score'));
        const theirScore = (parseFloat(entry.querySelector('.score:nth-child(3)').getAttribute('score')))*request.scoreScaleFactor;

        if (yourScore === 0 || theirScore === 0 || yourStatus === 'Planning' || theirStatus === 'Planning') {
          entry.remove();
        } else {
          sumOfDifferences += (yourScore - theirScore) * (yourScore - theirScore);
          consideredEntriesCount++;
        }
      });

      meanDifference = (Math.sqrt(sumOfDifferences / consideredEntriesCount)).toFixed(2);

      const sortedEntries = allEntries.filter(entry => entry.parentElement === compareElement).sort((a, b) => {
        const aScoreDifference = Math.abs(parseFloat(a.querySelector('.score:nth-child(2)').getAttribute('score')) - 
                                  (parseFloat(a.querySelector('.score:nth-child(3)').getAttribute('score')))*request.scoreScaleFactor);
        const bScoreDifference = Math.abs(parseFloat(b.querySelector('.score:nth-child(2)').getAttribute('score')) - 
                                  (parseFloat(b.querySelector('.score:nth-child(3)').getAttribute('score')))*request.scoreScaleFactor);
        return aScoreDifference - bScoreDifference;
      });

      sortedEntries.forEach((entry) => {
        compareElement.appendChild(entry);
      });

      sendResponse({ meanDifference: meanDifference });
    }
  }
});

