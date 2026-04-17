<template>
  <div 
    class="ai-chatbot-container"
    :style="{ bottom: dragPosition.y + 'px', right: dragPosition.x + 'px' }"
    :class="{ 'dragging': isDragging }"
    @mousedown="startDrag"
  >
    <button 
      class="fab-btn shadow-lg" 
      :class="{ 'active': isOpen }"
      @click="toggleChat"
      title="Khéo thả để thay đổi vị trí"
    >
      <i v-if="!isOpen" class="bi bi-robot fs-4"></i>
      <i v-else class="bi bi-x-lg fs-4"></i>
    </button>

    <div v-if="isOpen" class="chat-window shadow-lg animate__animated animate__fadeInUp" :style="windowStyles">
      <div 
        class="chat-header d-flex justify-content-between align-items-center p-3 bg-primary text-white rounded-top-4"
        @mousedown.stop="startDrag"
      >
        <div class="d-flex align-items-center gap-2">
          <div class="avatar-bg bg-white rounded-circle d-flex align-items-center justify-content-center" style="width: 32px; height: 32px;">
            <i class="bi bi-robot text-primary"></i>
          </div>
          <div>
            <h6 class="mb-0 fw-bold small">AI Librarian</h6>
            <span class="x-small opacity-75">Tư vấn chọn sách 24/7</span>
          </div>
        </div>
        <button class="btn btn-link text-white p-0" @click="isOpen = false">
          <i class="bi bi-dash-lg"></i>
        </button>
      </div>

      <div class="chat-body p-3 custom-scrollbar" ref="messageContainer">
        <div v-if="messages.length === 0" class="welcome-text text-center py-4">
          <p class="small text-muted mb-0">Xin chào! Tôi là trợ lý ảo của UniBorrow. Bạn cần tìm sách gì hôm nay?</p>
        </div>

        <div v-for="(msg, index) in messages" :key="index" class="message-wrapper mb-3" :class="msg.role">
          <div class="message-bubble p-3 rounded-4 shadow-sm" :class="msg.role">
            <div v-if="msg.role === 'ai'" v-html="renderMarkdown(msg.content)" class="markdown-content"></div>
            <div v-else>{{ msg.content }}</div>
          </div>
          <span class="x-small text-muted mt-1 px-2 d-block">{{ formatTime(msg.timestamp) }}</span>
        </div>

        <div v-if="isLoading" class="message-wrapper ai mb-3">
          <div class="message-bubble ai p-3 rounded-4 shadow-sm">
            <div class="typing-indicator">
              <span></span><span></span><span></span>
            </div>
          </div>
        </div>
      </div>

      <div class="chat-footer p-3 border-top bg-light rounded-bottom-4">
        <form @submit.prevent="sendMessage" class="d-flex gap-2">
          <input 
            v-model="inputMessage" 
            type="text" 
            class="form-control rounded-pill border-0 shadow-sm px-3" 
            placeholder="Nhập câu hỏi tại đây..."
            :disabled="isLoading"
          >
          <button 
            type="submit" 
            class="btn btn-primary rounded-circle shadow-sm d-flex align-items-center justify-content-center" 
            style="width: 40px; height: 40px;"
            :disabled="!inputMessage.trim() || isLoading"
          >
            <i class="bi bi-send-fill"></i>
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, watch, computed } from 'vue';
import axios from 'axios';
import { marked } from 'marked';
import { useVoiceRecognition } from '../composables/useVoiceRecognition';

const isOpen = ref(false);
const isLoading = ref(false);
const inputMessage = ref('');
const messages = ref([]);
const messageContainer = ref(null);

const { isListening, toggleVoiceSearch } = useVoiceRecognition((transcript) => {
  inputMessage.value = transcript;
  sendMessage();
});

const isDragging = ref(false);
const dragPosition = ref({ x: 30, y: 30 }); 
const dragStartMouse = { x: 0, y: 0 };
const dragStartPosition = { x: 0, y: 0 };
const wasMoved = ref(false);

const startDrag = (e) => {
  if (e.button !== 0) return;
  
  isDragging.value = true;
  wasMoved.value = false;
  
  dragStartMouse.x = e.clientX;
  dragStartMouse.y = e.clientY;
  dragStartPosition.x = dragPosition.value.x;
  dragStartPosition.y = dragPosition.value.y;

  window.addEventListener('mousemove', onDrag);
  window.addEventListener('mouseup', endDrag);
};

const onDrag = (e) => {
  if (!isDragging.value) return;

  const dx = dragStartMouse.x - e.clientX;
  const dy = dragStartMouse.y - e.clientY;

  if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
    wasMoved.value = true;
  }

  let newX = dragStartPosition.x + dx;
  let newY = dragStartPosition.y + dy;

  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;
  const chatWidth = isOpen.value ? 380 : 60;
  const chatHeight = isOpen.value ? 480 : 60;

  newX = Math.max(10, Math.min(newX, windowWidth - chatWidth - 10));
  newY = Math.max(10, Math.min(newY, windowHeight - chatHeight - 10));

  dragPosition.value.x = newX;
  dragPosition.value.y = newY;
};

const endDrag = () => {
  isDragging.value = false;
  window.removeEventListener('mousemove', onDrag);
  window.removeEventListener('mouseup', endDrag);
};

const windowStyles = computed(() => {
  const styles = {};
  const thresholdX = 400;
  const thresholdY = 500;
  
  if (dragPosition.value.x > window.innerWidth - thresholdX) {
    styles.right = 'auto';
    styles.left = '0';
  } else {
    styles.right = '0';
    styles.left = 'auto';
  }

  if (dragPosition.value.y > window.innerHeight - thresholdY) {
    styles.bottom = 'auto';
    styles.top = '75px';
  } else {
    styles.bottom = '75px';
    styles.top = 'auto';
  }

  return styles;
});

const toggleChat = () => {
  if (wasMoved.value) return; 
  isOpen.value = !isOpen.value;
};

const renderMarkdown = (content) => {
  return marked.parse(content);
};

const scrollToBottom = async () => {
  await nextTick();
  if (messageContainer.value) {
    messageContainer.value.scrollTop = messageContainer.value.scrollHeight;
  }
};

watch(isOpen, (newVal) => {
  if (newVal) scrollToBottom();
});

const sendMessage = async () => {
  if (!inputMessage.value.trim() || isLoading.value) return;

  const userMsg = inputMessage.value;
  inputMessage.value = '';

  messages.value.push({
    role: 'user',
    content: userMsg,
    timestamp: new Date()
  });

  isLoading.value = true;
  await scrollToBottom();

  try {
    const aiHistory = messages.value.slice(0, -1).map(m => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.content }]
    }));

    const response = await axios.post('http://localhost:5000/api/ai/chat', {
      message: userMsg,
      history: aiHistory
    });

    messages.value.push({
      role: 'ai',
      content: response.data.reply,
      timestamp: new Date()
    });

  } catch (error) {
    messages.value.push({
      role: 'ai',
      content: 'Rất tiếc, đã có lỗi xảy ra khi kết nối với hệ thống AI. Bạn vui lòng thử lại sau nhé!',
      timestamp: new Date()
    });
  } finally {
    isLoading.value = false;
    await scrollToBottom();
  }
};

const formatTime = (date) => {
  return new Intl.DateTimeFormat('vi-VN', {
    hour: '2-digit', minute: '2-digit'
  }).format(date);
};
</script>

<style scoped>
.ai-chatbot-container {
  position: fixed;
  z-index: 9999;
  user-select: none;
  transition: bottom 0.1s ease, right 0.1s ease;
}
.ai-chatbot-container.dragging {
  transition: none;
}

.fab-btn {
  width: 55px;
  height: 55px;
  border-radius: 50%;
  background-color: var(--bs-primary); 
  color: white;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  cursor: grab;
}
.fab-btn:active {
  cursor: grabbing;
}
.chat-header {
  cursor: grab;
}
.chat-header:active {
  cursor: grabbing;
}
.fab-btn:hover {
  transform: scale(1.1);
  background-color: #0056b3;
}
.fab-btn.active {
  background-color: #6c757d;
  transform: rotate(90deg);
}

.chat-window {
  position: absolute;
  width: 380px;
  height: 480px; 
  background-color: white;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0,0,0,0.15) !important;
}

@media (max-width: 576px) {
  .chat-window {
    width: calc(100vw - 40px);
    right: -10px;
    height: 70vh;
  }
}

.chat-body {
  flex: 1;
  overflow-y: auto;
  background-color: #f0f2f5;
  padding-bottom: 20px;
}

.message-wrapper {
  display: flex;
  flex-direction: column;
  width: 100%;
}
.message-wrapper.user {
  align-items: flex-end;
}
.message-wrapper.ai {
  align-items: flex-start;
}

.message-bubble {
  max-width: 85%;
  font-size: 0.9rem;
  line-height: 1.5;
}
.message-bubble.user {
  background-color: var(--bs-primary);
  color: white;
  border-bottom-right-radius: 4px;
}
.message-bubble.ai {
  background-color: white;
  color: #1a202c;
  border-top-left-radius: 4px;
}

.markdown-content :deep(p) { margin-bottom: 0.5rem; }
.markdown-content :deep(p:last-child) { margin-bottom: 0; }
.markdown-content :deep(ul), .markdown-content :deep(ol) {
  padding-left: 1.2rem;
  margin-bottom: 0.5rem;
}
.markdown-content :deep(li) { margin-bottom: 0.2rem; }

.typing-indicator span {
  display: inline-block;
  width: 6px;
  height: 6px;
  background-color: #cbd5e0;
  border-radius: 50%;
  margin-right: 4px;
  animation: typing 1s infinite ease-in-out;
}
.typing-indicator span:nth-child(2) { animation-delay: 0.2s; }
.typing-indicator span:nth-child(3) { animation-delay: 0.4s; }

@keyframes typing {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
}

.x-small { font-size: 0.65rem; }

.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #cbd5e0;
  border-radius: 10px;
}

.voice-btn {
  transition: all 0.3s ease;
  width: 40px;
  height: 40px;
  min-width: 40px;
  min-height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50% !important;
  aspect-ratio: 1/1;
}

.voice-btn:hover {
  background-color: rgba(var(--primary-rgb), 0.05);
  color: var(--primary-color) !important;
}
</style>
