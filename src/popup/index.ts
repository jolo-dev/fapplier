import './index.css';
import * as showdown from 'showdown';
import van from 'vanjs-core';

const { a, div, h3, main, span } = van.tags;

const coverLetter = div({ class: 'cover-letter' });
const loader = span({ class: 'loader' });

const content = main(h3('Your draft'), coverLetter, a({ target: '_blank' }, 'Fapplier'));

document.addEventListener('DOMContentLoaded', () => {
  console.log('Background Task was clicked');
  const redirectUrl = new URLSearchParams(chrome.identity.getRedirectURL('oauth2'))
    .toString()
    .replace('=', ''); // make sure to define Authorised redirect URIs in the Google Console such as https://<-your-extension-ID->.chromiumapp.org/

  chrome.identity.launchWebAuthFlow(
    {
      url: `http://localhost:9011/oauth2/authorize?client_id=f95db56d-2e57-4f38-ae10-929700c3d925&response_type=code&redirect_uri=${redirectUrl}`,
      interactive: true,
    },
    async (responseUrl) => {
      console.log('responseUrl', responseUrl);

      const code = new URL(responseUrl).searchParams.get('code');
      console.log('code', code);

      const auth = await (
        await fetch('http://localhost:9011/oauth2/token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: `Basic ${btoa(
              'f95db56d-2e57-4f38-ae10-929700c3d925:QeOG0qRzQHRnIeDbjC705OhmzJS2dE3QkPSBwRGCn5Y',
            )}`,
          },
          body: new URLSearchParams({
            code,
            client_id: 'f95db56d-2e57-4f38-ae10-929700c3d925',
            redirect_uri: 'https://dbemnkkneppahhfmmplicmbgnbpeandh.chromiumapp.org/oauth2',
            grant_type: 'authorization_code',
          }).toString(),
        })
      ).json();

      chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { type: 'JOB_DESCRIPTION' }, async (response) => {
          const job = response.jobDescription.replace(/\s+/g, ' ').replace("'", '').trim();
          coverLetter.appendChild(loader);
          const result = await fetch('http://localhost:3000/create-coverletter', {
            body: JSON.stringify({ job }),
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${auth.access_token}`,
            },
            method: 'POST',
          });
          const data = await result.json();
          const converter = new showdown.Converter();
          const html = converter.makeHtml(data.result);
          coverLetter.innerHTML = html;
        });
      });

      const app = document.getElementById('app');
      app.appendChild(content);
    },
  );
});
