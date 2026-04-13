<template>
  <div class="fade-in">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h3 class="fw-bold text-primary mb-0">Quản lý mượn trả</h3>
      <button class="btn btn-outline-primary rounded-pill px-4" @click="adminStore.fetchAllBorrows()" :disabled="adminStore.loading">
        <i class="bi bi-arrow-clockwise me-1"></i> Làm mới
      </button>
    </div>
    
    <div class="row g-4 mb-5">
      <div class="col-lg-12">
        <div class="card border-0 shadow-sm rounded-4 overflow-hidden">
          <div class="card-header bg-white py-3 px-4 border-bottom d-flex align-items-center justify-content-between">
            <h5 class="fw-bold mb-0 text-dark">Chờ duyệt mượn</h5>
            <span class="badge bg-warning text-dark rounded-pill px-3">{{ pendingBorrows.length }} yêu cầu</span>
          </div>
          <div class="table-responsive">
            <table class="table table-hover align-middle mb-0">
              <thead class="bg-light small text-uppercase text-muted">
                <tr>
                  <th class="px-4 py-3 border-0">Độc giả</th>
                  <th class="py-3 border-0">Sách</th>
                  <th class="py-3 border-0">Ngày đăng ký</th>
                  <th class="py-3 border-0 text-end px-4">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="pendingBorrows.length === 0">
                  <td colspan="4" class="text-center py-5 text-muted">Không có yêu cầu nào chờ duyệt</td>
                </tr>
                <tr v-for="item in pendingBorrows" :key="item._id">
                  <td class="px-4 py-3 border-0 fw-medium">{{ item.MaDocGia?.Email || 'N/A' }}</td>
                  <td class="py-3 border-0">{{ item.MaSach?.TenSach || 'Sách đã xóa' }}</td>
                  <td class="py-3 border-0 small">{{ new Date(item.createdAt).toLocaleDateString('vi-VN') }}</td>
                  <td class="py-3 border-0 text-end px-4">
                    <button class="btn btn-primary btn-sm rounded-pill px-3 fw-bold shadow-sm me-2" @click="handleApprove(item._id)">
                      Duyệt mượn
                    </button>
                    <button class="btn btn-outline-danger btn-sm rounded-pill px-3 fw-bold" @click="handleReject(item._id)">
                      Từ chối
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <div class="row g-4">
      <div class="col-lg-12">
        <div class="card border-0 shadow-sm rounded-4 overflow-hidden">
          <div class="card-header bg-white py-3 px-4 border-bottom d-flex align-items-center justify-content-between">
            <h5 class="fw-bold mb-0 text-dark">Đang mượn & Quá hạn</h5>
            <span class="badge bg-primary rounded-pill px-3">{{ activeBorrows.length }} phiếu</span>
          </div>
          <div class="table-responsive">
            <table class="table table-hover align-middle mb-0">
              <thead class="bg-light small text-uppercase text-muted">
                <tr>
                  <th class="px-4 py-3 border-0">Độc giả</th>
                  <th class="py-3 border-0">Sách</th>
                  <th class="py-3 border-0">Hạn trả</th>
                  <th class="py-3 border-0">Trạng thái</th>
                  <th class="py-3 border-0 text-end px-4">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="activeBorrows.length === 0">
                  <td colspan="5" class="text-center py-5 text-muted">Hiện không có ai đang mượn sách</td>
                </tr>
                <tr v-for="item in activeBorrows" :key="item._id">
                  <td class="px-4 py-3 border-0 fw-medium">{{ item.MaDocGia?.Email || 'N/A' }}</td>
                  <td class="py-3 border-0">{{ item.MaSach?.TenSach || 'Sách đã xóa' }}</td>
                  <td class="py-3 border-0 small">{{ new Date(item.HanTra).toLocaleDateString('vi-VN') }}</td>
                  <td class="py-3 border-0">
                    <span :class="['badge rounded-pill px-2 py-1', item.TrangThai === 'QuaHan' ? 'bg-danger' : 'bg-info']">
                      {{ item.TrangThai === 'QuaHan' ? 'Quá hạn' : 'Đang mượn' }}
                    </span>
                  </td>
                  <td class="py-3 border-0 text-end px-4">
                    <button class="btn btn-primary btn-sm rounded-pill px-3 fw-bold shadow-sm" @click="handleReturn(item._id)">
                      Xác nhận trả
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <Notification :messages="notifStore.messages" @close="notifStore.remove" />
  </div>
</template>

<script setup>

import { computed, onMounted } from 'vue';
import { useAdminStore } from '../store/adminStore';
import { useNotificationStore } from '../store/notificationStore';
import Notification from '../components/Shared/Notification.vue';

const adminStore = useAdminStore();
const notifStore = useNotificationStore();

const pendingBorrows = computed(() => 
  adminStore.borrows.filter(b => b.TrangThai === 'ChoDuyet')
);

const activeBorrows = computed(() => 
  adminStore.borrows.filter(b => b.TrangThai === 'DangMuon' || b.TrangThai === 'QuaHan')
);

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
