import { useCallback, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import BN from 'bn.js';
import { ClipLoader } from 'react-spinners';
import { browser } from 'webextension-polyfill-ts';

import {
  balanceChangeChannel,
  BalanceChangeOutput,
} from '../../channels/balanceChangeChannel/balanceChangeChannel';
import { KiltAmount } from '../KiltAmount/KiltAmount';
import { paths, generatePath } from '../../views/paths';
import { hasVestedFundsChannel } from '../../channels/VestingChannels/VestingChannels';

import styles from './Balance.module.css';

interface BalanceBN {
  free: BN;
  bonded: BN;
  locked: BN;
  total: BN;
}

export function useAddressBalance(address: string): BalanceBN | null {
  const [balance, setBalance] = useState<BalanceBN | null>(null);

  useEffect(() => {
    return balanceChangeChannel.subscribe(
      address,
      (error, output?: BalanceChangeOutput) => {
        if (error || !output) {
          console.error(error);
        } else {
          if (output.address === address) {
            setBalance(output.balances as BalanceBN);
          }
        }
      },
    );
  }, [address]);

  return balance;
}

interface BalanceProps {
  address: string;
  breakdown?: boolean;
}

export function Balance({ address, breakdown }: BalanceProps): JSX.Element {
  const t = browser.i18n.getMessage;
  const balance = useAddressBalance(address);

  const [showBreakdown, setShowBreakdown] = useState(false);

  const [updateDisabled, setUpdateDisabled] = useState(true);

  const handleShowBreakdownClick = useCallback(async () => {
    setShowBreakdown(true);

    (await hasVestedFundsChannel.get(address)) && setUpdateDisabled(false);
  }, [address]);

  const handleHideBreakdownClick = useCallback(() => {
    setShowBreakdown(false);
  }, []);

  const history = useHistory();

  const handleUpdateBalanceClick = useCallback(() => {
    history.push(generatePath(paths.account.vest, { address }));
  }, [history, address]);

  return (
    <>
      <p className={styles.balanceLine}>
        {t('component_Balance_label')}
        {balance !== null && <KiltAmount amount={balance.total} type="funds" />}

        {balance === null && <ClipLoader size={10} />}

        {breakdown &&
          balance !== null &&
          (showBreakdown ? (
            <button
              type="button"
              onClick={handleHideBreakdownClick}
              className={styles.hideBreakdown}
              title={t('component_Balance_hideBreakdown')}
              aria-label={t('component_Balance_hideBreakdown')}
            />
          ) : (
            <button
              type="button"
              onClick={handleShowBreakdownClick}
              className={styles.showBreakdown}
              title={t('component_Balance_showBreakdown')}
              aria-label={t('component_Balance_showBreakdown')}
            />
          ))}
      </p>
      {showBreakdown && balance !== null && (
        <>
          <ul className={styles.breakdown}>
            <li className={styles.balance}>
              {t('component_Balance_free')}
              <KiltAmount amount={balance.free} type="funds" />
            </li>
            <li className={styles.balance}>
              {t('component_Balance_locked')}
              <KiltAmount amount={balance.locked} type="funds" />
            </li>
            <li className={styles.balance}>
              {t('component_Balance_bonded')}
              <KiltAmount amount={balance.bonded} type="funds" />
            </li>
          </ul>
          <button
            type="button"
            onClick={handleUpdateBalanceClick}
            className={styles.update}
            disabled={updateDisabled}
          >
            {t('component_Balance_update')}
          </button>
        </>
      )}
    </>
  );
}
