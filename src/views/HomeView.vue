<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
  <main class="home-page">
    <section class="hero">
      <div class="hero-content">
        <p class="eyebrow">Recycle smarter in Melbourne</p>

        <h1>Make recycling simple with EcoLoop Melbourne</h1>

        <p class="hero-text">
          Find clear recycling information, learn how to dispose of different waste items,
          and discover recycling points across Melbourne.
        </p>

        <div class="hero-actions">
          <RouterLink to="/guide" class="primary-button">
            Recycling Guide
          </RouterLink>

          <RouterLink to="/points" class="secondary-button">
            Find Recycling Points
          </RouterLink>
        </div>
      </div>
    </section>

    <section class="features">
      <div class="feature-card">
        <div class="icon">♻️</div>
        <h2>Recycling Guide</h2>
        <p>
          Check how common household waste such as batteries, glass and e-waste should be recycled.
        </p>
      </div>

      <div class="feature-card">
        <div class="icon">📍📍</div>
        <h2>Find Recycling Points</h2>
        <p>
          Search recycling locations and view useful information such as accepted waste and opening hours.
        </p>
      </div>

      <div class="feature-card">
        <div class="icon">🌱🌱🌱</div>
        <h2>Reduce Waste</h2>
        <p>
          Make better recycling choices and support a cleaner and more sustainable Melbourne community.
        </p>
      </div>
    </section>
  </main>
</template>

<style scoped>
.home-page {
  background-color: #f7faf8;
  min-height: calc(100vh - 100px);
}

.hero {
  padding: 90px 24px 70px;
}

.hero-content {
  max-width: 900px;
  margin: 0 auto;
  text-align: center;
}

.eyebrow {
  margin-bottom: 16px;
  color: #2f6f4e;
  font-size: 16px;
  font-weight: 700;
}

.hero h1 {
  max-width: 800px;
  margin: 0 auto;
  color: #1f2937;
  font-size: 52px;
  line-height: 1.15;
}

.hero-text {
  max-width: 700px;
  margin: 24px auto 0;
  color: #5f6b66;
  font-size: 19px;
  line-height: 1.7;
}

.hero-actions {
  margin-top: 34px;
  display: flex;
  justify-content: center;
  gap: 16px;
}

.primary-button,
.secondary-button {
  padding: 13px 22px;
  border-radius: 9px;
  text-decoration: none;
  font-size: 16px;
  font-weight: 600;
  transition: 0.2s;
}

.primary-button {
  background-color: #2f6f4e;
  color: #ffffff;
}

.primary-button:hover {
  background-color: #24583e;
}

.secondary-button {
  border: 1px solid #2f6f4e;
  background-color: #ffffff;
  color: #2f6f4e;
}

.secondary-button:hover {
  background-color: #edf7f1;
}

.features {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px 80px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

.feature-card {
  background-color: #ffffff;
  padding: 30px;
  border: 1px solid #e2e8e5;
  border-radius: 14px;
}

.icon {
  font-size: 34px;
  margin-bottom: 18px;
}

.feature-card h2 {
  margin: 0 0 12px;
  color: #26352e;
  font-size: 21px;
}

.feature-card p {
  margin: 0;
  color: #65716b;
  line-height: 1.6;
}

/* Tablet */
@media (max-width: 992px) {
  .hero {
    padding-top: 70px;
  }

  .hero h1 {
    font-size: 44px;
  }

  .features {
    grid-template-columns: 1fr;
    max-width: 700px;
  }
}

/* Mobile */
@media (max-width: 576px) {
  .hero {
    padding: 55px 20px 50px;
  }

  .hero h1 {
    font-size: 36px;
  }

  .hero-text {
    font-size: 17px;
  }

  .hero-actions {
    flex-direction: column;
  }

  .primary-button,
  .secondary-button {
    width: 100%;
    box-sizing: border-box;
  }

  .features {
    padding: 0 20px 50px;
  }
}
</style>