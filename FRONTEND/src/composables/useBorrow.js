import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useBookStore } from '../store/bookStore';
import { useAuthStore } from '../store/authStore';
import { useNotificationStore } from '../store/notificationStore';

export function useBorrow(onSuccessCallback) {
  const router = useRouter();
  const bookStore = useBookStore();
  const authStore = useAuthStore();
  const notifStore = useNotificationStore();

  const borrowingId = ref(null);
  const quantities = reactive({});

  const getQuantity = (bookId) => quantities[bookId] || 1;
  
  const setQuantity = (bookId, val) => {
    quantities[bookId] = val;
  };
  
  const resetQuantities = (books) => {
    books.forEach(b => {
      quantities[b._id] = 1;
    });
  };

  const onBorrow = async (book) => {
    const quantity = getQuantity(book._id);
    
    if (!authStore.isAuthenticated) {
      notifStore.add('Vui lòng đăng nhập để mượn sách', 'error');
      router.push('/login');
      return;
    }
    
    borrowingId.value = book._id;
    let successCount = 0;
    let lastMessage = '';

    for (let i = 0; i < quantity; i++) {
      const result = await bookStore.borrowBook(book._id);
      if (result.success) {
        successCount++;
        lastMessage = result.message;
      } else {
        lastMessage = result.message;
        break; 
      }
    }

    if (successCount > 0) {
      const msg = successCount > 1 ? `Đã đăng ký mượn ${successCount} quyển thành công` : lastMessage;
      notifStore.add(msg, 'success');
      
      if (onSuccessCallback) {
        await onSuccessCallback();
      }
    } else {
      notifStore.add(lastMessage || 'Lỗi khi mượn sách', 'error');
    }
    
    borrowingId.value = null;
  };

  return {
    borrowingId,
    quantities,
    getQuantity,
    setQuantity,
    resetQuantities,
    onBorrow
  };
}
