import AddChannelButton from 'components/atoms/AddChannelButton';
import TrackItem from 'components/molecules/TrackItem';
import { instrumentTypes } from 'constants/constants';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { uniqueId } from 'lodash';
import React from 'react';
import { addChannel, selectChannel } from 'store/ChannelReducer';
import styles from './styles.module.scss';

const TrackList = () => {
  const { channels, selectedChannelId } = useAppSelector(
    (state) => state.channels
  );

  const dispatch = useAppDispatch();

  const onAddChannel = () => {
    dispatch(
      addChannel({
        id: uniqueId(),
        name: `Channel ${channels.length + 1}`,
        instrumentId: uniqueId(),
        instrumentType: instrumentTypes.am,
      })
    );
  };

  const onSelectChannel = (channelId: string) => {
    dispatch(selectChannel(channelId));
  };

  return (
    <div className={styles['trackList']}>
      {channels.map((channel) => {
        const isSelected = selectedChannelId === channel.id;

        return (
          <TrackItem
            channel={channel}
            key={channel.id}
            isSelected={isSelected}
            onSelectChannel={onSelectChannel}
          />
        );
      })}
      <AddChannelButton onClick={onAddChannel} />
    </div>
  );
};

export default TrackList;
