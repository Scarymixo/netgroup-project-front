<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { EventApiService } from '@/services/EventApiService';
import type { IEvent } from '@/domain/IEvent';

const events = ref<IEvent[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);

function formatDate(value: Date | string): string {
  const date = value instanceof Date ? value : new Date(value);
  if (isNaN(date.getTime())) return '';
  return date.toLocaleString();
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

    <p v-if="loading">Loading events...</p>
    <p v-else-if="error" class="error">{{ error }}</p>
    <p v-else-if="events.length === 0">No events found.</p>

    <div v-else class="event-list">
      <div v-for="event in events" :key="event.id" class="event-card">
        <h3>{{ event.eventName }}</h3>
        <p><strong>Starts:</strong> {{ formatDate(event.startTime) }}</p>
        <p><strong>Ends:</strong> {{ formatDate(event.endTime) }}</p>
        <p><strong>Max participants:</strong> {{ event.maxParticipants }}</p>
        <p><strong>Spots left:</strong> {{ event.spotsLeft }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
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

.error {
  color: #c0392b;
}
</style>
