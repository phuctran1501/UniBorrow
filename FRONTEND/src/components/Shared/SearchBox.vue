<template>
  <div class="search-box-outer position-relative">
    <div class="search-box-wrap d-flex align-items-center">
      <i class="bi bi-search ms-3 fs-6 text-muted flex-shrink-0"></i>
      <input 
        type="text"
        class="form-control border-0 shadow-none px-3 py-2 bg-transparent"
        :placeholder="placeholder"
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
      >
    </div>

    <button 
      v-if="showMic"
      class="btn voice-btn voice-btn-sm position-absolute top-50 translate-middle-y d-flex align-items-center justify-content-center p-0 border-0 shadow-none"
      :class="isListening ? 'text-primary pulse-scale' : 'text-muted'"
      style="right: 8px;"
      @click="$emit('mic')"
      type="button"
      title="Tìm kiếm bằng giọng nói"
    >
      <i :class="isListening ? 'bi bi-mic-fill' : 'bi bi-mic'"></i>
    </button>
  </div>
</template>

<script setup>
defineProps({
  modelValue: { type: String, default: '' },
  placeholder: { type: String, default: 'Tìm kiếm...' },
  showMic: { type: Boolean, default: false },
  isListening: { type: Boolean, default: false }
});
defineEmits(['update:modelValue', 'mic']);
</script>

<style scoped>
.search-box-wrap {
  border: 1px solid #dee2e6;
  border-radius: 50rem;
  background: #fff;
  box-shadow: 0 0 0 3px transparent;
  transition: box-shadow 0.2s ease, border-color 0.2s ease;
}
/* .search-box-wrap:focus-within {
  box-shadow: 0 0 0 3px rgba(var(--primary-rgb, 13, 110, 253), 0.12);
  border-color: rgba(var(--primary-rgb, 13, 110, 253), 0.4);
} */
.search-box-wrap .form-control:focus {
  box-shadow: none !important;
  outline: none !important;
}
</style>

