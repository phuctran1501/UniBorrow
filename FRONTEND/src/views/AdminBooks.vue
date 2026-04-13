<template>
  <div class="fade-in">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h3 class="fw-bold text-primary mb-0">Quản lý sách</h3>
      <button class="btn btn-primary rounded-pill px-4 fw-bold shadow-sm" @click="showModal = true; isEditing = false; resetForm()">
        <i class="bi bi-plus-lg me-2"></i> Thêm sách mới
      </button>
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

    <!-- Phân trang cho Admin -->
    <div v-if="bookStore.totalPages > 1" class="d-flex justify-content-center align-items-center mb-5 gap-3">
      <button 
        class="btn btn-outline-primary rounded-pill px-4 fw-bold shadow-sm"
        :disabled="bookStore.currentPage === 1"
        @click="goToPage(bookStore.currentPage - 1)"
      >
        <i class="bi bi-chevron-left"></i>
      </button>
      
      <span class="fw-bold">Trang {{ bookStore.currentPage }} / {{ bookStore.totalPages }}</span>
      
      <button 
        class="btn btn-outline-primary rounded-pill px-4 fw-bold shadow-sm"
        :disabled="bookStore.currentPage === bookStore.totalPages"
        @click="goToPage(bookStore.currentPage + 1)"
      >
        <i class="bi bi-chevron-right"></i>
      </button>
    </div>

    <Teleport to="body">
      <div v-if="showModal" class="modal-backdrop fade show" style="z-index: 1060;"></div>
      <div v-if="showModal" class="modal fade show d-block" tabindex="-1" style="z-index: 1070;">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content border-0 shadow-lg rounded-4">
            <div class="modal-header border-0 p-4 pb-0">
              <h5 class="modal-title fw-bold text-primary">{{ isEditing ? 'Cập nhật sách' : 'Thêm sách mới' }}</h5>
              <button type="button" class="btn-close shadow-none" @click="showModal = false"></button>
            </div>
            <div class="modal-body p-4">
              <form @submit.prevent="handleSubmit">
                <div class="mb-3">
                  <label class="form-label fw-medium">Tên sách</label>
                  <input type="text" class="form-control rounded-3 border-2" v-model="form.TenSach" required>
                </div>
                 <div class="row g-3 mb-3">
                   <div class="col-md-6">
                     <label class="form-label fw-medium">Tác giả</label>
                     <input type="text" class="form-control rounded-3 border-2" v-model="form.TacGia" placeholder="Chưa xác định">
                   </div>
                   <div class="col-md-6">
                     <label class="form-label fw-medium">Thể loại</label>
                     <select class="form-select rounded-3 border-2" v-model="form.TheLoai">
                       <option value="Chưa xác định">Chọn thể loại</option>
                       <option v-for="genre in genres" :key="genre" :value="genre">{{ genre }}</option>
                     </select>
                   </div>
                 </div>
                 <div class="row g-3 mb-3">
                   <div class="col-md-4">
                     <label class="form-label fw-medium">Năm xuất bản</label>
                     <input type="number" class="form-control rounded-3 border-2" v-model="form.NamXuatBan">
                   </div>
                   <div class="col-md-4">
                     <label class="form-label fw-medium">Số quyển</label>
                     <input type="number" class="form-control rounded-3 border-2" v-model="form.SoQuyen" required>
                   </div>
                   <div class="col-md-4">
                     <label class="form-label fw-medium">Đơn giá (VNĐ)</label>
                     <input type="number" class="form-control rounded-3 border-2" v-model="form.DonGia" required min="0" step="1000">
                   </div>
                 </div>
                 <div class="mb-3">
                   <label class="form-label fw-medium">Nhà xuất bản</label>
                   <select class="form-select rounded-3 border-2" v-model="form.MaNXB">
                     <option value="">Chưa xác định</option>
                     <option v-for="nxb in adminStore.publishers" :key="nxb._id" :value="nxb._id">
                       {{ nxb.TenNXB }}
                     </option>
                   </select>
                 </div>
                <div class="mb-4">
                  <label class="form-label fw-medium">Hình ảnh sách</label>
                  <div class="upload-area rounded-4 border-2 border-dashed p-4 text-center cursor-pointer mb-2" @click="$refs.fileInput.click()">
                    <div v-if="!form.HinhAnh">
                      <i class="bi bi-cloud-arrow-up fs-1 text-primary mb-2"></i>
                      <p class="small text-muted mb-0">Nhấn để tải ảnh lên từ máy tính</p>
                    </div>
                    <div v-else class="preview-wrapper position-relative">
                      <img :src="form.HinhAnh" class="img-fluid rounded-3 shadow-sm mb-2" style="max-height: 150px;">
                      <button type="button" class="btn btn-sm btn-danger rounded-circle position-absolute top-0 end-0 m-1" @click.stop="form.HinhAnh = ''">
                        <i class="bi bi-x"></i>
                      </button>
                    </div>
                  </div>
                  <input type="file" ref="fileInput" class="d-none" accept="image/*" @change="handleFileUpload">
                </div>
                <div class="mb-4">
                  <label class="form-label fw-medium">Mô tả sách</label>
                  <textarea class="form-control rounded-3 border-2" v-model="form.MoTa" rows="3" placeholder="Nhập mô tả ngắn về sách..."></textarea>
                </div>
                <button class="btn btn-primary w-100 rounded-3 py-2 fw-bold shadow-sm" type="submit" :disabled="loading">
                  {{ loading ? 'Đang lưu...' : (isEditing ? 'Lưu thay đổi' : 'Thêm sách') }}
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
  bookStore.fetchBooks('', false, [], [], page);
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
    bookStore.fetchBooks(); // Tải lại danh sách sách
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
