<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { RouterView } from 'vue-router'
import AppHeader from './components/AppHeader.vue'

const isOnline = ref(navigator.onLine)
const showBackOnline = ref(false)

function handleOffline() {
  isOnline.value = false
  showBackOnline.value = false
}

function handleOnline() {
  isOnline.value = true
  showBackOnline.value = true

  setTimeout(() => {
    showBackOnline.value = false
  }, 3000)
}

onMounted(() => {
  window.addEventListener('offline', handleOffline)
  window.addEventListener('online', handleOnline)
})

onBeforeUnmount(() => {
  window.removeEventListener('offline', handleOffline)
  window.removeEventListener('online', handleOnline)
})
</script>

<template>
  <AppHeader />

  <div
    v-if="!isOnline"
    class="offline-message"
    role="status"
    aria-live="polite"
  >
    You are offline. Some features may be limited.
  </div>

  <div
    v-else-if="showBackOnline"
    class="online-message"
    role="status"
    aria-live="polite"
  >
    Back online.
  </div>

  <RouterView />
</template>

<style scoped>
.offline-message,
.online-message {
  padding: 10px 20px;
  text-align: center;
  font-weight: 600;
}

.offline-message {
  background-color: #fff3cd;
  color: #664d03;
  border-bottom: 1px solid #ffecb5;
}

.online-message {
  background-color: #d1e7dd;
  color: #0f5132;
  border-bottom: 1px solid #badbcc;
}
</style>