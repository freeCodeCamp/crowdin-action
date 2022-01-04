import { CrowdinProjectGET } from "../interfaces/CrowdinResponses";

import { authHeader } from "./auth-header";
import { makeRequest } from "./make-request";

/**
 * Utility to list the language IDs available on a given Crowdin project.
 *
 * @param {string} projectId The project ID from Crowdin.
 * @returns {Promise<string[]>} A promise that resolves to an array of language IDs.
 */
export const getLanguages = async (projectId: string) => {
  const headers = { ...authHeader };
  const endPoint = `projects/${projectId}?limit=500`;
  const response = await makeRequest<CrowdinProjectGET>({
    method: "GET",
    endPoint,
    headers,
  });
  if (response && response.targetLanguageIds.length) {
    return response.targetLanguageIds;
  } else {
    console.log(JSON.stringify(response, null, 2));
    return null;
  }
};
