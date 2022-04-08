import { BalanceUtils } from '@kiltprotocol/core';
import { FullDidDetails } from '@kiltprotocol/did';

import { identitiesMock, render } from '../../testing/testing';
import { waitForGetPassword } from '../../channels/SavedPasswordsChannels/SavedPasswordsChannels.mock';
import '../../components/useCopyButton/useCopyButton.mock';
import { useAsyncValue } from '../../utilities/useAsyncValue/useAsyncValue';
import { useDepositWeb3Name } from '../../utilities/getDeposit/getDeposit';
import { useFullDidDetails } from '../../utilities/did/did';

import { W3NRemove } from './W3NRemove';

const identity =
  identitiesMock['4sm9oDiYFe22D7Ck2aBy5Y2gzxi2HhmGML98W9ZD2qmsqKCr'];

jest.mock('../../utilities/did/did');
jest.mocked(useFullDidDetails).mockReturnValue({} as FullDidDetails);

jest.mock('../../utilities/useAsyncValue/useAsyncValue');
jest.mocked(useAsyncValue).mockReturnValue(BalanceUtils.toFemtoKilt(0.01));

jest.mock('../../utilities/getDeposit/getDeposit');

describe('W3NRemove', () => {
  it('should show refund amount including deposit if promo was not used', async () => {
    jest.mocked(useDepositWeb3Name).mockReturnValue({
      owner: identity.address,
      amount: BalanceUtils.toFemtoKilt(2),
    });

    const { container } = render(<W3NRemove identity={identity} />);
    await waitForGetPassword();
    expect(container).toMatchSnapshot();
  });

  it('should show only fee amount if promo was used', async () => {
    jest.mocked(useDepositWeb3Name).mockReturnValue({
      owner: 'some other deposit owner',
      amount: BalanceUtils.toFemtoKilt(2),
    });

    const { container } = render(<W3NRemove identity={identity} />);
    await waitForGetPassword();
    expect(container).toMatchSnapshot();
  });
});
