<template>
  <div class="container py-4 mt-2">
    <div class="row justify-content-center">
      <div class="col-md-5">
        <div class="card border-0 shadow-lg rounded-4 overflow-hidden">
          <div class="bg-primary p-4 text-center">
            <h3 class="text-white fw-bold mb-0">{{ loginType === 'docgia' ? 'Đăng nhập' : 'Đăng nhập Admin' }}</h3>
          </div>
          <div class="card-body p-5">
            <form @submit.prevent="handleLogin">
              <div class="mb-4">
                <label class="form-label fw-medium">Email</label>
                <input 
                  type="email" 
                  class="form-control rounded-3 py-2 px-3 border-2" 
                  v-model="email" 
                  placeholder="name@example.com"
                  required
                >
              </div>
              <div class="mb-4">
                <label class="form-label fw-medium">Mật khẩu</label>
                <input 
                  type="password" 
                  class="form-control rounded-3 py-2 px-3 border-2" 
                  v-model="password" 
                  placeholder="*******"
                  required
                >
              </div>
              <button 
                class="btn btn-primary w-100 rounded-3 py-2 fw-bold shadow-sm" 
                type="submit"
                :disabled="loading"
              >
                <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
                Tiếp tục
              </button>
            </form>
            <div class="text-center mt-4">
              <div v-if="loginType === 'docgia'">
                <span class="text-muted small">Chưa có tài khoản? </span>
                <router-link to="/register" class="text-secondary small fw-bold text-decoration-none">Đăng ký ngay</router-link>
                <hr class="my-3 opacity-10">
                <button @click="loginType = 'nhanvien'" class="btn btn-link text-primary small text-decoration-none fw-bold p-0">
                  Đăng nhập với tư cách Admin
                </button>
                
                <div class="mt-3 pt-0">
                  <div class="text-center position-relative mb-3">
                    <hr class="text-muted opacity-25">
                    <span class="position-absolute top-50 start-50 translate-middle bg-white px-3 text-muted small">Hoặc tiếp tục với</span>
                  </div>
                  
                  <div class="row g-2">
                    <div class="col-6">
                      <button @click="loginWithSocial('google')" class="social-btn btn btn-outline-light border text-dark w-100 rounded-3 d-flex align-items-center justify-content-center gap-2 hover-shadow shadow-sm">
                        <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" width="18" height="18" alt="Google">
                        <span class="small fw-bold">Google</span>
                      </button>
                    </div>
                    <div class="col-6">
                      <button @click="loginWithSocial('github')" class="social-btn btn btn-outline-light border text-dark w-100 rounded-3 d-flex align-items-center justify-content-center gap-2 hover-shadow shadow-sm">
                        <i class="bi bi-github fs-5"></i>
                        <span class="small fw-bold">GitHub</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div v-else>
                <button @click="loginType = 'docgia'" class="btn btn-link text-primary small text-decoration-none fw-bold p-0">
                  Đăng nhập với tư cách độc giả
                </button>
              </div>
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
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../store/authStore';
import { useNotificationStore } from '../store/notificationStore';
import Notification from '../components/Shared/Notification.vue';
import { auth, googleProvider, githubProvider } from '../config/firebase';
import { signInWithPopup } from 'firebase/auth';

const email = ref('');
const password = ref('');
const loginType = ref('docgia'); 
const loading = ref(false);

const router = useRouter();
const authStore = useAuthStore();
const notifStore = useNotificationStore();

const handleLogin = async () => {
  loading.value = true;
  const result = await authStore.login(email.value, password.value, loginType.value);
  loading.value = false;
  
  if (result.success) {
    notifStore.add('Đăng nhập thành công', 'success');
    if (authStore.isAdmin || authStore.isStaff) {
      router.push('/admin'); 
    } else {
      router.push('/');      
    }
  } else {
    notifStore.add(result.message, 'error');
  }
};

const loginWithSocial = async (type) => {
  try {
    const provider = type === 'google' ? googleProvider : githubProvider;
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    loading.value = true;
  
    const fullName = user.displayName || 'Social User';
    const nameParts = fullName.trim().split(' ');
    let hoLot = '';
    let ten = '';

    if (nameParts.length > 1) {
      ten = nameParts.pop();      
      hoLot = nameParts.join(' '); 
    } else {
      hoLot = '';       
      ten = nameParts[0] || 'User';
    }

    const response = await authStore.socialLogin({
      Email: user.email,
      HoLot: hoLot, 
      Ten: ten
    });
    loading.value = false;
    
    if (response.success) {
      notifStore.add('Đăng nhập thành công', 'success');
      router.push('/');
    } else {
      notifStore.add(response.message, 'error');
    }
  } catch (error) {
    console.error('Social login error:', error);
    notifStore.add('Đăng nhập mạng xã hội thất bại', 'error');
  }
};
</script>

<style scoped>

.form-control:focus {
  border-color: var(--secondary-color);
  box-shadow: 0 0 0 0.25rem rgba(var(--secondary-rgb), 0.1);
}

.hover-shadow:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.05) !important;
  border-color: var(--primary-color) !important;
  background-color: #f8fafc;
}

.social-btn {
  height: 38px;
  transition: all 0.2s ease;
}

.hover-shadow {
  transition: all 0.2s ease;
}
</style>
