import { useCallback } from 'react';
import { browser } from 'webextension-polyfill-ts';
import { Link } from 'react-router-dom';

import { Account } from '../../utilities/accounts/types';
import { Balance } from '../../components/Balance/Balance';
import { removeAccount } from '../../utilities/accounts/accounts';
import { LinkBack } from '../../components/LinkBack/LinkBack';
import { Stats } from '../../components/Stats/Stats';
import { paths } from '../paths';
import { Avatar } from '../../components/Avatar/Avatar';

import styles from './RemoveAccount.module.css';

interface Props {
  account: Account;
}

export function RemoveAccount({ account }: Props): JSX.Element {
  const t = browser.i18n.getMessage;

  const handleClick = useCallback(async () => {
    await removeAccount(account);
  }, [account]);

  return (
    <main className={styles.container}>
      <h1 className={styles.heading}>{t('view_RemoveAccount_heading')}</h1>
      <p className={styles.subline}>{t('view_RemoveAccount_subline')}</p>

      <Avatar tartan={account.tartan} address={account.address} />
      <p className={styles.name}>{account.name}</p>

      <Balance address={account.address} />

      <small className={styles.addressLabel}>
        {t('view_RemoveAccount_address')}
      </small>
      <p className={styles.address}>{account.address}</p>
      <p className={styles.explanation}>
        {t('view_RemoveAccount_explanation')}
      </p>

      <p className={styles.buttonsLine}>
        <Link to={paths.home} className={styles.cancel}>
          {t('common_action_cancel')}
        </Link>
        <button type="button" onClick={handleClick} className={styles.remove}>
          {t('view_RemoveAccount_remove')}
        </button>
      </p>

      <LinkBack />

      <Stats />
    </main>
  );
}
