import { render } from 'react-dom';
import { browser } from 'webextension-polyfill-ts';

import { AppWithProviders } from './views/App/App';

(async () => {
  await browser.tabs.query({ active: true, currentWindow: true });
  browser.runtime.connect(undefined, { name: 'popup' });
  render(<AppWithProviders />, document.getElementById('popup'));
  document.documentElement.lang = browser.i18n.getUILanguage();
})();
