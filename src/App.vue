<template lang="pug">
#app
  .flex.font-bold.justify-center.py-4.text-2xl.text-gray-700 GitHub Activity Sniffer
  search-field(@clear="onSearchClear" @error="onSearchError" :hasError="Boolean(errorMessage)" :transformOrganizationResponse="transformOrganizationResponse")
  error-message(:message="errorMessage")
  activity-item-container
    activity-item(v-for="member in memberData" :key="member.id" :member="member")
  base-button(@click="onLoadMoreClick" v-if="nextPageLink" :disabled="isFetching") {{ isFetching ? 'Loading...' : 'Load more' }}
</template>

<script>
import ActivityItem from "@/components/ActivityItem.vue";
import ActivityItemContainer from "@/components/ActivityItemContainer.vue";
import BaseButton from "@/components/BaseButton.vue";
import ErrorMessage from "@/components/ErrorMessage.vue";
import SearchField from "@/components/SearchField.vue";
import fetchWrapper from "@/api/fetch-wrapper";

export default {
  name: "App",
  data() {
    return {
      isFetching: false,
      nextPageLink: null,
      memberData: [],
      errorMessage: ""
    };
  },
  components: {
    ActivityItem,
    ActivityItemContainer,
    BaseButton,
    ErrorMessage,
    SearchField
  },
  methods: {
    setSearchState({ nextPageLink, memberData, errorMessage }) {
      this.nextPageLink = nextPageLink;
      this.memberData = memberData;
      this.errorMessage = errorMessage;
    },
    onSearchClear() {
      this.setSearchState({
        nextPageLink: null,
        memberData: [],
        errorMessage: ""
      });
    },
    onSearchError(error) {
      this.setSearchState({
        nextPageLink: null,
        memberData: [],
        errorMessage: error
      });
    },
    async transformMembersEvents({ data }) {
      return await Promise.all(
        data.map(async member => {
          const events = await fetchWrapper({
            url: `${member.events_url.replace("{/privacy}", "")}/public`
          }).then(response => {
            if (!response.ok) {
              throw new Error(response.statusText);
            }

            return response.json();
          });

          return {
            ...member,
            latest_event: events[0] ?? null
          };
        })
      );
    },
    async transformOrganizationResponse({ promise }) {
      this.isFetching = true;
      this.errorMessage = "";

      try {
        const organizationResponse = await promise().then(async response => {
          if (!response.ok) {
            throw new Error(response.statusText);
          }

          return {
            links: response.headers.get("Link")?.split(",") ?? [],
            data: await response.json()
          };
        });

        const membersWithLatestEvents = await this.transformMembersEvents({
          data: organizationResponse.data
        });

        this.nextPageLink =
          organizationResponse.links
            ?.find(link => /rel="next"\s*$/.test(link))
            ?.match(/<([^<>]+)>/)?.[1] ?? null;

        this.memberData = [
          ...this.memberData,
          ...membersWithLatestEvents.map(
            ({ id, login, events_url, avatar_url, latest_event }) => ({
              id,
              login,
              avatar_url,
              events_url,
              latest_event
            })
          )
        ];
      } catch (error) {
        this.setSearchState({
          errorMessage: error?.message,
          nextPageLink: null,
          memberData: []
        });
      } finally {
        this.isFetching = false;
      }
    },
    async onLoadMoreClick() {
      if (!this.isFetching) {
        await this.transformOrganizationResponse({
          promise: () => fetchWrapper({ url: this.nextPageLink })
        });
      }
    }
  }
};
</script>

<style lang="postcss">
#app {
  @apply max-w-3xl p-3 flex flex-col mx-auto;
  font-family: Spartan, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

body {
  @apply bg-blue-100 min-h-screen;
}
</style>
