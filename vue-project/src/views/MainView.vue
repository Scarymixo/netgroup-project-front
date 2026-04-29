<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import { EventApiService } from '@/services/EventApiService';
import { ParticipantApiService } from '@/services/ParticipantApiService';
import type { IEvent } from '@/domain/IEvent';
import type { IParticipant } from '@/domain/IParticipant';
import { useAuthStore } from '@/stores/authStore';
import EventEditModal from '@/components/EventEditModal.vue';
import EventCreateModal from '@/components/EventCreateModal.vue';
import EventDetailsSidebar from '@/components/EventDetailsSidebar.vue';
import ConfirmDialog from '@/components/ConfirmDialog.vue';

interface RegistrationForm {
  firstName: string;
  lastName: string;
  nationalId: string;
  submitting: boolean;
  error: string | null;
  success: boolean;
}

const events = ref<IEvent[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);
const openFormEventId = ref<string | null>(null);
const forms = reactive<Record<string, RegistrationForm>>({});

const authStore = useAuthStore();
const participantApiService = new ParticipantApiService();

const editModalRef = ref<InstanceType<typeof EventEditModal> | null>(null);
const createModalRef = ref<InstanceType<typeof EventCreateModal> | null>(null);
const detailsSidebarRef = ref<InstanceType<typeof EventDetailsSidebar> | null>(null);
const confirmDialogRef = ref<InstanceType<typeof ConfirmDialog> | null>(null);

const selectedEvent = ref<IEvent | null>(null);
const pendingDeleteId = ref<string | null>(null);

function formatDate(value: Date | string): string {
  const date = value instanceof Date ? value : new Date(value);
  if (isNaN(date.getTime())) return '';
  return date.toLocaleString();
}

function ensureForm(eventId: string): RegistrationForm {
  if (!forms[eventId]) {
    forms[eventId] = {
      firstName: '',
      lastName: '',
      nationalId: '',
      submitting: false,
      error: null,
      success: false,
    };
  }
  return forms[eventId];
}

function toggleForm(eventId: string) {
  ensureForm(eventId);
  openFormEventId.value = openFormEventId.value === eventId ? null : eventId;
}

async function submitRegistration(event: IEvent) {
  const form = ensureForm(event.id);
  form.error = null;
  form.success = false;
  form.submitting = true;

  try {
    const payload: IParticipant = {
      id: '00000000-0000-0000-0000-000000000000',
      eventId: event.id,
      firstName: form.firstName,
      lastName: form.lastName,
      nationalId: form.nationalId,
    };
    await participantApiService.create(payload);
    form.success = true;
    form.firstName = '';
    form.lastName = '';
    form.nationalId = '';
    if (event.spotsLeft > 0) event.spotsLeft -= 1;
  } catch (e) {
    form.error = e instanceof Error ? e.message : 'Failed to register';
  } finally {
    form.submitting = false;
  }
}

function openCreate() {
  createModalRef.value?.show();
}

function onCreated(created: IEvent) {
  events.value.unshift(created);
}

function openEdit(event: IEvent) {
  selectedEvent.value = event;
  editModalRef.value?.show();
}

function openDetails(event: IEvent) {
  selectedEvent.value = event;
  detailsSidebarRef.value?.show(event.id);
}

function requestDelete(event: IEvent) {
  pendingDeleteId.value = event.id;
  confirmDialogRef.value?.show();
}

function onUpdated(updated: IEvent) {
  const idx = events.value.findIndex((e) => e.id === updated.id);
  if (idx !== -1) events.value[idx] = updated;
}

async function onConfirmDelete() {
  const id = pendingDeleteId.value;
  if (!id) return;
  try {
    const service = new EventApiService();
    await service.delete(id);
    events.value = events.value.filter((e) => e.id !== id);
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Failed to delete event';
  } finally {
    pendingDeleteId.value = null;
  }
}

onMounted(async () => {
  const eventApiService = new EventApiService();

  try {
    events.value = await eventApiService.getAll();
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Failed to load events';
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div class="text-center">
    <h1>See what events are happening</h1>

    <div v-if="authStore.isAdmin()" class="create-row">
      <button type="button" class="btn btn-primary" @click="openCreate">
        Create new event
      </button>
    </div>

    <p v-if="loading">Loading events...</p>
    <p v-else-if="error" class="error">{{ error }}</p>
    <p v-else-if="events.length === 0">No events found.</p>

    <div v-else class="event-list">
      <div v-for="event in events" :key="event.id" class="event-card">
        <div class="event-card-body">
          <h3>{{ event.eventName }}</h3>
          <p><strong>Starts:</strong> {{ formatDate(event.startTime) }}</p>
          <p><strong>Ends:</strong> {{ formatDate(event.endTime) }}</p>
          <p><strong>Max participants:</strong> {{ event.maxParticipants }}</p>
          <p><strong>Spots left:</strong> {{ event.spotsLeft }}</p>

          <div class="register-row">
            <template v-if="authStore.isAdmin()">
              <button type="button" class="btn btn-outline-primary btn-sm" @click="openEdit(event)">
                Edit
              </button>
              <button type="button" class="btn btn-outline-secondary btn-sm" @click="openDetails(event)">
                Details
              </button>
              <button type="button" class="btn btn-outline-danger btn-sm" @click="requestDelete(event)">
                Delete
              </button>
            </template>
            <button
              v-else
              type="button"
              class="register-btn"
              @click="toggleForm(event.id)"
            >
              {{ openFormEventId === event.id ? 'Cancel' : 'Register' }}
            </button>
          </div>
        </div>

        <form
          v-if="!authStore.isAdmin() && openFormEventId === event.id && forms[event.id]"
          class="register-form"
          @submit.prevent="submitRegistration(event)"
        >
          <label>
            <span>First name</span>
            <input v-model="forms[event.id]!.firstName" required />
          </label>
          <label>
            <span>Last name</span>
            <input v-model="forms[event.id]!.lastName" required />
          </label>
          <label>
            <span>National ID</span>
            <input v-model="forms[event.id]!.nationalId" required />
          </label>

          <p v-if="forms[event.id]!.error" class="error">{{ forms[event.id]!.error }}</p>
          <p v-if="forms[event.id]!.success" class="success">Registered successfully!</p>

          <button type="submit" :disabled="forms[event.id]!.submitting">
            {{ forms[event.id]!.submitting ? 'Submitting...' : 'Submit' }}
          </button>
        </form>
      </div>
    </div>

    <EventEditModal ref="editModalRef" :event="selectedEvent" @updated="onUpdated" />
    <EventCreateModal ref="createModalRef" @created="onCreated" />
    <EventDetailsSidebar ref="detailsSidebarRef" :event="selectedEvent" />
    <ConfirmDialog
      ref="confirmDialogRef"
      title="Delete event?"
      message="This will permanently delete the event. This action cannot be undone."
      confirm-label="Delete"
      confirm-variant="danger"
      @confirm="onConfirmDelete"
    />
  </div>
</template>

<style scoped>
.create-row {
  margin-top: 1rem;
  display: flex;
  justify-content: center;
}

.event-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1.5rem;
  align-items: center;
}

.event-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 1rem 1.5rem;
  min-width: 280px;
  max-width: 480px;
  width: 100%;
  text-align: left;
}

.event-card h3 {
  margin: 0 0 0.5rem;
}

.register-row {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.register-btn {
  padding: 0.4rem 0.9rem;
  border-radius: 6px;
  border: 1px solid #2c7a7b;
  background: #2c7a7b;
  color: #fff;
  cursor: pointer;
}

.register-btn:hover {
  background: #285e61;
}

.register-form {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px dashed #ddd;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.register-form label {
  display: flex;
  flex-direction: column;
  font-size: 0.9rem;
  gap: 0.2rem;
}

.register-form input {
  padding: 0.4rem 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.register-form button {
  align-self: flex-end;
  padding: 0.4rem 0.9rem;
  border-radius: 6px;
  border: 1px solid #2c7a7b;
  background: #fff;
  color: #2c7a7b;
  cursor: pointer;
}

.register-form button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.error {
  color: #c0392b;
}

.success {
  color: #2f855a;
}
</style>
