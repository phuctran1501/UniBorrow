<template>
  <div class="fade-in">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h3 class="fw-bold text-primary mb-0">Quản lý nhân viên</h3>
      <button class="btn btn-primary rounded-pill px-4 fw-bold shadow-sm" @click="showModal = true; resetForm()">
        <i class="bi bi-plus-lg me-2"></i> Thêm nhân viên
      </button>
    </div>

    <div class="card border-0 shadow-sm rounded-4 overflow-hidden">
    
      <div class="table-responsive">
      
        <table class="table table-hover mb-0 align-middle">
          <thead class="bg-light">
            <tr>
              <th class="px-4 py-3 border-0 small text-uppercase text-muted fw-bold">Email</th>
              <th class="py-3 border-0 small text-uppercase text-muted fw-bold">Họ tên</th>
              <th class="py-3 border-0 small text-uppercase text-muted fw-bold">Chức vụ</th>
              <th class="py-3 border-0 small text-uppercase text-muted fw-bold">Số điện thoại</th>
              <th class="py-3 border-0 small text-uppercase text-muted fw-bold text-end px-4">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="adminStore.loading">
              <td colspan="5" class="text-center py-5">
                <div class="spinner-border text-primary" role="status"></div>
              </td>
            </tr>
            <tr v-for="member in adminStore.staff" :key="member._id">
              <td class="px-4 py-3 border-0 fw-bold">{{ member.Email }}</td>
              <td class="py-3 border-0">{{ member.HoTenNV }}</td>
              <td class="py-3 border-0">
                <span :class="['badge rounded-pill px-3', member.ChucVu === 'Admin' ? 'bg-primary' : 'bg-secondary-subtle text-secondary']">
                  {{ member.ChucVu }}
                </span>
              </td>
              <td class="py-3 border-0 small">{{ member.SoDienThoai }}</td>
              <td class="py-3 border-0 text-end px-4">
                <button 
                  v-if="member.Email !== 'admin@gmail.com'" 
                  class="btn btn-outline-danger btn-sm rounded-pill px-3 fw-bold" 
                  @click="handleDelete(member._id)"
                >
                  Xóa
                </button>
                <span v-else class="text-muted small">Mặc định</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <Teleport to="body">
      <div v-if="showModal" class="modal-backdrop modal-backdrop-subtle fade show" style="z-index: 1060;"></div>
      <div v-if="showModal" class="modal fade show d-block" tabindex="-1" style="z-index: 1070;">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
            <div class="auth-header py-3 d-flex align-items-center justify-content-between px-4">
              <h5 class="modal-title fw-bold mb-0 text-white">Thêm nhân sự mới</h5>
              <button type="button" class="btn-close btn-close-white shadow-none" @click="showModal = false"></button>
            </div>
            <div class="modal-body p-4">
              <form @submit.prevent="handleSubmit">
                <div class="mb-3">
                  <label class="form-label fw-medium">Họ tên nhân viên</label>
                  <input type="text" class="form-control rounded-3 border-2" v-model="form.HoTenNV" required>
                </div>
                <div class="mb-3">
                  <label class="form-label fw-medium">Email (Tài khoản)</label>
                  <input type="email" class="form-control rounded-3 border-2" v-model="form.Email" placeholder="staff@gmail.com" required>
                </div>
                <div class="mb-3">
                  <label class="form-label fw-medium">Mật khẩu</label>
                  <input type="password" class="form-control rounded-3 border-2" v-model="form.Password" required>
                </div>
              
                <div class="row g-3 mb-4">
               
                  <div class="col-md-6">
                    <label class="form-label fw-medium">Chức vụ</label>
                  
                    <select class="form-select rounded-3 border-2" v-model="form.ChucVu" required>
                      <option value="Nhân viên">Nhân viên</option>
                      <option value="Admin">Admin</option>
                    </select>
                  </div>
                  <div class="col-md-6">
                    <label class="form-label fw-medium">Số điện thoại</label>
                    <input type="tel" class="form-control rounded-3 border-2" v-model="form.SoDienThoai" required>
                  </div>
                </div>
                <div class="mb-5">
                  <label class="form-label fw-medium">Địa chỉ</label>
                  <input type="text" class="form-control rounded-3 border-2" v-model="form.DiaChi">
                </div>
                <button class="btn btn-primary w-100 rounded-3 py-2 fw-bold shadow-sm" type="submit" :disabled="loading">
                  {{ loading ? 'Đang tạo...' : 'Tạo nhân viên' }}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Teleport>

    <Notification :messages="notifStore.messages" @close="notifStore.remove" />
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useAdminStore } from '../store/adminStore';
import { useNotificationStore } from '../store/notificationStore';
import Notification from '../components/Shared/Notification.vue';

const adminStore = useAdminStore();
const notifStore = useNotificationStore();

const showModal = ref(false); 
const loading = ref(false);  

const form = reactive({
  Email: '',
  Password: '',
  HoTenNV: '',
  ChucVu: 'Nhân viên',
  DiaChi: '',
  SoDienThoai: ''
});

const resetForm = () => {
  form.Email = '';
  form.Password = '';
  form.HoTenNV = '';
  form.ChucVu = 'Nhân viên';
  form.DiaChi = '';
  form.SoDienThoai = '';
};

const handleSubmit = async () => {
  loading.value = true;
  const result = await adminStore.createStaff(form);
  loading.value = false;
  
  if (result.success) {
    notifStore.add('Đã thêm nhân viên mới thành công');
    showModal.value = false;
    adminStore.fetchAllStaff(); 
  } else {
    notifStore.add(result.message, 'error');
  }
};

const handleDelete = async (id) => {
  if (confirm('Bạn có chắc muốn xóa nhân viên này khỏi hệ thống?')) {
    const result = await adminStore.deleteStaff(id);
    if (result.success) {
      notifStore.add('Đã xóa nhân viên');
      adminStore.fetchAllStaff();
    } else {
      notifStore.add(result.message, 'error');
    }
  }
};

onMounted(() => {
  adminStore.fetchAllStaff();
});
</script>

<style scoped>
</style>
