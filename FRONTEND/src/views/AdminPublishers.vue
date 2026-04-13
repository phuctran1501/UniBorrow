<template>
  <div class="fade-in">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h3 class="fw-bold text-primary mb-0">Quản lý nhà xuất bản</h3>
      <button class="btn btn-primary rounded-pill px-4 fw-bold shadow-sm" @click="openCreateModal">
        <i class="bi bi-plus-lg me-2"></i> Thêm nhà xuất bản
      </button>
    </div>
    <div class="card border-0 shadow-sm rounded-4 overflow-hidden">
      <div class="table-responsive">
        <table class="table table-hover mb-0 align-middle">
          <thead class="bg-light">
            <tr>
              <th class="px-4 py-3 border-0 small text-uppercase text-muted fw-bold">Tên nhà xuất bản</th>
              <th class="py-3 border-0 small text-uppercase text-muted fw-bold">Địa chỉ</th>
              <th class="py-3 border-0 small text-uppercase text-muted fw-bold text-end px-4">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="adminStore.loading">
              <td colspan="3" class="text-center py-5">
                <div class="spinner-border text-primary" role="status"></div>
              </td>
            </tr>
            <tr v-else-if="adminStore.publishers.length === 0">
              <td colspan="3" class="text-center py-5 text-muted">Chưa có nhà xuất bản nào.</td>
            </tr>
            <tr v-for="nxb in adminStore.publishers" :key="nxb._id">
              <td class="px-4 py-3 border-0 fw-bold">{{ nxb.TenNXB }}</td>
              <td class="py-3 border-0">{{ nxb.DiaChi }}</td>
              <td class="py-3 border-0 text-end px-4">
                <button class="btn btn-outline-primary btn-sm rounded-pill px-3 fw-bold me-2" @click="editNXB(nxb)">
                  Sửa
                </button>
                <button class="btn btn-outline-danger btn-sm rounded-pill px-3 fw-bold" @click="handleDelete(nxb._id)">
                  Xóa
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Add/Edit Modal -->
    <Teleport to="body">
      <div v-if="showModal" class="modal-backdrop fade show" style="z-index: 1060;"></div>
      <div v-if="showModal" class="modal fade show d-block" tabindex="-1" style="z-index: 1070;">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content border-0 shadow-lg rounded-4">
            <div class="modal-header border-0 p-4 pb-0">
              <h5 class="modal-title fw-bold text-primary">{{ isEditing ? 'Cập nhật nhà xuất bản' : 'Thêm nhà xuất bản mới' }}</h5>
              <button type="button" class="btn-close shadow-none" @click="showModal = false"></button>
            </div>
            <div class="modal-body p-4">
              <form @submit.prevent="handleSubmit">
                <div class="mb-3">
                  <label class="form-label fw-medium">Tên nhà xuất bản</label>
                  <input type="text" class="form-control rounded-3 border-2" v-model="form.TenNXB" required>
                </div>
                <div class="mb-4">
                  <label class="form-label fw-medium">Địa chỉ</label>
                  <textarea class="form-control rounded-3 border-2" v-model="form.DiaChi" rows="3"></textarea>
                </div>
                <button class="btn btn-primary w-100 rounded-3 py-2 fw-bold shadow-sm" type="submit" :disabled="loading">
                  {{ loading ? 'Đang lưu...' : (isEditing ? 'Lưu thay đổi' : 'Thêm nhà xuất bản') }}
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
const isEditing = ref(false);    
const currentId = ref(null);   
const loading = ref(false);     

const form = reactive({
  TenNXB: '',
  DiaChi: ''
});

const resetForm = () => {
  form.TenNXB = '';
  form.DiaChi = '';
};

const openCreateModal = () => {
  isEditing.value = false;
  currentId.value = null;
  resetForm();
  showModal.value = true;
};

const editNXB = (nxb) => {
  isEditing.value = true;
  currentId.value = nxb._id;
  form.TenNXB = nxb.TenNXB;
  form.DiaChi = nxb.DiaChi;
  showModal.value = true;
};

const handleSubmit = async () => {
  loading.value = true;
  let result;
  if (isEditing.value) {
    result = await adminStore.updatePublisher(currentId.value, form);
  } else {
    result = await adminStore.createPublisher(form);
  }
  loading.value = false;

  if (result.success) {
    notifStore.add(`Đã ${isEditing.value ? 'cập nhật' : 'thêm'} nhà xuất bản thành công`);
    showModal.value = false;
    adminStore.fetchPublishers(); 
  } else {
    notifStore.add(result.message, 'error');
  }
};

const handleDelete = async (id) => {
  if (confirm('Bạn có chắc muốn xóa nhà xuất bản này?')) {
    const result = await adminStore.deletePublisher(id);
    if (result.success) {
      notifStore.add('Đã xóa nhà xuất bản');
      adminStore.fetchPublishers();
    } else {
      notifStore.add(result.message, 'error');
    }
  }
};

onMounted(() => {
  adminStore.fetchPublishers();
});
</script>

<style scoped>
.modal-backdrop { opacity: 0.5; }
.text-info { color: #0dcaf0 !important; }
</style>
