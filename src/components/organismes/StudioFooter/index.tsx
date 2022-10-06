import TransportBar from 'components/molecules/TransportBar';
import styles from './styles.module.scss';

const StudioFooter = () => {
  return (
    <div className={styles['studioFooter']}>
      <TransportBar />
    </div>
  );
};

export default StudioFooter;
