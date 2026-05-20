import { useNavigate } from 'react-router-dom'
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

  function handleStart(type) {
    navigate('/question', { state: { type } })
  }

  return (
    <div className={styles.page}>
      <Header />
      <ProgressBar current={2} total={5} />
      <main className={styles.main}>
        <div className={styles.hero}>
          <h1>Start Interview Prep</h1>
          <p>Choose the type of interview you want to practice. Our AI will guide you through questions and give you a detailed score.</p>
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
