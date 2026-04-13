<template>
  <div class="d-flex flex-column min-vh-100">
    <Navbar />
    
    <main class="flex-grow-1">
      <router-view />
    </main>
    
    <Footer />
  </div>
</template>

<script setup>
import Navbar from '../components/Shared/Navbar.vue';
import Footer from '../components/Shared/Footer.vue';
</script>

<style scoped>
main {
  min-height: 80vh;
}
</style>
