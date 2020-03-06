import fetchWrapper from "./fetch-wrapper";

export const getOrganizationByName = ({ organizationName }) =>
  fetchWrapper({
    url: `https://api.github.com/orgs/${encodeURIComponent(
      organizationName
    )}/members`,
    queryParameters: {
      page: 1,
      per_page: 5
    }
  });
