import CompositionArea from 'components/organismes/CompositionArea';
import TrackList from 'components/organismes/TrackList';
import styles from './styles.module.scss';

const StudioMiddle = () => {
  return (
    <div className={styles['studioMiddle']}>
      <TrackList />
      <CompositionArea />
    </div>
  );
};

export default StudioMiddle;
