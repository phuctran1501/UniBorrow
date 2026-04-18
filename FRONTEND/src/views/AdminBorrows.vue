<template>
  <div class="fade-in">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h3 class="fw-bold text-primary mb-0">Quản lý mượn trả</h3>
      <button 
        class="btn btn-primary rounded-pill px-4 shadow-sm" 
        @click="handleScanOverdue" 
        :disabled="adminStore.loading || isScanning"
      >
        <i v-if="!isScanning"></i>
        <span v-else class="spinner-border spinner-border-sm me-1" role="status"></span>
        {{ isScanning ? 'Đang quét...' : 'Quét phiếu quá hạn' }}
      </button>
    </div>
    
    <div class="row g-3 align-items-center mb-4 pb-2">
      <div class="col-lg-4">
        <SearchBox v-model="searchQuery" placeholder="Tìm tên độc giả hoặc email..." />
      </div>
      
      <div class="col-lg-8">
        <div class="d-flex justify-content-lg-end">
          <StatusFilterBar 
            v-model="statusFilter"
            :filters="statusFilters"
            :get-count="getCount"
          />
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
                  <div class="fw-bold text-dark">{{ getFullName(item.MaDocGia) }}</div>
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

    <Pagination 
      :current-page="currentPage"
      :total-pages="totalPages"
      @change="goToPage"
    />

    <Notification :messages="notifStore.messages" @close="notifStore.remove" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useAdminStore } from '../store/adminStore';
import { useNotificationStore } from '../store/notificationStore';
import Notification from '../components/Shared/Notification.vue';
import StatusFilterBar from '../components/Shared/StatusFilterBar.vue';
import SearchBox from '../components/Shared/SearchBox.vue';
import Pagination from '../components/Shared/Pagination.vue';

const adminStore = useAdminStore();
const notifStore = useNotificationStore();

const searchQuery = ref('');
const statusFilter = ref('All');
const isScanning = ref(false);

const statusFilters = [
  { label: 'Tất cả', value: 'All' },
  { label: 'Chờ duyệt', value: 'ChoDuyet' },
  { label: 'Đang mượn', value: 'DangMuon' },
  { label: 'Quá hạn', value: 'QuaHan' },
  { label: 'Đã trả', value: 'DaTra' },
  { label: 'Từ chối', value: 'TuChoi' }
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
      const fullName = getFullName(b.MaDocGia).toLowerCase();
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

const getFullName = (user) => {
  if (!user) return 'N/A';
  if (user.HoTenNV) return user.HoTenNV;
  return `${user.HoLot || ''} ${user.Ten || ''}`.trim() || 'Người dùng hệ thống';
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

const handleScanOverdue = async () => {
  isScanning.value = true;
  const result = await adminStore.checkOverdue();
  isScanning.value = false;
  
  if (result.success) {
    notifStore.add(result.message || 'Đã hoàn tất quét phiếu quá hạn');
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
</style>

