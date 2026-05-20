import { useState, useRef, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import Header from '../../components/layout/Header'
import Button from '../../components/common/Button'
import ProgressBar from '../../components/common/ProgressBar'
import { fetchQuestions } from '../../services/questionsService'
import styles from './Question.module.css'

export default function Question() {
  const navigate = useNavigate()
  const location = useLocation()

  const type = location.state?.type || 'behavioral'
  const profile = location.state?.profile ||
    (() => { try { return JSON.parse(localStorage.getItem('fcxm_profile') || '{}') } catch { return {} } })()

  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answer, setAnswer] = useState('')
  const [answers, setAnswers] = useState([])
  const [isRecording, setIsRecording] = useState(false)
  const [recordingError, setRecordingError] = useState('')

  const mediaRecorderRef = useRef(null)
  const chunksRef = useRef([])

  // Fetch questions on mount
  useEffect(() => {
    async function loadQuestions() {
      setLoading(true)
      setLoadError('')
      try {
        const qs = await fetchQuestions({
          jobTitle: profile.jobTitle || 'Professional',
          skills: profile.skills || '',
          experience: profile.experience || '',
          interviewType: type,
        })
        setQuestions(qs)
      } catch (err) {
        setLoadError(err.message)
      } finally {
        setLoading(false)
      }
    }
    loadQuestions()
  }, [])

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
      navigate('/results', { state: { answers: updatedAnswers, type, profile } })
    }
  }

  const progress = questions.length > 0 ? ((currentIndex + 1) / questions.length) * 100 : 0

  // Loading state
  if (loading) {
    return (
      <div className={styles.page}>
        <Header />
        <ProgressBar current={3} total={5} />
        <main className={styles.main}>
          <div className={styles.loadingCard}>
            <div className={styles.spinner} />
            <h2>Generating your questions...</h2>
            <p>
              Tailoring {type} interview questions for
              <strong> {profile.jobTitle || 'your role'}</strong>
              {profile.skills ? ` with skills in ${profile.skills}` : ''}
            </p>
          </div>
        </main>
      </div>
    )
  }

  // Error state
  if (loadError || questions.length === 0) {
    return (
      <div className={styles.page}>
        <Header />
        <ProgressBar current={3} total={5} />
        <main className={styles.main}>
          <div className={styles.loadingCard}>
            <p className={styles.errorMsg}>⚠️ {loadError || 'No questions generated.'}</p>
            <Button variant="primary" onClick={() => navigate('/interview-prep')}>Go Back</Button>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <Header />
      <ProgressBar current={3} total={5} />
      <main className={styles.main}>
        <div className={styles.card}>
          <div className={styles.meta}>
            <div className={styles.metaLeft}>
              <span className={styles.badge}>{type.charAt(0).toUpperCase() + type.slice(1)} Interview</span>
              {profile.jobTitle && <span className={styles.roleBadge}>🎯 {profile.jobTitle}</span>}
            </div>
            <span className={styles.counter}>Question {currentIndex + 1} of {questions.length}</span>
          </div>

          <div className={styles.progressTrack}>
            <div className={styles.progressFill} style={{ width: `${progress}%` }} />
          </div>

          <h2 className={styles.question}>{questions[currentIndex]}</h2>

          {recordingError && <p className={styles.recordingError}>{recordingError}</p>}

          <div className={styles.micRow}>
            {!isRecording ? (
              <button className={styles.micBtn} onClick={startRecording}
                aria-label="Start recording" title="Record your answer">
                <span className={styles.micIcon}>🎙️</span>
                <span>Record Answer</span>
              </button>
            ) : (
              <button className={`${styles.micBtn} ${styles.recording}`} onClick={stopRecording}
                aria-label="Stop recording" title="Stop recording">
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
            <Button variant="primary" onClick={handleNext} disabled={!answer.trim()}>
              {currentIndex < questions.length - 1 ? 'Next Question →' : 'Finish & See Results →'}
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
