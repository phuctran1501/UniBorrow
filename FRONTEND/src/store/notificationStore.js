import { defineStore } from 'pinia';

export const useNotificationStore = defineStore('notification', {
  state: () => ({
    messages: [] 
  }),

  actions: {
    add(text, type = 'success') {
      const id = Date.now(); 
      this.messages.push({ id, text, type });
      
      setTimeout(() => this.remove(id), 3000);
    },
    remove(id) {
      this.messages = this.messages.filter(m => m.id !== id);
    }
  }
});
