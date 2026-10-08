<template>
  <UApp>
    <UHeader title="beforeX">
      <template #right>
        <UColorModeButton />
      </template>
    </UHeader>

    <UMain>
      <NuxtPage />
    </UMain>

    <UFooter>
      <template #left>
        <p class="text-sm text-muted">
          © {{ new Date().getFullYear() }} beforeX
        </p>
      </template>
    </UFooter>
  </UApp>
</template>
