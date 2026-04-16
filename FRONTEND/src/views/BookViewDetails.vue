<template>
  <div class="book-detail-page py-5 min-vh-100 bg-light">
    <div class="container container-compact">
      <div class="mb-3">
        <button @click="goBack" class="btn btn-link text-decoration-none text-muted p-0 d-flex align-items-center gap-2 small">
          <i class="bi bi-arrow-left"></i>
          <span class="fw-bold text-uppercase tracking-wider">Thư viện sách</span>
        </button>
      </div>

      <div v-if="bookStore.loading" class="text-center py-5">
        <div class="spinner-border text-primary spinner-border-sm" role="status"></div>
      </div>

      <div v-else-if="!bookStore.currentBook && !bookStore.loading" class="text-center py-5 bg-white rounded-3 shadow-sm">
        <h5 class="fw-bold text-dark">Không tìm thấy thông tin sách</h5>
        <router-link to="/library" class="btn btn-primary btn-sm rounded-pill px-4 mt-2">Quay lại</router-link>
      </div>

      <div v-else class="row g-4">
        <div class="col-lg-5">
          <div class="book-image-container sticky-top" style="top: 130px;">
            <div class="card border-0 shadow-sm rounded-3 bg-white p-4">
              <div class="image-wrapper rounded-3 bg-light d-flex align-items-center justify-content-center shadow-inner" style="height: 400px;">
                <img v-if="book.HinhAnh" :src="book.HinhAnh" :alt="book.TenSach" class="img-fluid book-main-img">
                <div v-else class="text-muted d-flex flex-column align-items-center">
                  <i class="bi bi-book display-3 opacity-25"></i>
                </div>
              </div>
              
              <div class="mt-4 row g-3">
                <div class="col-6">
                  <div class="p-3 bg-light rounded-3 text-center">
                    <span class="d-block small text-muted fw-bold mb-1">Trạng thái</span>
                    <span :class="['fw-bold', book.SoQuyen > 0 ? 'text-success' : 'text-danger']">
                      {{ book.SoQuyen > 0 ? 'Sẵn sàng' : 'Đã hết' }}
                    </span>
                  </div>
                </div>
                <div class="col-6">
                  <div class="p-3 bg-light rounded-3 text-center">
                    <span class="d-block small text-muted fw-bold mb-1">Số lượng</span>
                    <span class="fw-bold text-dark fs-5">{{ book.SoQuyen }}</span>
                  </div>
                </div>
              </div>

              <div v-if="authStore.isAuthenticated" class="mt-3 text-center">
                <button 
                  @click="handleToggleFavorite" 
                  class="btn btn-outline-danger w-100 rounded-pill d-flex align-items-center justify-content-center gap-2 py-2 transition-all fw-medium"
                  :class="{'bg-danger text-white': isFavorite}"
                >
                  <i :class="['bi', isFavorite ? 'bi-heart-fill' : 'bi-heart']"></i>
                  {{ isFavorite ? 'Đã yêu thích' : 'Thêm vào yêu thích' }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="col-lg-7">
          <div class="book-info-content bg-white p-4 p-md-5 rounded-4 shadow-sm h-100 position-relative">
            <div v-if="book.LuotMuon !== undefined" class="position-absolute" style="top: 1.5rem; right: 2rem;">
              <span class="text-dark x-small fw-medium opacity-75">Lượt mượn: {{ book.LuotMuon }}</span>
            </div>
            <div class="mb-4">
              <h1 class="h3 fw-bold text-dark mb-2">{{ book.TenSach }}</h1>
              <p class="h4 text-primary fw-bold mb-0">
                {{ new Intl.NumberFormat('vi-VN').format(book.DonGia || 0) }} 
                <span class="small fw-normal">VNĐ</span>
              </p>
            </div>

            <div class="metadata-grid mb-4 py-3 border-top border-bottom">
              <div class="row g-3">
                <div class="col-sm-6">
                  <span class="text-muted">Tác giả:</span> <span class="fw-bold text-dark ms-2">{{ book.TacGia }}</span>
                </div>
                <div class="col-sm-6">
                  <span class="text-muted">Nhà xuất bản:</span> <span class="fw-bold text-dark ms-2">{{ book.MaNXB?.TenNXB }}</span>
                </div>
                <div class="col-sm-6">
                  <span class="text-muted">Năm xuất bản:</span> <span class="fw-bold text-dark ms-2">{{ book.NamXuatBan || 'N/A' }}</span>
                </div>
                <div class="col-sm-6">
                  <span class="text-muted">Thể loại:</span> <span class="fw-bold text-dark ms-2">{{ book.TheLoai }}</span>
                </div>
              </div>
            </div>

            <div class="mb-4">
              <span class="fw-bold text-dark d-block mb-3">Mô tả sách:</span>
              <div class="description-scrollable custom-scrollbar">
                <p class="text-muted mb-0" style="white-space: pre-line; line-height: 1.6; font-size: 1.05rem;">
                  {{ book.MoTa || 'Hệ thống UniBorrow cung cấp thông tin sách chi tiết giúp bạn dễ dàng lựa chọn những cuốn sách phù hợp nhất.' }}
                </p>
              </div>
            </div>

            <div class="borrow-action-area pt-4">
              <div class="d-flex align-items-center gap-4">
                <div v-if="book.SoQuyen > 0" class="d-flex align-items-center gap-3">
                  <span class="x-small fw-bold text-muted text-uppercase">Số lượng:</span>
                  <div class="quantity-compact d-flex align-items-center bg-light rounded-pill p-1">
                    <button class="btn btn-outline-secondary btn-sm rounded-circle border-0" style="width: 28px; height: 28px;" :disabled="quantity <= 1" @click="quantity--">
                      <i class="bi bi-dash"></i>
                    </button>
                    <span class="px-3 fw-bold">{{ quantity }}</span>
                    <button class="btn btn-outline-secondary btn-sm rounded-circle border-0" style="width: 28px; height: 28px;" :disabled="quantity >= 5 || quantity >= book.SoQuyen" @click="quantity++">
                      <i class="bi bi-plus"></i>
                    </button>
                  </div>
                </div>
                <div v-else class="text-danger fw-bold">Hết sách</div>

                <div class="flex-grow-1">
                  <button 
                    class="btn btn-primary w-100 rounded-pill py-2 fw-bold shadow-none"
                    :disabled="book.SoQuyen <= 0 || borrowing"
                    @click="handleBorrow"
                  >
                    <span v-if="!borrowing">Mượn sách</span>
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
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useBookStore } from '../store/bookStore';
import { useAuthStore } from '../store/authStore';
import { useNotificationStore } from '../store/notificationStore';

const route = useRoute();
const router = useRouter();
const bookStore = useBookStore();
const authStore = useAuthStore();
const notifStore = useNotificationStore();

const quantity = ref(1);
const borrowing = ref(false);
const isFavorite = ref(false);

const book = computed(() => bookStore.currentBook || {});

const goBack = () => {
  if (window.history.length > 1) {
    router.go(-1);
  } else {
    router.push('/library');
  }
};

const handleBorrow = async () => {
  if (!authStore.isAuthenticated) {
    notifStore.add('Vui lòng đăng nhập để mượn sách', 'error');
    router.push('/login');
    return;
  }

  borrowing.value = true;
  let successCount = 0;
  let lastMessage = '';

  try {
    for (let i = 0; i < quantity.value; i++) {
      const result = await bookStore.borrowBook(book.value._id);
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
      await bookStore.fetchBookById(route.params.id);
    } else {
      notifStore.add(lastMessage || 'Lỗi khi mượn sách', 'error');
    }
  } catch (error) {
    notifStore.add('Lỗi xử lý mượn sách', 'error');
  } finally {
    borrowing.value = false;
  }
};

const handleToggleFavorite = async () => {
  if (!authStore.isAuthenticated) {
    notifStore.add('Vui lòng đăng nhập để yêu thích sách', 'error');
    router.push('/login');
    return;
  }

  const result = await bookStore.toggleFavorite(book.value._id);
  if (result.success) {
    isFavorite.value = result.isFavorite;
    notifStore.add(result.message, 'success');
  } else {
    notifStore.add(result.message, 'error');
  }
};

onMounted(async () => {
  await bookStore.fetchBookById(route.params.id);
  if (authStore.isAuthenticated && authStore.role === 'DocGia') {
    isFavorite.value = await bookStore.checkIsFavorite(route.params.id);
  }
  window.scrollTo(0, 0);
});
</script>

<style scoped>
.container-compact {
  max-width: 1100px;
}

.book-main-img {
  max-height: 380px;
  object-fit: contain;
}

.shadow-inner {
  box-shadow: inset 0 2px 4px 0 rgba(0, 0, 0, 0.05) !important;
}

.x-small {
  font-size: 0.75rem;
  letter-spacing: 0.05em;
}

.description-scrollable {
  max-height: calc(1.6em * 6); 
  overflow-y: auto;
  padding-right: 12px;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 5px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: #f1f1f1;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #ccc;
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: var(--primary-color);
}

.quantity-compact button {
  background: transparent;
  transition: all 0.2s;
}
.quantity-compact button:hover:not(:disabled) {
  background: rgba(0,0,0,0.05);
}

@media (max-width: 991.98px) {
  .book-image-container {
    position: static !important;
    margin-bottom: 1rem;
  }
}
</style>
