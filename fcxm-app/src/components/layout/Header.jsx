import styles from './Header.module.css'

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.logoWrapper}>
        <img
          src="/logo/focalcxm-logo.svg"
          alt="FocalCXM – Remarkable Experiences"
          className={styles.logo}
        />
      </div>
    </header>
  )
}
