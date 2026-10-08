import type { CalendarDate } from '@internationalized/date'

export type OnThisDayKind = 'selected' | 'events' | 'births' | 'deaths' | 'holidays'

export interface OnThisDayEntry {
  id: string
  kind: OnThisDayKind
  year?: number
  text: string
  title?: string
  extract?: string
  thumbnail?: string
  url?: string
}

// Nur die Felder der Wikimedia-Antwort, die wir wirklich brauchen
interface WikiPage {
  title: string
  normalizedtitle?: string
  extract?: string
  thumbnail?: { source: string }
  content_urls?: { desktop?: { page?: string } }
}

interface WikiEntry {
  text: string
  year?: number
  pages?: WikiPage[]
}

type WikiResponse = Partial<Record<OnThisDayKind, WikiEntry[]>>

const KINDS: OnThisDayKind[] = ['selected', 'events', 'births', 'deaths', 'holidays']

function pad(n: number) {
  return String(n).padStart(2, '0')
}

function toEntry(kind: OnThisDayKind, entry: WikiEntry, index: number): OnThisDayEntry {
  const page = entry.pages?.[0]

  return {
    id: `${kind}-${entry.year ?? 'x'}-${index}`,
    kind,
    year: entry.year,
    text: entry.text,
    title: page?.normalizedtitle ?? page?.title.replaceAll('_', ' '),
    extract: page?.extract,
    thumbnail: page?.thumbnail?.source,
    url: page?.content_urls?.desktop?.page
  }
}

/**
 * Lädt die "Was geschah am ..."-Daten der deutschen Wikipedia für ein Datum.
 *
 * Weil der Key von `date` abhängt, lädt `useAsyncData` automatisch neu,
 * sobald sich das Datum ändert. Das Jahr spielt für die API keine Rolle,
 * nur Monat und Tag.
 */
export function useOnThisDay(date: Ref<CalendarDate>) {
  const monthDay = computed(() => `${pad(date.value.month)}/${pad(date.value.day)}`)

  return useAsyncData(
    () => `onthisday-${monthDay.value}`,
    async () => {
      const data = await $fetch<WikiResponse>(
        `https://api.wikimedia.org/feed/v1/wikipedia/de/onthisday/all/${monthDay.value}`
      )

      const result = {} as Record<OnThisDayKind, OnThisDayEntry[]>
      for (const kind of KINDS) {
        result[kind] = (data[kind] ?? []).map((entry, i) => toEntry(kind, entry, i))
      }
      return result
    }
  )
}
