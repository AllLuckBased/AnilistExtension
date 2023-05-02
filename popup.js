if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
  document.body.classList.add('dark');
  document.getElementById('sortButton').classList.add('dark');
}

document.addEventListener('DOMContentLoaded', () => {
  const sortButton = document.getElementById('sortButton');

  sortButton.addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const url = tabs[0].url;
      if (url.includes('anilist.co/user/') && url.includes('/compare')) {
        chrome.tabs.sendMessage(tabs[0].id, { action: 'sortComparison' }, (response) => {
          console.log(response);
          const meanScoreElement = document.querySelector('.mean-score');
          meanScoreElement.innerHTML = `Mean difference: ${response.meanDifference}`;
        });
      }
    });
  });
});
