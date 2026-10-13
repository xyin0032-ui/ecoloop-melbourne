import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'AIzaSyAwUuZI8eMDFaP0ebFyIMUAZplbITtjDs0',
  authDomain: 'fir-emulator-xintian.firebaseapp.com',
  projectId: 'fir-emulator-xintian',
  storageBucket: 'fir-emulator-xintian.firebasestorage.app',
  messagingSenderId: '172619550622',
  appId: '1:172619550622:web:cc4fedede0d3e03ae2d08f',
}

const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)

const db = getFirestore(app)

export default db