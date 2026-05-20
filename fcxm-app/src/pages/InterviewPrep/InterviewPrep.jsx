import { useNavigate, useLocation } from 'react-router-dom'
import Header from '../../components/layout/Header'
import Button from '../../components/common/Button'
import ProgressBar from '../../components/common/ProgressBar'
import styles from './InterviewPrep.module.css'

const INTERVIEW_TYPES = [
  { id: 'behavioral', label: 'Behavioral', icon: '🧠', desc: 'Situational & soft-skill questions' },
  { id: 'technical', label: 'Technical', icon: '💻', desc: 'Role-specific technical questions' },
  { id: 'leadership', label: 'Leadership', icon: '🎯', desc: 'Management & decision-making' },
  { id: 'general', label: 'General HR', icon: '🤝', desc: 'Common HR & culture-fit questions' },
]

export default function InterviewPrep() {
  const navigate = useNavigate()
  const location = useLocation()

  // Get profile from navigation state or localStorage
  const profile = location.state?.profile ||
    (() => { try { return JSON.parse(localStorage.getItem('fcxm_profile') || '{}') } catch { return {} } })()

  function handleStart(type) {
    navigate('/question', { state: { type, profile } })
  }

  return (
    <div className={styles.page}>
      <Header />
      <ProgressBar current={2} total={5} />
      <main className={styles.main}>
        <div className={styles.hero}>
          <h1>Start Interview Prep</h1>
          {profile.jobTitle && (
            <div className={styles.profileBadge}>
              <span>🎯 {profile.jobTitle}</span>
              {profile.skills && <span>🛠 {profile.skills}</span>}
            </div>
          )}
          <p>
            Choose the type of interview to practice. Questions will be tailored to your
            {profile.jobTitle ? ` ${profile.jobTitle} ` : ' '}role and skills.
          </p>
        </div>

        <div className={styles.grid}>
          {INTERVIEW_TYPES.map((t) => (
            <div key={t.id} className={styles.card} onClick={() => handleStart(t.id)}>
              <span className={styles.icon}>{t.icon}</span>
              <h3>{t.label}</h3>
              <p>{t.desc}</p>
              <Button variant="outline">Start →</Button>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
