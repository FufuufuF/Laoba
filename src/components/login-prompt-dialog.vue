<template>
  <el-dialog
    v-model="dialogVisible"
    title="需要登录"
    width="400px"
    :close-on-click-modal="true"
    :append-to-body="true"
    class="login-prompt-dialog"
  >
    <div class="dialog-content">
      <el-icon class="warning-icon" :size="48"><WarningFilled /></el-icon>
      <p class="message">{{ message || '请先登录后再进行此操作' }}</p>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleCancel">取消</el-button>
        <el-button type="primary" @click="handleGoLogin">去登录</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { WarningFilled } from '@element-plus/icons-vue'

const props = defineProps<{
  modelValue: boolean
  message?: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'cancel'): void
  (e: 'go-login'): void
}>()

const router = useRouter()
const dialogVisible = ref(props.modelValue)

// 同步 v-model
watch(() => props.modelValue, (val) => {
  dialogVisible.value = val
})

watch(dialogVisible, (val) => {
  emit('update:modelValue', val)
})

const handleCancel = () => {
  dialogVisible.value = false
  emit('cancel')
}

const handleGoLogin = () => {
  dialogVisible.value = false
  emit('go-login')
  router.push('/login')
}
</script>

<style scoped>
.dialog-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 0;
  text-align: center;
}

.warning-icon {
  color: var(--el-color-warning);
  margin-bottom: 16px;
}

.message {
  font-size: 16px;
  color: var(--el-text-color-primary);
  margin: 0;
  line-height: 1.5;
}

.dialog-footer {
  display: flex;
  justify-content: center;
  gap: 12px;
}
</style>
