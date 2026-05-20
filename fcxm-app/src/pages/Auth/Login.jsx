import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../../components/layout/Header'
import Button from '../../components/common/Button'
import ProgressBar from '../../components/common/ProgressBar'
import { loginUser, registerUser } from '../../services/authService'
import styles from './Login.module.css'

export default function Login() {
  const navigate = useNavigate()
  const [mode, setMode] = useState('login') // 'login' | 'register'
  const [form, setForm] = useState({ fullName: '', email: '', password: '', confirmPassword: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError('')
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (!form.email || !form.password) {
      setError('Please fill in all required fields.')
      return
    }

    if (mode === 'register') {
      if (!form.fullName.trim()) {
        setError('Full name is required.')
        return
      }
      if (form.password.length < 6) {
        setError('Password must be at least 6 characters.')
        return
      }
      if (form.password !== form.confirmPassword) {
        setError('Passwords do not match.')
        return
      }
    }

    setLoading(true)
    try {
      if (mode === 'register') {
        await registerUser({ fullName: form.fullName, email: form.email, password: form.password })
      } else {
        await loginUser({ email: form.email, password: form.password })
      }
      navigate('/profile')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  function toggleMode() {
    setMode(mode === 'login' ? 'register' : 'login')
    setForm({ fullName: '', email: '', password: '', confirmPassword: '' })
    setError('')
  }

  return (
    <div className={styles.page}>
      <Header />
      <ProgressBar current={0} total={5} />
      <main className={styles.main}>
        <div className={styles.card}>
          <h1 className={styles.title}>
            {mode === 'login' ? 'Welcome Back' : 'Create Account'}
          </h1>
          <p className={styles.subtitle}>
            {mode === 'login'
              ? 'Sign in to your FocalCXM account'
              : 'Join FocalCXM and start your interview prep'}
          </p>

          {error && <div className={styles.error} role="alert">{error}</div>}

          <form onSubmit={handleSubmit} className={styles.form} noValidate>
            {mode === 'register' && (
              <div className={styles.field}>
                <label htmlFor="fullName">Full Name</label>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  placeholder="Jane Smith"
                  value={form.fullName}
                  onChange={handleChange}
                  autoComplete="name"
                />
              </div>
            )}

            <div className={styles.field}>
              <label htmlFor="email">Email Address</label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                autoComplete="email"
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="password">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder={mode === 'register' ? 'Min. 6 characters' : '••••••••'}
                value={form.password}
                onChange={handleChange}
                autoComplete={mode === 'register' ? 'new-password' : 'current-password'}
              />
            </div>

            {mode === 'register' && (
              <div className={styles.field}>
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="Re-enter your password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  autoComplete="new-password"
                />
              </div>
            )}

            <Button type="submit" variant="primary" disabled={loading}>
              {loading
                ? (mode === 'login' ? 'Signing in...' : 'Creating account...')
                : (mode === 'login' ? 'Sign In' : 'Create Account')}
            </Button>
          </form>

          <p className={styles.toggle}>
            {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}{' '}
            <button className={styles.toggleBtn} onClick={toggleMode} type="button">
              {mode === 'login' ? 'Create one' : 'Sign in'}
            </button>
          </p>
        </div>
      </main>
    </div>
  )
}
