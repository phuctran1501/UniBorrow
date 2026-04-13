import { defineStore } from 'pinia';
import api from '../services/api';

export const useAuthStore = defineStore('auth', {
  state: () => {
    let user = null;
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser && storedUser !== 'undefined') {
        user = JSON.parse(storedUser);
      }
    } catch (e) {
      console.error('Error parsing user from localStorage', e);
    }
    
    return {
      user,
      token: localStorage.getItem('token') || null,
      role: localStorage.getItem('role') || null,
    };
  },
  getters: {
    isAuthenticated: (state) => !!state.token,
    isAdmin: (state) => state.role?.toLowerCase() === 'admin',
    isStaff: (state) => {
      const r = state.role?.toLowerCase() || '';
      return r === 'admin' || r === 'nhân viên' || r === 'nhanvien';
    },
  },
  actions: {
    async login(email, password, type = 'docgia') {
      try {
        const endpoint = type === 'docgia' ? '/docgia/login' : '/nhanvien/login';
        const { data } = await api.post(endpoint, { Email: email, Password: password });
        
        this.token = data.token;
        this.user = data;
        this.role = data.ChucVu || 'DocGia';
        
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data));
        localStorage.setItem('role', this.role);
        
        return { success: true };
      } catch (error) {
        return { 
          success: false, 
          message: error.response?.data?.message || 'Đăng nhập không thành công. Vui lòng kiểm tra lại thông tin.' 
        };
      }
    },
    async socialLogin(userData) {
      try {
        const { data } = await api.post('/docgia/social-login', userData);
        
        this.token = data.token;
        this.user = data;
        this.role = data.ChucVu || 'DocGia';
        
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data));
        localStorage.setItem('role', this.role);
        
        return { success: true };
      } catch (error) {
        return { 
          success: false, 
          message: error.response?.data?.message || 'Đăng nhập mạng xã hội thất bại.' 
        };
      }
    },
    logout() {
      this.user = null;
      this.token = null;
      this.role = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('role');
    }
  }
});
