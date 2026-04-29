<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { Modal } from 'bootstrap';

interface Props {
  title?: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  confirmVariant?: 'danger' | 'primary' | 'warning';
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Are you sure?',
  message: 'This action cannot be undone.',
  confirmLabel: 'Delete',
  cancelLabel: 'Cancel',
  confirmVariant: 'danger',
});

const emit = defineEmits<{
  (e: 'confirm'): void;
}>();

const modalEl = ref<HTMLElement | null>(null);
let modal: Modal | null = null;

onMounted(() => {
  if (modalEl.value) {
    modal = new Modal(modalEl.value);
  }
});

onBeforeUnmount(() => {
  modal?.dispose();
  modal = null;
});

function show() {
  modal?.show();
}

function hide() {
  modal?.hide();
}

function onConfirm() {
  emit('confirm');
  hide();
}

defineExpose({ show, hide });
</script>

<template>
  <div ref="modalEl" class="modal fade" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">{{ props.title }}</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <p class="mb-0">{{ props.message }}</p>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
            {{ props.cancelLabel }}
          </button>
          <button type="button" :class="['btn', `btn-${props.confirmVariant}`]" @click="onConfirm">
            {{ props.confirmLabel }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
