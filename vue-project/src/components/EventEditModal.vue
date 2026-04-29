<script setup lang="ts">
import { onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue';
import { Modal } from 'bootstrap';
import type { IEvent } from '@/domain/IEvent';
import { EventApiService } from '@/services/EventApiService';

interface Props {
  event: IEvent | null;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: 'updated', event: IEvent): void;
}>();

interface EditForm {
  eventName: string;
  startTime: string;
  endTime: string;
  maxParticipants: number;
}

const form = reactive<EditForm>({
  eventName: '',
  startTime: '',
  endTime: '',
  maxParticipants: 0,
});

const submitting = ref(false);
const error = ref<string | null>(null);

const modalEl = ref<HTMLElement | null>(null);
let modal: Modal | null = null;

function toDatetimeLocal(value: Date | string): string {
  const d = value instanceof Date ? value : new Date(value);
  if (isNaN(d.getTime())) return '';
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

watch(
  () => props.event,
  (event) => {
    if (!event) return;
    form.eventName = event.eventName;
    form.startTime = toDatetimeLocal(event.startTime);
    form.endTime = toDatetimeLocal(event.endTime);
    form.maxParticipants = event.maxParticipants;
    error.value = null;
  },
  { immediate: true },
);

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

async function save() {
  if (!props.event) return;
  error.value = null;
  submitting.value = true;
  try {
    const payload: IEvent = {
      id: props.event.id,
      eventName: form.eventName,
      startTime: new Date(form.startTime),
      endTime: new Date(form.endTime),
      maxParticipants: form.maxParticipants,
      spotsLeft: props.event.spotsLeft,
    };
    const service = new EventApiService();
    await service.update(props.event.id, payload);
    emit('updated', payload);
    hide();
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Failed to update event';
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
          <h5 class="modal-title">Edit event</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div class="mb-3 text-start">
            <label for="edit-event-name" class="form-label">Name</label>
            <input id="edit-event-name" v-model="form.eventName" type="text" class="form-control" required />
          </div>
          <div class="mb-3 text-start">
            <label for="edit-event-start" class="form-label">Starts</label>
            <input id="edit-event-start" v-model="form.startTime" type="datetime-local" class="form-control" required />
          </div>
          <div class="mb-3 text-start">
            <label for="edit-event-end" class="form-label">Ends</label>
            <input id="edit-event-end" v-model="form.endTime" type="datetime-local" class="form-control" required />
          </div>
          <div class="mb-3 text-start">
            <label for="edit-event-max" class="form-label">Max participants</label>
            <input id="edit-event-max" v-model.number="form.maxParticipants" type="number" min="1" class="form-control" required />
          </div>
          <div v-if="error" class="alert alert-danger mb-0" role="alert">{{ error }}</div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
          <button type="submit" class="btn btn-primary" :disabled="submitting">
            {{ submitting ? 'Saving...' : 'Save' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
