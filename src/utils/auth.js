const USERS_KEY = 'ecoloop_users'
const CURRENT_USER_KEY = 'ecoloop_current_user'

export function getUsers() {
  const savedUsers = localStorage.getItem(USERS_KEY)

  if (!savedUsers) {
    return []
  }

  return JSON.parse(savedUsers)
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

async function hashPassword(password) {
  const data = new TextEncoder().encode(password)
  const hash = await crypto.subtle.digest('SHA-256', data)

  return Array.from(new Uint8Array(hash))
    .map((item) => item.toString(16).padStart(2, '0'))
    .join('')
}

export async function registerUser(username, email, password) {
  const users = getUsers()

  const usernameExists = users.some(
    (user) => user.username.toLowerCase() === username.trim().toLowerCase(),
  )

  if (usernameExists) {
    return {
      success: false,
      message: 'This username is already registered.',
    }
  }

  const emailExists = users.some(
    (user) => user.email.toLowerCase() === email.trim().toLowerCase(),
  )

  if (emailExists) {
    return {
      success: false,
      message: 'This email address is already registered.',
    }
  }

  const passwordHash = await hashPassword(password)

  const newUser = {
    id: Date.now(),
    username: username.trim(),
    email: email.trim().toLowerCase(),
    password: passwordHash,
    role: 'user',
  }

  users.push(newUser)
  saveUsers(users)

  return {
    success: true,
    user: newUser,
  }
}

export function getCurrentUser() {
  const savedUser = localStorage.getItem(CURRENT_USER_KEY)

  if (!savedUser) {
    return null
  }

  return JSON.parse(savedUser)
}