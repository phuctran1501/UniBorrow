<template>
  <Teleport to="body">
    <div class="toast-container position-fixed bottom-0 end-0 p-4" style="z-index: 2000">
      <transition-group name="toast">
        <div 
          v-for="msg in notifStore.messages" 
          :key="msg.id"
          class="toast show shadow-lg border-0 rounded-4 mb-3 overflow-hidden" 
          :class="msg.type === 'error' ? 'bg-danger text-white' : 'bg-success text-white'"
          role="alert"
        >
          <div class="d-flex align-items-center p-3">
            <i :class="['bi fs-4 me-3', msg.type === 'error' ? 'bi-exclamation-circle' : 'bi-check-circle']"></i>
            <div class="fw-medium">{{ msg.text }}</div>
            <button @click="notifStore.remove(msg.id)" type="button" class="btn-close btn-close-white ms-auto shadow-none"></button>
          </div>
        </div>
      </transition-group>
    </div>
  </Teleport>
</template>

<script setup>
import { useNotificationStore } from '../../store/notificationStore';
const notifStore = useNotificationStore();
</script>

<style scoped>
.toast-enter-active, .toast-leave-active {
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
.toast-enter-from { opacity: 0; transform: translateX(100%); }
.toast-leave-to { opacity: 0; transform: translateY(20px); }
</style>
