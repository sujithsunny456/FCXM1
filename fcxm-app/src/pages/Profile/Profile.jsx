import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../../components/layout/Header'
import Button from '../../components/common/Button'
import ProgressBar from '../../components/common/ProgressBar'
import { getCurrentUser } from '../../services/authService'
import styles from './Profile.module.css'

export default function Profile() {
  const navigate = useNavigate()
  const user = getCurrentUser()

  const [form, setForm] = useState({
    fullName: user?.fullName || '',
    jobTitle: '',
    experience: '',
    skills: '',
    linkedIn: '',
  })

  // Pre-fill from localStorage if returning
  useEffect(() => {
    const saved = localStorage.getItem('fcxm_profile')
    if (saved) {
      try { setForm(JSON.parse(saved)) } catch {}
    }
  }, [])

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  function handleSubmit(e) {
    e.preventDefault()
    // Save profile so Question page can use it
    localStorage.setItem('fcxm_profile', JSON.stringify(form))
    navigate('/interview-prep', { state: { profile: form } })
  }

  return (
    <div className={styles.page}>
      <Header />
      <ProgressBar current={1} total={5} />
      <main className={styles.main}>
        <div className={styles.card}>
          <h1 className={styles.title}>Your Profile</h1>
          <p className={styles.subtitle}>
            Tell us about yourself — we&apos;ll generate interview questions tailored to your role and skills
          </p>

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.row}>
              <div className={styles.field}>
                <label htmlFor="fullName">Full Name</label>
                <input id="fullName" name="fullName" type="text" placeholder="Jane Smith"
                  value={form.fullName} onChange={handleChange} required />
              </div>
              <div className={styles.field}>
                <label htmlFor="jobTitle">Target Job Title <span className={styles.required}>*</span></label>
                <input id="jobTitle" name="jobTitle" type="text"
                  placeholder="e.g. React Developer, Product Manager"
                  value={form.jobTitle} onChange={handleChange} required />
              </div>
            </div>

            <div className={styles.field}>
              <label htmlFor="experience">Years of Experience</label>
              <select id="experience" name="experience" value={form.experience} onChange={handleChange} required>
                <option value="">Select experience level</option>
                <option value="0-1">0–1 years (Entry level)</option>
                <option value="2-4">2–4 years (Mid level)</option>
                <option value="5-9">5–9 years (Senior)</option>
                <option value="10+">10+ years (Lead / Executive)</option>
              </select>
            </div>

            <div className={styles.field}>
              <label htmlFor="skills">
                Key Skills <span className={styles.required}>*</span>
                <span className={styles.hint}> — separate with commas</span>
              </label>
              <input
                id="skills"
                name="skills"
                type="text"
                placeholder="e.g. React, Node.js, Agile, AWS, Python"
                value={form.skills}
                onChange={handleChange}
                required
              />
              {form.skills && (
                <div className={styles.skillTags}>
                  {form.skills.split(',').map(s => s.trim()).filter(Boolean).map((s, i) => (
                    <span key={i} className={styles.skillTag}>{s}</span>
                  ))}
                </div>
              )}
            </div>

            <div className={styles.field}>
              <label htmlFor="linkedIn">LinkedIn URL <span className={styles.optional}>(optional)</span></label>
              <input id="linkedIn" name="linkedIn" type="url" placeholder="https://linkedin.com/in/yourname"
                value={form.linkedIn} onChange={handleChange} />
            </div>

            <div className={styles.actions}>
              <Button type="submit" variant="primary">Save &amp; Continue →</Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}
