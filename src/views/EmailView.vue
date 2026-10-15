<script setup>
import { ref } from 'vue'

const email = ref('')
const subject = ref(
  'EcoLoop Recycling Information',
)
const message = ref(
  'Please find the recycling information attached.',
)

const selectedFile = ref(null)
const fileName = ref('')

const statusMessage = ref('')
const sending = ref(false)

function handleFile(event) {
  const file =
    event.target.files[0]

  if (!file) {
    selectedFile.value = null
    fileName.value = ''
    return
  }

  selectedFile.value = file
  fileName.value = file.name
}

function fileToBase64(file) {
  return new Promise(
    (resolve, reject) => {
      const reader =
        new FileReader()

      reader.onload = () => {
        const result =
          reader.result

        const base64 =
          result.split(',')[1]

        resolve(base64)
      }

      reader.onerror = reject

      reader.readAsDataURL(file)
    },
  )
}

async function sendEmail() {
  statusMessage.value = ''

  if (
    !email.value.trim() ||
    !subject.value.trim() ||
    !message.value.trim()
  ) {
    statusMessage.value =
      'Please complete all fields.'
    return
  }

  if (!selectedFile.value) {
    statusMessage.value =
      'Please choose a PDF attachment.'
    return
  }

  sending.value = true

  try {
    const attachmentContent =
      await fileToBase64(
        selectedFile.value,
      )

    const response =
      await fetch(
        'https://ecoloop-email.xyin0032.workers.dev',
        {
          method: 'POST',
          headers: {
            'Content-Type':
              'application/json',
          },
          body: JSON.stringify({
            to:
              email.value.trim(),
            subject:
              subject.value.trim(),
            message:
              message.value.trim(),
            attachmentName:
              selectedFile.value.name,
            attachmentContent,
          }),
        },
      )

    const data =
      await response.json()

    if (!response.ok) {
      throw new Error(
        data.message,
      )
    }

    statusMessage.value =
      'Email sent successfully.'
  } catch (error) {
    statusMessage.value =
      error.message ||
      'Unable to send email. Please try again.'
  } finally {
    sending.value = false
  }
}
</script>

<template>
  <main class="email-page">
    <section class="email-container">
      <p class="eyebrow">
        Email Service
      </p>

      <h1>
        Send Recycling Information
      </h1>

      <p class="intro-text">
        Send recycling information by email
        with a PDF attachment.
      </p>

      <form
        class="email-form"
        @submit.prevent="sendEmail"
      >
        <div class="form-group">
          <label for="email">
            Recipient Email
          </label>

          <input
            id="email"
            v-model="email"
            type="email"
            required
            placeholder="Enter recipient email"
          />
        </div>

        <div class="form-group">
          <label for="subject">
            Subject
          </label>

          <input
            id="subject"
            v-model="subject"
            type="text"
            required
          />
        </div>

        <div class="form-group">
          <label for="message">
            Message
          </label>

          <textarea
            id="message"
            v-model="message"
            rows="5"
            required
          ></textarea>
        </div>

        <div class="form-group">
          <label for="attachment">
            PDF Attachment
          </label>

          <input
            id="attachment"
            type="file"
            accept=".pdf,application/pdf"
            @change="handleFile"
          />

          <p
            v-if="fileName"
            class="file-name"
          >
            Selected:
            {{ fileName }}
          </p>
        </div>

        <button
          type="submit"
          class="send-button"
          :disabled="sending"
        >
          {{
            sending
              ? 'Sending...'
              : 'Send Email'
          }}
        </button>

        <p
          v-if="statusMessage"
          class="status-message"
          aria-live="polite"
        >
          {{ statusMessage }}
        </p>
      </form>
    </section>
  </main>
</template>

<style scoped>
.email-page {
  min-height: calc(100vh - 90px);
  padding: 70px 24px;
  background-color: #f7faf8;
}

.email-container {
  max-width: 700px;
  margin: 0 auto;
}

.eyebrow {
  margin-bottom: 10px;
  color: #2f6f4e;
  font-weight: 700;
}

h1 {
  margin: 0;
  color: #1f2937;
  font-size: 40px;
}

.intro-text {
  margin: 14px 0 30px;
  color: #65716b;
}

.email-form {
  padding: 30px;
  border: 1px solid #e2e8e5;
  border-radius: 12px;
  background-color: #ffffff;
}

.form-group {
  margin-bottom: 22px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: #374151;
  font-weight: 600;
}

.form-group input,
.form-group textarea {
  width: 100%;
  box-sizing: border-box;
  padding: 12px 14px;
  border: 1px solid #cfd9d3;
  border-radius: 8px;
  font-size: 15px;
}

.form-group textarea {
  resize: vertical;
}

.file-name {
  margin-top: 8px;
  color: #65716b;
  font-size: 14px;
}

.send-button {
  padding: 12px 20px;
  border: none;
  border-radius: 8px;
  background-color: #2f6f4e;
  color: #ffffff;
  cursor: pointer;
  font-size: 15px;
  font-weight: 600;
}

.send-button:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.status-message {
  margin-top: 18px;
  color: #374151;
  font-weight: 600;
}

input:focus-visible,
textarea:focus-visible,
button:focus-visible {
  outline: 3px solid #1f6feb;
  outline-offset: 3px;
}
</style>