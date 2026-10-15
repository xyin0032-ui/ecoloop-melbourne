<script setup>
import {
  computed,
  ref,
} from 'vue'

import {
  recyclingItems,
} from '../data/recyclingGuide'

import {
  recyclingPoints,
} from '../data/recyclingPoints'

const rowsPerPage = 10

const pointSearch = ref({
  name: '',
  address: '',
  waste: '',
})

const pointSortKey = ref('name')
const pointSortDirection = ref('asc')
const pointPage = ref(1)

const itemSearch = ref({
  name: '',
  category: '',
  description: '',
})

const itemSortKey = ref('name')
const itemSortDirection = ref('asc')
const itemPage = ref(1)

function sortRows(
  rows,
  key,
  direction,
) {
  return [...rows].sort((a, b) => {
    const first =
      String(a[key]).toLowerCase()

    const second =
      String(b[key]).toLowerCase()

    if (first < second) {
      return direction === 'asc'
        ? -1
        : 1
    }

    if (first > second) {
      return direction === 'asc'
        ? 1
        : -1
    }

    return 0
  })
}

function changePointSort(key) {
  if (pointSortKey.value === key) {
    pointSortDirection.value =
      pointSortDirection.value === 'asc'
        ? 'desc'
        : 'asc'
  } else {
    pointSortKey.value = key
    pointSortDirection.value = 'asc'
  }

  pointPage.value = 1
}

function changeItemSort(key) {
  if (itemSortKey.value === key) {
    itemSortDirection.value =
      itemSortDirection.value === 'asc'
        ? 'desc'
        : 'asc'
  } else {
    itemSortKey.value = key
    itemSortDirection.value = 'asc'
  }

  itemPage.value = 1
}

const filteredPoints =
  computed(() => {
    const rows =
      recyclingPoints.filter(
        (point) => {
          const wasteText =
            point.acceptedWaste
              .join(', ')
              .toLowerCase()

          return (
            point.name
              .toLowerCase()
              .includes(
                pointSearch.value.name
                  .toLowerCase(),
              ) &&
            point.address
              .toLowerCase()
              .includes(
                pointSearch.value.address
                  .toLowerCase(),
              ) &&
            wasteText.includes(
              pointSearch.value.waste
                .toLowerCase(),
            )
          )
        },
      )

    return sortRows(
      rows,
      pointSortKey.value,
      pointSortDirection.value,
    )
  })

const pointPageCount =
  computed(() => {
    return Math.max(
      1,
      Math.ceil(
        filteredPoints.value.length /
          rowsPerPage,
      ),
    )
  })

const pagedPoints =
  computed(() => {
    const start =
      (pointPage.value - 1) *
      rowsPerPage

    return filteredPoints.value.slice(
      start,
      start + rowsPerPage,
    )
  })

const filteredItems =
  computed(() => {
    const rows =
      recyclingItems.filter(
        (item) => {
          return (
            item.name
              .toLowerCase()
              .includes(
                itemSearch.value.name
                  .toLowerCase(),
              ) &&
            item.category
              .toLowerCase()
              .includes(
                itemSearch.value.category
                  .toLowerCase(),
              ) &&
            item.description
              .toLowerCase()
              .includes(
                itemSearch.value
                  .description
                  .toLowerCase(),
              )
          )
        },
      )

    return sortRows(
      rows,
      itemSortKey.value,
      itemSortDirection.value,
    )
  })

const itemPageCount =
  computed(() => {
    return Math.max(
      1,
      Math.ceil(
        filteredItems.value.length /
          rowsPerPage,
      ),
    )
  })

const pagedItems =
  computed(() => {
    const start =
      (itemPage.value - 1) *
      rowsPerPage

    return filteredItems.value.slice(
      start,
      start + rowsPerPage,
    )
  })

function csvValue(value) {
  return `"${String(value)
    .replaceAll('"', '""')}"`
}

function downloadCsv(
  filename,
  headers,
  rows,
) {
  const lines = [
    headers
      .map((header) =>
        csvValue(header),
      )
      .join(','),
  ]

  rows.forEach((row) => {
    lines.push(
      row
        .map((value) =>
          csvValue(value),
        )
        .join(','),
    )
  })

  const file =
    new Blob(
      [lines.join('\n')],
      {
        type:
          'text/csv;charset=utf-8;',
      },
    )

  const link =
    document.createElement('a')

  link.href =
    URL.createObjectURL(file)

  link.download = filename

  link.click()

  URL.revokeObjectURL(
    link.href,
  )
}

function exportPoints() {
  downloadCsv(
    'recycling-points.csv',
    [
      'Name',
      'Address',
      'Opening Hours',
      'Accepted Waste',
      'Distance',
    ],
    filteredPoints.value.map(
      (point) => [
        point.name,
        point.address,
        point.openingHours,
        point.acceptedWaste.join(', '),
        point.distance,
      ],
    ),
  )
}

function exportItems() {
  downloadCsv(
    'recycling-guide.csv',
    [
      'Item',
      'Category',
      'Description',
    ],
    filteredItems.value.map(
      (item) => [
        item.name,
        item.category,
        item.description,
      ],
    ),
  )
}
</script>

<template>
  <main class="tables-page">
    <section class="page-header">
      <p class="eyebrow">
        Data Explorer
      </p>

      <h1>
        EcoLoop Data Tables
      </h1>

      <p>
        Search each column, sort the
        table and export the filtered
        data as CSV.
      </p>
    </section>

    <section class="table-section">
      <div class="section-heading">
        <div>
          <h2>
            Recycling Points
          </h2>

          <p aria-live="polite">
            {{ filteredPoints.length }}
            records found
          </p>
        </div>

        <button
          type="button"
          class="export-button"
          @click="exportPoints"
        >
          Export CSV
        </button>
      </div>

      <div class="filters-grid">
        <label>
          Name

          <input
            v-model="
              pointSearch.name
            "
            type="search"
            placeholder="Search name"
            @input="pointPage = 1"
          />
        </label>

        <label>
          Address

          <input
            v-model="
              pointSearch.address
            "
            type="search"
            placeholder="Search address"
            @input="pointPage = 1"
          />
        </label>

        <label>
          Accepted Waste

          <input
            v-model="
              pointSearch.waste
            "
            type="search"
            placeholder="Search waste type"
            @input="pointPage = 1"
          />
        </label>
      </div>

      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>
                <button
                  type="button"
                  aria-label="Sort recycling points by name"
                  @click="
                    changePointSort(
                      'name',
                    )
                  "
                >
                  Name

                  <span
                    v-if="
                      pointSortKey ===
                      'name'
                    "
                  >
                    {{
                      pointSortDirection ===
                      'asc'
                        ? '↑'
                        : '↓'
                    }}
                  </span>
                </button>
              </th>

              <th>
                <button
                  type="button"
                  aria-label="Sort recycling points by address"
                  @click="
                    changePointSort(
                      'address',
                    )
                  "
                >
                  Address

                  <span
                    v-if="
                      pointSortKey ===
                      'address'
                    "
                  >
                    {{
                      pointSortDirection ===
                      'asc'
                        ? '↑'
                        : '↓'
                    }}
                  </span>
                </button>
              </th>

              <th>
                Opening Hours
              </th>

              <th>
                Accepted Waste
              </th>

              <th>
                <button
                  type="button"
                  aria-label="Sort recycling points by distance"
                  @click="
                    changePointSort(
                      'distance',
                    )
                  "
                >
                  Distance

                  <span
                    v-if="
                      pointSortKey ===
                      'distance'
                    "
                  >
                    {{
                      pointSortDirection ===
                      'asc'
                        ? '↑'
                        : '↓'
                    }}
                  </span>
                </button>
              </th>
            </tr>
          </thead>

          <tbody>
            <tr
              v-for="point in pagedPoints"
              :key="point.id"
            >
              <td>
                {{ point.name }}
              </td>

              <td>
                {{ point.address }}
              </td>

              <td>
                {{ point.openingHours }}
              </td>

              <td>
                {{
                  point.acceptedWaste
                    .join(', ')
                }}
              </td>

              <td>
                {{ point.distance }}
              </td>
            </tr>

            <tr
              v-if="
                pagedPoints.length === 0
              "
            >
              <td
                colspan="5"
                class="no-results"
              >
                No matching records.
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div
        class="pagination"
        aria-label="Recycling points pagination"
      >
        <button
          type="button"
          :disabled="
            pointPage === 1
          "
          @click="pointPage--"
        >
          Previous
        </button>

        <span>
          Page {{ pointPage }}
          of {{ pointPageCount }}
        </span>

        <button
          type="button"
          :disabled="
            pointPage ===
            pointPageCount
          "
          @click="pointPage++"
        >
          Next
        </button>
      </div>
    </section>

    <section class="table-section">
      <div class="section-heading">
        <div>
          <h2>
            Recycling Guide
          </h2>

          <p aria-live="polite">
            {{ filteredItems.length }}
            records found
          </p>
        </div>

        <button
          type="button"
          class="export-button"
          @click="exportItems"
        >
          Export CSV
        </button>
      </div>

      <div class="filters-grid">
        <label>
          Item

          <input
            v-model="
              itemSearch.name
            "
            type="search"
            placeholder="Search item"
            @input="itemPage = 1"
          />
        </label>

        <label>
          Category

          <input
            v-model="
              itemSearch.category
            "
            type="search"
            placeholder="Search category"
            @input="itemPage = 1"
          />
        </label>

        <label>
          Description

          <input
            v-model="
              itemSearch.description
            "
            type="search"
            placeholder="Search description"
            @input="itemPage = 1"
          />
        </label>
      </div>

      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>
                <button
                  type="button"
                  aria-label="Sort recycling guide by item name"
                  @click="
                    changeItemSort(
                      'name',
                    )
                  "
                >
                  Item

                  <span
                    v-if="
                      itemSortKey ===
                      'name'
                    "
                  >
                    {{
                      itemSortDirection ===
                      'asc'
                        ? '↑'
                        : '↓'
                    }}
                  </span>
                </button>
              </th>

              <th>
                <button
                  type="button"
                  aria-label="Sort recycling guide by category"
                  @click="
                    changeItemSort(
                      'category',
                    )
                  "
                >
                  Category

                  <span
                    v-if="
                      itemSortKey ===
                      'category'
                    "
                  >
                    {{
                      itemSortDirection ===
                      'asc'
                        ? '↑'
                        : '↓'
                    }}
                  </span>
                </button>
              </th>

              <th>
                Description
              </th>
            </tr>
          </thead>

          <tbody>
            <tr
              v-for="item in pagedItems"
              :key="item.id"
            >
              <td>
                {{ item.icon }}
                {{ item.name }}
              </td>

              <td>
                {{ item.category }}
              </td>

              <td>
                {{ item.description }}
              </td>
            </tr>

            <tr
              v-if="
                pagedItems.length === 0
              "
            >
              <td
                colspan="3"
                class="no-results"
              >
                No matching records.
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div
        class="pagination"
        aria-label="Recycling guide pagination"
      >
        <button
          type="button"
          :disabled="
            itemPage === 1
          "
          @click="itemPage--"
        >
          Previous
        </button>

        <span>
          Page {{ itemPage }}
          of {{ itemPageCount }}
        </span>

        <button
          type="button"
          :disabled="
            itemPage ===
            itemPageCount
          "
          @click="itemPage++"
        >
          Next
        </button>
      </div>
    </section>
  </main>
</template>

<style scoped>
.tables-page {
  min-height: calc(100vh - 90px);
  padding: 70px 24px 80px;
  background-color: #f7faf8;
}

.page-header,
.table-section {
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 35px;
}

.eyebrow {
  margin-bottom: 10px;
  color: #2f6f4e;
  font-weight: 700;
}

.page-header h1 {
  margin: 0;
  color: #1f2937;
  font-size: 40px;
}

.page-header p,
.section-heading p {
  color: #65716b;
}

.table-section {
  margin-bottom: 32px;
  padding: 28px;
  border: 1px solid #e2e8e5;
  border-radius: 12px;
  background-color: #ffffff;
}

.section-heading {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  margin-bottom: 24px;
}

.section-heading h2,
.section-heading p {
  margin: 0;
}

.section-heading p {
  margin-top: 6px;
}

.export-button {
  padding: 10px 16px;
  border: none;
  border-radius: 8px;
  background-color: #2f6f4e;
  color: #ffffff;
  cursor: pointer;
  font-weight: 600;
}

.filters-grid {
  display: grid;
  grid-template-columns:
    repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 20px;
}

.filters-grid label {
  display: flex;
  flex-direction: column;
  gap: 8px;
  color: #374151;
  font-size: 14px;
  font-weight: 600;
}

.filters-grid input {
  padding: 10px 12px;
  border: 1px solid #cfd9d3;
  border-radius: 8px;
  font-size: 14px;
}

input:focus-visible,
button:focus-visible {
  outline: 3px solid #1f6feb;
  outline-offset: 3px;
}

.table-wrapper {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  padding: 13px;
  border-bottom:
    1px solid #e5e7eb;
  text-align: left;
  vertical-align: top;
}

th {
  color: #374151;
  font-size: 14px;
}

th button {
  padding: 0;
  border: none;
  background: none;
  color: inherit;
  cursor: pointer;
  font: inherit;
  font-weight: 700;
}

td {
  color: #65716b;
  font-size: 14px;
}

.no-results {
  padding: 25px;
  text-align: center;
}

.pagination {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 14px;
  margin-top: 20px;
}

.pagination button {
  padding: 8px 14px;
  border: 1px solid #cfd9d3;
  border-radius: 8px;
  background-color: #ffffff;
  color: #374151;
  cursor: pointer;
}

.pagination button:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.pagination span {
  color: #65716b;
  font-size: 14px;
}

@media (max-width: 768px) {
  .tables-page {
    padding: 50px 20px;
  }

  .page-header h1 {
    font-size: 33px;
  }

  .table-section {
    padding: 20px;
  }

  .section-heading {
    align-items: flex-start;
    flex-direction: column;
  }

  .filters-grid {
    grid-template-columns: 1fr;
  }

  .pagination {
    justify-content: center;
  }
}
</style>