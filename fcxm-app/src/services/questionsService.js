const API_BASE = 'http://localhost:5000/api'

export async function fetchQuestions({ jobTitle, skills, experience, interviewType }) {
  const token = localStorage.getItem('fcxm_token')

  const res = await fetch(`${API_BASE}/questions/generate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ jobTitle, skills, experience, interviewType }),
  })

  const data = await res.json()
  if (!res.ok) throw new Error(data.message || 'Failed to generate questions')
  return data.questions
}
