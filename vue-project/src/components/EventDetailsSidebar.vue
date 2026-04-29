<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { Offcanvas } from 'bootstrap';
import type { IEvent } from '@/domain/IEvent';
import type { IParticipant } from '@/domain/IParticipant';
import { EventApiService } from '@/services/EventApiService';

interface Props {
  event: IEvent | null;
}

const props = defineProps<Props>();

const offcanvasEl = ref<HTMLElement | null>(null);
let offcanvas: Offcanvas | null = null;

const participants = ref<IParticipant[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);

function formatDate(value: Date | string): string {
  const date = value instanceof Date ? value : new Date(value);
  if (isNaN(date.getTime())) return '';
  return date.toLocaleString();
}

async function loadParticipants(eventId: string) {
  error.value = null;
  loading.value = true;
  try {
    const service = new EventApiService();
    participants.value = await service.getParticipants(eventId);
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Failed to load participants';
    participants.value = [];
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  if (offcanvasEl.value) {
    offcanvas = new Offcanvas(offcanvasEl.value);
    offcanvasEl.value.addEventListener('hidden.bs.offcanvas', () => {
      participants.value = [];
      error.value = null;
    });
  }
});

onBeforeUnmount(() => {
  offcanvas?.dispose();
  offcanvas = null;
});

async function show(eventId: string) {
  offcanvas?.show();
  await loadParticipants(eventId);
}

function hide() {
  offcanvas?.hide();
}

defineExpose({ show, hide });
</script>

<template>
  <div ref="offcanvasEl" class="offcanvas offcanvas-end" tabindex="-1" aria-labelledby="event-details-label">
    <div class="offcanvas-header">
      <h5 id="event-details-label" class="offcanvas-title">Event details</h5>
      <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
    </div>
    <div class="offcanvas-body">
      <div v-if="props.event">
        <h4>{{ props.event.eventName }}</h4>
        <p class="mb-1"><strong>Starts:</strong> {{ formatDate(props.event.startTime) }}</p>
        <p class="mb-1"><strong>Ends:</strong> {{ formatDate(props.event.endTime) }}</p>
        <p class="mb-1"><strong>Max participants:</strong> {{ props.event.maxParticipants }}</p>
        <p class="mb-0"><strong>Spots left:</strong> {{ props.event.spotsLeft }}</p>
      </div>

      <hr />

      <h6>Participants</h6>
      <p v-if="loading" class="text-muted mb-0">Loading participants...</p>
      <p v-else-if="error" class="text-danger mb-0">{{ error }}</p>
      <p v-else-if="participants.length === 0" class="text-muted mb-0">No participants yet.</p>
      <ul v-else class="list-group list-group-flush">
        <li v-for="p in participants" :key="p.id" class="list-group-item px-0">
          {{ p.firstName }} {{ p.lastName }}
        </li>
      </ul>
    </div>
  </div>
</template>
