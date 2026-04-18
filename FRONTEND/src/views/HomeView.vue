<template>
  <div class="home-view">
    <header class="hero-section bg-white py-5 position-relative">
      <div class="container position-relative z-1">
        <div class="row align-items-center min-vh-60 py-5">
          <div class="col-lg-7 text-start">
            <h1 class="display-3 fw-bold mb-3 text-primary tracking-tight">
              Tìm kiếm kiến thức <br>
              <span class="text-secondary">tại UniBorrow</span>
            </h1>
            <p class="lead text-muted mb-5 max-w-custom">
              Khám phá hàng ngàn đầu sách học thuật, nghiên cứu và giải trí. 
              Mượn sách dễ dàng, quản lý thông minh.
            </p>
            <div class="search-container shadow-lg rounded-pill p-2 bg-white d-flex align-items-center">
              <i class="bi bi-search ms-3 fs-5 text-muted"></i>
              <input 
                type="text" 
                class="form-control border-0 shadow-none px-3" 
                placeholder="Tìm tên sách, tác giả..."
                v-model="searchQuery"
                @keyup.enter="handleSearch"
              >
              <button 
                class="btn btn-link text-muted p-0 me-2 border-0 shadow-none voice-btn"
                @click="toggleVoiceSearch"
                :class="{ 'text-danger pulse': isListening }"
                type="button"
                title="Tìm kiếm bằng giọng nói"
              >
                <i :class="isListening ? 'bi bi-mic-fill' : 'bi bi-mic'"></i>
              </button>
              <button 
                class="btn btn-primary rounded-pill px-4 py-2 fw-bold ms-2 text-nowrap"
                @click="handleSearch"
                style="min-width: 140px;"
              >
                Tìm kiếm
              </button>
            </div>
          </div>
        
          <div class="col-lg-5 d-none d-lg-block">
            <div class="hero-image-wrapper text-end">
              <img :src="libraryImg" alt="Library" class="img-fluid hero-img">
            </div>
          </div>
        </div>
      </div>
    </header>

    <section class="stats-row bg-white border-bottom border-secondary border-opacity-10">
      <div class="container">
        <div class="row justify-content-center text-center g-0">
          <div v-for="(stat, index) in stats" :key="index" class="col-6 col-md-4">
            <div class="snum-wrap">
              <strong class="snum">{{ stat.value }}</strong>
              <span class="slbl">{{ stat.label }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="quote-section py-5">
      <div class="container position-relative z-1 text-center">
        <div class="quote-content py-5">
          <i class="bi bi-quote fs-1 text-primary opacity-25 mb-4 d-block"></i>
          <h2 class="quote-text display-6 fw-bold mb-4 px-lg-5">
            "Việc đọc rất quan trọng. Nếu bạn biết cách đọc, <br class="d-none d-md-block"> cả thế giới sẽ mở ra cho bạn."
          </h2>
          <div class="quote-author-wrap d-flex align-items-center justify-content-center gap-3">
            <div class="line w-30px bg-primary opacity-50" style="height: 2px;"></div>
            <span class="quote-author fw-bold text-primary tracking-widest text-uppercase small">Barack Obama</span>
            <div class="line w-30px bg-primary opacity-50" style="height: 2px;"></div>
          </div>
        </div>
      </div>
    </section>

    <section class="recent-books-section py-5">
      <div class="container">

        <div class="d-flex justify-content-between align-items-center mb-4">
          <div class="d-flex align-items-center gap-2">
            <i class="bi bi-book-fill text-primary fs-5"></i>
            <h3 class="fw-bold text-dark mb-0">Sách mới cập nhật</h3>
          </div>
          <router-link to="/library" class="text-primary text-decoration-none fw-medium small">
            Xem tất cả <i class="bi bi-arrow-right ms-1"></i>
          </router-link>
        </div>

        <div v-if="loadingRecent" class="text-center py-5">
          <div class="spinner-border text-primary spinner-border-sm" role="status"></div>
        </div>

        <div v-else class="row g-3 row-cols-2 row-cols-md-3 row-cols-lg-6">
          <div v-for="book in bookStore.recentBooks" :key="book._id" class="col">
            <div class="new-book-card h-100 bg-white rounded-3 shadow-sm border p-2 text-center transition-up">

              <div class="book-cover-mini mb-2 rounded-2 overflow-hidden shadow-sm">
                <img :src="book.HinhAnh" :alt="book.TenSach" class="img-fluid">
              </div>

              <h6 class="book-title-mini fw-bold text-dark mb-0 text-truncate px-1">{{ book.TenSach }}</h6>
              <p class="x-small text-muted mb-2 text-truncate px-1">{{ book.TacGia }}</p>

              <router-link
                :to="{ name: 'book-details', params: { id: book._id } }"
                class="btn btn-sm btn-primary rounded-pill w-100 py-1 fw-bold"
                style="font-size: 0.65rem;"
              >Xem ngay</router-link>

            </div>
          </div>
        </div>

      </div>
    </section>

    <section class="news-faq-section py-5 bg-white">
      <div class="container">
        <div class="row g-5">

          <div class="col-lg-7">
            <div class="d-flex align-items-center gap-2 mb-4">
              <i class="bi bi-megaphone-fill text-primary fs-5"></i>
              <h3 class="fw-bold text-dark mb-0">Bản tin</h3>
            </div>
            <div class="row g-3">
              <div
                v-for="(news, index) in libraryNews"
                :key="index"
                class="col-12 col-md-6"
              >
                <div class="news-item h-100 p-3 rounded-4 border bg-white shadow-sm cursor-pointer">
                  <div class="d-flex align-items-center gap-2 mb-2">
                    <span
                      class="badge rounded-pill x-small"
                      :class="news.tagColor || 'bg-primary'"
                      style="font-size: 0.6rem;"
                    >{{ news.tag }}</span>
                    <span class="x-small text-muted">{{ news.date }}</span>
                  </div>

                  <h6 class="fw-bold text-dark mb-1 small">{{ news.title }}</h6>
                  <p class="x-small text-muted mb-0 lh-sm">{{ news.desc }}</p>

                </div>
              </div>
            </div>

          </div>

          <div class="col-lg-5">
            <div class="d-flex align-items-center gap-2 mb-4">
              <i class="bi bi-patch-question-fill text-primary fs-5"></i>
              <h3 class="fw-bold text-dark mb-0">Câu hỏi thường gặp</h3>
            </div>
            <div class="accordion" id="faqAccordion">
              <div
                v-for="(faq, index) in faqs"
                :key="index"
                class="faq-item mb-2"
              >
                <button
                  class="faq-btn w-100 d-flex justify-content-between align-items-center p-3 border-0 rounded-4 text-start fw-bold"
                  type="button"
                  :data-bs-toggle="'collapse'"
                  :data-bs-target="'#faq-' + index"
                  :aria-expanded="index === 0"
                  :aria-controls="'faq-' + index"
                >
                  <span class="small">{{ faq.q }}</span>
                  <i class="bi bi-plus-lg faq-icon flex-shrink-0 ms-2"></i>
                </button>
                <div
                  :id="'faq-' + index"
                  class="accordion-collapse collapse"
                  :class="{ show: index === 0 }"
                  data-bs-parent="#faqAccordion"
                >
                  <div class="faq-body px-3 pb-3 pt-0 text-muted x-small lh-lg">
                    {{ faq.a }}
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </div>
    </section>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useBookStore } from '../store/bookStore';
import { useVoiceRecognition } from '../composables/useVoiceRecognition';
import libraryImg from '../assets/library.png';

const searchQuery = ref('');
const router = useRouter();
const bookStore = useBookStore();
const loadingRecent = ref(true);

const stats = [
  { value: '10,000+', label: 'Đầu sách đa dạng' },
  { value: '5,000+',  label: 'Lượt mượn thành công' },
  { value: '2,000+',  label: 'Truy cập mỗi ngày' }
];

const openingHours = [
  { day: 'Thứ Hai – Thứ Sáu', time: '07:30 – 21:00' },
  { day: 'Thứ Bảy',           time: '08:00 – 17:00' },
  { day: 'Chủ Nhật',          time: 'Đóng cửa', closed: true }
];

const contactInfo = [
  { icon: 'bi-geo-alt-fill',   label: 'Địa chỉ',    value: '01 Đường Võ Văn Ngân, Thủ Đức, TP. Hồ Chí Minh' },
  { icon: 'bi-telephone-fill', label: 'Điện thoại',  value: '(028) 3896 8641' },
  { icon: 'bi-envelope-fill',  label: 'Email',       value: 'library@UniBorrow.edu.vn' }
];

const faqs = [
  {
    q: 'Tôi có thể mượn tối đa bao nhiêu cuốn sách?',
    a: 'Mỗi sinh viên có thể mượn tối đa 5 cuốn sách cùng một lúc. Thời hạn mượn mặc định là 7 ngày kể từ ngày mượn.'
  },
  {
    q: 'Phí trễ hạn trả sách được tính như thế nào?',
    a: 'Phí trễ hạn là 10,000 VNĐ/cuốn/ngày. Nếu quá 30 ngày chưa trả, tài khoản sẽ bị khóa vĩnh viễn.'
  },
  {
    q: 'Làm thế nào để mượn sách?',
    a: 'Đăng nhập vào UniBorrow, vào mục "Thư viện sách" và chọn sách mong muốn được mượn. Chúc bạn may mắn nhé!'
  }
];

const libraryNews = [
  {
    tag: 'Thông báo', tagColor: 'bg-primary',
    date: '12/04',
    title: 'Nâng cấp phòng đọc tự học',
    desc: 'Bổ sung 50 chỗ ngồi và hệ thống ổ cắm điện mới tại tầng 2.'
  },
  {
    tag: 'Sự kiện', tagColor: 'bg-success',
    date: '15/04',
    title: 'Ngày hội đổi sách cũ lấy sách mới',
    desc: 'Tham gia giao lưu và sở hữu những tựa sách hấp dẫn hoàn toàn miễn phí.'
  },
  {
    tag: 'Công nghệ', tagColor: 'bg-secondary',
    date: '20/04',
    title: 'Ra mắt ứng dụng UniBorrow Mobile',
    desc: 'Trải nghiệm mượn sách mượt mà ngay trên điện thoại của bạn.'
  },
  {
    tag: 'Học thuật', tagColor: 'bg-info',
    date: '22/04',
    title: 'Tọa đàm "Kỹ năng đọc hiểu nâng cao"',
    desc: 'Giảng viên khoa Giáo dục chia sẻ phương pháp đọc sách hiệu quả cho sinh viên.'
  }
];

const { isListening, toggleVoiceSearch } = useVoiceRecognition((transcript) => {
  searchQuery.value = transcript;
  handleSearch(); 
});

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    router.push({ name: 'library', query: { q: searchQuery.value } });
  }
};

onMounted(async () => {
  await bookStore.fetchRecentBooks();
  loadingRecent.value = false;
});
</script>

<style scoped>
.hero-section {
  background-color: #f8fafc !important;
}

.max-w-custom {
  max-width: 600px;
}

.search-container {
  max-width: 650px;
}

.hero-img {
  max-height: 450px;
  width: auto;
  object-fit: contain;
}


.icon-box {
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
}

.min-vh-60 {
  min-height: 60vh;
}

.quote-section {
  background: #ffffff;
}

.quote-text {
  color: #1e293b;
  line-height: 1.4;
  letter-spacing: -0.02em;
}

.tracking-widest {
  letter-spacing: 0.2em;
}

.w-30px {
  width: 30px;
}

.opacity-05 {
  opacity: 0.05;
}

.new-book-card {
  transition: all 0.3s ease;
}

.book-cover-mini {
  height: 90px; 
  background: #f1f5f9;
}

@media (min-width: 992px) {
  .row-cols-lg-7 > * {
    flex: 0 0 auto;
    width: 14.2857%;
  }
}

.book-cover-mini img {
  height: 100%;
  width: 100%;
  object-fit: cover;
}

.book-title-mini {
  font-size: 0.72rem; 
}

.x-small {
  font-size: 0.7rem;
}

.cursor-pointer {
  cursor: pointer;
}

.transition-up:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0,0,0,0.1) !important;
}

.news-item {
  transition: all 0.3s ease;
}

.news-item:hover {
  background: white !important;
  border-color: var(--primary-color) !important;
}


.stats-row {
  padding: 0.25rem 0;
}

.snum-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1.5rem 1rem;
  gap: 0.3rem;
}

.snum {
  font-size: 1.85rem;
  font-weight: 800;
  letter-spacing: -0.03em;
  color: var(--primary-color);
  line-height: 1;
}

.slbl {
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #9ca3af;
}

@media (max-width: 576px) {
  .snum  { font-size: 1.5rem; }
  .snum-wrap { padding: 1.25rem 0.5rem; }
}

.info-section {
  background-color: #fff;
}

.info-card {
  background-color: #f8fafc;
  border: 1px solid #f1f5f9;
}

.info-icon-wrap {
  width: 42px;
  height: 42px;
  min-width: 42px;
}

.contact-icon-wrap {
  width: 32px;
  height: 32px;
  min-width: 32px;
}

.hours-row {
  border-bottom: 1px solid #f1f5f9;
}
.hours-row:last-child {
  border-bottom: none;
}

.section-header h2 {
  font-size: 1.6rem;
}

.faq-section {
  background-color: #f8fafc !important;
}

.faq-btn {
  background-color: #ffffff;
  color: #1a202c;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background-color 0.2s ease, color 0.2s ease;
}

.faq-btn[aria-expanded="true"] {
  background-color: rgba(var(--primary-rgb), 0.07);
  color: var(--primary-color);
  border-radius: 1rem 1rem 0 0 !important;
}

.faq-btn[aria-expanded="true"] .faq-icon {
  transform: rotate(45deg);
}

.faq-icon {
  transition: transform 0.25s ease;
  font-size: 0.9rem;
  color: var(--primary-color);
}

.faq-item {
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 1px 4px rgba(0,0,0,0.05);
}

.faq-body {
  background-color: rgba(var(--primary-rgb), 0.04);
}
</style>
