<template lang="pug">
.activity-item
  img.avatar(:src="member.avatar_url")
  .member-login.flex.font-bold.items-center.justify-start.text-xl 
    a.link(:href="memberProfileHref" target="_blank") {{ member.login }}
  .latest-event-container
    .latest-event-date.flex.justify-between.w-full
      b Latest event date:&emsp;
      span {{ latestEventDate }}
    .latest-event-type.flex.justify-between.w-full
      b Latest event type:&emsp;
      span {{ latestEventType }}
    .latest-event-repo.flex.justify-between.w-full
      b Latest event repo:&emsp;
      a.link(:href="latestEventRepoHref" target="_blank" v-if="latestEventRepoHref") {{ latestEventRepoName }}
      span(v-else) {{ latestEventRepoName }}
</template>

<script>
import { format } from "date-fns";

export default {
  props: {
    member: Object
  },
  computed: {
    latestEventDate() {
      const createdAt = this.member?.latest_event?.created_at ?? null;

      return createdAt
        ? format(new Date(createdAt), "yyyy-MM-dd HH:mm:ss")
        : "N/A";
    },
    latestEventType() {
      return this.member?.latest_event?.type ?? "N/A";
    },
    latestEventRepoHref() {
      const repoName = this.member?.latest_event?.repo?.name;
      return repoName ? `https://github.com/${repoName}` : null;
    },
    latestEventRepoName() {
      return this.member.latest_event?.repo?.name ?? "N/A";
    },
    memberProfileHref() {
      return `https://github.com/${this.member.login}`;
    }
  }
};
</script>

<style lang="postcss" scoped>
$avatar_size: 5rem;

.activity-item {
  @apply grid gap-4 items-center p-2 w-full;
  grid-template-columns: $avatar_size 0.5fr 0.5fr;
  min-height: $avatar_size;

  @media screen and (max-width: theme("screens.sm")) {
    grid-template-columns: 1fr;
  }
}

.avatar {
  @apply border-4 border-solid border-blue-400 rounded-full shadow-lg;
  height: $avatar_size;
  width: $avatar_size;
}

.latest-event-container {
  @apply flex flex-col items-end justify-center text-xs;

  @media screen and (max-width: theme("screens.sm")) {
    @apply items-start;
  }
}

.link {
  @apply text-blue-700;
  transition: color 0.125s ease-out;
  &:hover {
    @apply text-blue-400;
  }
}
</style>
