<template>
  <main class="access-page">
    <section class="access-box">
      <p class="eyebrow">Access Denied</p>

      <h1>You cannot access this page</h1>

      <p>
        This page is only available to admin users.
      </p>

      <RouterLink to="/" class="home-button">
        Back to Home
      </RouterLink>
    </section>
  </main>
</template>

<style scoped>
.access-page {
  min-height: calc(100vh - 90px);
  padding: 90px 24px;
  background-color: #f7faf8;
}

.access-box {
  max-width: 620px;
  margin: 0 auto;
  padding: 45px;
  border: 1px solid #e2e8e5;
  border-radius: 14px;
  background-color: #ffffff;
  text-align: center;
}

.eyebrow {
  margin-bottom: 12px;
  color: #b42318;
  font-weight: 700;
}

.access-box h1 {
  margin: 0;
  color: #1f2937;
  font-size: 38px;
}

.access-box p {
  margin: 18px 0 28px;
  color: #65716b;
  line-height: 1.6;
}

.home-button {
  display: inline-block;
  padding: 12px 20px;
  border-radius: 8px;
  background-color: #2f6f4e;
  color: #ffffff;
  font-weight: 600;
  text-decoration: none;
}

.home-button:hover {
  background-color: #24583e;
}

@media (max-width: 576px) {
  .access-page {
    padding: 60px 20px;
  }

  .access-box {
    padding: 30px 22px;
  }

  .access-box h1 {
    font-size: 31px;
  }
}
</style>