import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { setupAdminUser } from './utils/auth'

setupAdminUser()

const app = createApp(App)

app.use(router)

app.mount('#app')