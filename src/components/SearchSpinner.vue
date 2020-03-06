<template lang="pug">
transition(name="fade")
  .spinner-container(v-show="isFetching")
    .spinner.reverse
    .spinner
</template>

<script>
export default {
  props: {
    isFetching: Boolean
  }
};
</script>

<style lang="postcss" scoped>
@keyframes spinner-animation {
  0% {
    transform: translateX(0%);
  }

  100% {
    transform: translateX(100%);
  }
}

.spinner-container {
  @apply absolute flex h-full items-center mr-4 w-5;
  right: 0;
  top: 0;
}

.spinner {
  @apply bg-blue-500 h-2 opacity-50 rounded-lg w-2;
  animation: spinner-animation 0.25s ease-in 0s infinite alternate;
}

.spinner.reverse {
  animation-direction: alternate-reverse;
}

.fade-enter,
.fade-leave-to {
  @apply opacity-0;
}

.fade-enter-to,
.fade-leave {
  @apply opacity-100;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease-out;
}
</style>
