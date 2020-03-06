<template lang="pug">
.activity-item-container
  slot
</template>

<style lang="postcss">
.activity-item-container {
  @apply block w-full flex flex-col mt-5;

  > *:not(:last-child) {
    @apply border-b border-gray-400 border-solid;
  }
}
</style>
