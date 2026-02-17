<template>
  <div class="add-view fade-in">
    <h1 class="page-title">{{ isEdit ? '✎ Редактирование' : '➕ Новая запись' }}</h1>

    <TransactionForm
      :initial="initialData"
      :saving="saving"
      @submit="handleSubmit"
      @cancel="goBack"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTransactionStore } from '@/stores/transactionStore.js'
import { useToast } from '@/composables/useToast.js'

import TransactionForm from '@/components/TransactionForm.vue'

const route = useRoute()
const router = useRouter()
const txStore = useTransactionStore()
const toast = useToast()

const saving = ref(false)
const initialData = ref(null)

const isEdit = computed(() => !!route.params.id)

onMounted(() => {
  if (route.params.id) {
    const tx = txStore.getById(route.params.id)
    if (tx) {
      initialData.value = { ...tx }
    } else {
      toast.error('Транзакция не найдена')
      router.push('/transactions')
    }
  }
})

async function handleSubmit(formData) {
  saving.value = true
  try {
    if (isEdit.value) {
      await txStore.update(route.params.id, formData)
      toast.success('Обновлено ✓')
    } else {
      await txStore.create(formData)
      toast.success('Добавлено ✓')
    }
    router.push('/transactions')
  } catch (e) {
    toast.error('Ошибка: ' + e.message)
  } finally {
    saving.value = false
  }
}

function goBack() {
  router.push('/transactions')
}
</script>

<style scoped>
.add-view { padding-top: 16px }
</style>
