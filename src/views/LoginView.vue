<script setup>
import { reactive, ref } from 'vue'
import { loginUser } from '../utils/auth'

const form = reactive({
  email: '',
  password: '',
})

const errors = reactive({
  email: '',
  password: '',
})

const loginError = ref('')

function validateEmail() {
  errors.email = ''

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  if (!form.email.trim()) {
    errors.email = 'Please enter your email address.'
    return false
  }

  if (!emailPattern.test(form.email)) {
    errors.email = 'Please enter a valid email address.'
    return false
  }

  return true
}

function validatePassword() {
  errors.password = ''

  if (!form.password) {
    errors.password = 'Please enter your password.'
    return false
  }

  return true
}

async function validateForm() {
  loginError.value = ''

  const emailValid = validateEmail()
  const passwordValid = validatePassword()

  if (emailValid && passwordValid) {
    const result = await loginUser(
      form.email,
      form.password,
    )

    if (!result.success) {
      loginError.value = result.message
      return
    }

    window.location.href = '/'
  }
}

function clearForm() {
  form.email = ''
  form.password = ''

  errors.email = ''
  errors.password = ''

  loginError.value = ''
}
</script>

<template>
  <main class="login-page">
    <section class="login-container">
      <div class="login-header">
        <p class="eyebrow">Welcome Back</p>

        <h1>Login to EcoLoop Melbourne</h1>

        <p>
          Login to your account to continue your recycling journey.
        </p>
      </div>

      <form class="login-form" @submit.prevent="validateForm">
        <div class="form-group">
          <label for="email">Email</label>

          <input
            id="email"
            v-model="form.email"
            type="text"
            placeholder="Enter your email address"
            @blur="validateEmail"
          />

          <p v-if="errors.email" class="error-message">
            {{ errors.email }}
          </p>
        </div>

        <div class="form-group">
          <label for="password">Password</label>

          <input
            id="password"
            v-model="form.password"
            type="password"
            placeholder="Enter your password"
            @blur="validatePassword"
          />

          <p v-if="errors.password" class="error-message">
            {{ errors.password }}
          </p>
        </div>

        <p v-if="loginError" class="error-box">
          {{ loginError }}
        </p>

        <div class="form-actions">
          <button type="submit" class="login-button">
            Login
          </button>

          <button type="button" class="clear-button" @click="clearForm">
            Clear
          </button>
        </div>

        <p class="register-text">
          Don't have an account?
          <RouterLink to="/register">
            Register here
          </RouterLink>
        </p>
      </form>
    </section>
  </main>
</template>

<style scoped>
.login-page {
  min-height: calc(100vh - 90px);
  padding: 70px 24px;
  background-color: #f7faf8;
}

.login-container {
  max-width: 620px;
  margin: 0 auto;
}

.login-header {
  margin-bottom: 30px;
  text-align: center;
}

.eyebrow {
  margin-bottom: 12px;
  color: #2f6f4e;
  font-weight: 700;
}

.login-header h1 {
  margin: 0;
  color: #1f2937;
  font-size: 40px;
}

.login-header p {
  margin-top: 15px;
  color: #65716b;
  line-height: 1.6;
}

.login-form {
  padding: 32px;
  border: 1px solid #e2e8e5;
  border-radius: 14px;
  background-color: #ffffff;
}

.form-group {
  margin-bottom: 22px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: #374151;
  font-size: 14px;
  font-weight: 600;
}

.form-group input {
  width: 100%;
  box-sizing: border-box;
  padding: 12px 14px;
  border: 1px solid #cfd9d3;
  border-radius: 8px;
  font-size: 15px;
  outline: none;
}

.form-group input:focus {
  border-color: #2f6f4e;
}

.error-message {
  margin: 7px 0 0;
  color: #b42318;
  font-size: 13px;
}

.error-box {
  margin-bottom: 20px;
  padding: 12px 14px;
  border-radius: 8px;
  background-color: #fef3f2;
  color: #b42318;
  font-weight: 600;
}

.form-actions {
  display: flex;
  gap: 12px;
}

.login-button,
.clear-button {
  padding: 12px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 15px;
  font-weight: 600;
}

.login-button {
  border: none;
  background-color: #2f6f4e;
  color: #ffffff;
}

.login-button:hover {
  background-color: #24583e;
}

.clear-button {
  border: 1px solid #cfd9d3;
  background-color: #ffffff;
  color: #374151;
}

.clear-button:hover {
  background-color: #f3f5f4;
}

.register-text {
  margin: 24px 0 0;
  text-align: center;
  color: #65716b;
  font-size: 14px;
}

.register-text a {
  color: #2f6f4e;
  font-weight: 600;
  text-decoration: none;
}

.register-text a:hover {
  text-decoration: underline;
}

@media (max-width: 576px) {
  .login-page {
    padding: 50px 20px;
  }

  .login-header h1 {
    font-size: 33px;
  }

  .login-form {
    padding: 22px;
  }

  .form-actions {
    flex-direction: column;
  }

  .login-button,
  .clear-button {
    width: 100%;
  }
}
</style>