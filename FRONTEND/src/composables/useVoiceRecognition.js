import { ref } from 'vue';

export function useVoiceRecognition(onResultCallback) {
  const isListening = ref(false);
  let recognition = null;

  const toggleVoiceSearch = () => {
    if (!recognition) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognition = new SpeechRecognition();
        recognition.lang = 'vi-VN';
        recognition.continuous = false;
        recognition.interimResults = false;

        recognition.onstart = () => {
          isListening.value = true;
        };

        recognition.onend = () => {
          isListening.value = false;
        };
        
        recognition.onresult = (event) => {
          const transcript = event.results[0][0].transcript;
          if (onResultCallback) {
            onResultCallback(transcript);
          }
        };

        recognition.onerror = (event) => {
          console.error('Lỗi nhận dạng giọng nói:', event.error);
          isListening.value = false;
        };
      } else {
        alert('Trình duyệt của bạn không hỗ trợ tính năng Web Speech API.');
      }
    }

    if (recognition) {
      if (isListening.value) {
        recognition.stop();
      } else {
        recognition.start();
      }
    }
  };

  return {
    isListening,
    toggleVoiceSearch
  };
}
