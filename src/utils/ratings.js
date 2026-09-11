const RATINGS_KEY = 'ecoloop_ratings'

export function getRatings() {
  const savedRatings = localStorage.getItem(RATINGS_KEY)

  if (!savedRatings) {
    return []
  }

  try {
    const ratings = JSON.parse(savedRatings)

    if (Array.isArray(ratings)) {
      return ratings
    }

    return []
  } catch {
    return []
  }
}

function saveRatings(ratings) {
  localStorage.setItem(RATINGS_KEY, JSON.stringify(ratings))
}

export function addRating(pointId, userId, rating) {
  const ratingValue = Number(rating)

  if (
    !Number.isInteger(ratingValue) ||
    ratingValue < 1 ||
    ratingValue > 5
  ) {
    return false
  }

  const ratings = getRatings()

  const existingRating = ratings.find(
    (item) =>
      item.pointId === pointId &&
      item.userId === userId,
  )

  if (existingRating) {
    existingRating.rating = ratingValue
  } else {
    ratings.push({
      pointId,
      userId,
      rating: ratingValue,
    })
  }

  saveRatings(ratings)

  return true
}

export function getPointRatings(pointId) {
  return getRatings().filter(
    (item) => item.pointId === pointId,
  )
}

export function getAverageRating(pointId) {
  const ratings = getPointRatings(pointId)

  if (ratings.length === 0) {
    return 0
  }

  const total = ratings.reduce(
    (sum, item) => sum + item.rating,
    0,
  )

  return total / ratings.length
}