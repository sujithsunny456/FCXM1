import { useLocation, useNavigate } from 'react-router-dom'
import { useMemo } from 'react'
import Header from '../../components/layout/Header'
import Button from '../../components/common/Button'
import ProgressBar from '../../components/common/ProgressBar'
import styles from './Results.module.css'

function scoreAnswer(answer) {
  const words = answer.trim().split(/\s+/).length
  if (words < 5) return 3
  if (words < 20) return 5
  if (words < 50) return 7
  if (words < 100) return 8
  return 9
}

function getFeedback(score) {
  if (score >= 9) return { label: 'Excellent', color: '#27ae60', tip: 'Outstanding response — detailed, structured, and confident.' }
  if (score >= 7) return { label: 'Good', color: '#0598CE', tip: 'Solid answer. Consider adding more specific examples to strengthen it.' }
  if (score >= 5) return { label: 'Fair', color: '#FFC000', tip: 'Decent start. Try using the STAR method (Situation, Task, Action, Result).' }
  return { label: 'Needs Work', color: '#e74c3c', tip: 'Short or incomplete. Expand your answer with context and outcomes.' }
}

export default function Results() {
  const location = useLocation()
  const navigate = useNavigate()
  const answers = location.state?.answers || []
  const type = location.state?.type || 'behavioral'

  const scored = useMemo(() =>
    answers.map((a) => ({ ...a, score: scoreAnswer(a.answer) })),
    [answers]
  )

  const avgScore = scored.length
    ? Math.round((scored.reduce((s, a) => s + a.score, 0) / scored.length) * 10) / 10
    : 0

  const overall = getFeedback(avgScore)

  return (
    <div className={styles.page}>
      <Header />
      <ProgressBar current={4} total={5} />
      <main className={styles.main}>
        <div className={styles.hero}>
          <h1>Your Interview Results</h1>
          <p>Here&apos;s a qualitative analysis of your {type} interview performance.</p>
        </div>

        {/* Overall Score Card */}
        <div className={styles.scoreCard}>
          <div className={styles.scoreCircle} style={{ borderColor: overall.color }}>
            <span className={styles.scoreNum} style={{ color: overall.color }}>{avgScore}</span>
            <span className={styles.scoreMax}>/10</span>
          </div>
          <div className={styles.scoreInfo}>
            <h2 style={{ color: overall.color }}>{overall.label}</h2>
            <p>{overall.tip}</p>
            <div className={styles.tags}>
              <span className={styles.tag}>{type.charAt(0).toUpperCase() + type.slice(1)} Interview</span>
              <span className={styles.tag}>{scored.length} Questions</span>
            </div>
          </div>
        </div>

        {/* Per-question breakdown */}
        <h3 className={styles.breakdownTitle}>Question Breakdown</h3>
        <div className={styles.breakdown}>
          {scored.map((item, i) => {
            const fb = getFeedback(item.score)
            return (
              <div key={i} className={styles.qCard}>
                <div className={styles.qHeader}>
                  <span className={styles.qNum}>Q{i + 1}</span>
                  <span className={styles.qScore} style={{ color: fb.color }}>
                    {item.score}/10 — {fb.label}
                  </span>
                </div>
                <p className={styles.qText}>{item.question}</p>
                <p className={styles.qAnswer}><strong>Your answer:</strong> {item.answer}</p>
                <p className={styles.qTip}>💡 {fb.tip}</p>
              </div>
            )
          })}
        </div>

        <div className={styles.actions}>
          <Button variant="secondary" onClick={() => navigate('/interview-prep')}>
            Try Another Interview
          </Button>
          <Button variant="primary" onClick={() => navigate('/profile')}>
            Update Profile
          </Button>
        </div>
      </main>
    </div>
  )
}
