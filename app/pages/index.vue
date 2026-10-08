<script setup lang="ts">
import type { TabsItem, TimelineItem } from '@nuxt/ui'
import { getLocalTimeZone, parseDate, today } from '@internationalized/date'
import type { CalendarDate, DateValue } from '@internationalized/date'
import type { OnThisDayEntry, OnThisDayKind } from '~/composables/useOnThisDay'

useSeoMeta({ title: 'Heute vor X Jahren · beforeX' })

// --- Datum -----------------------------------------------------------------
// useState statt ref: so bleibt das gewählte Datum erhalten, wenn man zu den
// Favoriten wechselt und wieder zurückkommt.
// useState wird vom Server an den Browser übertragen und kann daher nur
// einfache Werte speichern – also den String "2026-10-08" statt CalendarDate.
const isoDate = useState('selected-date', () => today(getLocalTimeZone()).toString())

const date = computed<CalendarDate>({
  get: () => parseDate(isoDate.value),
  set: value => { isoDate.value = value.toString() }
})
const dayLabel = computed(() => formatDay(date.value.day, date.value.month))

// UInputDate liefert beim Leeren `undefined` – dann behalten wir das alte Datum
const inputDate = computed({
  get: () => date.value,
  set: (value: DateValue | null | undefined) => {
    if (value) date.value = parseDate(value.toString().slice(0, 10))
  }
})

function shiftDay(days: number) {
  date.value = date.value.add({ days })
}

function goToday() {
  date.value = today(getLocalTimeZone())
}

// --- Daten -----------------------------------------------------------------
// Ändert sich `date`, ändert sich der Key → useAsyncData lädt automatisch neu
const { data, status, error, refresh } = useOnThisDay(date)

// --- Tabs ------------------------------------------------------------------
const TAB_DEFS: { value: OnThisDayKind, label: string, icon: string }[] = [
  { value: 'selected', label: 'Highlights', icon: 'i-lucide-sparkles' },
  { value: 'events', label: 'Ereignisse', icon: 'i-lucide-landmark' },
  { value: 'births', label: 'Geburtstage', icon: 'i-lucide-baby' },
  { value: 'deaths', label: 'Todestage', icon: 'i-lucide-flower-2' },
  { value: 'holidays', label: 'Feiertage', icon: 'i-lucide-party-popper' }
]

const activeTab = ref<OnThisDayKind>('selected')

const tabs = computed<TabsItem[]>(() =>
  TAB_DEFS.map(t => ({
    ...t,
    badge: data.value?.[t.value].length ?? undefined
  }))
)

function timelineItems(kind: OnThisDayKind): (TimelineItem & { entry: OnThisDayEntry })[] {
  const def = TAB_DEFS.find(t => t.value === kind)!
  return (data.value?.[kind] ?? []).map(entry => ({
    value: entry.id,
    date: entry.year !== undefined ? formatYear(entry.year) : undefined,
    title: entry.text,
    icon: def.icon,
    entry
  }))
}

// --- Favoriten & Modal -----------------------------------------------------
const { isFavorite, toggle } = useFavorites()

const modalOpen = ref(false)
const selectedEntry = ref<OnThisDayEntry | null>(null)

function openDetails(entry: OnThisDayEntry) {
  selectedEntry.value = entry
  modalOpen.value = true
}
</script>

<template>
  <UContainer class="py-8 space-y-6">
    <div class="space-y-1">
      <h1 class="text-3xl font-bold">
        Heute vor X Jahren
      </h1>
      <p class="text-muted">
        Was am {{ dayLabel }} in der Geschichte passiert ist – Daten aus der deutschen Wikipedia.
      </p>
    </div>

    <!-- Datumsauswahl -->
    <div class="flex flex-wrap items-center gap-2">
      <UButton
        icon="i-lucide-chevron-left"
        color="neutral"
        variant="outline"
        aria-label="Vorheriger Tag"
        @click="shiftDay(-1)"
      />

      <UInputDate v-model="inputDate" />

      <UPopover>
        <UButton
          icon="i-lucide-calendar"
          color="neutral"
          variant="outline"
          aria-label="Kalender öffnen"
        />
        <template #content>
          <UCalendar v-model="inputDate" class="p-2" />
        </template>
      </UPopover>

      <UButton
        icon="i-lucide-chevron-right"
        color="neutral"
        variant="outline"
        aria-label="Nächster Tag"
        @click="shiftDay(1)"
      />

      <UButton
        label="Heute"
        color="neutral"
        variant="ghost"
        @click="goToday"
      />
    </div>

    <!-- Fehler -->
    <UAlert
      v-if="error"
      color="error"
      variant="subtle"
      icon="i-lucide-triangle-alert"
      title="Daten konnten nicht geladen werden"
      :description="error.message"
      :actions="[{ label: 'Erneut versuchen', onClick: () => refresh() }]"
    />

    <!-- Inhalt -->
    <UTabs
      v-else
      v-model="activeTab"
      :items="tabs"
      :unmount-on-hide="true"
      variant="link"
      class="w-full"
    >
      <template #content="{ item }">
        <div v-if="status === 'pending'" class="space-y-4 pt-4">
          <USkeleton v-for="i in 5" :key="i" class="h-14 w-full" />
        </div>

        <p
          v-else-if="!timelineItems(item.value as OnThisDayKind).length"
          class="pt-6 text-muted"
        >
          Für diesen Tag gibt es hier keine Einträge.
        </p>

        <UTimeline
          v-else
          :items="timelineItems(item.value as OnThisDayKind)"
          size="xs"
          class="pt-4"
        >
          <template #title="{ item: row }">
            <button
              type="button"
              class="text-left font-medium hover:text-primary hover:underline"
              @click="openDetails(row.entry)"
            >
              {{ row.title }}
            </button>
          </template>

          <template #description="{ item: row }">
            <div class="flex items-center gap-2">
              <span v-if="row.entry.year !== undefined">{{ yearsAgo(row.entry.year) }}</span>
              <UButton
                icon="i-lucide-star"
                :color="isFavorite(row.entry, dayLabel) ? 'warning' : 'neutral'"
                :variant="isFavorite(row.entry, dayLabel) ? 'soft' : 'ghost'"
                size="xs"
                :aria-label="isFavorite(row.entry, dayLabel) ? 'Aus Favoriten entfernen' : 'Zu Favoriten'"
                @click="toggle(row.entry, dayLabel)"
              />
            </div>
          </template>
        </UTimeline>
      </template>
    </UTabs>

    <EntryDetailModal
      v-model:open="modalOpen"
      :entry="selectedEntry"
      :day="dayLabel"
    />
  </UContainer>
</template>
