import { injectExtension } from '@polkadot/extension-inject';

import { injectedAccessChannel } from '../AccessChannels/injectedAccessChannel';
import { AccountsInjectedAPI } from '../AccountsInjectedAPI/AccountsInjectedAPI';
import { SignerInjectedAPI } from '../SignerInjectedAPI/SignerInjectedAPI';
import { debounceAsync } from '../../utilities/debounceAsync/debounceAsync';

const authenticate = debounceAsync<typeof injectedAccessChannel.get>((input) =>
  injectedAccessChannel.get(input),
);

export function injectIntoDApp(): void {
  const sporranMeta = {
    name: 'Sporran', // manifest_name
    version: '1.0.0', // TODO: version
  };

  injectExtension(async (unsafeDAppName: string) => {
    const dAppName = unsafeDAppName.substring(0, 50);
    await authenticate({ dAppName });

    return {
      accounts: new AccountsInjectedAPI(dAppName),
      signer: new SignerInjectedAPI(dAppName),
    };
  }, sporranMeta);
}
