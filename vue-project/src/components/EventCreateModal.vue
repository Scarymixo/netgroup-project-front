<script setup lang="ts">
import { onBeforeUnmount, onMounted, reactive, ref } from 'vue';
import { Modal } from 'bootstrap';
import type { IEvent } from '@/domain/IEvent';
import { EventApiService } from '@/services/EventApiService';

const emit = defineEmits<{
  (e: 'created', event: IEvent): void;
}>();

interface CreateForm {
  eventName: string;
  startTime: string;
  endTime: string;
  maxParticipants: number;
}

const form = reactive<CreateForm>({
  eventName: '',
  startTime: '',
  endTime: '',
  maxParticipants: 1,
});

const submitting = ref(false);
const error = ref<string | null>(null);

const modalEl = ref<HTMLElement | null>(null);
let modal: Modal | null = null;

function resetForm() {
  form.eventName = '';
  form.startTime = '';
  form.endTime = '';
  form.maxParticipants = 1;
  error.value = null;
}

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
  resetForm();
  modal?.show();
}

function hide() {
  modal?.hide();
}

async function save() {
  error.value = null;
  submitting.value = true;
  try {
    const payload: IEvent = {
      id: '00000000-0000-0000-0000-000000000000',
      eventName: form.eventName,
      startTime: new Date(form.startTime),
      endTime: new Date(form.endTime),
      maxParticipants: form.maxParticipants,
      spotsLeft: form.maxParticipants,
    };
    const service = new EventApiService();
    const created = await service.create(payload);
    emit('created', created ?? payload);
    hide();
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Failed to create event';
  } finally {
    submitting.value = false;
  }
}

defineExpose({ show, hide });
</script>

<template>
  <div ref="modalEl" class="modal fade" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <form class="modal-content" @submit.prevent="save">
        <div class="modal-header">
          <h5 class="modal-title">Create event</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div class="mb-3 text-start">
            <label for="create-event-name" class="form-label">Name</label>
            <input id="create-event-name" v-model="form.eventName" type="text" class="form-control" required />
          </div>
          <div class="mb-3 text-start">
            <label for="create-event-start" class="form-label">Starts</label>
            <input id="create-event-start" v-model="form.startTime" type="datetime-local" class="form-control" required />
          </div>
          <div class="mb-3 text-start">
            <label for="create-event-end" class="form-label">Ends</label>
            <input id="create-event-end" v-model="form.endTime" type="datetime-local" class="form-control" required />
          </div>
          <div class="mb-3 text-start">
            <label for="create-event-max" class="form-label">Max participants</label>
            <input id="create-event-max" v-model.number="form.maxParticipants" type="number" min="1" class="form-control" required />
          </div>
          <div v-if="error" class="alert alert-danger mb-0" role="alert">{{ error }}</div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
          <button type="submit" class="btn btn-primary" :disabled="submitting">
            {{ submitting ? 'Creating...' : 'Create' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
