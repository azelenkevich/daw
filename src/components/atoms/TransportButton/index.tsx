import { FC } from 'react';
import clsx from 'clsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

import styles from './styles.module.scss';

type TransportButtonProps = {
  icon: IconProp;
  onClick: () => void;
  active?: boolean;
  className?: string;
};

const TransportButton: FC<TransportButtonProps> = ({
  icon,
  onClick,
  className,
  active,
}) => {
  return (
    <button
      className={clsx([
        styles['transportButton'],
        { [styles['active']]: active },
        className,
      ])}
      onClick={onClick}
    >
      <FontAwesomeIcon icon={icon} className={styles['icon']} />
    </button>
  );
};

export default TransportButton;
