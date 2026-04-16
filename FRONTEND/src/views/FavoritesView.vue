<template>
  <div class="favorites-page py-5 min-vh-100 bg-light">
    <div class="container container-large">
      <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
        <div>
          <h2 class="fw-bold text-primary mb-1 tracking-tight">Thư viện yêu thích</h2>
        </div>
        
        <!-- Sort & Search Container -->
        <div class="d-flex align-items-center gap-2" style="max-width: 600px; width: 100%;">
          <!-- Sort Dropdown -->
          <div class="dropdown">
            <button 
              class="btn btn-white rounded-pill px-3 border-0 dropdown-toggle fw-bold text-muted small shadow-sm bg-white" 
              type="button" 
              data-bs-toggle="dropdown" 
              aria-expanded="false"
              style="height: 40px; font-size: 0.75rem;"
            >
              <i class="bi bi-sort-down me-1"></i> Sắp xếp
            </button>
            <ul class="dropdown-menu shadow-lg border-0 rounded-3 mt-2">
              <li><a class="dropdown-item small fw-medium" href="#" @click.prevent="sortBy = 'newest'">Mới nhất</a></li>
              <li><a class="dropdown-item small fw-medium" href="#" @click.prevent="sortBy = 'price_asc'">Giá: Thấp đến Cao</a></li>
              <li><a class="dropdown-item small fw-medium" href="#" @click.prevent="sortBy = 'price_desc'">Giá: Cao đến Thấp</a></li>
            </ul>
          </div>

          <!-- Search Input -->
          <div class="search-container position-relative flex-grow-1">
            <i class="bi bi-search position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"></i>
            <input 
              v-model="searchQuery" 
              type="text" 
              class="form-control rounded-pill ps-5 py-2 border-0 shadow-sm" 
              placeholder="Tìm tên sách, tác giả..."
              style="height: 40px;"
            >
          </div>
        </div>
      </div>

      <div v-if="bookStore.loading" class="text-center py-5">
        <div class="spinner-border text-primary" role="status"></div>
      </div>

      <div v-else-if="bookStore.favorites.length === 0" class="text-center py-5 bg-white rounded-4 shadow-sm border mt-4">
        <div class="display-4 text-muted opacity-25 mb-3"><i class="bi bi-heart"></i></div>
        <h5 class="fw-bold text-dark">Danh sách yêu thích đang trống</h5>
        <router-link to="/library" class="btn btn-primary rounded-pill px-4 mt-2">
          Khám phá thư viện
        </router-link>
      </div>

      <div v-else class="row justify-content-center">
        <div v-if="filteredBooks.length === 0" class="text-center py-5">
          <i class="bi bi-search display-4 text-muted opacity-25"></i>
          <p class="text-muted mt-3">Không tìm thấy sách yêu thích nào khớp với từ khóa.</p>
        </div>
        <div v-else class="col-xxl-10 col-xl-11">
          <div class="row g-4">
            <div v-for="book in filteredBooks" :key="book._id" class="col-xxl-3 col-xl-3 col-lg-4 col-md-6 col-sm-6">
              <div 
                class="card h-100 UniBorrow-card border-0 shadow-sm overflow-hidden position-relative" 
                @click="router.push({ name: 'book-details', params: { id: book._id } })"
                style="cursor: pointer; border-radius: 1.25rem !important;"
              >
            <button 
              @click.stop="handleRemoveFavorite(book._id)" 
              class="btn btn-remove-x-small shadow-sm" 
              title="Gỡ khỏi yêu thích"
            >
              <i class="bi bi-x-lg"></i>
            </button>

            <div class="img-container position-relative bg-light" style="height: 180px;">
              <div v-if="!book.HinhAnh" class="h-100 d-flex align-items-center justify-content-center text-muted">
                <i class="bi bi-book fs-2"></i>
              </div>
              <img v-else :src="book.HinhAnh" :alt="book.TenSach" class="w-100 h-100 object-fit-cover card-img">
              
              <div class="position-absolute top-0 end-0 m-2">
                <span :class="['badge rounded-pill px-2 py-1', book.SoQuyen > 0 ? 'bg-success' : 'bg-danger']" style="font-size: 0.65rem;">
                  {{ book.SoQuyen > 0 ? 'Sẵn sàng' : 'Đã hết' }}
                </span>
              </div>
            </div>
            
            <!-- Content Area - Reduced padding -->
            <div class="card-body p-3 d-flex flex-column">
              <h6 class="fw-bold text-dark mb-1 text-truncate" style="font-size: 0.95rem;" :title="book.TenSach">
                {{ book.TenSach }}
              </h6>
              
              <div class="fw-bold text-primary mb-2" style="font-size: 1rem;">
                {{ new Intl.NumberFormat('vi-VN').format(book.DonGia || 0) }} VNĐ
              </div>

              <hr class="my-2 opacity-10">

              <div class="d-flex align-items-center justify-content-between mb-3 mt-auto">
                <div class="d-flex flex-column">
                   <span class="x-small-label fw-bold text-muted text-uppercase">Số lượng:</span>
                   <span class="fw-bold text-primary mb-0" style="font-size: 1.1rem;">{{ book.SoQuyen }}</span>
                </div>
                
                <div v-if="book.SoQuyen > 0" class="qty-control-pill-small d-flex align-items-center bg-light rounded-pill p-1" @click.stop>
                  <button class="btn btn-qty-ctrl-sm" :disabled="quantities[book._id] <= 1" @click="decreaseQty(book._id)">
                    <i class="bi bi-dash"></i>
                  </button>
                  <span class="mx-2 fw-bold small">{{ quantities[book._id] || 1 }}</span>
                  <button class="btn btn-qty-ctrl-sm" :disabled="(quantities[book._id] || 1) >= 5 || (quantities[book._id] || 1) >= book.SoQuyen" @click="increaseQty(book._id, book.SoQuyen)">
                    <i class="bi bi-plus"></i>
                  </button>
                </div>
              </div>

              <button 
                class="btn btn-primary w-100 rounded-pill py-2 fw-bold shadow-none text-sm" 
                :disabled="book.SoQuyen <= 0 || borrowingId === book._id" 
                @click.stop="handleBorrow(book)"
              >
                <span v-if="borrowingId !== book._id">Mượn sách</span>
                <span v-else class="spinner-border spinner-border-sm" role="status"></span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  </div>
</div>
</template>

<script setup>
import { ref, onMounted, reactive, computed } from 'vue';
import { useBookStore } from '../store/bookStore';
import { useNotificationStore } from '../store/notificationStore';
import { useRouter } from 'vue-router';

const bookStore = useBookStore();
const notifStore = useNotificationStore();
const router = useRouter();

const searchQuery = ref('');
const sortBy = ref('newest');
const borrowingId = ref(null);
const quantities = reactive({});

const filteredBooks = computed(() => {
  let results = [...bookStore.favorites];

  // Apply Search
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase();
    results = results.filter(book => 
      book.TenSach.toLowerCase().includes(query) || 
      (book.TacGia && book.TacGia.toLowerCase().includes(query))
    );
  }

  // Apply Sort
  if (sortBy.value === 'price_asc') {
    results.sort((a, b) => (a.DonGia || 0) - (b.DonGia || 0));
  } else if (sortBy.value === 'price_desc') {
    results.sort((a, b) => (b.DonGia || 0) - (a.DonGia || 0));
  } else if (sortBy.value === 'newest') {
    results.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }
  
  return results;
});

const handleRemoveFavorite = async (bookId) => {
  const result = await bookStore.toggleFavorite(bookId);
  if (result.success) {
    notifStore.add('Đã xóa khỏi danh sách yêu thích', 'success');
  } else {
    notifStore.add(result.message || 'Lỗi khi xóa yêu thích', 'error');
  }
};

const handleBorrow = async (book) => {
  borrowingId.value = book._id;
  const qty = quantities[book._id] || 1;
  let successCount = 0;
  let lastMessage = '';

  try {
    for (let i = 0; i < qty; i++) {
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
        notifStore.add(successCount > 1 ? `Đã đăng ký mượn ${successCount} quyển thành công` : lastMessage, 'success');
        await bookStore.fetchFavorites();
    } else {
        notifStore.add(lastMessage || 'Lỗi khi mượn sách', 'error');
    }
  } catch (error) {
    notifStore.add('Lỗi hệ thống', 'error');
  } finally {
    borrowingId.value = null;
  }
};

const increaseQty = (id, max) => {
    if (!quantities[id]) quantities[id] = 1;
    if (quantities[id] < max && quantities[id] < 5) {
        quantities[id]++;
    }
};

const decreaseQty = (id) => {
    if (quantities[id] > 1) {
        quantities[id]--;
    }
};

onMounted(async () => {
    await bookStore.fetchFavorites();
    bookStore.favorites.forEach(b => {
        quantities[b._id] = 1;
    });
});
</script>

<style scoped>
.container-large { max-width: 1200px; }

.UniBorrow-card {
  transition: all 0.3s ease;
  border-radius: 0.75rem !important;
}

.card-img {
  transition: transform 0.4s ease;
}
.UniBorrow-card:hover .card-img {
  transform: scale(1.05);
}

.btn-remove-x-small {
  position: absolute;
  top: 8px;
  left: 8px;
  background: white;
  border-radius: 50%;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  z-index: 10;
  transition: all 0.2s;
  color: #666;
  font-size: 0.8rem;
}
.btn-remove-x-small:hover {
  background: #dc3545;
  color: #ffffff;
}

.x-small-label {
  font-size: 0.65rem;
  letter-spacing: 0.05em;
}

.qty-control-pill-small {
  background: #f1f3f5;
  min-width: 90px;
  justify-content: space-between;
}

.btn-qty-ctrl-sm {
  background: white;
  border: none;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #555;
  box-shadow: 0 1px 2px rgba(0,0,0,0.05);
  transition: all 0.2s;
  font-size: 0.8rem;
}
.btn-qty-ctrl-sm:hover:not(:disabled) {
  background-color: var(--primary-color);
  color: white;
}

.text-truncate-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.opacity-10 {
  opacity: 0.1;
}

.text-sm {
  font-size: 0.85rem;
}

.object-fit-cover {
  object-fit: cover;
}
</style>
