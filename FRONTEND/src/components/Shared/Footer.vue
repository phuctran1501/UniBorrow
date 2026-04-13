<template>
  <footer class="footer mt-auto pt-5 pb-3 bg-dark text-white">
    <div class="container">
      <div class="row g-4">
        <div class="col-lg-4">
          <div class="d-flex align-items-center mb-3">
            <i class="bi bi-book-half me-2 fs-3 text-white"></i>
            <span class="fw-bold fs-4 text-white">UniBorrow</span>
          </div>
          <p class="text-white">
            Hệ thống quản lý thư viện hiện đại, mang đến trải nghiệm mượn sách 
            nhanh chóng và thuận tiện cho sinh viên.
          </p>
        </div>
        
        <div class="col-lg-2 col-md-4">
          <h6 class="fw-bold mb-3 text-white">Liên kết</h6>
          <ul class="list-unstyled footer-links">
            <li><router-link to="/">Trang chủ</router-link></li>
            <li><router-link to="/library">Thư viện sách</router-link></li>
            <li><router-link to="/terms">Điều khoản</router-link></li>
          </ul>
        </div>
        
        <div class="col-lg-3 col-md-4">
          <h6 class="fw-bold mb-3 text-white">Hỗ trợ</h6>
          <ul class="list-unstyled footer-links">
            <li><router-link to="/terms">Trung tâm trợ giúp</router-link></li>
            <li><router-link to="/terms">Hướng dẫn mượn sách</router-link></li>
            <li><router-link to="/terms">Báo cáo sự cố</router-link></li>
          </ul>
        </div>
        
        <div class="col-lg-3 col-md-4">
          <h6 class="fw-bold mb-3 text-white">Theo dõi chúng tôi</h6>
          <div class="d-flex gap-3 fs-5">
            <a href="#" class="text-white"><i class="bi bi-facebook"></i></a>
            <a href="#" class="text-white"><i class="bi bi-instagram"></i></a>
            <a href="#" class="text-white"><i class="bi bi-linkedin"></i></a>
          </div>
          <br>
          <h6 class="mb-3 text-white">Hotline: 0923521277</h6>
          <h6 class="mb-3 text-white">Địa chỉ: KTX B Đại học Cần Thơ</h6>
        </div>
      </div>
      
      <hr class="my-2 border-secondary opacity-25">
      
      <div class="text-center text-white">
        <small>© 2026 UniBorrow Library. All rights reserved.</small>
      </div>
    </div>
  </footer>
</template>

<script setup>
</script>

<style scoped>
.footer {
  background-color: #0c1421 !important;
}

.footer-links li {
  margin-bottom: 0.5rem;
}

.footer-links a {
  color: #adb5bd;
  text-decoration: none;
  transition: color 0.3s ease;
}

.footer-links a:hover {
  color: var(--secondary-color);
}
</style>
