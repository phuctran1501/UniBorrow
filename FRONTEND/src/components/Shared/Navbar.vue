<template>
  <nav class="navbar navbar-expand-lg navbar-dark sticky-top glass-morphism py-3">
    <div class="container">
      <router-link class="navbar-brand d-flex align-items-center" to="/">
        <i class="bi bi-book-half me-2 fs-3 text-secondary"></i>
        <span class="fw-bold fs-4 tracking-tight text-primary">UniBorrow</span>
      </router-link>

      <button class="navbar-toggler border-0 shadow-none" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
        <span class="navbar-toggler-icon"></span>
      </button>
      
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0 ms-lg-4">
          <li class="nav-item">
            <router-link class="nav-link px-3 fw-medium" to="/">Trang chủ</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link px-3 fw-medium" to="/library">Thư viện sách</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link px-3 fw-medium" to="/terms">Điều khoản</router-link>
          </li>
          <li v-if="authStore.isAuthenticated" class="nav-item">
            <router-link class="nav-link px-3 fw-medium" to="/my-borrows">Lịch sử mượn</router-link>
          </li>
          <li v-if="authStore.isStaff" class="nav-item">
            <router-link class="nav-link px-3 fw-medium text-secondary" to="/admin">Quản trị</router-link>
          </li>
        </ul>
        
        <div class="d-flex align-items-center gap-3">
          <template v-if="!authStore.isAuthenticated">
            <router-link to="/login" class="btn btn-outline-primary rounded-pill px-0 fw-medium border-2 nav-auth-btn">
              Đăng nhập
            </router-link>
            <router-link to="/register" class="btn btn-primary rounded-pill px-0 fw-medium shadow-sm nav-auth-btn">
              Đăng ký
            </router-link>
          </template>
          <template v-else>
            <router-link to="/favorites" class="btn btn-link text-primary p-0 position-relative me-2">
              <i class="bi bi-heart fs-4"></i>
              <span v-if="bookStore.favorites.length > 0" class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style="font-size: 0.6rem;">
                {{ bookStore.favorites.length }}
              </span>
            </router-link>
            <div class="d-flex align-items-center me-3 border-end pe-3">
              <i class="bi bi-person-circle fs-4 me-2 text-primary"></i>
              <div class="d-flex flex-column line-height-1">
                <span class="small fw-bold text-dark">{{ authStore.user?.HoTenNV || authStore.user?.Ten }}</span>
                <span class="x-small text-muted">{{ authStore.role === 'DocGia' ? 'Độc giả' : authStore.role }}</span>
              </div>
            </div>
            <button @click="authStore.logout(); $router.push('/')" class="btn btn-link text-danger p-0 text-decoration-none fw-bold small">
              Đăng xuất
            </button>
          </template>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>

import { useAuthStore } from '../../store/authStore';
import { useBookStore } from '../../store/bookStore';
import { onMounted } from 'vue';

const authStore = useAuthStore();
const bookStore = useBookStore();

onMounted(() => {
  if (authStore.isAuthenticated) {
    bookStore.fetchFavorites();
  }
});
</script>

<style scoped>
.line-height-1 { line-height: 1.1; }
.x-small { font-size: 0.75rem; }
.navbar {
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.9) !important;
  z-index: 1030;
}

.nav-link {
  color: #333 !important;
  transition: color 0.3s ease;
}

.nav-link:hover, 
.nav-link.router-link-exact-active {
  color: var(--primary-color) !important;
}



.nav-auth-btn {
  min-width: 150px;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.3s ease;
}

.nav-auth-btn:hover {
  transform: translateY(-2px);
  filter: brightness(1.1);
}
</style>
