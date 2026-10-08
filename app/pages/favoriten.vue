<script setup lang="ts">
import type { Favorite } from '~/composables/useFavorites'

useSeoMeta({ title: 'Favoriten · beforeX' })

// Dieselbe Liste wie auf der Startseite – useState teilt sie über den Key
const { favorites, remove } = useFavorites()

const modalOpen = ref(false)
const selected = ref<Favorite | null>(null)

function openDetails(favorite: Favorite) {
  selected.value = favorite
  modalOpen.value = true
}
</script>

<template>
  <UContainer class="py-8 space-y-6">
    <div class="space-y-1">
      <h1 class="text-3xl font-bold">
        Favoriten
      </h1>
      <p class="text-muted">
        Gemerkte Einträge. Sie bleiben beim Seitenwechsel erhalten, aber nicht beim Neuladen.
      </p>
    </div>

    <UEmpty
      v-if="!favorites.length"
      icon="i-lucide-star"
      title="Noch keine Favoriten"
      description="Markiere auf der Startseite Einträge mit dem Stern."
      :actions="[{ label: 'Zur Startseite', to: '/', icon: 'i-lucide-arrow-left' }]"
    />

    <div v-else class="grid gap-4 sm:grid-cols-2">
      <UCard v-for="fav in favorites" :key="`${fav.day}-${fav.id}`">
        <div class="space-y-2">
          <div class="flex items-center gap-2 text-sm text-muted">
            <UBadge :label="fav.day" color="neutral" variant="subtle" />
            <span v-if="fav.year !== undefined">{{ formatYear(fav.year) }} · {{ yearsAgo(fav.year) }}</span>
          </div>
          <p class="font-medium">
            {{ fav.text }}
          </p>
        </div>

        <template #footer>
          <div class="flex justify-between">
            <UButton
              label="Details"
              color="neutral"
              variant="ghost"
              icon="i-lucide-info"
              @click="openDetails(fav)"
            />
            <UButton
              label="Entfernen"
              color="error"
              variant="ghost"
              icon="i-lucide-trash-2"
              @click="remove(fav)"
            />
          </div>
        </template>
      </UCard>
    </div>

    <EntryDetailModal
      v-model:open="modalOpen"
      :entry="selected"
      :day="selected?.day ?? ''"
    />
  </UContainer>
</template>
