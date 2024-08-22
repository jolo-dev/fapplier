import * as cheerio from 'cheerio';

// Listen for messages from the Popup
chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
  console.log('contentScript received message', request);

  if (request.type === 'JOB_DESCRIPTION') {
    const html = document.documentElement.innerHTML;
    const $ = cheerio.load(html);
    $('script').remove();
    $('style').remove();
    const content: string =
      $('.jobs-search__job-details--wrapper').text() ||
      $('.job-details-page__content').text() ||
      $('#contents').text() ||
      $('article').text() ||
      $('main').text() ||
      $('body').text();
    console.info('contentScript is running', content);

    // Send the job description to the Popup
    sendResponse({ jobDescription: content });

    chrome.sidePanel
      .setPanelBehavior({
        openPanelOnActionClick: true,
      })
      .catch((e) => {
        console.error(e);
      });
    return true;
  }
});
