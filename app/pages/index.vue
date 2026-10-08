<script setup lang="ts">
useSeoMeta({
  title: 'beforeX',
  description: 'Erste Seite mit Nuxt UI'
})

const features = [
  {
    title: 'Nuxt 4',
    description: 'Dateibasiertes Routing, Auto-Imports und Server-Rendering out of the box.',
    icon: 'i-lucide-rocket'
  },
  {
    title: 'Nuxt UI',
    description: 'Fertige, zugängliche Komponenten auf Basis von Tailwind CSS.',
    icon: 'i-lucide-layout-dashboard'
  },
  {
    title: 'Dark Mode',
    description: 'Hell und dunkel per Klick oben rechts im Header.',
    icon: 'i-lucide-moon'
  }
]

const toast = useToast()

function sayHello() {
  toast.add({
    title: 'Es funktioniert!',
    description: 'Nuxt UI ist eingerichtet.',
    icon: 'i-lucide-check-circle',
    color: 'success'
  })
}
</script>

<template>
  <div>
    <UPageHero
      title="Willkommen bei beforeX"
      description="Deine erste Seite mit Nuxt UI. Von hier aus kannst du weiterbauen."
    >
      <template #links>
        <UButton
          label="Ausprobieren"
          icon="i-lucide-sparkles"
          size="xl"
          @click="sayHello"
        />
        <UButton
          label="Nuxt UI Docs"
          to="https://ui.nuxt.com"
          target="_blank"
          trailing-icon="i-lucide-arrow-up-right"
          color="neutral"
          variant="subtle"
          size="xl"
        />
      </template>
    </UPageHero>

    <UPageSection
      title="Was schon drin ist"
      :features="features"
    />
  </div>
</template>
