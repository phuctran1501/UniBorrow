<template>
  <div class="d-flex bg-white border rounded-pill p-1 shadow-sm overflow-auto no-scrollbar" style="max-width: fit-content;">
    <template v-for="(filter, index) in filters" :key="filter.value">
      <div v-if="index > 0" class="vr my-2 text-muted opacity-25 flex-shrink-0" style="height: 1.2rem;"></div>
      
      <button 
        @click="$emit('update:modelValue', filter.value)"
        :class="[
          'btn border-0 fw-bold px-3 py-1 transition-all d-flex align-items-center rounded-pill text-nowrap',
          modelValue === filter.value ? 'btn-primary shadow-sm text-white' : 'btn-link text-dark text-decoration-none'
        ]"
        style="font-size: 0.85rem;"
      >
        {{ filter.label }}
        <span 
          v-if="getCount(filter.value) > 0" 
          :class="['badge rounded-circle ms-2 d-flex align-items-center justify-content-center', modelValue === filter.value ? 'bg-white text-primary' : 'bg-light text-muted border']"
          style="min-width: 18px; height: 18px; font-size: 0.65rem;"
        >
          {{ getCount(filter.value) }}
        </span>
      </button>
    </template>
  </div>
</template>

<script setup>
defineProps({
  modelValue: { type: String, required: true },
  filters: { type: Array, required: true },
  getCount: { type: Function, default: () => 0 }
});

defineEmits(['update:modelValue']);
</script>

<style scoped>
</style>

