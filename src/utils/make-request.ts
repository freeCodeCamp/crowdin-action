import fetch from "node-fetch";

type requestParams = {
  method: string;
  endPoint: string;
  contentType?: string;
  accept?: string;
  headers?: Record<string, unknown>;
  body?: Record<string, unknown> | Record<string, unknown>[] | string;
};

/**
 * Utility to build and send a request to the Crowdin API.
 *
 * @param {requestParams} param0 Object containing all of the request parameters.
 * @returns {Promise<any>} The response from the API.
 */
export const makeRequest = async <S>({
  method,
  endPoint,
  contentType = "application/json",
  accept = "application/json",
  headers,
  body,
}: requestParams): Promise<S | null> => {
  const newHeaders = {
    ...headers,
    "Content-Type": contentType,
    Accept: accept,
  };
  const apiUrl = process.env.CROWDIN_API_URL + endPoint;
  let newBody = "";

  if (contentType === "application/x-www-form-urlencoded") {
    newBody = Object.entries(body || {})
      .reduce(
        (formDataArr, [key, value]) => formDataArr.concat(`${key}=${value}`),
        [] as string[]
      )
      .join("&");
  } else if (contentType === "application/json") {
    newBody = JSON.stringify(body);
  } else {
    newBody = body as string;
  }

  console.table({ newHeaders, method, body, apiUrl });

  const response = await fetch(apiUrl, {
    headers: newHeaders,
    method,
    body: newBody,
  });
  if (method !== "delete") {
    const data = await response.json();
    return data;
  } else {
    return null;
  }
};
