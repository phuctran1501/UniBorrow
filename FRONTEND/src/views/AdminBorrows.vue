<template>
  <div class="fade-in">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h3 class="fw-bold text-primary mb-0">Quản lý mượn trả</h3>
      <!-- <button class="btn btn-outline-primary rounded-pill px-4" @click="adminStore.fetchAllBorrows()" :disabled="adminStore.loading">
        <i class="bi bi-arrow-clockwise me-1"></i> Làm mới
      </button> -->
    </div>
    
    <div class="row g-3 align-items-center mb-4 pb-2">
      <div class="col-lg-4">
        <div class="search-box position-relative">
          <i class="bi bi-search position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"></i>
          <input 
            type="text" 
            class="form-control rounded-pill ps-5 py-2 border shadow-sm" 
            placeholder="Tìm tên độc giả hoặc email..."
            v-model="searchQuery"
          >
          <button 
            v-if="searchQuery" 
            class="btn btn-link position-absolute top-50 end-0 translate-middle-y me-2 text-muted p-0 border-0 shadow-none"
            @click="searchQuery = ''"
          >
            <i class="bi bi-x-circle-fill"></i>
          </button>
        </div>
      </div>
      
      <div class="col-lg-8">
        <div class="d-flex justify-content-lg-end">
          <div class="d-inline-flex align-items-center bg-white border rounded-pill p-1 shadow-sm">
            <template v-for="(filter, index) in statusFilters" :key="filter.value">
              <div v-if="index > 0" class="vr my-2 text-muted opacity-25" style="height: 1.2rem;"></div>
              
              <button 
                @click="statusFilter = filter.value"
                :class="[
                  'btn border-0 fw-bold px-3 py-1 transition-all d-flex align-items-center rounded-pill',
                  statusFilter === filter.value ? 'btn-primary shadow-sm text-white' : 'btn-link text-dark text-decoration-none'
                ]"
                style="font-size: 0.85rem;"
              >
                {{ filter.label }}
                <span 
                  v-if="getCount(filter.value) > 0" 
                  :class="['badge rounded-circle ms-2 d-flex align-items-center justify-content-center', statusFilter === filter.value ? 'bg-white text-primary' : 'bg-light text-muted border']"
                  style="width: 18px; height: 18px; font-size: 0.65rem;"
                >
                  {{ getCount(filter.value) }}
                </span>
              </button>
            </template>
          </div>
        </div>
      </div>
    </div>

    <div class="card border-0 shadow-sm rounded-4 overflow-hidden">
      <div class="table-responsive">
        <table class="table table-hover align-middle mb-0">
          <thead class="bg-light small text-uppercase text-muted">
            <tr>
              <th class="px-4 py-3 border-0">Độc giả</th>
              <th class="py-3 border-0">Sách mượn</th>
              <th class="py-3 border-0">Thời gian</th>
              <th class="py-3 border-0">Trạng thái</th>
              <th class="py-3 border-0 text-end px-4">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="filteredBorrows.length === 0">
              <td colspan="5" class="text-center py-5">
                <div class="py-4">
                  <i class="bi bi-inbox display-1 text-muted opacity-25"></i>
                  <p class="mt-3 text-muted fw-medium">Không tìm thấy phiếu mượn nào phù hợp</p>
                </div>
              </td>
            </tr>
            <tr v-for="item in paginatedBorrows" :key="item._id" class="transition-all">
              <td class="px-4 py-3 border-0">
                <div>
                  <div class="fw-bold text-dark">{{ item.MaDocGia?.HoLot }} {{ item.MaDocGia?.Ten }}</div>
                  <div class="small text-muted">{{ item.MaDocGia?.Email }}</div>
                </div>
              </td>

              <td class="py-3 border-0">
                <div class="fw-medium text-dark">{{ item.MaSach?.TenSach || 'Sách đã xóa' }}</div>
                <div class="small text-muted">Mã: {{ item._id.substring(item._id.length - 8).toUpperCase() }}</div>
              </td>

              <td class="py-3 border-0 small">
                <div v-if="item.TrangThai === 'ChoDuyet'">
                  <span class="text-muted">Đăng ký: {{ formatDate(item.createdAt) }}</span>
                </div>
                <div v-else>
                  <div class="text-dark">Hạn trả: <strong>{{ formatDate(item.HanTra) }}</strong></div>
                  <div class="text-muted x-small">Mượn từ: {{ formatDate(item.NgayMuon) }}</div>
                </div>
              </td>

              <td class="py-3 border-0">
                <span :class="['badge rounded-pill px-3 py-2', getStatusClass(item.TrangThai)]">
                  <i :class="['bi me-1', getStatusIcon(item.TrangThai)]"></i>
                  {{ getStatusLabel(item.TrangThai) }}
                </span>
              </td>

              <td class="py-3 border-0 text-end px-4">
                <div v-if="item.TrangThai === 'ChoDuyet'" class="d-flex justify-content-end gap-2">
                  <button class="btn btn-success btn-sm rounded-pill px-3 fw-bold shadow-sm" @click="handleApprove(item._id)">
                    Duyệt
                  </button>
                  <button class="btn btn-outline-danger btn-sm rounded-pill px-3 fw-bold" @click="handleReject(item._id)">
                    Từ chối
                  </button>
                </div>

                <div v-else-if="item.TrangThai === 'DangMuon' || item.TrangThai === 'QuaHan'" class="d-flex justify-content-end">
                  <button class="btn btn-primary btn-sm rounded-pill px-3 fw-bold shadow-sm" @click="handleReturn(item._id)">
                    Xác nhận trả
                  </button>
                </div>

                <div v-else class="text-muted small italic">
                  Không có thao tác
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-if="totalPages > 1" class="d-flex justify-content-center align-items-center mt-4 mb-5 gap-3">
      <button 
        class="btn btn-outline-dark rounded-pill px-4 fw-bold shadow-sm"
        :disabled="currentPage === 1"
        @click="goToPage(currentPage - 1)"
      >
        <i class="bi bi-chevron-left"></i>
      </button>
      
      <span class="fw-bold">Trang {{ currentPage }} / {{ totalPages }}</span>
      
      <button 
        class="btn btn-outline-dark rounded-pill px-4 fw-bold shadow-sm"
        :disabled="currentPage === totalPages"
        @click="goToPage(currentPage + 1)"
      >
        <i class="bi bi-chevron-right"></i>
      </button>
    </div>

    <Notification :messages="notifStore.messages" @close="notifStore.remove" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useAdminStore } from '../store/adminStore';
import { useNotificationStore } from '../store/notificationStore';
import Notification from '../components/Shared/Notification.vue';

const adminStore = useAdminStore();
const notifStore = useNotificationStore();

const searchQuery = ref('');
const statusFilter = ref('All');

const statusFilters = [
  { label: 'Tất cả', value: 'All' },
  { label: 'Chờ duyệt', value: 'ChoDuyet' },
  { label: 'Đang mượn', value: 'DangMuon' },
  { label: 'Quá hạn', value: 'QuaHan' },
  { label: 'Đã trả', value: 'DaTra' }
];

const currentPage = ref(1);
const itemsPerPage = 15;

const filteredBorrows = computed(() => {
  let result = adminStore.borrows;

  if (statusFilter.value !== 'All') {
    result = result.filter(b => b.TrangThai === statusFilter.value);
  }

  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase();
    result = result.filter(b => {
      const fullName = `${b.MaDocGia?.HoLot || ''} ${b.MaDocGia?.Ten || ''}`.toLowerCase();
      const email = (b.MaDocGia?.Email || '').toLowerCase();
      return fullName.includes(q) || email.includes(q);
    });
  }

  return result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
});

const totalPages = computed(() => Math.ceil(filteredBorrows.value.length / itemsPerPage));

const paginatedBorrows = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return filteredBorrows.value.slice(start, start + itemsPerPage);
});

const goToPage = (page) => {
  currentPage.value = page;
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

watch([searchQuery, statusFilter], () => {
  currentPage.value = 1;
});

const getCount = (status) => {
  if (status === 'All') return adminStore.borrows.length;
  return adminStore.borrows.filter(b => b.TrangThai === status).length;
};

const formatDate = (date) => {
  if (!date) return 'N/A';
  return new Date(date).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

const getStatusLabel = (status) => {
  const labels = {
    'ChoDuyet': 'Chờ duyệt',
    'DangMuon': 'Đang mượn',
    'QuaHan': 'Quá hạn',
    'DaTra': 'Đã trả',
    'TuChoi': 'Đã từ chối'
  };
  return labels[status] || status;
};

const getStatusClass = (status) => {
  const classes = {
    'ChoDuyet': 'bg-warning text-dark',
    'DangMuon': 'bg-info text-white',
    'QuaHan': 'bg-danger text-white',
    'DaTra': 'bg-success text-white',
    'TuChoi': 'bg-secondary text-white'
  };
  return classes[status] || 'bg-secondary text-white';
};

const getStatusIcon = (status) => {
  const icons = {
    'ChoDuyet': 'bi-clock-history',
    'DangMuon': 'bi-book',
    'QuaHan': 'bi-exclamation-triangle',
    'DaTra': 'bi-check-circle',
    'TuChoi': 'bi-x-circle'
  };
  return icons[status] || 'bi-info-circle';
};

const handleApprove = async (id) => {
  const result = await adminStore.approveBorrow(id);
  if (result.success) {
    notifStore.add('Đã duyệt phiếu mượn thành công');
    adminStore.fetchAllBorrows(); 
  } else {
    notifStore.add(result.message, 'error');
  }
};

const handleReject = async (id) => {
  const result = await adminStore.rejectBorrow(id);
  if (result.success) {
    notifStore.add('Đã từ chối yêu cầu mượn sách');
    adminStore.fetchAllBorrows();
  } else {
    notifStore.add(result.message, 'error');
  }
};

const handleReturn = async (id) => {
  const result = await adminStore.returnBook(id);
  if (result.success) {
    notifStore.add('Đã xác nhận trả sách');
    adminStore.fetchAllBorrows();
  } else {
    notifStore.add(result.message, 'error');
  }
};

onMounted(() => {
  adminStore.fetchAllBorrows();
});
</script>

<style scoped>
.bg-info { background-color: var(--secondary-color) !important; }
.bg-success { background-color: #28a745 !important; }
.bg-danger { background-color: #dc3545 !important; }
</style>
