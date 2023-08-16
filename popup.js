if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
  document.body.classList.add('dark');
  document.getElementById('sortButton').classList.add('dark');
}

document.addEventListener('DOMContentLoaded', () => {
  const sortButton = document.getElementById('sortButton');
  const scoreFormatDropdown = document.getElementById('scoreFormatDropdown');

  sortButton.addEventListener('click', () => {
    const selectedScoreFormat = parseInt(scoreFormatDropdown.value);
    console.log(selectedScoreFormat)
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      fetchUserPrecision(tabs[0].url.match(/\/user\/([^/]+)\//)[1], selectedScoreFormat).then(scoreScaleFactor => {
        chrome.tabs.sendMessage(tabs[0].id, { action: 'sortComparison', scoreScaleFactor: scoreScaleFactor }, (response) => {
          console.log(response);
          const meanScoreElement = document.querySelector('.mean-score');
          meanScoreElement.innerHTML = `RMS difference: ${response.meanDifference}`;
        });
      })
    });
  });
});

async function fetchUserPrecision(username, selectedScoreFormat) {
  const query = `
    query ($name: String) {
      User(name:$name) {
        mediaListOptions{
          scoreFormat
        }
      }
    }
  `;

  const variables = {"name": username};
  
  const response = await fetch('https://graphql.anilist.co', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({
      query: query,
      variables: variables,
    }),
  })
  const json = await response.json();
  switch(json.data.User.mediaListOptions.scoreFormat) {
    case "POINT_100":
      return selectedScoreFormat/100;
    case "POINT_10_DECIMAL":
      return selectedScoreFormat/10;
    case "POINT_10":
      return selectedScoreFormat/10;
    case "POINT_5":
      return selectedScoreFormat/5;
    case "POINT_3":
      return selectedScoreFormat/3;
  }
}
