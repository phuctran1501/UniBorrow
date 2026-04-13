<template>
  <div class="container py-5 min-vh-100">
    <div class="row g-4">
      <aside class="col-lg-3">
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
                v-model="availableOnly"
                @change="handleSearch"
              >
              <label class="form-check-label text-dark small" for="availableSwitch">
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
                   v-model="selectedGenres"
                   @change="handleSearch"
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
             <div class="publisher-list d-flex flex-column gap-2 max-h-300 overflow-auto pe-2">
               <div class="form-check d-flex align-items-center gap-3 p-0 mb-1" v-for="nxb in bookStore.publishers" :key="nxb._id">
                 <input 
                   class="form-check-input ms-0 mt-0 custom-check" 
                   type="checkbox" 
                   :id="'nxb-' + nxb._id" 
                   :value="nxb._id"
                   v-model="selectedPublishers"
                   @change="handleSearch"
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
            @click="clearFilters"
          >
            <i class="bi bi-x-circle me-1"></i> Xóa tất cả bộ lọc
          </button>
        </div>
      </aside>

      <main class="col-lg-9">
        <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
          <div class="d-flex align-items-center gap-3">
            <h2 class="fw-bold text-primary mb-0 tracking-tight">Thư viện sách</h2>
            
            <div class="d-flex align-items-center gap-1 bg-white p-1 rounded-pill shadow-sm border ms-2">
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
          
          <div class="search-box position-relative w-100 max-w-md shadow-sm rounded-pill overflow-hidden bg-white d-flex align-items-center border">
            <i class="bi bi-search ms-3 text-muted"></i>
            <input 
              type="text" 
              class="form-control border-0 py-2 ps-3 shadow-none flex-grow-1" 
              placeholder="Tìm tên sách, tác giả..."
              v-model="searchQuery"
              @input="handleSearch"
            >
            <button 
              class="btn btn-link text-muted p-0 me-3 border-0 shadow-none voice-btn"
              @click="toggleVoiceSearch"
              :class="{ 'text-danger pulse': isListening }"
              type="button"
              title="Tìm kiếm bằng giọng nói"
            >
              <i :class="isListening ? 'bi bi-mic-fill' : 'bi bi-mic'"></i>
            </button>
          </div>
        </div>

        <div v-if="bookStore.loading" class="text-center py-5 my-5">
          <div class="spinner-border text-primary" role="status"></div>
          <p class="mt-3 text-muted fw-medium">Đang lọc dữ liệu cho bạn...</p>
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
            <BookCard 
              :book="book" 
              :viewMode="viewMode"
              @borrow="onBorrow" 
            />
          </div>
        </div>

        <div v-if="bookStore.totalPages > 1" class="d-flex justify-content-center align-items-center mt-5 gap-3">
          <button 
            class="btn btn-outline-dark rounded-pill px-4 fw-bold shadow-sm fw-bold"
            :disabled="bookStore.currentPage === 1"
            @click="goToPage(bookStore.currentPage - 1)"
          >
            <i class="bi bi-chevron-left me-1"></i> 
          </button>
          
          <div class="text-dark px-3 py-2 bg-light rounded-pill border shadow-sm">
            Trang {{ bookStore.currentPage }} / {{ bookStore.totalPages }}
          </div>
          
          <button 
            class="btn btn-outline-dark rounded-pill px-4 fw-bold shadow-sm fw-bold"
            :disabled="bookStore.currentPage === bookStore.totalPages"
            @click="goToPage(bookStore.currentPage + 1)"
          >
            <i class="bi bi-chevron-right ms-1"></i>
          </button>
        </div>
      </main>
    </div>

    <Notification 
      :messages="notifStore.messages" 
      @close="notifStore.remove" 
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useBookStore } from '../store/bookStore';
import { useAuthStore } from '../store/authStore';
import { useNotificationStore } from '../store/notificationStore';
import BookCard from '../components/Reader/BookCard.vue';
import Notification from '../components/Shared/Notification.vue';

const route = useRoute();
const bookStore = useBookStore();
const authStore = useAuthStore();
const notifStore = useNotificationStore();

const viewMode = ref('grid');

const genres = ['Công nghệ', 'Kinh tế', 'Giáo dục', 'Tiểu thuyết', 'Văn học', 'Thiếu nhi'];

const searchQuery = ref(route.query.q || ''); 
const availableOnly = ref(false);            
const selectedPublishers = ref([]); 
const selectedGenres = ref([]);   
const isListening = ref(false);
let recognition = null;

const hasFilters = computed(() => {
  return searchQuery.value !== '' || availableOnly.value === true || selectedPublishers.value.length > 0 || selectedGenres.value.length > 0;
});

const toggleVoiceSearch = () => {
  if (!recognition) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognition = new SpeechRecognition();
      recognition.lang = 'vi-VN';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => { isListening.value = true; };
      recognition.onend = () => { isListening.value = false; };
      
      recognition.onresult = (event) => {
        searchQuery.value = event.results[0][0].transcript;
        handleSearch(); 
      };

      recognition.onerror = () => { isListening.value = false; };
    }
  }

  if (recognition) {
    isListening.value ? recognition.stop() : recognition.start();
  }
};

let searchTimeout = null;
const handleSearch = () => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    bookStore.fetchBooks(searchQuery.value, availableOnly.value, selectedPublishers.value, selectedGenres.value, 1);
  }, 300);
};

const goToPage = (page) => {
  bookStore.fetchBooks(searchQuery.value, availableOnly.value, selectedPublishers.value, selectedGenres.value, page);
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const clearFilters = () => {
  searchQuery.value = '';
  availableOnly.value = false;
  selectedPublishers.value = [];
  selectedGenres.value = [];
  handleSearch();
};

const onBorrow = async ({ book, quantity }) => {
  if (!authStore.isAuthenticated) {
    notifStore.add('Vui lòng đăng nhập để mượn sách', 'error');
    return;
  }
  
  let successCount = 0;
  let lastMessage = '';

  for (let i = 0; i < quantity; i++) {
    const result = await bookStore.borrowBook(book._id);
    if (result.success) {
      successCount++;
      lastMessage = result.message;
    } else {
      lastMessage = result.message;
      break; 
    }
  }

  if (successCount > 0) {
    notifStore.add(successCount > 1 ? ` Đã đăng ký mượn ${successCount} quyển thành công` : ` ${lastMessage}`, 'success');
    bookStore.fetchBooks(searchQuery.value, availableOnly.value, selectedPublishers.value, selectedGenres.value, bookStore.currentPage);
  } else {
    notifStore.add(` ${lastMessage || 'Lỗi khi mượn sách'}`, 'error');
  }
};

onMounted(async () => {
  await bookStore.fetchPublishers();
  bookStore.fetchBooks(searchQuery.value, availableOnly.value, selectedPublishers.value, selectedGenres.value, 1);
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
  top: 90px !important; 
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

.voice-btn {
  transition: all 0.3s ease;
  width: 40px; height: 40px;
  display: flex; align-items: center; justify-content: center;
  border-radius: 50% !important;
}
.voice-btn:hover {
  background-color: rgba(var(--primary-rgb), 0.05);
  color: var(--primary-color) !important;
}

.pulse { animation: pulse-red 1.5s infinite; }
@keyframes pulse-red {
  0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(220, 53, 69, 0.4); }
  70% { transform: scale(1.1); box-shadow: 0 0 0 10px rgba(220, 53, 69, 0); }
  100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(220, 53, 69, 0); }
}

.publisher-list::-webkit-scrollbar { width: 4px; }
.publisher-list::-webkit-scrollbar-track { background: #f1f1f1; }
.publisher-list::-webkit-scrollbar-thumb { background: #ccc; border-radius: 10px; }
.publisher-list::-webkit-scrollbar-thumb:hover { background: var(--primary-color); }
</style>
