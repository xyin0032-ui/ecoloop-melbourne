<script setup>
import {
  computed,
  ref,
  onMounted,
} from 'vue'

import {
  recyclingItems,
} from '../data/recyclingGuide'

const STORAGE_KEY =
  'ecoloop_recycling_guide'

const selectedCategory =
  ref('All')

const guideItems =
  ref([])

const usingOfflineData =
  ref(false)

function saveGuideData() {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(
      recyclingItems,
    ),
  )
}

function loadSavedGuideData() {
  const savedData =
    localStorage.getItem(
      STORAGE_KEY,
    )

  if (!savedData) {
    return []
  }

  try {
    const parsedData =
      JSON.parse(savedData)

    if (
      Array.isArray(parsedData)
    ) {
      return parsedData
    }

    return []
  } catch {
    return []
  }
}

function loadGuide() {
  if (navigator.onLine) {
    guideItems.value =
      recyclingItems

    saveGuideData()

    usingOfflineData.value =
      false
  } else {
    const savedData =
      loadSavedGuideData()

    if (
      savedData.length > 0
    ) {
      guideItems.value =
        savedData

      usingOfflineData.value =
        true
    } else {
      guideItems.value =
        recyclingItems

      usingOfflineData.value =
        false
    }
  }
}

const categories =
  computed(() => {
    return [
      'All',
      ...new Set(
        guideItems.value.map(
          (item) =>
            item.category,
        ),
      ),
    ]
  })

const filteredItems =
  computed(() => {
    if (
      selectedCategory.value ===
      'All'
    ) {
      return guideItems.value
    }

    return guideItems.value.filter(
      (item) =>
        item.category ===
        selectedCategory.value,
    )
  })

onMounted(() => {
  loadGuide()
})
</script>

<template>
  <main class="guide-page">
    <section class="guide-header">
      <p class="eyebrow">
        Recycling Guide
      </p>

      <h1>
        How should I recycle it?
      </h1>

      <p class="intro">
        Select a category and learn how common household waste should be
        recycled in Melbourne.
      </p>

      <p
        v-if="usingOfflineData"
        class="offline-data-message"
        role="status"
        aria-live="polite"
      >
        Offline guide loaded from saved data.
      </p>
    </section>

    <section class="guide-content">
      <div class="filter-section">
        <span class="filter-label">
          Filter by category:
        </span>

        <div class="filter-buttons">
          <button
            v-for="category in categories"
            :key="category"
            class="filter-button"
            :class="{
              active:
                selectedCategory ===
                category,
            }"
            @click="
              selectedCategory =
                category
            "
          >
            {{ category }}
          </button>
        </div>
      </div>

      <div class="guide-grid">
        <article
          v-for="item in filteredItems"
          :key="item.id"
          class="guide-card"
        >
          <div class="item-icon">
            {{ item.icon }}
          </div>

          <div class="item-category">
            {{ item.category }}
          </div>

          <h2>
            {{ item.name }}
          </h2>

          <p>
            {{ item.description }}
          </p>
        </article>
      </div>
    </section>
  </main>
</template>

<style scoped>
.guide-page {
  min-height: calc(100vh - 90px);
  background-color: #f7faf8;
  padding-bottom: 80px;
}

.guide-header {
  max-width: 800px;
  margin: 0 auto;
  padding: 70px 24px 45px;
  text-align: center;
}

.eyebrow {
  margin-bottom: 12px;
  color: #2f6f4e;
  font-weight: 700;
}

.guide-header h1 {
  margin: 0;
  color: #1f2937;
  font-size: 44px;
}

.intro {
  max-width: 650px;
  margin: 20px auto 0;
  color: #65716b;
  font-size: 18px;
  line-height: 1.6;
}

.offline-data-message {
  margin: 20px auto 0;
  padding: 10px 16px;
  border: 1px solid #ffecb5;
  border-radius: 8px;
  background-color: #fff3cd;
  color: #664d03;
  font-weight: 600;
}

.guide-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

.filter-section {
  margin-bottom: 32px;
}

.filter-label {
  display: block;
  margin-bottom: 14px;
  color: #374151;
  font-weight: 600;
}

.filter-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.filter-button {
  padding: 10px 16px;
  border: 1px solid #cfd9d3;
  border-radius: 8px;
  background-color: #ffffff;
  color: #4b5563;
  cursor: pointer;
  font-size: 14px;
  transition: 0.2s;
}

.filter-button:hover {
  border-color: #2f6f4e;
  color: #2f6f4e;
}

.filter-button.active {
  border-color: #2f6f4e;
  background-color: #2f6f4e;
  color: #ffffff;
}

.guide-grid {
  display: grid;
  grid-template-columns:
    repeat(3, 1fr);
  gap: 24px;
}

.guide-card {
  padding: 28px;
  border:
    1px solid #e2e8e5;
  border-radius: 14px;
  background-color: #ffffff;
}

.item-icon {
  margin-bottom: 18px;
  font-size: 38px;
}

.item-category {
  display: inline-block;
  margin-bottom: 12px;
  padding: 5px 10px;
  border-radius: 20px;
  background-color: #edf7f1;
  color: #2f6f4e;
  font-size: 13px;
  font-weight: 600;
}

.guide-card h2 {
  margin: 0 0 12px;
  color: #26352e;
  font-size: 22px;
}

.guide-card p {
  margin: 0;
  color: #65716b;
  line-height: 1.65;
}

@media (max-width: 992px) {
  .guide-grid {
    grid-template-columns:
      repeat(2, 1fr);
  }
}

@media (max-width: 576px) {
  .guide-header {
    padding:
      50px 20px 35px;
  }

  .guide-header h1 {
    font-size: 34px;
  }

  .intro {
    font-size: 16px;
  }

  .guide-content {
    padding: 0 20px;
  }

  .guide-grid {
    grid-template-columns:
      1fr;
  }

  .filter-buttons {
    flex-direction: column;
  }

  .filter-button {
    width: 100%;
  }
}
</style>