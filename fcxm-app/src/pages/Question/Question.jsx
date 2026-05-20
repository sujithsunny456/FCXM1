import { useState, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import Header from '../../components/layout/Header'
import Button from '../../components/common/Button'
import ProgressBar from '../../components/common/ProgressBar'
import styles from './Question.module.css'

const QUESTIONS = {
  behavioral: [
    'Tell me about a time you handled a difficult situation at work.',
    'Describe a moment when you had to work under pressure. How did you manage it?',
    'Give an example of a goal you set and how you achieved it.',
    'Tell me about a time you disagreed with a colleague. How did you resolve it?',
    'Describe a situation where you showed leadership.',
  ],
  technical: [
    'Walk me through your technical background and key skills.',
    'Describe a challenging technical problem you solved recently.',
    'How do you approach debugging a complex issue?',
    'Explain a technology or tool you are most proficient in.',
    'How do you stay current with new technologies in your field?',
  ],
  leadership: [
    'Tell me about your leadership style.',
    'Describe a time you motivated a team through a difficult project.',
    'How do you handle underperforming team members?',
    'Give an example of a strategic decision you made and its outcome.',
    'How do you prioritize when managing multiple projects?',
  ],
  general: [
    'Tell me about yourself.',
    'Why are you interested in this role?',
    'What are your greatest strengths?',
    'Where do you see yourself in 5 years?',
    'Why are you leaving your current position?',
  ],
}

export default function Question() {
  const navigate = useNavigate()
  const location = useLocation()
  const type = location.state?.type || 'behavioral'
  const questions = QUESTIONS[type] || QUESTIONS.behavioral

  const [currentIndex, setCurrentIndex] = useState(0)
  const [answer, setAnswer] = useState('')
  const [answers, setAnswers] = useState([])
  const [isRecording, setIsRecording] = useState(false)
  const [recordingError, setRecordingError] = useState('')

  const mediaRecorderRef = useRef(null)
  const chunksRef = useRef([])

  async function startRecording() {
    setRecordingError('')
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      chunksRef.current = []

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data)
      }

      mediaRecorder.onstop = () => {
        stream.getTracks().forEach((t) => t.stop())
        // In a real app, send audio to speech-to-text API here
        setAnswer((prev) => prev + (prev ? ' ' : '') + '[Voice response recorded]')
      }

      mediaRecorder.start()
      setIsRecording(true)
    } catch {
      setRecordingError('Microphone access denied. Please type your answer below.')
    }
  }

  function stopRecording() {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
    }
  }

  function handleNext() {
    const updatedAnswers = [...answers, { question: questions[currentIndex], answer }]
    setAnswers(updatedAnswers)
    setAnswer('')

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1)
    } else {
      navigate('/results', { state: { answers: updatedAnswers, type } })
    }
  }

  const progress = ((currentIndex + 1) / questions.length) * 100

  return (
    <div className={styles.page}>
      <Header />
      <ProgressBar current={3} total={5} />
      <main className={styles.main}>
        <div className={styles.card}>
          <div className={styles.meta}>
            <span className={styles.badge}>{type.charAt(0).toUpperCase() + type.slice(1)} Interview</span>
            <span className={styles.counter}>Question {currentIndex + 1} of {questions.length}</span>
          </div>

          <div className={styles.progressTrack}>
            <div className={styles.progressFill} style={{ width: `${progress}%` }} />
          </div>

          <h2 className={styles.question}>{questions[currentIndex]}</h2>

          {recordingError && <p className={styles.recordingError}>{recordingError}</p>}

          <div className={styles.micRow}>
            {!isRecording ? (
              <button
                className={styles.micBtn}
                onClick={startRecording}
                aria-label="Start recording"
                title="Record your answer"
              >
                <span className={styles.micIcon}>🎙️</span>
                <span>Record Answer</span>
              </button>
            ) : (
              <button
                className={`${styles.micBtn} ${styles.recording}`}
                onClick={stopRecording}
                aria-label="Stop recording"
                title="Stop recording"
              >
                <span className={styles.micIcon}>⏹️</span>
                <span>Stop Recording</span>
              </button>
            )}
          </div>

          <div className={styles.field}>
            <label htmlFor="answer">Your Answer</label>
            <textarea
              id="answer"
              rows={5}
              placeholder="Type your answer here, or use the mic button above to record..."
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
            />
          </div>

          <div className={styles.actions}>
            <Button
              variant="primary"
              onClick={handleNext}
              disabled={!answer.trim()}
            >
              {currentIndex < questions.length - 1 ? 'Next Question →' : 'Finish & See Results →'}
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
