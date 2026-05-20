import styles from './Header.module.css'

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <span className={styles.logoText}>Focal</span>
        <span className={styles.logoCxm}>CXM</span>
        <span className={styles.tagline}>REMARKABLE</span>
      </div>
    </header>
  )
}
