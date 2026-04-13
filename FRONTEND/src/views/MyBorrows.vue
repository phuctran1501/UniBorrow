<template>
  <div class="container py-5">
    <div class="row mb-5">
      <div class="col-12">
        <h2 class="fw-bold text-primary mb-3">Theo dõi mượn trả</h2>
        <p class="text-muted">Xem trạng thái các yêu cầu mượn sách và lịch sử trả sách của bạn.</p>
      </div>
    </div>

    <div v-if="hasOverdue" class="alert alert-danger border-0 rounded-4 shadow-sm p-4 mb-5">
      <div class="d-flex align-items-center">
        <i class="bi bi-exclamation-triangle-fill fs-1 me-4"></i>
        <div>
          <h5 class="fw-bold mb-1 text-danger">Cảnh báo: Bạn có sách quá hạn!</h5>
          <p class="mb-0 text-dark opacity-75">Vui lòng mang sách đến thư viện để trả và thanh toán phí phạt để có thể tiếp tục mượn sách mới.</p>
        </div>
      </div>
    </div>

    <div class="card border-0 shadow-sm rounded-4 overflow-hidden mb-5">
      <div v-if="loading" class="text-center py-5">
        <div class="spinner-border text-primary" role="status"></div>
      </div>
      
      <div v-else-if="borrows.length === 0" class="text-center py-5 px-4">
        <i class="bi bi-journal-x fs-1 text-muted mb-3 d-block"></i>
        <h5 class="text-muted fw-bold">Bạn chưa có yêu cầu mượn sách nào</h5>
        <router-link to="/library" class="btn btn-primary rounded-pill px-4 mt-3 fw-bold">Đến thư viện ngay</router-link>
      </div>

      <div v-else class="table-responsive">
        <table class="table table-hover align-middle mb-0">
          <thead class="bg-light">
            <tr>
              <th class="px-4 py-3 border-0 small text-muted text-uppercase fw-bold">Tên sách</th>
              <th class="py-3 border-0 small text-muted text-uppercase fw-bold text-center">Ngày mượn</th>
              <th class="py-3 border-0 small text-muted text-uppercase fw-bold text-center">Hạn trả</th>
              <th class="py-3 border-0 small text-muted text-uppercase fw-bold text-center">Trạng thái</th>
              <th class="py-3 border-0 small text-muted text-uppercase fw-bold text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="phieu in sortedBorrows" :key="phieu._id">
              <td class="px-4 py-3 border-0">
                <div class="fw-bold text-dark">{{ phieu.MaSach?.TenSach || 'Sách đã bị xóa' }}</div>
                <div class="small text-muted">{{ phieu.MaSach?.TacGia }}</div>
              </td>
              <td class="py-3 border-0 text-center text-dark">{{ formatDate(phieu.NgayMuon) }}</td>
              <td class="py-3 border-0 text-center text-dark" :class="{'text-danger': phieu.TrangThai === 'QuaHan'}">
                {{ formatDate(phieu.HanTra) }}
              </td>
              <td class="py-3 border-0 text-center">
                <span :class="['badge rounded-pill px-3 py-2', getStatusClass(phieu.TrangThai)]">
                  {{ getStatusText(phieu.TrangThai) }}
                </span>
              </td>
              <td class="py-3 border-0 text-center">
                <button 
                  v-if="phieu.TrangThai === 'ChoDuyet'" 
                  class="btn btn-outline-danger btn-sm rounded-pill px-3 fw-bold"
                  @click="handleCancel(phieu._id)"
                >
                  <i class="bi bi-x-circle me-1"></i> Hủy
                </button>
                <span v-else class="text-muted small">-</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    
    <Notification :messages="notifStore.messages" @close="notifStore.remove" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import api from '../services/api';
import { useNotificationStore } from '../store/notificationStore';
import Notification from '../components/Shared/Notification.vue';

const notifStore = useNotificationStore();

const borrows = ref([]); 
const loading = ref(true);

const hasOverdue = computed(() => {
  return borrows.value.some(p => p.TrangThai === 'QuaHan');
});

const sortedBorrows = computed(() => {
  return [...borrows.value].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
});

const fetchBorrows = async () => {
  try {
    const { data } = await api.get('/sach/my-borrows');
    borrows.value = data;
  } catch (err) {
    console.error('Lỗi khi tải danh sách mượn sách:', err);
  } finally {
    loading.value = false;
  }
};

const handleCancel = async (id) => {
  if (confirm('Bạn có chắc chắn muốn hủy yêu cầu mượn sách này?')) {
    try {
      const { data } = await api.delete(`/sach/cancel/${id}`);
      notifStore.add(data.message || 'Đã hủy yêu cầu thành công');
      fetchBorrows(); 
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Có lỗi xảy ra khi hủy yêu cầu';
      notifStore.add(errorMsg, 'danger');
      console.error('Lỗi khi hủy mượn sách:', err);
    }
  }
};

const formatDate = (date) => {
  if (!date) return '-';
  return new Date(date).toLocaleDateString('vi-VN');
};

const getStatusText = (status) => {
  const map = {
    'ChoDuyet': 'Chờ duyệt',
    'DangMuon': 'Đang mượn',
    'DaTra': 'Đã trả',
    'QuaHan': 'Quá hạn',
    'DaThanhToan': 'Đã nộp phạt',
    'TuChoi': 'Từ chối'
  };
  return map[status] || status;
};

const getStatusClass = (status) => {
  const map = {
    'ChoDuyet': 'bg-warning-subtle text-warning',
    'DangMuon': 'bg-primary-subtle text-primary',
    'DaTra': 'bg-success-subtle text-success',
    'QuaHan': 'bg-danger text-white shadow-sm',
    'DaThanhToan': 'bg-info-subtle text-info',
    'TuChoi': 'bg-secondary-subtle text-danger'
  };
  return map[status] || 'bg-light text-dark';
};

onMounted(fetchBorrows);
</script>

<style scoped>
.bg-warning-subtle { background-color: rgba(255, 193, 7, 0.1); }
.bg-primary-subtle { background-color: rgba(31, 92, 169, 0.1); }
.bg-success-subtle { background-color: rgba(25, 135, 84, 0.1); }
.bg-danger-subtle { background-color: rgba(220, 53, 69, 0.1); }
.bg-info-subtle { background-color: rgba(13, 202, 240, 0.1); }
.bg-secondary-subtle { background-color: rgba(108, 117, 125, 0.1); }
</style>
