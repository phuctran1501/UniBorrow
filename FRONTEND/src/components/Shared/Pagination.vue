<template>
  <div v-if="totalPages > 1" class="d-flex justify-content-center align-items-center mt-4 mb-5 gap-3">
    <button 
      class="btn btn-outline-dark rounded-pill px-4 fw-bold shadow-sm"
      :disabled="currentPage === 1"
      @click="$emit('change', currentPage - 1)"
    >
      <i class="bi bi-chevron-left"></i>
    </button>

    <span class="fw-bold">Trang {{ currentPage }} / {{ totalPages }}</span>

    <button 
      class="btn btn-outline-dark rounded-pill px-4 fw-bold shadow-sm"
      :disabled="currentPage === totalPages"
      @click="$emit('change', currentPage + 1)"
    >
      <i class="bi bi-chevron-right"></i>
    </button>
  </div>
</template>

<script setup>
defineProps({
  currentPage: { type: Number, required: true },
  totalPages: { type: Number, required: true }
});
defineEmits(['change']);
</script>
