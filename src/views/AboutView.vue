<template>
  <main class="about-page">
    <section class="about-header">
      <p class="eyebrow">About Us</p>
      <h1>About EcoLoop Melbourne</h1>

      <p class="intro">
        EcoLoop Melbourne is designed to make recycling information easier
        to find and understand for Melbourne residents.
      </p>
    </section>

    <section class="about-content">
      <div class="about-card">
        <h2>Our Purpose</h2>
        <p>
          Different types of household waste need different recycling methods.
          EcoLoop Melbourne brings useful recycling information together in one
          simple website.
        </p>
      </div>

      <div class="about-card">
        <h2>What We Provide</h2>
        <p>
          Users can learn how to recycle common waste items and search for
          recycling points based on location and accepted waste types.
        </p>
      </div>

      <div class="about-card">
        <h2>Our Goal</h2>
        <p>
          Our goal is to support better recycling habits, reduce waste and
          encourage a cleaner and more sustainable Melbourne community.
        </p>
      </div>
    </section>
  </main>
</template>

<style scoped>
.about-page {
  min-height: calc(100vh - 90px);
  padding-bottom: 80px;
  background-color: #f7faf8;
}

.about-header {
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

.about-header h1 {
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

.about-content {
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 24px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

.about-card {
  padding: 30px;
  border: 1px solid #e2e8e5;
  border-radius: 14px;
  background-color: #ffffff;
}

.about-card h2 {
  margin: 0 0 14px;
  color: #26352e;
  font-size: 21px;
}

.about-card p {
  margin: 0;
  color: #65716b;
  line-height: 1.7;
}

@media (max-width: 768px) {
  .about-content {
    grid-template-columns: 1fr;
    max-width: 650px;
  }
}

@media (max-width: 576px) {
  .about-header {
    padding: 50px 20px 35px;
  }

  .about-header h1 {
    font-size: 34px;
  }

  .intro {
    font-size: 16px;
  }

  .about-content {
    padding: 0 20px;
  }
}
</style>