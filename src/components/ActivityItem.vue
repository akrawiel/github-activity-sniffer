<template lang="pug">
transition(name="collapse" appear)
  .activity-item
    img.avatar(:src="member.avatar_url")
    .member-login.flex.font-bold.items-center.justify-start.text-xl 
      a.link(:href="memberProfileHref" target="_blank") {{ member.login }}
    .latest-event-container
      .latest-event-date.gap-2.grid.grid-columns-manual.justify-between.w-full
        b Latest event date:&emsp;
        span.truncate.text-right {{ latestEventDate }}
      .latest-event-type.gap-2.grid.grid-columns-manual.justify-between.w-full
        b Latest event type:&emsp;
        span.truncate.text-right {{ latestEventType }}
      .latest-event-repo.gap-2.grid.grid-columns-manual.justify-between.w-full
        b Latest event repo:&emsp;
        a.link.truncate.text-right(:href="latestEventRepoHref" target="_blank" v-if="latestEventRepoHref") {{ latestEventRepoName }}
        span.truncate.text-right(v-else) {{ latestEventRepoName }}
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
$item_height: 6.25rem;

.activity-item {
  @apply grid gap-4 items-center overflow-hidden p-2 w-full;
  grid-template-columns: $avatar_size 0.5fr 0.5fr;
  height: $item_height;

  @media screen and (max-width: theme("screens.sm")) {
    grid-template-columns: 1fr;
  }
}

.avatar {
  @apply border-4 border-solid border-blue-400 rounded-full shadow-lg;
  height: $avatar_size;
  width: $avatar_size;
}

.collapse-enter,
.collapse-leave-to {
  height: 0;
}

.collapse-enter-to,
.collapse-leave {
  height: $item_height;
}

.collapse-enter-active {
  transition: height 0.25s ease-out;
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

.grid-columns-manual {
  grid-template-columns: auto 1fr;
}
</style>
