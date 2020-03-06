import { shallowMount } from "@vue/test-utils";
import SearchField from "@/components/SearchField.vue";

const dummyValidEvent = {
  target: { value: "test" }
};

const dummyInvalidEvent = {
  target: { value: "" }
};

describe("SearchField.vue", () => {
  it("renders when all data is passed", () => {
    const propsData = {
      transformOrganizationResponse: jest.fn(),
      hasError: false
    };

    const wrapper = shallowMount(SearchField, {
      propsData
    });

    expect(wrapper.element).toMatchSnapshot();

    const searchDebouncedSpy = jest.fn(() => {
      wrapper.vm.transformOrganizationResponse();
    });
    searchDebouncedSpy.cancel = jest.fn();

    wrapper.setData({ searchDebounced: searchDebouncedSpy });

    // called with valid event
    wrapper.vm.search(dummyValidEvent);

    expect(wrapper.emitted("clear")).toHaveLength(1);
    expect(wrapper.vm.isFetching).toBeTruthy();
    expect(searchDebouncedSpy).toHaveBeenCalledWith({
      searchValue: dummyValidEvent.target.value
    });
    expect(propsData.transformOrganizationResponse).toHaveBeenCalled();

    searchDebouncedSpy.mockReset();

    // called with invalid event
    wrapper.vm.search(dummyInvalidEvent);

    expect(wrapper.emitted("clear")).toHaveLength(2);
    expect(wrapper.vm.isFetching).toBeFalsy();
    expect(searchDebouncedSpy).not.toHaveBeenCalled();
    expect(searchDebouncedSpy.cancel).toHaveBeenCalled();
    expect(wrapper.emitted("error")).toMatchObject([
      ["Enter at least 1 character in the field above"]
    ]);
  });
});
