<template>
  <div class="fade-in">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h3 class="fw-bold text-primary mb-0">Quản lý sách</h3>
      <button class="btn btn-primary rounded-pill px-4 fw-bold shadow-sm" @click="showModal = true; isEditing = false; resetForm()">
        <i class="bi bi-plus-lg me-2"></i> Thêm sách mới
      </button>
    </div>
    
    <div class="row mb-4">
      <div class="col-md-6 col-lg-4">
        <div class="search-box position-relative">
          <i class="bi bi-search position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"></i>
          <input 
            type="text" 
            class="form-control rounded-pill ps-5 py-2 border shadow-sm" 
            placeholder="Tìm kiếm tên sách, tác giả..."
            v-model="searchQuery"
          >
          <button 
            v-if="searchQuery" 
            class="btn btn-link position-absolute top-50 end-0 translate-middle-y me-2 text-muted p-0 border-0 shadow-none"
            @click="searchQuery = ''"
          >
            <i class="bi bi-x-circle-fill"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- Book Table -->
    <div class="card border-0 shadow-sm rounded-4 overflow-hidden mb-5">
      <div class="table-responsive">
        <table class="table table-hover mb-0 align-middle">
          <thead class="bg-light">
            <tr>
               <th class="px-4 py-3 border-0 small text-uppercase text-muted fw-bold">Tên sách</th>
               <th class="py-3 border-0 small text-uppercase text-muted fw-bold">Thể loại</th>
               <th class="py-3 border-0 small text-uppercase text-muted fw-bold">Số lượng</th>
               <th class="py-3 border-0 small text-uppercase text-muted fw-bold">Đơn giá</th>
               <th class="py-3 border-0 small text-uppercase text-muted fw-bold text-end px-4">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="bookStore.loading">
              <td colspan="5" class="text-center py-5"><div class="spinner-border text-primary" role="status"></div></td>
            </tr>
            <tr v-else-if="bookStore.books.length === 0">
              <td colspan="5" class="text-center py-5 text-muted">Chưa có đầu sách nào trong kho.</td>
            </tr>
            <tr v-for="book in bookStore.books" :key="book._id">
               <td class="px-4 py-3 border-0 fw-bold text-dark">
                 <div>{{ book.TenSach }}</div>
                 <div class="small text-muted fw-normal">{{ book.TacGia }}</div>
               </td>
               <td class="py-3 border-0">
                 <span class="badge bg-light text-dark border fw-medium">{{ book.TheLoai || 'Chưa xác định' }}</span>
               </td>
              <td class="py-3 border-0">
                <span :class="['badge rounded-pill px-3', book.SoQuyen > 0 ? 'bg-success-subtle text-success' : 'bg-danger-subtle text-danger']">
                  {{ book.SoQuyen }} cuốn
                </span>
              </td>
              <td class="py-3 border-0">
                <span class="fw-bold text-primary">{{ new Intl.NumberFormat('vi-VN').format(book.DonGia || 0) }}đ</span>
              </td>
              <td class="py-3 border-0 text-end px-4">
                <button class="btn btn-outline-primary btn-sm rounded-pill px-3 fw-bold me-2" @click="editBook(book)">
                  Sửa
                </button>
                <button class="btn btn-outline-danger btn-sm rounded-pill px-3 fw-bold" @click="handleDelete(book._id)">
                  Xóa
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-if="bookStore.totalPages > 1" class="d-flex justify-content-center align-items-center mb-5 gap-3">
      <button 
        class="btn btn-outline-dark rounded-pill px-4 fw-bold shadow-sm"
        :disabled="bookStore.currentPage === 1"
        @click="goToPage(bookStore.currentPage - 1)"
      >
        <i class="bi bi-chevron-left"></i>
      </button>
      
      <span class="fw-bold">Trang {{ bookStore.currentPage }} / {{ bookStore.totalPages }}</span>
      
      <button 
        class="btn btn-outline-dark rounded-pill px-4 fw-bold shadow-sm"
        :disabled="bookStore.currentPage === bookStore.totalPages"
        @click="goToPage(bookStore.currentPage + 1)"
      >
        <i class="bi bi-chevron-right"></i>
      </button>
    </div>

    <Teleport to="body">
      <div v-if="showModal" class="modal-backdrop fade show" style="z-index: 1060;"></div>
      <div v-if="showModal" class="modal fade show d-block" tabindex="-1" style="z-index: 1070;">
        <div class="modal-dialog modal-dialog-centered" style="max-width: 950px;">
          <div class="modal-content border-0 shadow-lg rounded-4">
            <div class="modal-header border-0 p-3 pb-0">
              <h6 class="modal-title fw-bold text-primary">{{ isEditing ? 'Cập nhật sách' : 'Thêm sách mới' }}</h6>
              <button type="button" class="btn-close shadow-none small" @click="showModal = false" style="font-size: 0.75rem;"></button>
            </div>
            <div class="modal-body p-3">
              <form @submit.prevent="handleSubmit">
                <div class="row g-4 align-items-stretch">
                  <div class="col-lg-7 d-flex flex-column">
                    <div class="mb-4">
                      <label class="form-label fw-bold mb-2 text-dark">Tên sách</label>
                      <input type="text" class="form-control rounded-3 border-2 py-2 shadow-sm" v-model="form.TenSach" required style="font-size: 1.1rem;">
                    </div>
                    
                    <div class="row g-3 mb-4">
                       <div class="col-md-6">
                         <label class="form-label fw-bold mb-2 text-dark">Tác giả</label>
                         <input type="text" class="form-control rounded-3 border-2 py-2 shadow-sm" v-model="form.TacGia" placeholder="Chưa xác định" style="font-size: 1rem;">
                       </div>
                       <div class="col-md-6">
                         <label class="form-label fw-bold mb-2 text-dark">Thể loại</label>
                         <select class="form-select rounded-3 border-2 py-2 shadow-sm" v-model="form.TheLoai" style="font-size: 1rem;">
                           <option value="Chưa xác định">Chọn thể loại</option>
                           <option v-for="genre in genres" :key="genre" :value="genre">{{ genre }}</option>
                         </select>
                       </div>
                    </div>

                    <div class="row g-3 mb-4">
                      <div class="col-md-4">
                        <label class="form-label fw-bold mb-2 text-dark">Năm xuất bản</label>
                        <input type="number" class="form-control rounded-3 border-2 py-2 shadow-sm" v-model="form.NamXuatBan" style="font-size: 1rem;">
                      </div>
                      <div class="col-md-4">
                        <label class="form-label fw-bold mb-2 text-dark">Số quyển</label>
                        <input type="number" class="form-control rounded-3 border-2 py-2 shadow-sm" v-model="form.SoQuyen" required style="font-size: 1rem;">
                      </div>
                      <div class="col-md-4">
                        <label class="form-label fw-bold mb-2 text-dark">Đơn giá (VNĐ)</label>
                        <input type="number" class="form-control rounded-3 border-2 py-2 shadow-sm" v-model="form.DonGia" required min="0" step="1000" style="font-size: 1rem;">
                      </div>
                    </div>

                    <div class="mb-4">
                      <label class="form-label fw-bold mb-2 text-dark">Nhà xuất bản</label>
                      <select class="form-select rounded-3 border-2 py-2 shadow-sm" v-model="form.MaNXB" style="font-size: 1rem;">
                        <option value="">Chưa xác định</option>
                        <option v-for="nxb in adminStore.publishers" :key="nxb._id" :value="nxb._id">
                          {{ nxb.TenNXB }}
                        </option>
                      </select>
                    </div>

                    <div class="mt-auto pt-3">
                      <button class="btn btn-primary w-100 rounded-pill py-2 fw-bold shadow-sm" type="submit" :disabled="loading">
                        {{ loading ? 'Đang lưu...' : (isEditing ? 'Lưu thay đổi' : 'THÊM SÁCH MỚI') }}
                      </button>
                    </div>
                  </div>

                  <div class="col-lg-5">
                    <div class="mb-4">
                      <label class="form-label fw-bold mb-2 text-dark">Hình ảnh sách</label>
                      <div class="upload-area rounded-4 border-2 border-dashed p-3 text-center cursor-pointer mb-2 bg-light d-flex align-items-center justify-content-center" style="min-height: 140px;" @click="$refs.fileInput.click()">
                        <div v-if="!form.HinhAnh">
                          <i class="bi bi-cloud-arrow-up fs-1 text-primary opacity-50"></i>
                          <p class="small text-muted mb-0 mt-2">Nhấn để tải ảnh</p>
                        </div>
                        <div v-else class="preview-wrapper position-relative d-inline-block">
                          <img :src="form.HinhAnh" class="img-fluid rounded-3 shadow-lg" style="max-height: 120px;">
                          <button type="button" class="btn btn-danger rounded-circle position-absolute top-0 end-0 m-2 p-0 d-flex align-items-center justify-content-center shadow" style="width: 28px; height: 28px;" @click.stop="form.HinhAnh = ''">
                            <i class="bi bi-x fs-5"></i>
                          </button>
                        </div>
                      </div>
                      <input type="file" ref="fileInput" class="d-none" accept="image/*" @change="handleFileUpload">
                    </div>

                    <div class="mb-0">
                      <label class="form-label fw-bold mb-2 text-dark">Mô tả sách</label>
                      <textarea class="form-control rounded-3 border-2 py-2 shadow-sm" v-model="form.MoTa" rows="7" placeholder="Nhập mô tả về sách..." style="font-size: 1rem;"></textarea>
                    </div>
                  </div>
                </div>
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
import { ref, reactive, onMounted, watch } from 'vue';
import { useBookStore } from '../store/bookStore';
import { useAdminStore } from '../store/adminStore';
import { useNotificationStore } from '../store/notificationStore';
import Notification from '../components/Shared/Notification.vue';

const bookStore = useBookStore();
const adminStore = useAdminStore();
const notifStore = useNotificationStore();

const showModal = ref(false);    
const isEditing = ref(false);     
const loading = ref(false);       
const currentId = ref(null);      
const searchQuery = ref('');
let searchTimeout = null;

watch(searchQuery, (newVal) => {
  if (searchTimeout) clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    bookStore.fetchBooks(newVal, false, [], [], 1);
  }, 500);
});

const genres = [
  'Công nghệ', 
  'Kinh tế', 
  'Giáo dục', 
  'Tiểu thuyết', 
  'Văn học', 
  'Thiếu nhi'
];

const form = reactive({
  TenSach: '',
  TacGia: '',
  TheLoai: 'Chưa xác định',
  MaNXB: '',
  SoQuyen: 1,
  DonGia: 0,
  NamXuatBan: new Date().getFullYear(),
  HinhAnh: '', 
  MoTa: ''
});

const resetForm = () => {
  form.TenSach = '';
  form.TacGia = '';
  form.TheLoai = 'Chưa xác định';
  form.MaNXB = '';
  form.SoQuyen = 1;
  form.DonGia = 0;
  form.NamXuatBan = new Date().getFullYear();
  form.HinhAnh = '';
  form.MoTa = '';
};

const goToPage = (page) => {
  bookStore.fetchBooks(searchQuery.value, false, [], [], page);
};

const editBook = (book) => {
  isEditing.value = true;
  currentId.value = book._id;
  form.TenSach = book.TenSach;
  form.TacGia = book.TacGia;
  form.TheLoai = book.TheLoai || 'Chưa xác định';
  form.MaNXB = book.MaNXB?._id || book.MaNXB;
  form.SoQuyen = book.SoQuyen;
  form.DonGia = book.DonGia || 0;
  form.NamXuatBan = book.NamXuatBan;
  form.HinhAnh = book.HinhAnh || '';
  form.MoTa = book.MoTa || '';
  showModal.value = true;
};

const handleFileUpload = (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (event) => {
    form.HinhAnh = event.target.result;
  };
  reader.readAsDataURL(file);
};

const handleSubmit = async () => {
  loading.value = true;
  let result;
  
  const finalData = { ...form };
  if (!finalData.MaNXB) delete finalData.MaNXB;
  if (!finalData.TacGia) finalData.TacGia = 'Chưa xác định';
  
  if (isEditing.value) {
    result = await adminStore.updateBook(currentId.value, finalData);
  } else {
    result = await adminStore.createBook(finalData);
  }
  
  loading.value = false;
  if (result.success) {
    notifStore.add(isEditing.value ? 'Đã cập nhật sách thành công' : 'Đã thêm sách mới thành công');
    showModal.value = false;
    bookStore.fetchBooks(); 
  } else {
    notifStore.add(result.message, 'error');
  }
};

const handleDelete = async (id) => {
  if (confirm('Bạn có chắc chắn muốn xóa đầu sách này?')) {
    const result = await adminStore.deleteBook(id);
    if (result.success) {
      notifStore.add('Đã xóa sách khỏi hệ thống');
      bookStore.fetchBooks();
    } else {
      notifStore.add(result.message, 'error');
    }
  }
};

onMounted(() => {
  bookStore.fetchBooks();     
  adminStore.fetchPublishers(); 
});
</script>

<style scoped>
.modal-backdrop { opacity: 0.5; }
.bg-success-subtle { background-color: rgba(40, 167, 69, 0.1); }
.bg-danger-subtle { background-color: rgba(220, 53, 69, 0.1); }
.text-info { color: #0dcaf0 !important; }

.upload-area {
  border: 2px dashed #e2e8f0;
  transition: all 0.3s ease;
}

.upload-area:hover {
  border-color: var(--primary-color);
  background-color: rgba(31, 92, 169, 0.02);
}

.border-dashed { border-style: dashed !important; }
.cursor-pointer { cursor: pointer; }
</style>
