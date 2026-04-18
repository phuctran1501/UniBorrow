<template>
  <div 
    class="card h-100 UniBorrow-card border-0 shadow-sm overflow-hidden position-relative" 
    :class="{ 'list-view-row': viewMode === 'list' }"
    @click="$router.push({ name: 'book-details', params: { id: book._id } })"
    style="cursor: pointer;"
  >
    <button 
      v-if="isFavoriteView"
      @click.stop="$emit('remove-favorite', book._id)" 
      class="btn-remove-fave" 
      title="Gỡ khỏi yêu thích"
    >
      <i class="bi bi-x-lg"></i>
    </button>

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
              
              <div v-if="book.SoQuyen > 0" class="quantity-selector d-flex align-items-center bg-light rounded-pill p-1" @click.stop>
                <button class="btn btn-sm btn-light rounded-circle border-0 p-0 d-flex align-items-center justify-content-center" style="width: 24px; height: 24px;" :disabled="quantity <= 1" @click="$emit('update:quantity', quantity - 1)">
                  <i class="bi bi-dash"></i>
                </button>
                <span class="mx-2 fw-bold" style="min-width: 12px; text-align: center; font-size: 0.85rem;">{{ quantity }}</span>
                <button class="btn btn-sm btn-light rounded-circle border-0 p-0 d-flex align-items-center justify-content-center" style="width: 24px; height: 24px;" :disabled="quantity >= 5 || quantity >= book.SoQuyen" @click="$emit('update:quantity', quantity + 1)">
                  <i class="bi bi-plus"></i>
                </button>
              </div>
            </div>
            <button class="btn btn-primary w-100 rounded-pill py-2 fw-bold shadow-sm" :disabled="book.SoQuyen <= 0 || borrowingId === book._id" @click.stop="$emit('borrow', book)">
              <span v-if="borrowingId !== book._id">{{ book.SoQuyen > 0 ? 'Mượn sách' : 'Hết sách' }}</span>
              <span v-else class="spinner-border spinner-border-sm" role="status"></span>
            </button>
          </div>
        </div>

        <div v-if="viewMode === 'list'" class="action-column bg-light-subtle p-3 d-flex flex-column justify-content-center align-items-center border-start" style="min-width: 180px;">
          <div class="mb-3 text-center">
             <span class="x-small-text fw-bold text-muted text-uppercase d-block mb-1">Số lượng:</span>
             <span :class="['fw-bold fs-5', book.SoQuyen > 0 ? 'text-primary' : 'text-danger']">{{ book.SoQuyen }}</span>
          </div>

          <div v-if="book.SoQuyen > 0" class="quantity-selector d-flex align-items-center bg-white shadow-sm rounded-pill p-1 mb-3" @click.stop>
              <button class="btn btn-sm btn-light rounded-circle border-0 p-0 d-flex align-items-center justify-content-center" style="width: 28px; height: 28px;" :disabled="quantity <= 1" @click="$emit('update:quantity', quantity - 1)">
                <i class="bi bi-dash"></i>
              </button>
              <span class="mx-3 fw-bold" style="min-width: 15px; text-align: center;">{{ quantity }}</span>
              <button class="btn btn-sm btn-light rounded-circle border-0 p-0 d-flex align-items-center justify-content-center" style="width: 28px; height: 28px;" :disabled="quantity >= 5 || quantity >= book.SoQuyen" @click="$emit('update:quantity', quantity + 1)">
                <i class="bi bi-plus"></i>
              </button>
          </div>

          <button class="btn btn-primary w-100 rounded-pill py-2 fw-bold shadow-sm" :disabled="book.SoQuyen <= 0 || borrowingId === book._id" @click.stop="$emit('borrow', book)">
            <span v-if="borrowingId !== book._id">{{ book.SoQuyen > 0 ? 'Mượn ngay' : 'Hết sách' }}</span>
            <span v-else class="spinner-border spinner-border-sm" role="status"></span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  book: { type: Object, required: true },
  viewMode: { type: String, default: 'grid' },
  borrowingId: { type: String, default: null },
  quantity: { type: Number, default: 1 },
  isFavoriteView: { type: Boolean, default: false }
});

defineEmits(['update:quantity', 'borrow', 'remove-favorite']);
</script>

<style scoped>
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

.bg-light-subtle { background-color: #f8fafc; }

@media (min-width: 768px) { .border-end-md { border-right: 1px solid #e2e8f0; } }
@media (max-width: 768px) {
  .list-view-row { flex-direction: column !important; max-height: none; }
  .list-view-row .card-img-top-wrapper { width: 100% !important; height: 200px !important; }
  .action-column { border-top: 1px solid #e2e8f0; border-left: none !important; width: 100%; }
}

.btn-remove-fave {
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
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}
.btn-remove-fave:hover {
  background: #dc3545;
  color: #ffffff;
}
</style>

