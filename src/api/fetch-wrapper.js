import queryString from "querystring";

export const URL_MISSING_MESSAGE = "`url` parameter is required";

export default function({ queryParameters = {}, url, ...otherParameters }) {
  if (!url) {
    throw new Error(URL_MISSING_MESSAGE);
  }

  const stringifiedQueryParameters = queryString.stringify(queryParameters);

  const urlWithParameters = `${url}?${stringifiedQueryParameters}`.replace(
    /\?$/,
    ""
  );

  return fetch(urlWithParameters, {
    ...otherParameters
  });
}
