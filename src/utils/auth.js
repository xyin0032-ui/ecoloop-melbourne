import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth'

import {
  doc,
  getDoc,
  setDoc,
} from 'firebase/firestore'

import db, { auth } from '../Firebase/init'

const USERS_KEY = 'ecoloop_users'
const CURRENT_USER_KEY = 'ecoloop_current_user'

export function getUsers() {
  const savedUsers =
    localStorage.getItem(USERS_KEY)

  if (!savedUsers) {
    return []
  }

  try {
    const users =
      JSON.parse(savedUsers)

    if (Array.isArray(users)) {
      return users
    }

    return []
  } catch {
    return []
  }
}

function saveUsers(users) {
  localStorage.setItem(
    USERS_KEY,
    JSON.stringify(users),
  )
}

export async function setupAdminUser() {
  const users = getUsers()

  const adminExists =
    users.some(
      (user) =>
        user.email ===
        'admin@ecoloop.com',
    )

  if (adminExists) {
    return
  }

  const adminUser = {
    id: 'admin',
    username: 'admin',
    email: 'admin@ecoloop.com',
    role: 'admin',
  }

  users.push(adminUser)
  saveUsers(users)
}

export async function registerUser(
  username,
  email,
  password,
) {
  const users = getUsers()

  const cleanUsername =
    username.trim()

  const cleanEmail =
    email.trim().toLowerCase()

  if (
    cleanUsername.length < 3 ||
    cleanUsername.length > 30
  ) {
    return {
      success: false,
      message:
        'Username must be between 3 and 30 characters.',
    }
  }

  const usernamePattern =
    /^[A-Za-z0-9_]+$/

  if (
    !usernamePattern.test(
      cleanUsername,
    )
  ) {
    return {
      success: false,
      message:
        'Username can only contain letters, numbers and underscores.',
    }
  }

  const emailPattern =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  if (
    !emailPattern.test(
      cleanEmail,
    )
  ) {
    return {
      success: false,
      message:
        'Please enter a valid email address.',
    }
  }

  const usernameExists =
    users.some(
      (user) =>
        user.username
          .toLowerCase() ===
        cleanUsername
          .toLowerCase(),
    )

  if (usernameExists) {
    return {
      success: false,
      message:
        'This username is already registered.',
    }
  }

  try {
    const userCredential =
      await createUserWithEmailAndPassword(
        auth,
        cleanEmail,
        password,
      )

    await updateProfile(
      userCredential.user,
      {
        displayName:
          cleanUsername,
      },
    )

    const newUser = {
      id:
        userCredential.user.uid,
      username:
        cleanUsername,
      email:
        cleanEmail,
      role: 'user',
    }

    await setDoc(
      doc(
        db,
        'users',
        userCredential.user.uid,
      ),
      {
        username:
          cleanUsername,
        email:
          cleanEmail,
        role: 'user',
      },
    )

    users.push(newUser)
    saveUsers(users)

    await signOut(auth)

    return {
      success: true,
      user: newUser,
    }
  } catch (error) {
    if (
      error.code ===
      'auth/email-already-in-use'
    ) {
      return {
        success: false,
        message:
          'This email address is already registered.',
      }
    }

    if (
      error.code ===
      'auth/weak-password'
    ) {
      return {
        success: false,
        message:
          'Please choose a stronger password.',
      }
    }

    return {
      success: false,
      message:
        'Unable to create account. Please try again.',
    }
  }
}

export async function loginUser(
  email,
  password,
) {
  const cleanEmail =
    email.trim().toLowerCase()

  try {
    const userCredential =
      await signInWithEmailAndPassword(
        auth,
        cleanEmail,
        password,
      )

    const firebaseUser =
      userCredential.user

    const userDoc =
      await getDoc(
        doc(
          db,
          'users',
          firebaseUser.uid,
        ),
      )

    let username =
      firebaseUser.displayName ||
      cleanEmail.split('@')[0]

    let role = 'user'

    if (userDoc.exists()) {
      const userData =
        userDoc.data()

      username =
        userData.username ||
        username

      role =
        userData.role ||
        'user'
    }

    const currentUser = {
      id: firebaseUser.uid,
      username,
      email:
        firebaseUser.email ||
        cleanEmail,
      role,
    }

    localStorage.setItem(
      CURRENT_USER_KEY,
      JSON.stringify(
        currentUser,
      ),
    )

    return {
      success: true,
      user: currentUser,
    }
  } catch (error) {
    console.error(
      'Login error:',
      error,
    )

    return {
      success: false,
      message:
        'Incorrect email or password.',
    }
  }
}

export function getCurrentUser() {
  const savedUser =
    localStorage.getItem(
      CURRENT_USER_KEY,
    )

  if (!savedUser) {
    return null
  }

  try {
    return JSON.parse(
      savedUser,
    )
  } catch {
    return null
  }
}

export async function logoutUser() {
  try {
    await signOut(auth)
  } catch (error) {
    console.error(
      'Logout error:',
      error,
    )
  }

  localStorage.removeItem(
    CURRENT_USER_KEY,
  )
}