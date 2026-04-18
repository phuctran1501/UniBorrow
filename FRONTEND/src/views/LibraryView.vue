<template>
  <div class="container py-5 min-vh-100">
    <div class="row g-4">
      <aside class="col-lg-3">
          <BookFilterSidebar 
            v-model:availableOnly="availableOnly"
            v-model:selectedGenres="selectedGenres"
            v-model:selectedPublishers="selectedPublishers"
            :genres="genres"
            :publishers="bookStore.publishers"
            :hasFilters="hasFilters"
            @clear="clearFilters"
            @change="handleSearch"
          />
      </aside>

      <main class="col-lg-9">
        <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
          <div class="d-flex align-items-center gap-3">
            <h2 class="fw-bold text-primary mb-0 tracking-tight">Thư viện sách</h2>
            
            <div class="d-flex align-items-center gap-2 bg-white p-1 rounded-pill shadow-sm border ms-2">
              
              <SortDropdown v-model="sortBy" @change="handleSearch" />

              <button 
                class="btn btn-sm rounded-circle d-flex align-items-center justify-content-center transition-all" 
                :class="viewMode === 'grid' ? 'btn-primary shadow-sm' : 'btn-outline-light border-0 text-muted'"
                style="width: 32px; height: 32px;"
                @click="viewMode = 'grid'"
                title="Xem dạng lưới"
              >
                <i class="bi bi-grid-3x3-gap-fill"></i>
              </button>
              <button 
                class="btn btn-sm rounded-circle d-flex align-items-center justify-content-center transition-all" 
                :class="viewMode === 'list' ? 'btn-primary shadow-sm' : 'btn-outline-light border-0 text-muted'"
                style="width: 32px; height: 32px;"
                @click="viewMode = 'list'"
                title="Xem dạng cột (danh sách)"
              >
                <i class="bi bi-list-ul"></i>
              </button>
            </div>
          </div>
          
          <SearchBox 
            v-model="searchQuery" 
            placeholder="Tìm tên sách, tác giả..."
            :show-mic="true"
            :is-listening="isListening"
            class="max-w-md w-100"
            @update:modelValue="handleSearch"
            @mic="toggleVoiceSearch"
          />
        </div>

        <div v-if="bookStore.loading" class="text-center py-5 my-5">
          <div class="spinner-border text-primary" role="status"></div>
        </div>

        <div v-else-if="bookStore.books.length === 0" class="text-center py-5 my-5 bg-light rounded-4">
          <div class="display-1 text-muted opacity-25 mb-3"><i class="bi bi-journal-x"></i></div>
          <h4 class="fw-bold text-dark">Không tìm thấy sách phù hợp</h4>
          <p class="text-muted">Hãy thử thay đổi từ khóa hoặc bộ lọc bên trái.</p>
          <button class="btn btn-primary rounded-pill px-4 mt-2" @click="clearFilters">
            Xem tất cả sách
          </button>
        </div>

        <div v-else class="row g-4">
          <div 
            v-for="book in bookStore.books" 
            :key="book._id" 
            :class="viewMode === 'grid' ? 'col-xl-3 col-lg-4 col-md-6' : 'col-12'"
          >
            <BookDisplayCard 
              :book="book"
              :view-mode="viewMode"
              :borrowing-id="borrowingId"
              :quantity="getQuantity(book._id)"
              @update:quantity="setQuantity(book._id, $event)"
              @borrow="onBorrow"
            />
          </div>
        </div>

        <Pagination 
          :current-page="bookStore.currentPage"
          :total-pages="bookStore.totalPages"
          @change="goToPage"
        />
      </main>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useBookStore } from '../store/bookStore';
import { useVoiceRecognition } from '../composables/useVoiceRecognition';
import { useBorrow } from '../composables/useBorrow';
import { useViewMode } from '../composables/useViewMode';
import BookDisplayCard from '../components/BookDisplayCard.vue';
import BookFilterSidebar from '../components/Shared/BookFilterSidebar.vue';
import SortDropdown from '../components/Shared/SortDropdown.vue';
import SearchBox from '../components/Shared/SearchBox.vue';
import Pagination from '../components/Shared/Pagination.vue';


const route = useRoute();
const router = useRouter();
const bookStore = useBookStore();

const { viewMode } = useViewMode('grid', 'library-view-mode');

const { borrowingId, getQuantity, setQuantity, onBorrow } = useBorrow(() => {
  bookStore.fetchBooks(searchQuery.value, availableOnly.value, selectedPublishers.value, selectedGenres.value, bookStore.currentPage);
});

const genres = ['Công nghệ', 'Kinh tế', 'Giáo dục', 'Tiểu thuyết', 'Văn học', 'Tâm lý học'];

const searchQuery = ref(route.query.q || ''); 
const availableOnly = ref(false);            
const selectedPublishers = ref([]); 
const selectedGenres = ref([]);   
const sortBy = ref('newest');
const { isListening, toggleVoiceSearch } = useVoiceRecognition((transcript) => {
  searchQuery.value = transcript;
  handleSearch(); 
});

const hasFilters = computed(() => {
  return searchQuery.value !== '' || availableOnly.value === true || selectedPublishers.value.length > 0 || selectedGenres.value.length > 0;
});

let searchTimeout = null;
const handleSearch = () => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    bookStore.fetchBooks(searchQuery.value, availableOnly.value, selectedPublishers.value, selectedGenres.value, 1, sortBy.value);
  }, 300);
};

const goToPage = (page) => {
  bookStore.fetchBooks(searchQuery.value, availableOnly.value, selectedPublishers.value, selectedGenres.value, page, sortBy.value);
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const clearFilters = () => {
  searchQuery.value = '';
  availableOnly.value = false;
  selectedPublishers.value = [];
  selectedGenres.value = [];
  handleSearch();
};



onMounted(async () => {
  await bookStore.fetchPublishers();
  bookStore.fetchBooks(searchQuery.value, availableOnly.value, selectedPublishers.value, selectedGenres.value, 1, sortBy.value);
});

watch(() => route.query.q, (newVal) => {
  searchQuery.value = newVal || '';
  handleSearch();
});
</script>

<style scoped>
.max-w-md { max-width: 400px; }
.max-h-300 { max-height: 300px; }
.cursor-pointer { cursor: pointer; }

.filter-sidebar {
  transition: all 0.3s ease;
  z-index: 1000; 
  top: 120px !important; 
}
.custom-check {
  cursor: pointer;
  width: 18px;
  height: 18px;
  border: 2px solid #cbd5e1;
  transition: all 0.2s ease;
}
.custom-check:checked {
  background-color: var(--primary-color) !important;
  border-color: var(--primary-color) !important;
}

.custom-switch {
  cursor: pointer;
  transform: scale(1.1);
}
.custom-switch:checked {
  background-color: var(--primary-color) !important;
  border-color: var(--primary-color) !important;
}

.custom-radio .form-check-input:checked {
  background-color: var(--primary-color);
  border-color: var(--primary-color);
}


.publisher-list::-webkit-scrollbar { width: 4px; }
.publisher-list::-webkit-scrollbar-track { background: #f1f1f1; }
.publisher-list::-webkit-scrollbar-thumb { background: #ccc; border-radius: 10px; }
.publisher-list::-webkit-scrollbar-thumb:hover { background: var(--primary-color); }
</style>
