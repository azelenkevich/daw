import clsx from 'clsx';
import React, { FC } from 'react';
import { StoredChannel } from 'store/ChannelReducer';

import styles from './styles.module.scss';

type TrackItemProps = {
  channel: StoredChannel;
  isSelected: boolean;
  onSelectChannel: (channelId: string) => void;
};

const TrackItem: FC<TrackItemProps> = ({ channel, isSelected, onSelectChannel }) => {
  return (
    <div
      className={clsx({
        [styles['trackItem']]: true,
        [styles['selected']]: isSelected,
      })}
      onClick={() => onSelectChannel(channel.id)}
    ></div>
  );
};

export default TrackItem;
