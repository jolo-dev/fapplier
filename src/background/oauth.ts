window.onload = () => {
  document.querySelector('#login').addEventListener('click', () => {
    const redirect_url = new URLSearchParams(chrome.identity.getRedirectURL('oauth2'))
      .toString()
      .replace('=', ''); // make sure to define Authorised redirect URIs in the Google Console such as https://<-your-extension-ID->.chromiumapp.org/
    console.log(redirect_url);

    chrome.identity.launchWebAuthFlow(
      {
        url: `http://localhost:9011/oauth2/authorize?client_id=f95db56d-2e57-4f38-ae10-929700c3d925&response_type=code&redirect_uri=${redirect_url}`,
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
        // chrome.storage.sync.set({ auth: JSON.stringify(auth) }, () => {
        //   console.log('Auth saved');
        // });

        chrome.storage.sync.get('auth', (data) => {
          console.log('Yes there is data', data);
        });

        document.getElementById('friendDiv').innerText = JSON.stringify(auth);
      },
    );
  });
};
