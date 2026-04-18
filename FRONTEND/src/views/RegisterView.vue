<template>
  <div class="container py-4 mt-2">
    <div class="row justify-content-center">
      <div class="col-md-7 col-lg-6">
        <div class="auth-card">
          <div class="auth-header">
            <h3 class="text-white fw-bold mb-0">Đăng ký</h3>
          </div>
          <div class="card-body p-5">
            <form @submit.prevent="handleRegister">
              <div class="row g-3 mb-4">
                <div class="col-md-6">
                  <label class="form-label fw-medium">Họ</label>
                  <input type="text" class="form-control rounded-3 py-2 border-2" v-model="form.HoLot" required>
                </div>
                <div class="col-md-6">
                  <label class="form-label fw-medium">Tên</label>
                  <input type="text" class="form-control rounded-3 py-2 border-2" v-model="form.Ten" required>
                </div>
              </div>
              
              <div class="mb-4">
                <label class="form-label fw-medium">Email</label>
                <input type="email" class="form-control rounded-3 py-2 border-2" v-model="form.Email" placeholder="email@example.com" required>
              </div>

              <div class="mb-4">
                <label class="form-label fw-medium">Mật khẩu</label>
                <input type="password" class="form-control rounded-3 py-2 border-2" v-model="form.Password" placeholder="******" required>
              </div>

              <div class="mb-4">
                <label class="form-label fw-medium">Số điện thoại</label>
                <input type="tel" class="form-control rounded-3 py-2 border-2" v-model="form.DienThoai">
              </div>

              <div class="mb-5">
                <label class="form-label fw-medium">Địa chỉ </label>
                <textarea class="form-control rounded-3 border-2" v-model="form.DiaChi" rows="2"></textarea>
              </div>
              <button class="btn btn-primary w-100 rounded-3 py-2 fw-bold shadow-sm" type="submit" :disabled="loading">
                {{ loading ? 'Đang xử lý...' : 'Tạo tài khoản' }}
              </button>
            </form>
            <div class="text-center mt-4 text-muted small">
              Bằng cách đăng ký, bạn đồng ý với <router-link to="/terms" class="text-secondary text-decoration-none">Điều khoản sử dụng</router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Notification 
      :messages="notifStore.messages" 
      @close="notifStore.remove" 
    />
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import api from '../services/api'; 
import { useNotificationStore } from '../store/notificationStore';
import Notification from '../components/Shared/Notification.vue';

const router = useRouter();
const notifStore = useNotificationStore();
const loading = ref(false);

const form = reactive({
  HoLot: '',
  Ten: '',
  Email: '',
  Password: '',
  DienThoai: '',
  DiaChi: ''
});
const handleRegister = async () => {
  loading.value = true;
  try {
    await api.post('/docgia/register', form);
    notifStore.add('Đăng ký thành công! Vui lòng đăng nhập.', 'success');
    router.push('/login'); 
  } catch (error) {
    notifStore.add(error.response?.data?.message || 'Đăng ký thất bại', 'error');
  } finally {
    loading.value = false;
  }
};
</script>

