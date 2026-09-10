<script setup>
import { getUsers } from '../utils/auth'

const users = getUsers()

const userCount = users.filter(
  (user) => user.role === 'user',
).length

const adminCount = users.filter(
  (user) => user.role === 'admin',
).length
</script>

<template>
  <main class="admin-page">
    <section class="admin-container">
      <div class="admin-header">
        <p class="eyebrow">Admin Area</p>

        <h1>Admin Dashboard</h1>

        <p>
          View basic account information for EcoLoop Melbourne.
        </p>
      </div>

      <div class="summary-grid">
        <div class="summary-card">
          <h2>{{ userCount }}</h2>
          <p>Registered Users</p>
        </div>

        <div class="summary-card">
          <h2>{{ adminCount }}</h2>
          <p>Admin Accounts</p>
        </div>

        <div class="summary-card">
          <h2>{{ users.length }}</h2>
          <p>Total Accounts</p>
        </div>
      </div>

      <section class="users-section">
        <h2>User Accounts</h2>

        <div class="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Username</th>
                <th>Email</th>
                <th>Role</th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="user in users" :key="user.id">
                <td>{{ user.username }}</td>
                <td>{{ user.email }}</td>
                <td>{{ user.role }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </section>
  </main>
</template>

<style scoped>
.admin-page {
  min-height: calc(100vh - 90px);
  padding: 70px 24px;
  background-color: #f7faf8;
}

.admin-container {
  max-width: 1000px;
  margin: 0 auto;
}

.admin-header {
  margin-bottom: 35px;
}

.eyebrow {
  margin-bottom: 10px;
  color: #2f6f4e;
  font-weight: 700;
}

.admin-header h1 {
  margin: 0;
  color: #1f2937;
  font-size: 40px;
}

.admin-header p {
  margin-top: 15px;
  color: #65716b;
  line-height: 1.6;
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-bottom: 35px;
}

.summary-card {
  padding: 26px;
  border: 1px solid #e2e8e5;
  border-radius: 12px;
  background-color: #ffffff;
}

.summary-card h2 {
  margin: 0 0 8px;
  color: #2f6f4e;
  font-size: 34px;
}

.summary-card p {
  margin: 0;
  color: #65716b;
}

.users-section {
  padding: 28px;
  border: 1px solid #e2e8e5;
  border-radius: 12px;
  background-color: #ffffff;
}

.users-section h2 {
  margin-top: 0;
  color: #1f2937;
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
  padding: 14px;
  border-bottom: 1px solid #e5e7eb;
  text-align: left;
}

th {
  color: #374151;
  font-size: 14px;
}

td {
  color: #65716b;
}

@media (max-width: 768px) {
  .admin-page {
    padding: 50px 20px;
  }

  .admin-header h1 {
    font-size: 33px;
  }

  .summary-grid {
    grid-template-columns: 1fr;
  }

  .users-section {
    padding: 20px;
  }
}
</style>