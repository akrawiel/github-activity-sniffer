<template lang="pug">
.relative
  input.search-field(:class="{ error: hasError }" type="search" placeholder="Enter GitHub organization's name here" autoFocus @input="search")
  search-spinner(:isFetching="isFetching")
</template>

<script>
import debounce from "lodash.debounce";
import SearchSpinner from "@/components/SearchSpinner";
import { getOrganizationByName } from "@/api/github-api";

export default {
  components: {
    SearchSpinner
  },
  data() {
    return {
      isFetching: false,
      errorMessage: "",
      showErrorMessage: true,
      searchDebounced: debounce(async function({ searchValue }) {
        await this.transformOrganizationResponse({
          promise: () =>
            getOrganizationByName({ organizationName: searchValue })
        });

        this.isFetching = false;
      }, 500)
    };
  },
  props: {
    transformOrganizationResponse: Function,
    hasError: Boolean
  },
  methods: {
    search(event) {
      const searchValue = event.target.value;

      this.$emit("clear");
      if (searchValue) {
        this.isFetching = true;
        this.searchDebounced({ searchValue });
      } else {
        this.searchDebounced.cancel();
        this.isFetching = false;
        this.$emit("error", "Enter at least 1 character in the field above");
      }
    }
  }
};
</script>

<style lang="postcss" scoped>
.search-field {
  @apply border border-gray-400 border-solid p-3 pr-4 rounded shadow-lg w-full;
  transition: border-color 0.2s ease-out;

  &:focus {
    @apply border-gray-600;
  }

  &.error {
    @apply border-red-500;
  }
}
</style>
