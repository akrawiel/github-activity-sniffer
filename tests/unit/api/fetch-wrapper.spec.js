import fetchWrapper, { URL_MISSING_MESSAGE } from "@/api/fetch-wrapper";

const validParameters = {
  url: "/example",
  queryParameters: {
    test1: 1,
    test2: true
  }
};

const invalidParameters = {};

describe("fetch-wrapper.js", () => {
  it("returns a Promise for valid parameters", () => {
    expect(fetchWrapper(validParameters)).toBeInstanceOf(Promise);
  });

  it("throws an error if no `url` is provided", () => {
    try {
      fetchWrapper(invalidParameters);
    } catch (error) {
      expect(error).toMatchObject({
        message: URL_MISSING_MESSAGE
      });
    }
  });
});
