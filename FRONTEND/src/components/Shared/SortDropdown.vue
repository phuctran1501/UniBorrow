<template>
  <div class="dropdown me-1">
    <button 
      class="btn btn-sm btn-light rounded-pill px-3 border-0 dropdown-toggle fw-bold text-muted small" 
      type="button" 
      data-bs-toggle="dropdown" 
      aria-expanded="false"
      style="font-size: 0.75rem;"
    >
      <i class="bi bi-sort-down me-1"></i> Sắp xếp
    </button>
    <ul class="dropdown-menu dropdown-menu-end shadow-lg border-0 rounded-3 mt-2">
      <li><a class="dropdown-item small fw-medium" href="#" @click.prevent="updateSort('newest')">Mới nhất</a></li>
      <li><a class="dropdown-item small fw-medium" href="#" @click.prevent="updateSort('price_asc')">Giá: Thấp đến Cao</a></li>
      <li><a class="dropdown-item small fw-medium" href="#" @click.prevent="updateSort('price_desc')">Giá: Cao đến Thấp</a></li>
    </ul>
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: {
    type: String,
    required: true
  }
});

const emit = defineEmits(['update:modelValue', 'change']);

const updateSort = (val) => {
  emit('update:modelValue', val);
  emit('change');
};
</script>
