import { shallowMount } from "@vue/test-utils";
import App from "@/App.vue";

const invalidOrganizationPromise = () =>
  Promise.resolve({
    ok: false,
    statusText: "Test 1"
  });

const dummyMemberData = [
  {
    avatar_url: "avatar",
    events_url: "url",
    id: 1,
    login: "Test"
  }
];

const dummyEventData = [
  {
    id: 1
  }
];
const dummyHeaders = new Headers({
  Link: '<test-link> rel="next"'
});

const validOrganizationPromise = () =>
  Promise.resolve({
    ok: true,
    json: () => dummyMemberData,
    headers: dummyHeaders
  });

const validEventsPromise = () =>
  Promise.resolve({
    ok: true,
    json: () => dummyEventData
  });

let wrapper;

beforeEach(() => {
  wrapper = shallowMount(App);
});

describe("App.vue", async () => {
  it("renders when all data is passed", () => {
    expect(wrapper.element).toMatchSnapshot();
  });

  it("returns valid organization response data", async () => {
    await wrapper.vm.transformOrganizationResponse({
      promise: invalidOrganizationPromise
    });

    expect(wrapper.vm.errorMessage).toBe("Test 1");

    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        statusText: "Test 2"
      })
    );

    try {
      await wrapper.vm.transformMembersEvents({
        data: dummyMemberData
      });
    } catch (error) {
      expect(error).toMatchObject(new Error("Test 2"));
    }

    global.fetch = jest.fn(validEventsPromise);

    await wrapper.vm.transformOrganizationResponse({
      promise: validOrganizationPromise
    });

    expect(wrapper.vm.errorMessage).toBe("");
    expect(wrapper.vm.memberData).toMatchObject([
      {
        ...dummyMemberData[0],
        latest_event: dummyEventData[0]
      }
    ]);
    expect(wrapper.vm.nextPageLink).toBe("test-link");
  });
});
