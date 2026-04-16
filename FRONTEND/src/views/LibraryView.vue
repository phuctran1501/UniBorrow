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
            
            <div class="d-flex align-items-center gap-2 bg-white p-1 rounded-pill shadow-sm border ms-2">
              
              <!-- Sort Dropdown -->
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
                  <li><a class="dropdown-item small fw-medium" href="#" @click.prevent="sortBy = 'newest'; handleSearch()">Mới nhất</a></li>
                  <li><a class="dropdown-item small fw-medium" href="#" @click.prevent="sortBy = 'price_asc'; handleSearch()">Giá: Thấp đến Cao</a></li>
                  <li><a class="dropdown-item small fw-medium" href="#" @click.prevent="sortBy = 'price_desc'; handleSearch()">Giá: Cao đến Thấp</a></li>
                </ul>
              </div>

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
            <!-- Inlined Book Card UI -->
            <div 
              class="card h-100 UniBorrow-card border-0 shadow-sm overflow-hidden" 
              :class="{ 'list-view-row': viewMode === 'list' }"
              @click="router.push({ name: 'book-details', params: { id: book._id } })"
              style="cursor: pointer;"
            >
              <div 
                class="card-img-top-wrapper position-relative overflow-hidden bg-light flex-shrink-0" 
                :style="viewMode === 'list' ? 'width: 160px; height: 100%;' : 'height: 180px;'"
              >
                <div v-if="!book.HinhAnh" class="d-flex align-items-center justify-content-center h-100 text-muted bg-secondary-subtle">
                  <i class="bi bi-book fs-2"></i>
                </div>
                <img v-else :src="book.HinhAnh" :alt="book.TenSach" class="card-img-top h-100 w-100 object-fit-cover transition-transform">
                
                <div class="status-badge position-absolute top-0 end-0 m-2">
                  <span :class="['badge rounded-pill px-2 py-1', book.SoQuyen > 0 ? 'bg-success' : 'bg-danger shadow-sm']" style="font-size: 0.7rem;">
                    {{ book.SoQuyen > 0 ? 'Sẵn sàng' : 'Đã hết' }}
                  </span>
                </div>
              </div>
              
              <div class="card-body p-0 d-flex flex-column flex-grow-1">
                <div :class="{ 'd-flex h-100 flex-column flex-md-row': viewMode === 'list' }">
                  <div class="p-3 flex-grow-1 border-end-md" :class="{ 'd-flex flex-column': viewMode === 'list' }">
                    <h6 class="card-title fw-bold text-dark mb-1 text-truncate" style="font-size: 0.95rem; line-height: 1.4;" :title="book.TenSach">
                      {{ book.TenSach }}
                    </h6>
                    
                    <div class="mb-2">
                      <span class="fw-bold text-primary">{{ new Intl.NumberFormat('vi-VN').format(book.DonGia || 0) }} VNĐ</span>
                    </div>
                    <p v-if="viewMode === 'list'" class="text-muted mb-0 mt-2 line-clamp-3 d-none d-md-block" style="font-size: 0.8rem; line-height: 1.5; max-height: 3.6rem;">
                      {{ book.MoTa || 'Hệ thống UniBorrow cung cấp trải nghiệm mượn sách hiện đại và nhanh chóng.' }}
                    </p>

                    <div v-if="viewMode === 'grid'" class="mt-auto pt-2 border-top">
                      <div class="d-flex align-items-center justify-content-between mb-2">
                        <div class="d-flex flex-column">
                           <span class="x-small-text fw-bold text-muted text-uppercase mb-0">Số lượng:</span>
                           <span :class="['fw-bold', book.SoQuyen > 0 ? 'text-primary' : 'text-danger']" style="font-size: 0.9rem;">{{ book.SoQuyen }}</span>
                        </div>
                        
                        <!-- Quantity Selector Grid -->
                        <div v-if="book.SoQuyen > 0" class="quantity-selector d-flex align-items-center bg-light rounded-pill p-1" @click.stop>
                          <button class="btn btn-sm btn-light rounded-circle border-0 p-0 d-flex align-items-center justify-content-center" style="width: 24px; height: 24px;" :disabled="getQuantity(book._id) <= 1" @click="setQuantity(book._id, getQuantity(book._id) - 1)">
                            <i class="bi bi-dash"></i>
                          </button>
                          <span class="mx-2 fw-bold" style="min-width: 12px; text-align: center; font-size: 0.85rem;">{{ getQuantity(book._id) }}</span>
                          <button class="btn btn-sm btn-light rounded-circle border-0 p-0 d-flex align-items-center justify-content-center" style="width: 24px; height: 24px;" :disabled="getQuantity(book._id) >= 5 || getQuantity(book._id) >= book.SoQuyen" @click="setQuantity(book._id, getQuantity(book._id) + 1)">
                            <i class="bi bi-plus"></i>
                          </button>
                        </div>
                      </div>
                      <button class="btn btn-primary w-100 rounded-pill py-2 fw-bold shadow-sm" :disabled="book.SoQuyen <= 0" @click.stop="onBorrow(book)">
                        {{ book.SoQuyen > 0 ? 'Mượn sách' : 'Hết sách' }}
                      </button>
                    </div>
                  </div>

                  <div v-if="viewMode === 'list'" class="action-column bg-light-subtle p-3 d-flex flex-column justify-content-center align-items-center border-start" style="min-width: 180px;">
                    <div class="mb-3 text-center">
                       <span class="x-small-text fw-bold text-muted text-uppercase d-block mb-1">Số lượng:</span>
                       <span :class="['fw-bold fs-5', book.SoQuyen > 0 ? 'text-primary' : 'text-danger']">{{ book.SoQuyen }}</span>
                    </div>

                    <!-- Quantity Selector List -->
                    <div v-if="book.SoQuyen > 0" class="quantity-selector d-flex align-items-center bg-white shadow-sm rounded-pill p-1 mb-3" @click.stop>
                        <button class="btn btn-sm btn-light rounded-circle border-0 p-0 d-flex align-items-center justify-content-center" style="width: 28px; height: 28px;" :disabled="getQuantity(book._id) <= 1" @click="setQuantity(book._id, getQuantity(book._id) - 1)">
                          <i class="bi bi-dash"></i>
                        </button>
                        <span class="mx-3 fw-bold" style="min-width: 15px; text-align: center;">{{ getQuantity(book._id) }}</span>
                        <button class="btn btn-sm btn-light rounded-circle border-0 p-0 d-flex align-items-center justify-content-center" style="width: 28px; height: 28px;" :disabled="getQuantity(book._id) >= 5 || getQuantity(book._id) >= book.SoQuyen" @click="setQuantity(book._id, getQuantity(book._id) + 1)">
                          <i class="bi bi-plus"></i>
                        </button>
                    </div>

                    <button class="btn btn-primary w-100 rounded-pill py-2 fw-bold shadow-sm" :disabled="book.SoQuyen <= 0" @click.stop="onBorrow(book)">
                      {{ book.SoQuyen > 0 ? 'Mượn ngay' : 'Hết sách' }}
                    </button>
                  </div>
                </div>
              </div>
            </div>
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

  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useBookStore } from '../store/bookStore';
import { useAuthStore } from '../store/authStore';
import { useNotificationStore } from '../store/notificationStore';


const route = useRoute();
const router = useRouter();
const bookStore = useBookStore();
const authStore = useAuthStore();
const notifStore = useNotificationStore();

const viewMode = ref('grid');

const quantities = ref({}); 
const getQuantity = (bookId) => quantities.value[bookId] || 1;
const setQuantity = (bookId, val) => {
  quantities.value[bookId] = val;
};

const genres = ['Công nghệ', 'Kinh tế', 'Giáo dục', 'Tiểu thuyết', 'Văn học', 'Thiếu nhi'];

const searchQuery = ref(route.query.q || ''); 
const availableOnly = ref(false);            
const selectedPublishers = ref([]); 
const selectedGenres = ref([]);   
const sortBy = ref('newest');
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

const onBorrow = async (book) => {
  const quantity = getQuantity(book._id);
  
  if (!authStore.isAuthenticated) {
    notifStore.add('Vui lòng đăng nhập để mượn sách', 'error');
    router.push('/login');
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

.UniBorrow-card { transition: all 0.3s ease; }
.UniBorrow-card:hover { transform: translateY(-5px); box-shadow: 0 10px 20px rgba(0,0,0,0.1) !important; }
.transition-transform { transition: transform 0.4s cubic-bezier(0.165, 0.84, 0.44, 1); }
.UniBorrow-card:hover .transition-transform { transform: scale(1.08); }

.quantity-selector button {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}
.quantity-selector button:hover:not(:disabled) {
  background-color: #e9ecef !important;
}

.list-view-row {
  flex-direction: row !important;
  max-height: 250px;
  border: 1px solid transparent !important;
  transition: all 0.3s ease;
}
.list-view-row:hover {
  border-color: rgba(13, 110, 253, 0.2) !important;
  transform: translateY(-3px);
}

.line-clamp-3 {
  display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical;
  overflow: hidden; text-overflow: ellipsis;
}

.bg-light-subtle { background-color: #f8fafc; }
.x-small-text { font-size: 0.65rem; letter-spacing: 0.05em; }

@media (min-width: 768px) { .border-end-md { border-right: 1px solid #e2e8f0; } }
@media (max-width: 768px) {
  .list-view-row { flex-direction: column !important; max-height: none; }
  .list-view-row .card-img-top-wrapper { width: 100% !important; height: 200px !important; }
  .action-column { border-top: 1px solid #e2e8f0; border-left: none !important; width: 100%; }
}

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
