<template>
  <div 
    class="card h-100 UniBorrow-card border-0 shadow-sm overflow-hidden" 
    :class="{ 'list-view-row': viewMode === 'list' }"
    @click="showDetail = true"
  >
    <div 
      class="card-img-top-wrapper position-relative overflow-hidden bg-light flex-shrink-0" 
      :style="viewMode === 'list' ? 'width: 160px; height: 100%;' : 'height: 180px;'"
      style="cursor: pointer;"
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
          
          <h6 class="card-title fw-bold text-dark mb-1 text-truncate" style="cursor: pointer; font-size: 0.95rem; line-height: 1.4;" :title="book.TenSach">
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
                <button class="btn btn-sm btn-light rounded-circle border-0 p-0 d-flex align-items-center justify-content-center" style="width: 24px; height: 24px;" :disabled="quantity <= 1" @click="quantity--">
                  <i class="bi bi-dash"></i>
                </button>
                <span class="mx-2 fw-bold" style="min-width: 12px; text-align: center; font-size: 0.85rem;">{{ quantity }}</span>
                <button class="btn btn-sm btn-light rounded-circle border-0 p-0 d-flex align-items-center justify-content-center" style="width: 24px; height: 24px;" :disabled="quantity >= 5 || quantity >= book.SoQuyen" @click="quantity++">
                  <i class="bi bi-plus"></i>
                </button>
              </div>
            </div>
            <button class="btn btn-primary w-100 rounded-pill py-2 fw-bold shadow-sm" :disabled="book.SoQuyen <= 0" @click.stop="handleBorrow">
              Mượn sách
            </button>
          </div>
        </div>

        <div v-if="viewMode === 'list'" class="action-column bg-light-subtle p-3 d-flex flex-column justify-content-center align-items-center border-start" style="min-width: 180px;">
          <div class="mb-3 text-center">
             <span class="x-small-text fw-bold text-muted text-uppercase d-block mb-1">Số lượng:</span>
             <span :class="['fw-bold fs-5', book.SoQuyen > 0 ? 'text-primary' : 'text-danger']">{{ book.SoQuyen }}</span>
          </div>

          <div v-if="book.SoQuyen > 0" class="quantity-selector d-flex align-items-center bg-white shadow-sm rounded-pill p-1 mb-3" @click.stop>
            <button class="btn btn-sm btn-light rounded-circle border-0 p-0 d-flex align-items-center justify-content-center" style="width: 28px; height: 28px;" :disabled="quantity <= 1" @click="quantity--">
              <i class="bi bi-dash"></i>
            </button>
            <span class="mx-3 fw-bold" style="min-width: 15px; text-align: center;">{{ quantity }}</span>
            <button class="btn btn-sm btn-light rounded-circle border-0 p-0 d-flex align-items-center justify-content-center" style="width: 28px; height: 28px;" :disabled="quantity >= 5 || quantity >= book.SoQuyen" @click="quantity++">
              <i class="bi bi-plus"></i>
            </button>
          </div>

          <button 
            class="btn btn-primary w-100 rounded-pill py-2 fw-bold shadow-sm"
            :disabled="book.SoQuyen <= 0"
            @click.stop="handleBorrow"
          >
            Mượn ngay
          </button>
        </div>
      </div>
    </div>

    <Teleport to="body">
      <div v-if="showDetail" class="modal-backdrop fade show" style="z-index: 1060;" @click="showDetail = false"></div>
      <div v-if="showDetail" class="modal fade show d-block" tabindex="-1" style="z-index: 1070;" @click.self="showDetail = false">
        <div class="modal-dialog modal-dialog-centered modal-lg">
          <div class="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
            <div class="modal-body p-0">
              <div class="row g-0">
                <div class="col-md-5 bg-light d-flex align-items-center justify-content-center p-4">
                  <img :src="book.HinhAnh" :alt="book.TenSach" class="img-fluid rounded-3 shadow-sm" style="max-height: 400px;">
                </div>
                <div class="col-md-7 p-4 p-lg-5">
                  <div class="d-flex justify-content-between align-items-start mb-3">
                    <h2 class="fw-bold text-dark mb-0 leading-tight">{{ book.TenSach }}</h2>
                    <button type="button" class="btn-close ms-2" @click="showDetail = false"></button>
                  </div>
                  
                  <div class="mb-3">
                    <p class="text-muted mb-1" style="font-size: 0.9rem;">Thể loại: <span class="text-primary fw-bold">{{ book.TheLoai }}</span></p>
                    <p class="text-muted mb-1" style="font-size: 0.9rem;">Tác giả: <span class="text-dark fw-bold">{{ book.TacGia }}</span></p>
                    <p class="text-muted mb-0" style="font-size: 0.9rem;">Nhà xuất bản: <span class="text-dark fw-bold">{{ book.MaNXB?.TenNXB }}</span></p>
                  </div>
                  
                  <div class="detail-section mb-3">
                    <h6 class="text-uppercase x-small-text fw-bold text-secondary mb-2 border-bottom pb-1">Mô tả chi tiết</h6>
                    <div class="modal-description-scroll pe-2">
                      <p class="text-dark opacity-75 mb-0" style="white-space: pre-line; font-size: 0.85rem; line-height: 1.6;">
                        {{ book.MoTa || 'Hệ thống UniBorrow cung cấp thông tin sách chi tiết giúp bạn dễ dàng lựa chọn những cuốn sách phù hợp nhất với nhu cầu nghiên cứu và học tập của mình.' }}
                      </p>
                    </div>
                  </div>

                  <div class="row g-2 mb-3">
                    <div class="col-4">
                      <div class="p-2 bg-light rounded-3 text-center">
                        <span class="d-block x-small-text text-muted text-uppercase fw-bold">Trạng thái</span>
                        <span :class="['fw-bold small', book.SoQuyen > 0 ? 'text-success' : 'text-danger']">
                          {{ book.SoQuyen > 0 ? 'Sẵn sàng' : 'Đã hết' }}
                        </span>
                      </div>
                    </div>
                    <div class="col-4">
                      <div class="p-2 bg-light rounded-3 text-center">
                        <span class="d-block x-small-text text-muted text-uppercase fw-bold">Số lượng</span>
                        <span class="fw-bold small text-dark">{{ book.SoQuyen }} quyển</span>
                      </div>
                    </div>
                    <div class="col-4">
                      <div class="p-2 bg-light rounded-3 text-center">
                        <span class="d-block x-small-text text-muted text-uppercase fw-bold">Đơn giá</span>
                        <span class="fw-bold small text-dark">{{ new Intl.NumberFormat('vi-VN').format(book.DonGia || 0) }}đ</span>
                      </div>
                    </div>
                  </div>

                  <div class="d-flex gap-3">
                    <div v-if="book.SoQuyen > 0" class="quantity-selector d-flex align-items-center bg-light rounded-pill px-2" style="height: 48px;">
                      <button class="btn btn-light rounded-circle border-0" :disabled="quantity <= 1" @click="quantity--">
                        <i class="bi bi-dash fs-5"></i>
                      </button>
                      <span class="mx-3 fw-bold fs-5 text-center" style="min-width: 30px;">{{ quantity }}</span>
                      <button class="btn btn-light rounded-circle border-0" :disabled="quantity >= 5 || quantity >= book.SoQuyen" @click="quantity++">
                        <i class="bi bi-plus fs-5"></i>
                      </button>
                    </div>
                    <button 
                      class="btn btn-primary flex-grow-1 rounded-pill fw-bold fs-5 shadow-sm"
                      :disabled="book.SoQuyen <= 0"
                      @click="handleBorrow"
                    >
                      Mượn ngay
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  book: {
    type: Object,
    required: true
  },
  viewMode: {
    type: String,
    default: 'grid'
  }
});

const emit = defineEmits(['borrow']);

const quantity = ref(1);       
const showDetail = ref(false); 

const handleBorrow = () => {
  emit('borrow', { book: props.book, quantity: quantity.value });
  showDetail.value = false; 
};
</script>

<style scoped>
.tracking-wider { letter-spacing: 0.1em; }

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.modal-description-scroll {
  max-height: 180px; 
  overflow-y: auto;
  scrollbar-width: thin; 
  scrollbar-color: #dee2e6 transparent;
}

.modal-description-scroll::-webkit-scrollbar {
  width: 5px;
}

.modal-description-scroll::-webkit-scrollbar-track {
  background: transparent;
}

.modal-description-scroll::-webkit-scrollbar-thumb {
  background-color: #dee2e6;
  border-radius: 20px;
}

.modal-description-scroll::-webkit-scrollbar-thumb:hover {
  background-color: #ced4da;
}

.x-small-text {
  font-size: 0.65rem;
  letter-spacing: 0.05em;
}

.flex-shrink-0 {
  flex-shrink: 0 !important;
}

.transition-transform { transition: transform 0.4s cubic-bezier(0.165, 0.84, 0.44, 1); }
.UniBorrow-card:hover .transition-transform { transform: scale(1.08); }

.bg-success { background-color: #28a745 !important; }
.bg-danger { background-color: #dc3545 !important; }

.quantity-selector button {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.quantity-selector button:hover:not(:disabled) {
  background-color: #e9ecef !important;
}

.modal-backdrop { opacity: 0.5; }

.bg-primary-subtle { background-color: rgba(31, 92, 169, 0.1) !important; }

.list-view-row {
  flex-direction: row !important;
  max-height: 250px;
  border: 1px solid transparent !important;
  transition: all 0.3s ease;
}

.list-view-row:hover {
  border-color: rgba(13, 110, 253, 0.2) !important;
  transform: translateY(-3px);
  box-shadow: 0 10px 20px rgba(0,0,0,0.08) !important;
}

.bg-light-subtle {
  background-color: #f8fafc;
}

@media (min-width: 768px) {
  .border-end-md {
    border-right: 1px flex-row transparent; 
  }
}

@media (max-width: 768px) {
  .list-view-row {
    flex-direction: column !important;
    max-height: none;
  }
  .list-view-row .card-img-top-wrapper {
    width: 100% !important;
    height: 200px !important;
  }
  .action-column {
    border-top: 1px solid #e2e8f0;
    border-left: none !important;
    width: 100%;
  }
}
</style>
