import { ref } from 'vue'

const toasts = ref([])
let nextId = 0

export function useToast() {
  function show(msg, type = 'success', duration = 2500) {
    const id = ++nextId
    toasts.value.push({ id, msg, type })
    setTimeout(() => {
      toasts.value = toasts.value.filter(t => t.id !== id)
    }, duration)
  }

  function success(msg) { show(msg, 'success') }
  function error(msg) { show(msg, 'error') }

  return { toasts, show, success, error }
}
