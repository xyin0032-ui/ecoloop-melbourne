<script setup>
import {
  onBeforeUnmount,
  onMounted,
  ref,
} from 'vue'

import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

import {
  recyclingPoints,
} from '../data/recyclingPoints'

const mapElement = ref(null)

const locationMessage = ref('')
const routeMessage = ref('')

let map = null
let userMarker = null
let routeLayer = null
let userLocation = null

function addRecyclingPoints() {
  recyclingPoints.forEach((point) => {
    const marker =
      L.circleMarker(
        [
          point.latitude,
          point.longitude,
        ],
        {
          radius: 9,
          fillOpacity: 0.9,
          weight: 2,
        },
      )

    marker
      .addTo(map)
      .bindPopup(`
        <strong>${point.name}</strong><br>
        ${point.address}<br>
        ${point.openingHours}
      `)
  })
}

function useMyLocation() {
  locationMessage.value =
    'Getting your location...'

  if (!navigator.geolocation) {
    locationMessage.value =
      'Location is not supported by this browser.'

    return
  }

  navigator.geolocation
    .getCurrentPosition(
      (position) => {
        const latitude =
          position.coords.latitude

        const longitude =
          position.coords.longitude

        userLocation = {
          latitude,
          longitude,
        }

        if (userMarker) {
          map.removeLayer(userMarker)
        }

        userMarker =
          L.circleMarker(
            [
              latitude,
              longitude,
            ],
            {
              radius: 10,
              fillOpacity: 1,
              weight: 3,
            },
          )

        userMarker
          .addTo(map)
          .bindPopup(
            'Your current location',
          )
          .openPopup()

        map.setView(
          [latitude, longitude],
          14,
        )

        locationMessage.value =
          'Your location has been found.'
      },
      () => {
        locationMessage.value =
          'Unable to get your location. Please allow location access.'
      },
    )
}

async function showRoute(point) {
  if (!userLocation) {
    routeMessage.value =
      'Please use your location first.'

    return
  }

  routeMessage.value =
    'Loading route...'

  const startLongitude =
    userLocation.longitude

  const startLatitude =
    userLocation.latitude

  const endLongitude =
    point.longitude

  const endLatitude =
    point.latitude

  const url =
    `https://router.project-osrm.org/route/v1/driving/` +
    `${startLongitude},${startLatitude};` +
    `${endLongitude},${endLatitude}` +
    `?overview=full&geometries=geojson`

  try {
    const response =
      await fetch(url)

    if (!response.ok) {
      throw new Error('Route failed')
    }

    const data =
      await response.json()

    if (
      !data.routes ||
      data.routes.length === 0
    ) {
      routeMessage.value =
        'No route was found.'

      return
    }

    const route =
      data.routes[0]

    const coordinates =
      route.geometry.coordinates.map(
        (coordinate) => [
          coordinate[1],
          coordinate[0],
        ],
      )

    if (routeLayer) {
      map.removeLayer(routeLayer)
    }

    routeLayer =
      L.polyline(
        coordinates,
        {
          weight: 5,
        },
      ).addTo(map)

    map.fitBounds(
      routeLayer.getBounds(),
      {
        padding: [30, 30],
      },
    )

    const distance =
      (
        route.distance / 1000
      ).toFixed(1)

    const minutes =
      Math.round(
        route.duration / 60,
      )

    routeMessage.value =
      `${point.name}: ${distance} km, about ${minutes} minutes by car.`
  } catch {
    routeMessage.value =
      'Unable to load the route. Please try again.'
  }
}

function clearRoute() {
  if (routeLayer) {
    map.removeLayer(routeLayer)
    routeLayer = null
  }

  routeMessage.value = ''
}

onMounted(() => {
  map =
    L.map(
      mapElement.value,
    ).setView(
      [
        -37.8136,
        144.9631,
      ],
      13,
    )

  L.tileLayer(
    'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    {
      attribution:
        '&copy; OpenStreetMap contributors',
    },
  ).addTo(map)

  addRecyclingPoints()
})

onBeforeUnmount(() => {
  if (map) {
    map.remove()
  }
})
</script>

<template>
  <main class="map-page">
    <section class="page-header">
      <p class="eyebrow">
        Recycling Map
      </p>

      <h1>
        Find recycling points on the map
      </h1>

      <p>
        View recycling locations, use your
        current location and check a route
        to a recycling point.
      </p>
    </section>

    <section class="map-content">
      <div class="map-actions">
        <button
          type="button"
          class="main-button"
          @click="useMyLocation"
        >
          Use My Location
        </button>

        <button
          type="button"
          class="secondary-button"
          @click="clearRoute"
        >
          Clear Route
        </button>

        <p
          v-if="locationMessage"
          class="message"
          aria-live="polite"
        >
          {{ locationMessage }}
        </p>

        <p
          v-if="routeMessage"
          class="message"
          aria-live="polite"
        >
          {{ routeMessage }}
        </p>
      </div>

      <div
        ref="mapElement"
        class="map"
        role="region"
        aria-label="Interactive map showing recycling points and routes"
      ></div>

      <div class="points-list">
        <h2>
          Recycling Points
        </h2>

        <article
          v-for="point in recyclingPoints"
          :key="point.id"
          class="point-card"
        >
          <div>
            <h3>
              {{ point.name }}
            </h3>

            <p>
              {{ point.address }}
            </p>

            <p>
              {{ point.openingHours }}
            </p>
          </div>

          <button
            type="button"
            class="route-button"
            :aria-label="
              `Show route to ${point.name}`
            "
            @click="showRoute(point)"
          >
            Show Route
          </button>
        </article>
      </div>
    </section>
  </main>
</template>

<style scoped>
.map-page {
  min-height: calc(100vh - 90px);
  padding: 60px 24px 80px;
  background-color: #f7faf8;
}

.page-header,
.map-content {
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 32px;
}

.eyebrow {
  margin-bottom: 10px;
  color: #2f6f4e;
  font-weight: 700;
}

.page-header h1 {
  margin: 0 0 12px;
  color: #1f2937;
  font-size: 40px;
}

.page-header p {
  color: #65716b;
}

.map-actions {
  margin-bottom: 20px;
}

.main-button,
.secondary-button,
.route-button {
  padding: 10px 16px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
}

.main-button,
.route-button {
  border: none;
  background-color: #2f6f4e;
  color: #ffffff;
}

.secondary-button {
  margin-left: 10px;
  border: 1px solid #cfd9d3;
  background-color: #ffffff;
  color: #374151;
}

button:focus-visible {
  outline: 3px solid #1f6feb;
  outline-offset: 3px;
}

.message {
  margin-top: 12px;
  color: #374151;
}

.map {
  width: 100%;
  height: 500px;
  border: 1px solid #dfe7e2;
  border-radius: 12px;
}

.points-list {
  margin-top: 32px;
}

.points-list h2 {
  margin-bottom: 18px;
  color: #1f2937;
}

.point-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  margin-bottom: 12px;
  padding: 20px;
  border: 1px solid #e2e8e5;
  border-radius: 10px;
  background-color: #ffffff;
}

.point-card h3 {
  margin: 0 0 8px;
  color: #1f2937;
}

.point-card p {
  margin: 4px 0;
  color: #65716b;
}

.route-button {
  white-space: nowrap;
}

@media (max-width: 768px) {
  .map-page {
    padding: 45px 20px;
  }

  .page-header h1 {
    font-size: 32px;
  }

  .map {
    height: 380px;
  }

  .point-card {
    align-items: flex-start;
    flex-direction: column;
  }

  .secondary-button {
    margin-top: 10px;
    margin-left: 0;
  }
}
</style>