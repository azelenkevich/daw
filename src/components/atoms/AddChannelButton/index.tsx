import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { FC } from 'react';

import styles from './styles.module.scss';

type AddChannelButtonProps = {
  onClick: () => void;
};

const AddChannelButton: FC<AddChannelButtonProps> = ({ onClick }) => {
  return (
    <button className={styles['addChannelButton']} onClick={onClick}>
      <FontAwesomeIcon icon={faPlus} className={styles['icon']} size='lg' />
      <span className={styles['addChannel']}>Add channel</span>
    </button>
  );
};

export default AddChannelButton;
