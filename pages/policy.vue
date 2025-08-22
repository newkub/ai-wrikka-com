<script setup lang="ts">
// Privacy policy page
</script>

<template>
  <div class="policy-container">
    <h1 class="policy-title">Privacy Policy</h1>
    
    <div class="toc">
      <h2>Table of Contents</h2>
      <ul>
        <li><a href="#data-collection"><div class="i-mdi-file-document-outline mr-2"></div> Data Collection</a></li>
        <li><a href="#data-usage"><div class="i-mdi-data-matrix-scan mr-2"></div> Data Usage</a></li>
        <li><a href="#security"><div class="i-mdi-shield-account-outline mr-2"></div> Security</a></li>
      </ul>
    </div>
    
    <section id="data-collection" class="policy-section">
      <h2><div class="i-mdi-file-document-outline mr-2"></div> Data Collection</h2>
      <p>We collect the following information...</p>
    </section>
    
    <section id="data-usage" class="policy-section">
      <h2><div class="i-mdi-data-matrix-scan mr-2"></div> Data Usage</h2>
      <p>Your data is used for...</p>
    </section>
    
    <section id="security" class="policy-section">
      <h2><div class="i-mdi-shield-account-outline mr-2"></div> Security</h2>
      <p>We implement the following security measures...</p>
    </section>
  </div>
</template>

<style scoped>
.policy-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.policy-title {
  font-size: 2.5rem;
  margin-bottom: 2rem;
}

.toc {
  background: #f5f5f5;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 2rem;
}

.policy-section {
  margin-bottom: 3rem;
}

.policy-section h2 {
  display: flex;
  align-items: center;
  font-size: 1.5rem;
  margin-bottom: 1rem;
}
</style>
