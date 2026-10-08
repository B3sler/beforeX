import type { OnThisDayEntry } from './useOnThisDay'

export interface Favorite extends OnThisDayEntry {
  // Tag, an dem der Eintrag gefunden wurde, z. B. "08.10."
  day: string
}

/**
 * Favoritenliste als globaler Zustand.
 *
 * `useState` mit demselben Key liefert überall in der App dieselbe reaktive
 * Liste – auch nach einem Seitenwechsel. Nach einem Neuladen der Seite ist sie
 * aber leer, denn `useState` speichert nichts dauerhaft.
 */
export function useFavorites() {
  const favorites = useState<Favorite[]>('favorites', () => [])

  function key(entry: OnThisDayEntry, day: string) {
    return `${day}|${entry.kind}|${entry.year}|${entry.text}`
  }

  function isFavorite(entry: OnThisDayEntry, day: string) {
    const k = key(entry, day)
    return favorites.value.some(f => key(f, f.day) === k)
  }

  function toggle(entry: OnThisDayEntry, day: string) {
    const k = key(entry, day)
    if (isFavorite(entry, day)) {
      favorites.value = favorites.value.filter(f => key(f, f.day) !== k)
    } else {
      favorites.value = [...favorites.value, { ...entry, day }]
    }
  }

  function remove(favorite: Favorite) {
    toggle(favorite, favorite.day)
  }

  return { favorites, isFavorite, toggle, remove }
}
