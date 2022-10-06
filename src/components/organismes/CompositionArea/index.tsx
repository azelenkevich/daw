import TrackLane from 'components/molecules/TrackLane';
import { stageScaleHandler } from 'components/organismes/CompositionArea/utils';
import { COLORS } from 'constants/colors';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { KonvaEventObject } from 'konva/lib/Node';
import { Stage as StageType } from 'konva/lib/Stage';
import { debounce, uniqueId } from 'lodash';
import { useMemo, useRef, useState } from 'react';
import { Layer, Line, Rect, Stage, Text } from 'react-konva';
import { selectChannel } from 'store/ChannelReducer';
import styles from './styles.module.scss';

const CompositionArea = () => {
  const [scale, setScale] = useState(1);

  const { channels, selectedChannelId } = useAppSelector(
    (state) => state.channels
  );

  const dispatch = useAppDispatch();

  const onSelectChannel = (channelId: string) => {
    dispatch(selectChannel(channelId));
  };

  const areaHeight = channels.length * 63;

  const scaleBy = 1.04;

  const onAreaScale = (e: KonvaEventObject<WheelEvent>): void => {
    e.evt.preventDefault();

    const stage = e.target as StageType;

    
    const oldScale = stage.scaleX();
    
    
    if (e.evt.ctrlKey) {
      stageScaleHandler({ stage, oldScale, scaleBy, event: e });
      return
    }
    // console.log(e.evt)

    if (+(e.evt.deltaY) !== 0) return
    

    if (e.evt.deltaX !== 0) {
      const oldXPosition = stage.x();
      const direction = -e.evt.deltaX;
      console.log('oldXPosition', oldXPosition)
      console.log('direction', direction)
      if (oldXPosition >= 0 && direction > 0) return
      const newPosition = direction < 0 ? oldXPosition * 1.05 + 0.01 : oldXPosition / 1.05 + 0.01

      stage.position({y: 0, x: newPosition })
    }
    

    // console.log(stage.getPosition());
  };

  const lines = useMemo(() => {
    const arr = [];
    for (let i = 0; i < 100; i++) {
      const width = 50 + 50 * i;
      arr.push([width, 0, width, areaHeight]);
    }
    return arr;
  }, [areaHeight]);

  return (
    <div className={styles['compositionArea']}>
      <Stage
        width={1600}
        height={areaHeight}
        className={styles['grid']}
        onWheel={onAreaScale}
      >
        <Layer>
          {lines.map((line, i) => {
            return (
              <Line
                key={i}
                points={line}
                stroke={COLORS.secondary2}
                strokeWidth={1}
                lineCap='round'
                lineJoin='round'
              />
            );
          })}
        </Layer>
      </Stage>
      <div className={styles['trackLanes']}>
        {channels.map((channel) => {
          const isSelected = selectedChannelId === channel.id;

          return (
            <TrackLane
              channel={channel}
              key={channel.id}
              isSelected={isSelected}
              onSelectChannel={onSelectChannel}
            />
          );
        })}
      </div>
    </div>
  );
};

export default CompositionArea;
