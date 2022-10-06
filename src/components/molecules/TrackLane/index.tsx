import clsx from 'clsx';
import { FC } from 'react';
import { StoredChannel } from 'store/ChannelReducer';
import styles from './styles.module.scss';

type TrackLaneProps = {
  channel: StoredChannel;
  isSelected: boolean;
  onSelectChannel: (channelId: string) => void;
};

const TrackLane: FC<TrackLaneProps> = ({
  channel,
  onSelectChannel,
  isSelected,
}) => {
  return (
    <div
      className={clsx({
        [styles['trackLane']]: true,
        [styles['selected']]: isSelected,
      })}
      onClick={() => onSelectChannel(channel.id)}
    ></div>
  );
};

export default TrackLane;
