<script setup>
import { computed, ref, watch } from 'vue'
import { recyclingPoints } from '../data/recyclingPoints'
import { getCurrentUser } from '../utils/auth'
import {
  addRating,
  getPointRatings,
  getAverageRating,
} from '../utils/ratings'

const searchText = ref('')
const selectedWaste = ref('All')
const selectedRatings = ref({})
const ratingMessage = ref({})
const ratingUpdate = ref(0)

const currentUser = getCurrentUser()

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

function selectRating(pointId, rating) {
  selectedRatings.value[pointId] = rating
  ratingMessage.value[pointId] = ''
}

function submitRating(pointId) {
  if (!currentUser) {
    ratingMessage.value[pointId] = 'Please login before submitting a rating.'
    return
  }

  const rating = selectedRatings.value[pointId]

  if (!rating) {
    ratingMessage.value[pointId] = 'Please select a rating.'
    return
  }

  const saved = addRating(
    pointId,
    currentUser.id,
    rating,
  )

  if (!saved) {
    ratingMessage.value[pointId] = 'Invalid rating.'
    return
  }

  ratingUpdate.value++

  ratingMessage.value[pointId] = 'Rating submitted successfully.'
}

function averageRating(pointId) {
  void ratingUpdate.value
  return getAverageRating(pointId)
}

function ratingCount(pointId) {
  void ratingUpdate.value
  return getPointRatings(pointId).length
}

// Interactive Table
const tableSearch = ref({
  name: '',
  address: '',
  waste: '',
  hours: '',
})

const sortColumn = ref('name')
const sortAscending = ref(true)
const currentPage = ref(1)
const pageSize = 10

const tableRows = computed(() => {
  const rows = recyclingPoints.filter((point) => {
    return (
      point.name.toLowerCase().includes(tableSearch.value.name.toLowerCase()) &&
      point.address.toLowerCase().includes(tableSearch.value.address.toLowerCase()) &&
      point.acceptedWaste.join(', ').toLowerCase().includes(tableSearch.value.waste.toLowerCase()) &&
      point.openingHours.toLowerCase().includes(tableSearch.value.hours.toLowerCase())
    )
  })

  return rows.sort((a, b) => {
    function getValue(point) {
      if (sortColumn.value === 'waste') {
        return point.acceptedWaste.join(', ')
      }

      if (sortColumn.value === 'hours') {
        return point.openingHours
      }

      return point[sortColumn.value]
    }

    const result = String(getValue(a)).localeCompare(String(getValue(b)))
    return sortAscending.value ? result : -result
  })
})

const totalPages = computed(() => {
  return Math.max(1, Math.ceil(tableRows.value.length / pageSize))
})

const visibleRows = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return tableRows.value.slice(start, start + pageSize)
})

watch(tableSearch, () => {
  currentPage.value = 1
}, { deep: true })

function sortTable(column) {
  if (sortColumn.value === column) {
    sortAscending.value = !sortAscending.value
  } else {
    sortColumn.value = column
    sortAscending.value = true
  }

  currentPage.value = 1
}
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

          <div class="average-rating">
            <strong>Average Rating</strong>

            <p v-if="ratingCount(point.id) > 0">
              {{ averageRating(point.id).toFixed(1) }} / 5
              ·
              {{ ratingCount(point.id) }}
              {{ ratingCount(point.id) === 1 ? 'rating' : 'ratings' }}
            </p>

            <p v-else>
              No ratings yet
            </p>
          </div>

          <div class="rating-section">
            <strong>Your Rating</strong>

            <div class="stars">
              <button
                v-for="star in 5"
                :key="star"
                type="button"
                class="star-button"
                :class="{
                  selected: star <= (selectedRatings[point.id] || 0),
                }"
                @click="selectRating(point.id, star)"
              >
                ★
              </button>
            </div>

            <button
              type="button"
              class="rating-button"
              @click="submitRating(point.id)"
            >
              Submit Rating
            </button>

            <p
              v-if="ratingMessage[point.id]"
              class="rating-message"
            >
              {{ ratingMessage[point.id] }}
            </p>
          </div>
        </article>
      </div>

      <div v-else class="no-results">
        <h3>No recycling points found</h3>
        <p>Try another location or waste type.</p>
      </div>
    </section>

    <section class="data-table-section">
      <h2>Recycling Points Data Table</h2>
      <p>Search each column or click a heading to sort the results.</p>

      <div class="table-scroll">
        <table class="data-table">
          <caption>Recycling point locations and accepted waste</caption>

          <thead>
            <tr>
              <th scope="col">
                <button type="button" @click="sortTable('name')">
                  Name
                  {{ sortColumn === 'name' ? (sortAscending ? '▲' : '▼') : '↕' }}
                </button>
              </th>

              <th scope="col">
                <button type="button" @click="sortTable('address')">
                  Address
                  {{ sortColumn === 'address' ? (sortAscending ? '▲' : '▼') : '↕' }}
                </button>
              </th>

              <th scope="col">
                <button type="button" @click="sortTable('waste')">
                  Accepted Waste
                  {{ sortColumn === 'waste' ? (sortAscending ? '▲' : '▼') : '↕' }}
                </button>
              </th>

              <th scope="col">
                <button type="button" @click="sortTable('hours')">
                  Opening Hours
                  {{ sortColumn === 'hours' ? (sortAscending ? '▲' : '▼') : '↕' }}
                </button>
              </th>
            </tr>

            <tr>
              <th>
                <input
                  v-model="tableSearch.name"
                  aria-label="Search name column"
                  placeholder="Search name"
                />
              </th>

              <th>
                <input
                  v-model="tableSearch.address"
                  aria-label="Search address column"
                  placeholder="Search address"
                />
              </th>

              <th>
                <input
                  v-model="tableSearch.waste"
                  aria-label="Search waste column"
                  placeholder="Search waste"
                />
              </th>

              <th>
                <input
                  v-model="tableSearch.hours"
                  aria-label="Search opening hours column"
                  placeholder="Search hours"
                />
              </th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="point in visibleRows" :key="point.id">
              <td>{{ point.name }}</td>
              <td>{{ point.address }}</td>
              <td>{{ point.acceptedWaste.join(', ') }}</td>
              <td>{{ point.openingHours }}</td>
            </tr>

            <tr v-if="visibleRows.length === 0">
              <td colspan="4">No matching recycling points.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="table-footer">
        <span>
          {{ tableRows.length }} results · 10 rows per page ·
          Page {{ currentPage }} of {{ totalPages }}
        </span>

        <div class="table-buttons">
          <button
            type="button"
            :disabled="currentPage === 1"
            @click="currentPage--"
          >
            Previous
          </button>

          <button
            type="button"
            :disabled="currentPage >= totalPages"
            @click="currentPage++"
          >
            Next
          </button>
        </div>
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
  margin-bottom: 18px;
}

.info-row strong {
  display: block;
  margin-bottom: 7px;
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

.average-rating {
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid #e5e7eb;
}

.average-rating strong {
  color: #374151;
  font-size: 14px;
}

.average-rating p {
  margin: 8px 0 0;
  color: #65716b;
}

.rating-section {
  margin-top: 20px;
}

.rating-section strong {
  color: #374151;
  font-size: 14px;
}

.stars {
  display: flex;
  gap: 5px;
  margin: 10px 0 14px;
}

.star-button {
  padding: 0;
  border: none;
  background: none;
  color: #cfd5d2;
  cursor: pointer;
  font-size: 28px;
}

.star-button.selected {
  color: #d49b32;
}

.rating-button {
  padding: 10px 16px;
  border: none;
  border-radius: 8px;
  background-color: #2f6f4e;
  color: #ffffff;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
}

.rating-button:hover {
  background-color: #24583e;
}

.rating-message {
  margin: 12px 0 0;
  color: #2f6f4e;
  font-size: 13px;
  font-weight: 600;
}

.no-results {
  padding: 50px 20px;
  border: 1px solid #e2e8e5;
  border-radius: 14px;
  background-color: #ffffff;
  text-align: center;
}

.no-results h3 {
  margin-top: 0;
  color: #26352e;
}

.no-results p {
  margin-bottom: 0;
  color: #65716b;
}

.data-table-section {
  max-width: 1100px;
  margin: 35px auto 0;
  padding: 24px;
  border: 1px solid #e2e8e5;
  border-radius: 14px;
  background-color: #ffffff;
}

.data-table-section h2 {
  margin-top: 0;
  color: #26352e;
}

.data-table-section p {
  color: #65716b;
}

.table-scroll {
  width: 100%;
  overflow-x: auto;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}

.data-table caption {
  padding: 6px 0;
  color: #65716b;
  text-align: left;
}

.data-table th,
.data-table td {
  padding: 12px;
  border-bottom: 1px solid #e2e8e5;
  vertical-align: top;
}

.data-table th {
  background-color: #edf7f1;
}

.data-table th button {
  border: none;
  background: none;
  color: #24583e;
  cursor: pointer;
  font: inherit;
  font-weight: 600;
  text-align: left;
}

.data-table input {
  width: 100%;
  min-width: 125px;
  box-sizing: border-box;
  padding: 8px;
  border: 1px solid #cfd9d3;
  border-radius: 6px;
}

.data-table button:focus-visible,
.data-table input:focus-visible,
.table-buttons button:focus-visible {
  outline: 3px solid #24583e;
  outline-offset: 2px;
}

.table-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 20px;
  color: #374151;
}

.table-buttons {
  display: flex;
  gap: 10px;
}

.table-buttons button {
  padding: 8px 14px;
  border: none;
  border-radius: 7px;
  background-color: #2f6f4e;
  color: white;
  cursor: pointer;
}

.table-buttons button:disabled {
  background-color: #cfd9d3;
  color: #374151;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .page-header {
    padding-top: 50px;
  }

  .page-header h1 {
    font-size: 36px;
  }

  .search-panel {
    grid-template-columns: 1fr;
  }

  .points-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 576px) {
  .page-header {
    padding-left: 20px;
    padding-right: 20px;
  }

  .page-header h1 {
    font-size: 32px;
  }

  .intro {
    font-size: 16px;
  }

  .points-content {
    padding: 0 20px;
  }

  .point-card {
    padding: 22px;
  }

  .results-header {
    align-items: flex-start;
    flex-direction: column;
    gap: 8px;
  }

  .data-table-section {
    margin-left: 20px;
    margin-right: 20px;
    padding: 16px;
  }
}
</style>