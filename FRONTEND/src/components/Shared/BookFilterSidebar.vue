<template>
  <div class="filter-sidebar p-4 rounded-4 bg-white shadow-sm border sticky-top" style="top: 100px;">
    <h5 class="fw-bold text-dark mb-4 d-flex align-items-center gap-2">
      <i class="bi bi-funnel-fill text-primary"></i> Bộ lọc nâng cao
    </h5>

    <div class="mb-4">
      <label class="small fw-bold text-muted text-uppercase tracking-wider mb-2 d-block">Trạng thái</label>
      <div class="form-check form-switch d-flex align-items-center gap-2 p-0">
        <input 
          class="form-check-input ms-0 custom-switch" 
          type="checkbox" 
          id="availableSwitch" 
          v-model="localAvailable"
        >
        <label class="form-check-label text-dark small cursor-pointer" for="availableSwitch">
          Chỉ hiện sách có sẵn
        </label>
      </div>
    </div>

    <hr class="my-4 opacity-50">

    <div class="mb-4">
      <label class="small fw-bold text-muted text-uppercase tracking-wider mb-3 d-block">Thể loại</label>
      <div class="genre-list d-flex flex-column gap-2">
        <div class="form-check d-flex align-items-center gap-3 p-0 mb-1" v-for="genre in genres" :key="genre">
          <input 
            class="form-check-input ms-0 mt-0 custom-check" 
            type="checkbox" 
            :id="'genre-' + genre" 
            :value="genre"
            v-model="localGenres"
          >
          <label class="form-check-label small text-dark cursor-pointer fw-medium" :for="'genre-' + genre">
            {{ genre }}
          </label>
        </div>
      </div>
    </div>

    <hr class="my-4 opacity-50">

    <div class="mb-4">
      <label class="small fw-bold text-muted text-uppercase tracking-wider mb-3 d-block">Nhà xuất bản</label>
      <div class="publisher-list d-flex flex-column gap-2 max-h-300 overflow-auto pe-2 custom-scrollbar">
        <div class="form-check d-flex align-items-center gap-3 p-0 mb-1" v-for="nxb in publishers" :key="nxb._id">
          <input 
            class="form-check-input ms-0 mt-0 custom-check" 
            type="checkbox" 
            :id="'nxb-' + nxb._id" 
            :value="nxb._id"
            v-model="localPublishers"
          >
          <label class="form-check-label small text-dark cursor-pointer fw-medium" :for="'nxb-' + nxb._id">
            {{ nxb.TenNXB }}
          </label>
        </div>
      </div>
    </div>

    <button 
      v-if="hasFilters"
      class="btn btn-outline-danger btn-sm w-100 rounded-pill mt-2 fw-medium"
      @click="$emit('clear')"
    >
      <i class="bi bi-x-circle me-1"></i> Xóa tất cả bộ lọc
    </button>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  availableOnly: Boolean,
  selectedGenres: Array,
  selectedPublishers: Array,
  genres: Array,
  publishers: Array,
  hasFilters: Boolean
});

const emit = defineEmits([
  'update:availableOnly',
  'update:selectedGenres',
  'update:selectedPublishers',
  'change',
  'clear'
]);

const localAvailable = computed({
  get: () => props.availableOnly,
  set: (val) => {
    emit('update:availableOnly', val);
    emit('change');
  }
});

const localPublishers = computed({
  get: () => props.selectedPublishers,
  set: (val) => {
    emit('update:selectedPublishers', val);
    emit('change');
  }
});

const localGenres = computed({
  get: () => props.selectedGenres,
  set: (val) => {
    emit('update:selectedGenres', val);
    emit('change');
  }
});

</script>

<style scoped>
.custom-switch, .custom-check { cursor: pointer; }
.custom-switch:checked, .custom-check:checked {
  background-color: var(--primary-color) !important;
  border-color: var(--primary-color) !important;
}
.max-h-300 { max-height: 300px; }
.tracking-wider { letter-spacing: 0.05em; }
</style>

