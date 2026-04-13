<template>
  <div class="admin-layout d-flex min-vh-100">
    <aside class="admin-sidebar bg-white border-end p-0 d-none d-lg-block shadow-sm" style="width: 280px;">
      <div class="d-flex align-items-center justify-content-center p-4 mb-4 mt-2 border-bottom">
        <i class="bi bi-shield-lock me-2 fs-3 text-primary"></i>
        <span class="fs-4 fw-bold text-dark">Admin</span>
      </div>
      
      <nav class="nav flex-column mb-auto px-2 gap-3">
        <router-link to="/admin" class="nav-link py-3 px-3 d-flex align-items-center border-bottom rounded-3">
          <i class="bi bi-speedometer2 me-3 fs-5"></i> Dashboard
        </router-link>
        <router-link to="/admin/books" class="nav-link py-3 px-3 d-flex align-items-center border-bottom rounded-3">
          <i class="bi bi-journal-plus me-3 fs-5"></i> Quản lý sách
        </router-link>
        <router-link to="/admin/publishers" class="nav-link py-3 px-3 d-flex align-items-center border-bottom rounded-3">
          <i class="bi bi-building me-3 fs-5"></i> Quản lý nhà xuất bản
        </router-link>
        <router-link to="/admin/borrows" class="nav-link py-3 px-3 d-flex align-items-center border-bottom rounded-3">
          <i class="bi bi-journal-text me-3 fs-5"></i>Quản lý phiếu mượn
        </router-link>
        <router-link v-if="authStore.isAdmin" to="/admin/staff" class="nav-link py-3 px-3 d-flex align-items-center border-bottom rounded-3">
          <i class="bi bi-person-badge me-3 fs-5"></i> Quản lý nhân viên
        </router-link>
        <router-link v-if="authStore.isAdmin" to="/admin/users" class="nav-link py-3 px-3 d-flex align-items-center border-bottom rounded-3">
          <i class="bi bi-people me-3 fs-5"></i> Quản lý người dùng
        </router-link>
      </nav>
      
      <div class="mt-auto px-3 mb-5 pt-3">
        <router-link to="/" class="nav-link py-3 px-3 d-flex align-items-center border-top back-home-link rounded-3">
          <i class="bi bi-box-arrow-left me-3 fs-5"></i> Quay lại trang chủ
        </router-link>
      </div>
    </aside>
    <div class="flex-grow-1 bg-light d-flex flex-column h-screen overflow-hidden">
      <header class="bg-white border-bottom py-3 px-4 d-flex justify-content-between align-items-center shadow-sm z-1">
        <button class="btn d-lg-none text-primary fs-3 p-0 border-0 shadow-none">
          <i class="bi bi-list"></i>
        </button>
        <div class="fw-bold text-muted small ms-lg-0 ms-3">QUẢN TRỊ UniBorrow</div>
        <div class="d-flex align-items-center">
          <div class="user-profile d-flex align-items-center gap-3 py-1 px-3">
            <div class="text-end d-none d-md-block">
              <div class="fw-bold small text-dark lh-1">{{ authStore.user?.Email }}</div>
              <div class="x-small text-muted text-uppercase tracking-wider mt-1" style="font-size: 0.65rem;">{{ authStore.user?.ChucVu }}</div>
            </div>
            <div class="dropdown">
              <div class="avatar bg-primary text-white rounded-circle shadow-sm d-flex align-items-center justify-content-center cursor-pointer" style="width: 40px; height: 40px;" data-bs-toggle="dropdown">
                <i class="bi bi-person-fill fs-5"></i>
              </div>
              <ul class="dropdown-menu dropdown-menu-end border-0 shadow mt-3 p-2 rounded-4">
                <li class="px-3 py-2 small fw-bold text-muted border-bottom mb-1">Tài khoản</li>
                <li><button @click="handleLogout" class="dropdown-item text-danger py-2 rounded-3 fw-medium">
                  <i class="bi bi-box-arrow-right me-2"></i> Đăng xuất
                </button></li>
              </ul>
            </div>
          </div>
        </div>
      </header>

      <main class="p-4 p-lg-5 overflow-auto flex-grow-1">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { useAuthStore } from '../store/authStore';

const authStore = useAuthStore();
const router = useRouter();

const handleLogout = () => {
  authStore.logout();
  router.push('/login');
};
</script>

<style scoped>
.x-small { font-size: 0.7rem; }
.tracking-wider { letter-spacing: 0.05em; }
.admin-sidebar {
  background-color: #fff !important;
  z-index: 10;
}

.nav-link {
  color: #4a5568 !important;
  border-bottom: 1px solid #edf2f7;
  border-radius: 0 !important;
}

.nav-link:hover, 
.nav-link.router-link-exact-active {
  background-color: var(--primary-color) !important;
  color: white !important;
  opacity: 1;
}

.back-home-link {
  border-top: 1px solid #edf2f7;
  border-bottom: none;
}

.cursor-pointer { cursor: pointer; }
.no-caret::after { display: none; }

.h-screen { height: 100vh; }
</style>
