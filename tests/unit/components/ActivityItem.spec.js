import { shallowMount } from "@vue/test-utils";
import ActivityItem from "@/components/ActivityItem.vue";
import { format } from "date-fns";

describe("ActivityItem.vue", () => {
  it("renders when all data is passed", () => {
    const propsData = {
      member: {
        avatar_url: "Avatar",
        login: "Login",
        latest_event: {
          created_at: "2020-02-02T01:00:00Z",
          type: "Test",
          repo: {
            name: "test/test"
          }
        }
      }
    };

    const wrapper = shallowMount(ActivityItem, {
      propsData
    });

    expect(wrapper).toMatchSnapshot();

    expect(wrapper.find(".avatar").attributes("src")).toMatch("Avatar");

    expect(wrapper.find(".member-login").text()).toMatch("Login");

    expect(
      wrapper
        .find(".latest-event-date")
        .text()
        .replace(/\s/g, " ")
    ).toMatch(
      `Latest event date: ${format(
        new Date(propsData.member.latest_event.created_at),
        "yyyy-MM-dd HH:mm:ss"
      )}`
    );

    expect(wrapper.find(".latest-event-type").text()).toMatch("Test");

    const repoLink = wrapper.find(".latest-event-repo").find(".link");

    expect(repoLink.attributes("href")).toMatch("https://github.com/test/test");

    expect(repoLink.text()).toMatch("test/test");
  });

  it("renders when latest event is missing", () => {
    const propsData = {
      member: {
        avatar_url: "Avatar",
        login: "Login"
      }
    };

    const wrapper = shallowMount(ActivityItem, {
      propsData
    });

    expect(wrapper).toMatchSnapshot();

    expect(wrapper.find(".avatar").attributes("src")).toMatch("Avatar");

    expect(wrapper.find(".member-login").text()).toMatch("Login");

    expect(
      wrapper
        .find(".latest-event-date")
        .text()
        .replace(/\s/g, " ")
    ).toMatch(`Latest event date: N/A`);

    expect(wrapper.find(".latest-event-type").text()).toMatch("N/A");

    const repoLink = wrapper.find(".latest-event-repo").find(".link");

    expect(repoLink.exists()).toBeFalsy();
  });
});
