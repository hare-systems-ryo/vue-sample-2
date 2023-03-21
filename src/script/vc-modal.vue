<script setup lang="ts">
import { useFocusTrap } from '@vueuse/integrations/useFocusTrap';
import { ref, watch } from 'vue';
type Props = {
  isShow: boolean;
};
const props = defineProps<Props>();
type Emits = {
  (e: 'close'): void;
  (e: 'close-before-func', func: () => void): void;
};
const emit = defineEmits<Emits>();
const target = ref();
const { activate, deactivate } = useFocusTrap(target);

watch(
  () => props.isShow,
  () => {
    if (props.isShow) {
      message.value.length = 0;
      activate();
    } else {
      deactivate();
    }
  }
);
const closeBefore = () => {
  if (isLock.value) {
    message.value.push('isLock=trueで閉じません');
  }
  return isLock.value;
};
emit('close-before-func', closeBefore);
const message = ref<string[]>([]);
const isLock = ref(false);
</script>
<template>
  <div class="card" @click.stop>
    <div class="card-header">モーダル</div>
    <div class="card-body py-1">
      <div class="d-flex justify-content-between fw-bold fs-5 w-100">
        <div class="">←</div>
        <div class="">領域外クリックで閉じれる</div>
        <div class="">→</div>
      </div>
      <div class="text-center mb-2">でもisLock=trueだと閉じれない</div>
      <div class="">
        <div class="btn btn-danger me-1" @click="isLock = !isLock">change</div>
        <span class="ms-1">isLock={{ isLock }}</span>
      </div>
      <div class="message">
        {{ message.join('\n') }}
      </div>
    </div>
    <div class="card-footer">
      <div class="btn btn-outline-secondary w-100" @click="emit('close')">modal閉じる</div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.card {
  min-width: 400px;
  max-height: 100%;
  max-width: 100%;

  > .card-body {
    overflow: auto;
  }
  @media screen and (min-width: #{ 0 }px) and (max-width: #{ 600 - 0.1}px) {
    min-width: 300px;
  }
}
.message {
  white-space: pre-line;
  font-size: 12px;
  max-height: 100px;
  overflow: auto;
}
</style>
