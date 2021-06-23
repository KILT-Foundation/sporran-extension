import { browser } from 'webextension-polyfill-ts';

import { plural } from '../../utilities/plural/plural';
import { KiltAmount } from '../KiltAmount/KiltAmount';
import {
  IdentitiesMap,
  useIdentities,
} from '../../utilities/identities/identities';
import { useStats } from './useStats';

import styles from './Stats.module.css';

interface Props {
  identities: IdentitiesMap;
}

function UnconditionalStats({ identities }: Props): JSX.Element | null {
  const t = browser.i18n.getMessage;

  const stats = useStats(identities);
  if (!stats) {
    return null;
  }

  return (
    <p className={styles.stats}>
      {plural(stats.count, {
        one: 'component_Stats_identity_one',
        other: 'component_Stats_identity_other',
      })}
      <span className={styles.balance}>
        {t('component_Stats_balance')}
        <KiltAmount amount={stats.total} type="funds" />
      </span>
    </p>
  );
}

export function Stats(): JSX.Element | null {
  const identities = useIdentities().data;
  if (!identities || Object.values(identities).length < 2) {
    return null;
  }

  return <UnconditionalStats identities={identities} />;
}
