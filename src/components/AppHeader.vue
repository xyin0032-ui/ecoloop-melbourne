<script setup>
import { ref } from 'vue'
import { RouterLink } from 'vue-router'

const menuOpen = ref(false)

function closeMenu() {
  menuOpen.value = false
}
</script>

<template>
  <header class="header">
    <div class="nav-container">
      <RouterLink to="/" class="logo" @click="closeMenu">
        EcoLoop Melbourne
      </RouterLink>

      <button
        class="menu-button"
        type="button"
        aria-label="Open navigation menu"
        @click="menuOpen = !menuOpen"
      >
        ☰
      </button>

      <nav class="nav-links" :class="{ open: menuOpen }">
        <RouterLink to="/" class="nav-button" @click="closeMenu">
          Home
        </RouterLink>

        <RouterLink to="/guide" class="nav-button" @click="closeMenu">
          Recycling Guide
        </RouterLink>

        <RouterLink to="/points" class="nav-button" @click="closeMenu">
          Find Recycling Points
        </RouterLink>

        <RouterLink to="/about" class="nav-button" @click="closeMenu">
          About Us
        </RouterLink>

        <RouterLink
          to="/register"
          class="register-button"
          @click="closeMenu"
        >
          Register
        </RouterLink>
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
  color: #ffffff;
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

.menu-button {
  display: none;
  padding: 8px 12px;
  border: 1px solid #cfd9d3;
  border-radius: 8px;
  background-color: #ffffff;
  color: #2f6f4e;
  cursor: pointer;
  font-size: 22px;
}

/* Tablet and mobile */
@media (max-width: 768px) {
  .nav-container {
    padding: 12px 20px;
    flex-wrap: wrap;
  }

  .logo {
    font-size: 21px;
  }

  .menu-button {
    display: block;
  }

  .nav-links {
    display: none;
    width: 100%;
    margin-top: 14px;
    padding-top: 14px;
    border-top: 1px solid #e5e7eb;
    flex-direction: column;
    align-items: stretch;
    gap: 8px;
  }

  .nav-links.open {
    display: flex;
  }

  .nav-button {
    width: 100%;
    box-sizing: border-box;
    padding: 12px 14px;
    text-align: left;
  }

  .register-button {
    width: 100%;
    box-sizing: border-box;
    padding: 12px 14px;
    text-align: center;
  }
}
</style>