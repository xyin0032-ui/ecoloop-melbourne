<script setup>
import { computed, ref } from 'vue'
import { recyclingPoints } from '../data/recyclingPoints'

const searchText = ref('')
const selectedWaste = ref('All')

const wasteTypes = computed(() => {
  const allTypes = recyclingPoints.flatMap((point) => point.acceptedWaste)
  return ['All', ...new Set(allTypes)]
})

const filteredPoints = computed(() => {
  return recyclingPoints.filter((point) => {
    const search = searchText.value.toLowerCase()

    const matchesSearch =
      point.name.toLowerCase().includes(search) ||
      point.address.toLowerCase().includes(search)

    const matchesWaste =
      selectedWaste.value === 'All' ||
      point.acceptedWaste.includes(selectedWaste.value)

    return matchesSearch && matchesWaste
  })
})
</script>

<template>
  <main class="points-page">
    <section class="page-header">
      <p class="eyebrow">Find Recycling Points</p>

      <h1>Find a recycling point near you</h1>

      <p class="intro">
        Search recycling locations and check their address, opening hours
        and accepted waste types.
      </p>
    </section>

    <section class="points-content">
      <div class="search-panel">
        <div class="search-field">
          <label for="search">Search location</label>

          <input
            id="search"
            v-model="searchText"
            type="text"
            placeholder="Search by name or address"
          />
        </div>

        <div class="filter-field">
          <label for="waste">Waste type</label>

          <select id="waste" v-model="selectedWaste">
            <option
              v-for="waste in wasteTypes"
              :key="waste"
              :value="waste"
            >
              {{ waste }}
            </option>
          </select>
        </div>
      </div>

      <div class="results-header">
        <h2>Recycling Points</h2>

        <span>
          {{ filteredPoints.length }}
          {{ filteredPoints.length === 1 ? 'location' : 'locations' }} found
        </span>
      </div>

      <div v-if="filteredPoints.length > 0" class="points-grid">
        <article
          v-for="point in filteredPoints"
          :key="point.id"
          class="point-card"
        >
          <div class="card-top">
            <div>
              <p class="distance">📍 {{ point.distance }} away</p>
              <h3>{{ point.name }}</h3>
            </div>
          </div>

          <div class="point-info">
            <div class="info-row">
              <strong>Address</strong>
              <p>{{ point.address }}</p>
            </div>

            <div class="info-row">
              <strong>Opening Hours</strong>
              <p>{{ point.openingHours }}</p>
            </div>

            <div class="info-row">
              <strong>Accepted Waste</strong>

              <div class="waste-tags">
                <span
                  v-for="waste in point.acceptedWaste"
                  :key="waste"
                  class="waste-tag"
                >
                  {{ waste }}
                </span>
              </div>
            </div>
          </div>
        </article>
      </div>

      <div v-else class="no-results">
        <h3>No recycling points found</h3>
        <p>Try another location or waste type.</p>
      </div>
    </section>
  </main>
</template>

<style scoped>
.points-page {
  min-height: calc(100vh - 90px);
  padding-bottom: 80px;
  background-color: #f7faf8;
}

.page-header {
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

.page-header h1 {
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

.points-content {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 24px;
}

.search-panel {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 20px;
  margin-bottom: 40px;
  padding: 24px;
  border: 1px solid #e2e8e5;
  border-radius: 14px;
  background-color: #ffffff;
}

.search-field,
.filter-field {
  display: flex;
  flex-direction: column;
  gap: 9px;
}

.search-field label,
.filter-field label {
  color: #374151;
  font-size: 14px;
  font-weight: 600;
}

.search-field input,
.filter-field select {
  width: 100%;
  box-sizing: border-box;
  padding: 12px 14px;
  border: 1px solid #cfd9d3;
  border-radius: 8px;
  background-color: #ffffff;
  color: #374151;
  font-size: 15px;
  outline: none;
}

.search-field input:focus,
.filter-field select:focus {
  border-color: #2f6f4e;
}

.results-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.results-header h2 {
  margin: 0;
  color: #26352e;
  font-size: 25px;
}

.results-header span {
  color: #65716b;
  font-size: 14px;
}

.points-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
}

.point-card {
  padding: 26px;
  border: 1px solid #e2e8e5;
  border-radius: 14px;
  background-color: #ffffff;
}

.distance {
  margin: 0 0 9px;
  color: #2f6f4e;
  font-size: 14px;
  font-weight: 600;
}

.point-card h3 {
  margin: 0;
  color: #26352e;
  font-size: 21px;
  line-height: 1.35;
}

.point-info {
  margin-top: 24px;
}

.info-row {
  margin-bottom: 19px;
}

.info-row:last-child {
  margin-bottom: 0;
}

.info-row strong {
  display: block;
  margin-bottom: 6px;
  color: #374151;
  font-size: 14px;
}

.info-row p {
  margin: 0;
  color: #65716b;
  line-height: 1.5;
}

.waste-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.waste-tag {
  padding: 6px 10px;
  border-radius: 20px;
  background-color: #edf7f1;
  color: #2f6f4e;
  font-size: 13px;
  font-weight: 600;
}

.no-results {
  padding: 55px 20px;
  border: 1px solid #e2e8e5;
  border-radius: 14px;
  background-color: #ffffff;
  text-align: center;
}

.no-results h3 {
  margin: 0 0 8px;
  color: #26352e;
}

.no-results p {
  margin: 0;
  color: #65716b;
}

@media (max-width: 768px) {
  .search-panel {
    grid-template-columns: 1fr;
  }

  .points-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 576px) {
  .page-header {
    padding: 50px 20px 35px;
  }

  .page-header h1 {
    font-size: 34px;
  }

  .intro {
    font-size: 16px;
  }

  .points-content {
    padding: 0 20px;
  }

  .search-panel {
    padding: 18px;
  }

  .results-header {
    align-items: flex-start;
    flex-direction: column;
    gap: 7px;
  }

  .point-card {
    padding: 22px;
  }
}
</style>