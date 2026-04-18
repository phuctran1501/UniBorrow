import { ref, watch, onMounted } from 'vue';

export function useViewMode(defaultMode = 'grid', storageKey = 'uniborrow-view-mode') {
  const viewMode = ref(defaultMode);

  onMounted(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      viewMode.value = saved;
    }
  });

  watch(viewMode, (newVal) => {
    localStorage.setItem(storageKey, newVal);
  });

  return {
    viewMode
  };
}
