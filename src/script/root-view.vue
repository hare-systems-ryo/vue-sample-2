<script setup lang="ts">
import dayjs from 'dayjs';

import { reactive, nextTick, onMounted, ref } from 'vue';
import { ModalControl, InitModalControl, InitModals } from './modal-control';

import VcModal from './vc-modal.vue';

interface Modal {
  test1: ModalControl<{
    isLock: boolean;
    id: number;
  }>;
  //開閉だけで他は省略
  test2: ModalControl;
}

const modal = reactive<Modal>({
  test1: InitModalControl<Modal['test1']['state']>({
    state: { isLock: false, id: 1 },
    //asyncもOK
    showBefore: (state) => {
      console.log('showBefore', state);
      if (state.isLock) {
        message.value.push(dayjs().format('HH:mm:ss.SSS') + ' isLock=trueで開けません');
      } else {
        message.value.length = 0;
      }
      return state.isLock;
    },
    showAfter: (state) => {
      console.log('showAfter', state);
    },
    //asyncもOK
    closeBefore: (state) => {
      console.log('closeBefore', state);
      if (state.isLock) {
        message.value.push(dayjs().format('HH:mm:ss.SSS') + ' isLock=trueで閉じれません');
      }
      return state.isLock;
    },
    closeAfter: (state) => {
      console.log('closeAfter', state);
    },
  }),
  //開閉だけで他は省略
  test2: InitModalControl(),
});
const showModal1 = () => {
  modal.test1.state.id++;
  modal.test1.show();
};

const message = ref<string[]>([]);

onMounted(() => {
  InitModals(modal, nextTick);
});
</script>
<template>
  <div class="container-fluid">
    <div class="card mt-2">
      <div class="card-header bg-info">modal</div>
      <div class="card-body">
        <div class="row">
          <div class="col-6">
            <div class="mb-1">
              <div class="btn btn-primary mb-1" @click="showModal1()">showModal1</div>
              <div class="mb-1">
                <div class="btn btn-danger me-1" @click="modal.test1.state.isLock = !modal.test1.state.isLock">
                  change
                </div>
                <span class="ms-1">isLock={{ modal.test1.state.isLock }}</span>
              </div>
            </div>
            <div class="message">
              {{ message.join('\n') }}
            </div>
          </div>
          <div class="col-6">
            <div class="btn btn-primary" @click="modal.test2.show()">showModal2</div>
            <div class="">コンポーネントのModal</div>
            <div class="">コンポーネント側で開閉制御</div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <teleport to="#teleport">
    <div class="modal-container" :class="{ isShow: modal.test1.isShow }" @click="modal.test1.close()">
      <div class="card" @click.stop>
        <div class="card-header">モーダル</div>
        <div class="card-body">
          <div class="text-center mb-2">id={{ modal.test1.state.id }}</div>
          <div class="">
            <div class="btn btn-danger me-1" @click="modal.test1.state.isLock = !modal.test1.state.isLock">change</div>
            <span class="ms-1">isLock={{ modal.test1.state.isLock }}</span>
          </div>
        </div>
        <div class="card-footer">
          <div class="btn btn-outline-secondary w-100" @click="modal.test1.close()">modal閉じる</div>
        </div>
      </div>
    </div>
    <div class="modal-container" :class="{ isShow: modal.test2.isShow }" @click="modal.test2.close()">
      <VcModal
        :isShow="modal.test2.isShow"
        @close-before-func="(func) => (modal.test2.closeBefore = func)"
        @close="modal.test2.close()"
      >
      </VcModal>
    </div>
  </teleport>
</template>

<style lang="scss" scoped>
.modal-container {
  position: fixed;
  inset: 0;
  background-color: rgba(23, 29, 78, 0.47);
  display: flex;
  justify-content: center;
  align-items: center;
  pointer-events: none;
  opacity: 0;
  transition: opacity 300ms;
  &.isShow {
    pointer-events: all;
    opacity: 1;
  }
  .card {
    max-height: 100%;
    max-width: 100%;
    > .card-body {
      overflow: auto;
    }
  }
}

.card,
.card-header,
.card-body {
  border-color: rgb(24, 7, 112);
}
.modal-container .card {
  min-width: 400px;

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
