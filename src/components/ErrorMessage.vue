<template lang="pug">
.my-2
  transition(name="collapse")
    .search-field-message(v-show="message") {{ message }} 
</template>

<script>
export default {
  props: ["message"]
};
</script>

<style lang="postcss" scoped>
.search-field-message {
  @apply text-xs overflow-hidden text-red-600 leading-tight;
}

.collapse-enter,
.collapse-leave-to {
  line-height: 0;
}

.collapse-enter-to,
.collapse-leave {
  @apply leading-tight;
}

.collapse-enter-active,
.collapse-leave-active {
  transition: line-height 0.25s ease-out;
}
</style>
