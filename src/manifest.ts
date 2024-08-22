import { defineManifest } from '@crxjs/vite-plugin';
import packageData from '../package.json';

//@ts-ignore
const isDev = process.env.NODE_ENV === 'development';

export default defineManifest({
  name: `${packageData.displayName || packageData.name}${isDev ? ' ➡️ Dev' : ''}`,
  description: packageData.description,
  version: packageData.version,
  manifest_version: 3,
  icons: {
    16: 'img/logo-16.png',
    32: 'img/logo-34.png',
    48: 'img/logo-48.png',
    128: 'img/logo-128.png',
  },
  action: {
    default_popup: 'popup.html',
    default_title: 'Fapplier',
    default_icon: 'img/logo-48.png',
  },
  // options_page: 'options.html',
  // devtools_page: 'devtools.html',
  background: {
    service_worker: 'src/background/index.ts',
    type: 'module',
  },
  content_scripts: [
    {
      matches: ['http://*/*', 'https://*/*'],
      js: ['src/contentScript/index.ts'],
    },
  ],
  side_panel: {
    default_path: 'sidepanel.html',
  },
  web_accessible_resources: [
    {
      resources: ['img/logo-16.png', 'img/logo-34.png', 'img/logo-48.png', 'img/logo-128.png'],
      matches: [],
    },
  ],
  permissions: ['cookies', 'sidePanel', 'storage', 'identity'],
  oauth2: {
    client_id: '907417617106-oib5isnbb9im2vis47lbr6lcd1ct0hvf.apps.googleusercontent.com',
    scopes: ['profile email'],
  },
  key: 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAlnABjt5BYM/vqMN+YJr2RQ9Wm30w+irySGD6DlQ41YUiJAPU87nwGz0UXQXuKAn+ngoF7eas6gKfMIrW9lFZLBPuET7tY02MBi7Njo3X/fYxZllTRe4GnVLpoYo2pquLa8qRNhLzYR2hxkARogIc+MU/ZrhJuxYvqiNuNWdou3Fg5qWl6i7ENTvT+ZPHlgh1ZNjHVTxEms4+ckfadXK/3sBgGYnmz8S4DMTaRlrSoxN+XNsZskweYRd5k6GjEwMkfvbNoNIAD6/Lism4ctgrSbzVti6xwT/rpdmt/mCFwZHg/h3KgrRXLRkyRr0/HIUxATX3QD6orue68tp/bjMBVQIDAQAB',
});
