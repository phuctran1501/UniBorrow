import { defineStore } from 'pinia';
import api from '../services/api';

export const useBookStore = defineStore('book', {
  state: () => ({
    books: [],       
    totalBooks: 0,   
    totalPages: 1,    
    currentPage: 1,  
    recentBooks: [],  
    publishers: [],   
    currentBook: null, 
    loading: false,   
    error: null,
    favorites: []      
  }),

  actions: {
    async fetchPublishers() {
      try {
        const { data } = await api.get('/nhaxuatban');
        this.publishers = data;
      } catch (error) {
        console.error('Lỗi khi tải danh sách NXB:', error);
      }
    },
    async fetchRecentBooks() {
      try {
        const { data } = await api.get('/sach/recent');
        this.recentBooks = data;
      } catch (error) {
        console.error('Lỗi khi tải sách mới cập nhật:', error);
      }
    },
    async fetchBooks(keyword = '', available = false, publisherIds = [], genreList = [], page = 1) {
      this.loading = true;
      try {
        const params = { 
          keyword, 
          available,
          page 
        };
        
        if (publisherIds && publisherIds.length > 0) {
          params.publisherId = Array.isArray(publisherIds) ? publisherIds.join(',') : publisherIds;
        }
        if (genreList && genreList.length > 0) {
          params.theLoai = Array.isArray(genreList) ? genreList.join(',') : genreList;
        }

        const { data } = await api.get(`/sach`, { params });
        
        this.books = data.books || [];
        this.totalBooks = data.totalBooks || 0;
        this.totalPages = data.totalPages || 1;
        this.currentPage = data.currentPage || 1;
      } catch (error) {
        this.error = error.response?.data?.message || 'Không thể tải danh sách sách';
        this.books = [];
      } finally {
        this.loading = false;
      }
    },
    async fetchBookById(id) {
      this.loading = true;
      this.currentBook = null;
      try {
        const { data } = await api.get(`/sach/${id}`);
        this.currentBook = data;
      } catch (error) {
        this.error = error.response?.data?.message || 'Không thể tải thông tin sách';
        console.error('Lỗi khi tải chi tiết sách:', error);
      } finally {
        this.loading = false;
      }
    },
    async borrowBook(sachId) {
      try {
        const { data } = await api.post(`/sach/borrow/${sachId}`);
        return { success: true, message: data.message };
      } catch (error) {
        return { 
          success: false, 
          message: error.response?.data?.message || 'Không thể đăng ký mượn sách' 
        };
      }
    },
    async fetchFavorites() {
      this.loading = true;
      try {
        const { data } = await api.get('/yeuthich');
        this.favorites = data;
      } catch (error) {
        console.error('Lỗi khi tải danh sách yêu thích:', error);
      } finally {
        this.loading = false;
      }
    },
    async toggleFavorite(sachId) {
      try {
        const { data } = await api.post(`/yeuthich/toggle/${sachId}`);
        // Refresh favorites list if we are on favorites page
        await this.fetchFavorites();
        return { success: true, isFavorite: data.isFavorite, message: data.message };
      } catch (error) {
        return { 
          success: false, 
          message: error.response?.data?.message || 'Không thể thực hiện yêu thích' 
        };
      }
    },
    async checkIsFavorite(sachId) {
      try {
        const { data } = await api.get(`/yeuthich/check/${sachId}`);
        return data.isFavorite;
      } catch (error) {
        return false;
      }
    }
  }
});
