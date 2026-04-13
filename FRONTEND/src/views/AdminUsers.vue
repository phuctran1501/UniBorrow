<template>
  <div class="fade-in">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h3 class="fw-bold text-primary mb-0">Quản lý người dùng</h3>
      <div class="search-box-wrapper input-group w-auto">
        <span class="input-group-text bg-white border-end-0 rounded-start-pill px-3 search-icon">
          <i class="bi bi-search text-muted"></i>
        </span>
        <input 
          type="text" 
          class="form-control border-start-0 rounded-end-pill px-3 shadow-none search-input" 
          placeholder="Tìm email, họ tên..." 
          style="width: 250px;"
          v-model="searchQuery"
        >
      </div>
    </div>
    
    <div v-if="adminStore.loading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status"></div>
    </div>
    
    <div v-else class="card border-0 shadow-sm rounded-4 overflow-hidden">
      <div class="table-responsive">
        <table class="table table-hover mb-0 align-middle">
          <thead class="bg-light">
            <tr>
              <th class="px-4 py-3 border-0 small text-uppercase text-muted fw-bold">Email</th>
              <th class="py-3 border-0 small text-uppercase text-muted fw-bold">Họ tên</th>
              <th class="py-3 border-0 small text-uppercase text-muted fw-bold">Số điện thoại</th>
              <th class="py-3 border-0 small text-uppercase text-muted fw-bold text-end px-4">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in filteredUsers" :key="user._id">
              <td class="px-4 py-3 border-0">
                <div class="d-flex align-items-center">
                  <div class="avatar bg-secondary-subtle text-secondary rounded-circle d-flex align-items-center justify-content-center me-3" style="width: 40px; height: 40px;">
                    <i class="bi bi-person"></i>
                  </div>
                  <span class="fw-bold text-dark">{{ user.Email }}</span>
                </div>
              </td>
              <td class="py-3 border-0">{{ user.HoLot }} {{ user.Ten }}</td>
              <td class="py-3 border-0 small">{{ user.DienThoai }}</td>
              <td class="py-3 border-0 text-end px-4">
                <button 
                  class="btn btn-sm rounded-pill px-3 fw-bold shadow-sm transition-all"
                  :class="!user.TrangThai ? 'btn-success' : 'btn-outline-danger'"
                  @click="handleToggleStatus(user._id)"
                >
                  {{ !user.TrangThai ? 'Mở khóa' : 'Khóa' }}
                </button>
              </td>
            </tr>
            <tr v-if="filteredUsers.length === 0">
              <td colspan="4" class="text-center py-4 text-muted small">Không tìm thấy người dùng nào</td>
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
import { useAdminStore } from '../store/adminStore';
import { useNotificationStore } from '../store/notificationStore';
import Notification from '../components/Shared/Notification.vue';

const adminStore = useAdminStore();
const notifStore = useNotificationStore();
const searchQuery = ref('');

const filteredUsers = computed(() => {
  const query = searchQuery.value.toLowerCase().trim();
  if (!query) return adminStore.users;
  return adminStore.users.filter(u => 
    u.Email.toLowerCase().includes(query) || 
    `${u.HoLot} ${u.Ten}`.toLowerCase().includes(query)
  );
});

const handleToggleStatus = async (id) => {
  const result = await adminStore.toggleUserStatus(id);
  if (result.success) {
    notifStore.add('Đã cập nhật trạng thái người dùng');
    adminStore.fetchAllUsers(); 
  } else {
    notifStore.add(result.message, 'error');
  }
};

onMounted(() => {
  adminStore.fetchAllUsers();
});
</script>

<style scoped>
.search-box-wrapper:hover .input-group-text,
.search-box-wrapper:hover .form-control {
  background-color: #fff !important;
  border-color: #dee2e6 !important;
}

.search-input:focus {
  border-color: var(--secondary-color) !important;
}

.transition-all { transition: all 0.2s ease; }
</style>
