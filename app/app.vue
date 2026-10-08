<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'
import { de } from '@nuxt/ui/locale'

const { favorites } = useFavorites()

const nav = computed<NavigationMenuItem[]>(() => [
  { label: 'Heute vor X Jahren', to: '/', icon: 'i-lucide-calendar-days' },
  {
    label: 'Favoriten',
    to: '/favoriten',
    icon: 'i-lucide-star',
    badge: favorites.value.length || undefined
  }
])
</script>

<template>
  <UApp :locale="de">
    <UHeader title="beforeX">
      <UNavigationMenu :items="nav" />

      <template #right>
        <UColorModeButton />
      </template>

      <template #body>
        <UNavigationMenu :items="nav" orientation="vertical" class="-mx-2.5" />
      </template>
    </UHeader>

    <UMain>
      <NuxtPage />
    </UMain>

    <UFooter>
      <template #left>
        <p class="text-sm text-muted">
          © {{ new Date().getFullYear() }} beforeX · Daten: Wikipedia (CC BY-SA)
        </p>
      </template>
    </UFooter>
  </UApp>
</template>
