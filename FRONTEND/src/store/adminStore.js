import { defineStore } from 'pinia';
import api from '../services/api';

export const useAdminStore = defineStore('admin', {
  state: () => ({
    borrows: [],    // toàn bộ lịch sử và trạng thái mượn trả sách
    users: [],      // Danh sách người dùng hệ thống để quản lý tài khoản
    staff: [],      // Danh sách nhân viên
    publishers: [], // Danh mục Nhà xuất bản
    loading: false, // Flag để hiển thị các hiệu ứng chờ 
    error: null     // Lưu giữ thông báo lỗi phát sinh từ server
  }),

  actions: {
    async fetchAllBorrows() {
      this.loading = true;
      try {
        const { data } = await api.get('/sach/all-borrows');
        this.borrows = data; 
      } catch (error) {
        this.error = 'Không thể tải danh sách phiếu mượn';
      } finally {
        this.loading = false; 
      }
    },
    async approveBorrow(id) {
      try {
        await api.put(`/sach/approve/${id}`);
        return { success: true };
      } catch (error) {
        return { success: false, message: error.response?.data?.message || 'Lỗi khi duyệt' };
      }
    },
    async rejectBorrow(id) {
      try {
        await api.put(`/sach/reject/${id}`);
        return { success: true };
      } catch (error) {
        return { success: false, message: error.response?.data?.message || 'Lỗi khi từ chối' };
      }
    },
    async returnBook(id) {
      try {
        await api.put(`/sach/return/${id}`);
        return { success: true };
      } catch (error) {
        return { success: false, message: error.response?.data?.message || 'Lỗi khi xử lý trả sách' };
      }
    },
    async fetchAllUsers() {
      this.loading = true;
      try {
        const { data } = await api.get('/docgia');
        this.users = data;
      } catch (error) {
        this.error = 'Không thể tải danh sách người dùng';
      } finally {
        this.loading = false;
      }
    },
    async toggleUserStatus(id) {
      try {
        const { data } = await api.put(`/docgia/toggle-status/${id}`);
        return { success: true, message: data.message };
      } catch (error) {
        return { success: false, message: error.response?.data?.message || 'Lỗi hệ thống khi đổi trạng thái' };
      }
    },
    async fetchAllStaff() {
      this.loading = true;
      try {
        const { data } = await api.get('/nhanvien');
        this.staff = data;
      } catch (error) {
        this.error = 'Không thể tải danh sách nhân viên';
      } finally {
        this.loading = false;
      }
    },
    async createStaff(form) {
      try {
        await api.post('/nhanvien', form);
        return { success: true };
      } catch (error) {
        return { success: false, message: error.response?.data?.message || 'Lỗi khi tạo nhân viên' };
      }
    },
    async deleteStaff(id) {
      try {
        await api.delete(`/nhanvien/${id}`);
        return { success: true };
      } catch (error) {
        return { success: false, message: error.response?.data?.message || 'Lỗi khi xóa nhân viên' };
      }
    },
    async createBook(form) {
      try {
        await api.post('/sach', form);
        return { success: true };
      } catch (error) {
        return { success: false, message: error.response?.data?.message || 'Lỗi khi thêm sách' };
      }
    },
    async updateBook(id, form) {
      try {
        await api.put(`/sach/${id}`, form);
        return { success: true };
      } catch (error) {
        return { success: false, message: error.response?.data?.message || 'Lỗi khi cập nhật' };
      }
    },
    async deleteBook(id) {
      try {
        await api.delete(`/sach/${id}`);
        return { success: true };
      } catch (error) {
        return { success: false, message: error.response?.data?.message || 'Lỗi khi xóa sách' };
      }
    },
    async fetchPublishers() {
      try {
        const { data } = await api.get('/nhaxuatban');
        this.publishers = data;
      } catch (error) {
        console.error('Lỗi khi tải NXB');
      }
    },
    async createPublisher(form) {
      try {
        await api.post('/nhaxuatban', form);
        return { success: true };
      } catch (error) {
        return { success: false, message: error.response?.data?.message || 'Lỗi khi tạo NXB' };
      }
    },
    async updatePublisher(id, form) {
      try {
        await api.put(`/nhaxuatban/${id}`, form);
        return { success: true };
      } catch (error) {
        return { success: false, message: error.response?.data?.message || 'Lỗi khi cập nhật NXB' };
      }
    },
    async deletePublisher(id) {
      try {
        await api.delete(`/nhaxuatban/${id}`);
        return { success: true };
      } catch (error) {
        return { success: false, message: error.response?.data?.message || 'Lỗi khi xóa NXB' };
      }
    }
  }
});
