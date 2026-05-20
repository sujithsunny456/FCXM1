import styles from './ProgressBar.module.css'

export default function ProgressBar({ current, total }) {
  const steps = ['Login', 'Profile', 'Prep', 'Interview', 'Results']
  return (
    <div className={styles.wrapper}>
      {steps.map((label, i) => (
        <div key={label} className={styles.step}>
          <div className={`${styles.dot} ${i < current ? styles.done : ''} ${i === current ? styles.active : ''}`}>
            {i < current ? '✓' : i + 1}
          </div>
          <span className={`${styles.label} ${i === current ? styles.activeLabel : ''}`}>{label}</span>
          {i < steps.length - 1 && <div className={`${styles.line} ${i < current ? styles.doneLine : ''}`} />}
        </div>
      ))}
    </div>
  )
}
