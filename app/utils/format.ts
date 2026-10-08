// Dateien in app/utils werden von Nuxt automatisch importiert.

export function formatDay(day: number, month: number) {
  return `${String(day).padStart(2, '0')}.${String(month).padStart(2, '0')}.`
}

export function formatYear(year: number) {
  return year < 0 ? `${-year} v. Chr.` : String(year)
}

export function yearsAgo(year: number) {
  const diff = new Date().getFullYear() - year
  if (diff === 0) return 'dieses Jahr'
  return diff === 1 ? 'vor 1 Jahr' : `vor ${diff} Jahren`
}
