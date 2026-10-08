<script setup lang="ts">
import type { OnThisDayEntry } from '~/composables/useOnThisDay'

const props = defineProps<{
  entry: OnThisDayEntry | null
  day: string
}>()

// v-model:open vom Elternteil
const open = defineModel<boolean>('open', { default: false })

const { isFavorite, toggle } = useFavorites()

const favorite = computed(() => props.entry ? isFavorite(props.entry, props.day) : false)
</script>

<template>
  <UModal
    v-model:open="open"
    :title="entry?.title ?? 'Details'"
    :description="entry?.year ? `${formatYear(entry.year)} · ${day}` : day"
  >
    <template #body>
      <div v-if="entry" class="space-y-4">
        <img
          v-if="entry.thumbnail"
          :src="entry.thumbnail"
          :alt="entry.title"
          class="max-h-64 w-full rounded-md object-cover"
        >
        <p class="font-medium">
          {{ entry.text }}
        </p>
        <p v-if="entry.extract" class="text-sm text-muted">
          {{ entry.extract }}
        </p>
      </div>
    </template>

    <template #footer>
      <div v-if="entry" class="flex w-full justify-between gap-2">
        <UButton
          :label="favorite ? 'Aus Favoriten entfernen' : 'Zu Favoriten'"
          :icon="favorite ? 'i-lucide-star-off' : 'i-lucide-star'"
          :color="favorite ? 'neutral' : 'primary'"
          :variant="favorite ? 'subtle' : 'solid'"
          @click="toggle(entry, day)"
        />
        <UButton
          v-if="entry.url"
          label="Auf Wikipedia lesen"
          :to="entry.url"
          target="_blank"
          trailing-icon="i-lucide-arrow-up-right"
          color="neutral"
          variant="ghost"
        />
      </div>
    </template>
  </UModal>
</template>
