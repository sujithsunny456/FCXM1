const API_BASE = 'http://localhost:5000/api'

async function request(endpoint, options = {}) {
  const token = localStorage.getItem('fcxm_token')
  const headers = { 'Content-Type': 'application/json' }
  if (token) headers['Authorization'] = `Bearer ${token}`

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: { ...headers, ...options.headers }
  })

  const data = await res.json()
  if (!res.ok) throw new Error(data.message || 'Something went wrong')
  return data
}

export async function registerUser({ fullName, email, password }) {
  const data = await request('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ fullName, email, password })
  })
  localStorage.setItem('fcxm_token', data.token)
  localStorage.setItem('fcxm_user', JSON.stringify(data.user))
  return data
}

export async function loginUser({ email, password }) {
  const data = await request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  })
  localStorage.setItem('fcxm_token', data.token)
  localStorage.setItem('fcxm_user', JSON.stringify(data.user))
  return data
}

export function logoutUser() {
  localStorage.removeItem('fcxm_token')
  localStorage.removeItem('fcxm_user')
}

export function getCurrentUser() {
  const user = localStorage.getItem('fcxm_user')
  return user ? JSON.parse(user) : null
}

export function getToken() {
  return localStorage.getItem('fcxm_token')
}
