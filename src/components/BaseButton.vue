<template lang="pug">
button.button(@click="$emit('click')" :disabled="disabled")
  slot
</template>

<script>
export default {
  props: {
    disabled: {
      required: false,
      default: false,
      type: Boolean
    }
  }
};
</script>

<style lang="postcss" scoped>
.button {
  @apply bg-blue-500 cursor-pointer rounded flex font-bold justify-center my-2 p-3 shadow text-white w-full;
  filter: brightness(1);
  transition: all 0.15s ease-out;

  &:not([disabled]) {
    &:hover {
      filter: brightness(1.15);
    }

    &:active {
      filter: brightness(0.85);
    }
  }

  &[disabled] {
    @apply cursor-not-allowed;
  }
}
</style>
