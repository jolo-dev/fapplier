chrome.action.onClicked.addListener(() => {
  console.log('Background Task was clicked');
  chrome.tabs.create({ url: './src/background/index.html' });
});
