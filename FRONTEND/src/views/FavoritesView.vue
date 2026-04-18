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
          />
      </aside>

      <main class="col-lg-9">
        <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
          <div class="d-flex align-items-center gap-3">
            <h2 class="fw-bold text-primary mb-0 tracking-tight">Sách yêu thích</h2>
            
            <div class="d-flex align-items-center gap-2 bg-white p-1 rounded-pill shadow-sm border ms-2">
              
              <SortDropdown v-model="sortBy" />

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
            placeholder="Tìm trong danh sách yêu thích..."
            :show-mic="true"
            :is-listening="isListening"
            class="max-w-md w-100"
            @mic="toggleVoiceSearch"
          />
        </div>

        <div v-if="bookStore.loading" class="text-center py-5 my-5">
          <div class="spinner-border text-primary" role="status"></div>
          <p class="mt-3 text-muted fw-medium">Đang tải danh sách yêu thích...</p>
        </div>

        <div v-else-if="bookStore.favorites.length === 0" class="text-center py-5 my-5 bg-white rounded-4 shadow-sm">
          <div class="display-1 text-muted opacity-25 mb-3"><i class="bi bi-heart"></i></div>
          <h4 class="fw-bold text-dark">Danh sách yêu thích đang trống</h4>
          <p class="text-muted">Hãy thêm những quyển sách bạn thích vào đây.</p>
          <router-link to="/library" class="btn btn-primary rounded-pill px-4 mt-2">
            Khám phá thư viện
          </router-link>
        </div>

        <div v-else-if="filteredBooks.length === 0" class="text-center py-5 my-5 bg-white rounded-4 shadow-sm">
          <div class="display-1 text-muted opacity-25 mb-3"><i class="bi bi-search"></i></div>
          <h4 class="fw-bold text-dark">Không tìm thấy sách phù hợp</h4>
          <p class="text-muted">Hãy thử thay đổi từ khóa hoặc bộ lọc bên trái.</p>
          <button class="btn btn-primary rounded-pill px-4 mt-2" @click="clearFilters">
            Xem tất cả yêu thích
          </button>
        </div>

        <div v-else class="row g-4">
          <div 
            v-for="book in filteredBooks" 
            :key="book._id" 
            :class="viewMode === 'grid' ? 'col-xl-3 col-lg-4 col-md-6 col-sm-6' : 'col-12'"
          >
            <BookDisplayCard 
              :book="book"
              :view-mode="viewMode"
              :borrowing-id="borrowingId"
              :quantity="getQuantity(book._id)"
              :is-favorite-view="true"
              @update:quantity="setQuantity(book._id, $event)"
              @borrow="onBorrow"
              @remove-favorite="handleRemoveFavorite"
            />
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useBookStore } from '../store/bookStore';
import { useNotificationStore } from '../store/notificationStore';
import { useVoiceRecognition } from '../composables/useVoiceRecognition';
import { useBorrow } from '../composables/useBorrow';
import { useViewMode } from '../composables/useViewMode';
import BookDisplayCard from '../components/BookDisplayCard.vue';
import BookFilterSidebar from '../components/Shared/BookFilterSidebar.vue';
import SortDropdown from '../components/Shared/SortDropdown.vue';
import SearchBox from '../components/Shared/SearchBox.vue';

const router = useRouter();
const bookStore = useBookStore();
const notifStore = useNotificationStore();

const { viewMode } = useViewMode('grid', 'favorites-view-mode');

const { borrowingId, getQuantity, setQuantity, resetQuantities, onBorrow } = useBorrow(async () => {
  await bookStore.fetchFavorites();
});

const genres = ['Công nghệ', 'Kinh tế', 'Giáo dục', 'Tiểu thuyết', 'Văn học', 'Tâm lý học'];

const searchQuery = ref(''); 
const availableOnly = ref(false);            
const selectedPublishers = ref([]); 
const selectedGenres = ref([]);   
const sortBy = ref('newest');

const { isListening, toggleVoiceSearch } = useVoiceRecognition((transcript) => {
  searchQuery.value = transcript;
});

const hasFilters = computed(() => {
  return searchQuery.value !== '' || availableOnly.value === true || selectedPublishers.value.length > 0 || selectedGenres.value.length > 0;
});

const filteredBooks = computed(() => {
  let results = [...bookStore.favorites];

  if (availableOnly.value) {
    results = results.filter(book => book.SoQuyen > 0);
  }

  if (selectedGenres.value.length > 0) {
    results = results.filter(book => selectedGenres.value.includes(book.TheLoai));
  }

  if (selectedPublishers.value.length > 0) {
    results = results.filter(book => selectedPublishers.value.includes(book.MaNXB?._id || book.MaNXB));
  }

  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase();
    results = results.filter(book => 
      book.TenSach.toLowerCase().includes(query) || 
      (book.TacGia && book.TacGia.toLowerCase().includes(query))
    );
  }

  if (sortBy.value === 'price_asc') {
    results.sort((a, b) => (a.DonGia || 0) - (b.DonGia || 0));
  } else if (sortBy.value === 'price_desc') {
    results.sort((a, b) => (b.DonGia || 0) - (a.DonGia || 0));
  } else if (sortBy.value === 'newest') {
    results.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }
  
  return results;
});

const clearFilters = () => {
  searchQuery.value = '';
  availableOnly.value = false;
  selectedPublishers.value = [];
  selectedGenres.value = [];
};

const handleRemoveFavorite = async (bookId) => {
  const result = await bookStore.toggleFavorite(bookId);
  if (result.success) {
    notifStore.add('Đã xóa khỏi danh sách yêu thích', 'success');
  } else {
    notifStore.add(result.message || 'Lỗi khi xóa yêu thích', 'error');
  }
};

onMounted(async () => {
    await bookStore.fetchPublishers();
    await bookStore.fetchFavorites();
    resetQuantities(bookStore.favorites);
});
</script>

<style scoped>
.filter-sidebar {
  transition: all 0.3s ease;
  z-index: 1000; 
  top: 100px !important; 
}


.custom-switch, .custom-check { cursor: pointer; }
.custom-switch:checked, .custom-check:checked {
  background-color: var(--primary-color) !important;
  border-color: var(--primary-color) !important;
}

.max-h-300 { max-height: 300px; }
</style>

