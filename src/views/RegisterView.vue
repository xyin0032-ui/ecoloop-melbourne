<script setup>
import { reactive, ref } from 'vue'

const form = reactive({
  fullName: '',
  email: '',
  password: '',
  confirmPassword: '',
})

const errors = reactive({
  fullName: '',
  email: '',
  password: '',
  confirmPassword: '',
})

const successMessage = ref('')

function validateForm() {
  errors.fullName = ''
  errors.email = ''
  errors.password = ''
  errors.confirmPassword = ''
  successMessage.value = ''

  let isValid = true

  if (!form.fullName.trim()) {
    errors.fullName = 'Please enter your full name.'
    isValid = false
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  if (!form.email.trim()) {
    errors.email = 'Please enter your email address.'
    isValid = false
  } else if (!emailPattern.test(form.email)) {
    errors.email = 'Please enter a valid email address.'
    isValid = false
  }

  if (!form.password) {
    errors.password = 'Please enter a password.'
    isValid = false
  } else if (form.password.length < 8) {
    errors.password = 'Password must be at least 8 characters.'
    isValid = false
  }

  if (!form.confirmPassword) {
    errors.confirmPassword = 'Please confirm your password.'
    isValid = false
  } else if (form.confirmPassword !== form.password) {
    errors.confirmPassword = 'Passwords do not match.'
    isValid = false
  }

  if (isValid) {
    successMessage.value = 'Account created successfully!'
  }
}

function clearForm() {
  form.fullName = ''
  form.email = ''
  form.password = ''
  form.confirmPassword = ''

  errors.fullName = ''
  errors.email = ''
  errors.password = ''
  errors.confirmPassword = ''

  successMessage.value = ''
}
</script>

<template>
  <main class="register-page">
    <section class="register-container">
      <div class="register-header">
        <p class="eyebrow">Create Account</p>
        <h1>Join EcoLoop Melbourne</h1>

        <p>
          Create an account to make your recycling experience easier.
        </p>
      </div>

      <form class="register-form" @submit.prevent="validateForm">
        <div class="form-group">
          <label for="fullName">Full Name</label>

          <input
            id="fullName"
            v-model="form.fullName"
            type="text"
            placeholder="Enter your full name"
          />

          <p v-if="errors.fullName" class="error-message">
            {{ errors.fullName }}
          </p>
        </div>

        <div class="form-group">
          <label for="email">Email</label>

          <input
            id="email"
            v-model="form.email"
            type="text"
            placeholder="Enter your email address"
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
            placeholder="At least 8 characters"
          />

          <p v-if="errors.password" class="error-message">
            {{ errors.password }}
          </p>
        </div>

        <div class="form-group">
          <label for="confirmPassword">Confirm Password</label>

          <input
            id="confirmPassword"
            v-model="form.confirmPassword"
            type="password"
            placeholder="Enter your password again"
          />

          <p v-if="errors.confirmPassword" class="error-message">
            {{ errors.confirmPassword }}
          </p>
        </div>

        <p v-if="successMessage" class="success-message">
          {{ successMessage }}
        </p>

        <div class="form-actions">
          <button type="submit" class="create-button">
            Create Account
          </button>

          <button type="button" class="clear-button" @click="clearForm">
            Clear
          </button>
        </div>
      </form>
    </section>
  </main>
</template>

<style scoped>
.register-page {
  min-height: calc(100vh - 90px);
  padding: 70px 24px;
  background-color: #f7faf8;
}

.register-container {
  max-width: 620px;
  margin: 0 auto;
}

.register-header {
  margin-bottom: 30px;
  text-align: center;
}

.eyebrow {
  margin-bottom: 12px;
  color: #2f6f4e;
  font-weight: 700;
}

.register-header h1 {
  margin: 0;
  color: #1f2937;
  font-size: 40px;
}

.register-header p {
  margin-top: 15px;
  color: #65716b;
  line-height: 1.6;
}

.register-form {
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

.success-message {
  margin-bottom: 20px;
  padding: 12px 14px;
  border-radius: 8px;
  background-color: #edf7f1;
  color: #2f6f4e;
  font-weight: 600;
}

.form-actions {
  display: flex;
  gap: 12px;
}

.create-button,
.clear-button {
  padding: 12px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 15px;
  font-weight: 600;
}

.create-button {
  border: none;
  background-color: #2f6f4e;
  color: #ffffff;
}

.create-button:hover {
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

@media (max-width: 576px) {
  .register-page {
    padding: 50px 20px;
  }

  .register-header h1 {
    font-size: 33px;
  }

  .register-form {
    padding: 22px;
  }

  .form-actions {
    flex-direction: column;
  }

  .create-button,
  .clear-button {
    width: 100%;
  }
}
</style>