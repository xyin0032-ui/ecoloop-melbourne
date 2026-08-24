<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
  <header class="header">
    <div class="nav-container">
      <RouterLink to="/" class="logo">
        EcoLoop Melbourne
      </RouterLink>

      <nav class="nav-links">
        <RouterLink to="/" class="nav-button">Home</RouterLink>
        <RouterLink to="/guide" class="nav-button">Recycling Guide</RouterLink>
        <RouterLink to="/points" class="nav-button">Find Recycling Points</RouterLink>
        <RouterLink to="/about" class="nav-button">About Us</RouterLink>
        <RouterLink to="/register" class="register-button">Register</RouterLink>
      </nav>
    </div>
  </header>
</template>

<style scoped>
.header {
  background-color: #ffffff;
  border-bottom: 1px solid #e5e7eb;
  padding: 8px 0;
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 14px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  font-size: 24px;
  font-weight: 700;
  color: #2f6f4e;
  text-decoration: none;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 12px;
}

.nav-button {
  padding: 10px 16px;
  border-radius: 8px;
  color: #374151;
  text-decoration: none;
  font-size: 15px;
  font-weight: 500;
  transition: 0.2s;
}

.nav-button:hover {
  background-color: #edf7f1;
  color: #2f6f4e;
}

.register-button {
  padding: 10px 18px;
  border-radius: 8px;
  background-color: #2f6f4e;
  color: white;
  text-decoration: none;
  font-size: 15px;
  font-weight: 600;
  transition: 0.2s;
}

.register-button:hover {
  background-color: #24583e;
}

.router-link-active.nav-button {
  background-color: #edf7f1;
  color: #2f6f4e;
}
</style>