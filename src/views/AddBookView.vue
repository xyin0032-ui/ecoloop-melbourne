<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-6">
        <div class="card p-4">
          <h2 class="text-center mb-4">
            Add Book
          </h2>

          <form @submit.prevent="addBook">
            <div class="mb-3">
              <label
                for="isbn"
                class="form-label"
              >
                ISBN
              </label>

              <input
                id="isbn"
                v-model.number="isbn"
                type="number"
                class="form-control"
                placeholder="Enter ISBN"
                required
              >
            </div>

            <div class="mb-3">
              <label
                for="name"
                class="form-label"
              >
                Book Name
              </label>

              <input
                id="name"
                v-model="name"
                type="text"
                class="form-control"
                placeholder="Enter book name"
                required
              >
            </div>

            <button
              type="submit"
              class="btn btn-primary w-100"
            >
              Add Book
            </button>
          </form>

          <div
            v-if="successMessage"
            class="alert alert-success mt-3"
          >
            {{ successMessage }}
          </div>

          <div
            v-if="errorMessage"
            class="alert alert-danger mt-3"
          >
            {{ errorMessage }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import {
  collection,
  addDoc
} from 'firebase/firestore'
import db from '../Firebase/init'

const isbn = ref('')
const name = ref('')
const successMessage = ref('')
const errorMessage = ref('')

const addBook = async () => {
  try {
    await addDoc(
      collection(db, 'books'),
      {
        isbn: Number(isbn.value),
        name: name.value
      }
    )

    successMessage.value = 'Book added successfully!'
    errorMessage.value = ''

    isbn.value = ''
    name.value = ''
  } catch (error) {
    console.log('Error adding book:', error)

    errorMessage.value = 'Failed to add book.'
    successMessage.value = ''
  }
}
</script>