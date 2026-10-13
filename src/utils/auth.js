import { ref } from 'vue'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth'

import {
  doc,
  setDoc,
  getDoc,
} from 'firebase/firestore'

import { auth } from '../Firebase/init'
import db from '../Firebase/init'

export const currentUser = ref(null)

let authLoaded

const authReady = new Promise((resolve) => {
  authLoaded = resolve
})

onAuthStateChanged(auth, async (firebaseUser) => {
  try {
    if (firebaseUser) {
      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid))

      if (userDoc.exists()) {
        const userData = userDoc.data()

        currentUser.value = {
          id: firebaseUser.uid,
          username: userData.username || firebaseUser.email,
          email: firebaseUser.email,
          role: userData.role || 'user',
        }
      } else {
        currentUser.value = {
          id: firebaseUser.uid,
          username: firebaseUser.email,
          email: firebaseUser.email,
          role: 'user',
        }
      }
    } else {
      currentUser.value = null
    }
  } catch (error) {
    console.error('Authentication error:', error)
    currentUser.value = null
  }

  authLoaded()
})

export function waitForAuth() {
  return authReady
}

export async function registerUser(username, email, password) {
  const cleanUsername = username.trim()
  const cleanEmail = email.trim().toLowerCase()

  if (cleanUsername.length < 3 || cleanUsername.length > 30) {
    return {
      success: false,
      message: 'Username must be between 3 and 30 characters.',
    }
  }

  if (!/^[A-Za-z0-9_]+$/.test(cleanUsername)) {
    return {
      success: false,
      message: 'Username can only contain letters, numbers and underscores.',
    }
  }

  try {
    const result = await createUserWithEmailAndPassword(
      auth,
      cleanEmail,
      password,
    )

    const newUser = {
      username: cleanUsername,
      email: cleanEmail,
      role: 'user',
    }

    await setDoc(doc(db, 'users', result.user.uid), newUser)

    currentUser.value = {
      id: result.user.uid,
      ...newUser,
    }

    return {
      success: true,
      user: currentUser.value,
    }
  } catch (error) {
    console.error('Registration error:', error)

    let message = 'Registration failed. Please try again.'

    if (error.code === 'auth/email-already-in-use') {
      message = 'This email address is already registered.'
    } else if (error.code === 'auth/invalid-email') {
      message = 'Please enter a valid email address.'
    } else if (error.code === 'auth/weak-password') {
      message = 'Please choose a stronger password.'
    } else if (error.code === 'permission-denied') {
      message = 'Cannot save user details. Please check Firestore permissions.'
    }

    return {
      success: false,
      message,
    }
  }
}

export async function loginUser(email, password) {
  const cleanEmail = email.trim().toLowerCase()

  try {
    const result = await signInWithEmailAndPassword(
      auth,
      cleanEmail,
      password,
    )

    const userDoc = await getDoc(doc(db, 'users', result.user.uid))

    if (!userDoc.exists()) {
      await signOut(auth)

      return {
        success: false,
        message: 'User profile not found. Please contact support.',
      }
    }

    const userData = userDoc.data()

    currentUser.value = {
      id: result.user.uid,
      username: userData.username || cleanEmail,
      email: result.user.email,
      role: userData.role || 'user',
    }

    return {
      success: true,
      user: currentUser.value,
    }
  } catch (error) {
    console.error('Login error:', error)

    let message = 'Login failed. Please try again.'

    if (
      error.code === 'auth/invalid-credential' ||
      error.code === 'auth/wrong-password' ||
      error.code === 'auth/user-not-found'
    ) {
      message = 'Incorrect email or password.'
    } else if (error.code === 'permission-denied') {
      message = 'Cannot read user details. Please check Firestore permissions.'
    }

    return {
      success: false,
      message,
    }
  }
}

export function getCurrentUser() {
  return currentUser.value
}

export async function logoutUser() {
  await signOut(auth)
  currentUser.value = null
}