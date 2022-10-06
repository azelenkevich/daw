import {
  faPlay,
  faPause,
  faStop,
  faBackwardStep,
} from '@fortawesome/free-solid-svg-icons';

import TransportButton from 'components/atoms/TransportButton';
import { useState } from 'react';

import styles from './styles.module.scss';

const TransportBar = () => {
  const [play, setPlay] = useState(false);
  return (
    <div className={styles['transportBar']}>
      <TransportButton
        onClick={() => {}}
        icon={play ? faStop : faBackwardStep}
        className={styles['button']}
      />
      <TransportButton
        onClick={() => {
          setPlay((play) => !play);
        }}
        icon={play ? faPause : faPlay}
        active={play}
        className={styles['button']}
      />
    </div>
  );
};

export default TransportBar;
