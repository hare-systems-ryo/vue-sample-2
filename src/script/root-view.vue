<script setup lang="ts">
import { reactive, nextTick, onMounted, ref } from 'vue';
import { ModalControl, InitModalControl, InitModals } from './modal-control';

const sleep = (time: number) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};

interface Modal {
  test: ModalControl<{
    disabled: boolean;
  }>;
  //開閉だけで他は省略
  test2: ModalControl;
}

const modal = reactive<Modal>({
  test: InitModalControl<Modal['test']['state']>({
    state: { disabled: false },
    showBefore: async (state) => {
      console.log('showBefore', state);
      await sleep(100);
      return state.disabled;
    },
    showAfter: (state) => {
      console.log('showAfter', state);
    },
    closeBefore: async (state) => {
      console.log('closeBefore', state);
      await sleep(300);
      return state.disabled;
    },
    closeAfter: (state) => {
      console.log('closeAfter', state);
    },
  }),
  //開閉だけで他は省略
  test2: InitModalControl(),
});

onMounted(() => {
  InitModals(modal, nextTick);
  // modal.test.show();
});
</script>
<template>
  <div class="container-fluid">
    <div class="card mt-2">
      <div class="card-header bg-info">modal</div>
      <div class="card-body">
        <div class="btn btn-info" @click="modal.test.show()">modalひらく</div>
        <div class="btn btn-info mx-1" @click="modal.test.state.disabled = !modal.test.state.disabled">
          modal.test.state.disabled={{ modal.test.state.disabled }}
        </div>
      </div>
      <div class="card-body">
        <div class="btn btn-info" @click="modal.test2.show()">modal test2ひらく</div>
      </div>
    </div>
  </div>
  <teleport to="#teleport">
    <div class="modal-base" :class="{ show: modal.test.isOpen }">
      <div class="card">
        <div class="card-header">これはモーダルです</div>
        <div class="card-body">
          <div class="btn btn-info" @click="modal.test.close()">modal閉じる</div>
          <div class="btn btn-info mx-1" @click="modal.test.state.disabled = !modal.test.state.disabled">
            modal.test.state.disabled={{ modal.test.state.disabled }}
          </div>
        </div>
      </div>
    </div>
    <div class="modal-base" :class="{ show: modal.test2.isOpen }">
      <div class="card">
        <div class="card-header">これはモーダルですtest2</div>
        <div class="card-body">
          <div class="btn btn-info" @click="modal.test2.close()">modal閉じる</div>
        </div>
      </div>
    </div>
  </teleport>
</template>

<style lang="scss" scoped>
.modal-base {
  position: fixed;
  inset: 0;
  transform: translateY(100%) scaleY(0);
  // transform: scale(0);
  background-color: rgba(53, 48, 131, 0.283);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 300ms;
  &.show {
    transform: translateY(0%) scaleY(1);
    // transform:  scale(1);
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
</style>
