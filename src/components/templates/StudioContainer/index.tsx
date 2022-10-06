import StudioFooter from 'components/organismes/StudioFooter'
import StudioMiddle from 'components/organismes/StudioMiddle'
import styles from './styles.module.scss'

const StudioContainer = () => {
  return (
    <div className={styles['studioContainer']}>
      <StudioMiddle />
      <StudioFooter />
    </div>
  )
}

export default StudioContainer