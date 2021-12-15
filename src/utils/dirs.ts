import {
  CrowdinDirectoriesGET,
  CrowdinDirectoriesPOST,
} from "../interfaces/CrowdinResponses";

import { authHeader } from "./auth-header";
import { delay } from "./delay";
import { makeRequest } from "./make-request";

/**
 * Generates a list of directories within a Crowdin project.
 *
 * @param {number} projectId The ID of the project to list directories for.
 * @returns {Promise<CrowdinDirectoriesGET>} A list of directories within the project.
 */
const getDirs = async (projectId: string) => {
  const headers = { ...authHeader };
  let done = false;
  let offset = 0;
  let files: CrowdinDirectoriesGET["data"] = [];
  while (!done) {
    const endPoint = `projects/${projectId}/directories?limit=500&offset=${offset}`;
    await delay(1000);
    const response = await makeRequest<CrowdinDirectoriesGET>({
      method: "get",
      endPoint,
      headers,
    });
    if (response && "data" in response) {
      if (response.data.length) {
        files = [...files, ...response.data];
        offset += 500;
      } else {
        done = true;
        return files;
      }
    } else {
      console.log(JSON.stringify(response, null, 2));
    }
  }
  return null;
};

/**
 * Creates a new directory within a Crowdin project.
 *
 * @param {number} projectId The ID of the Crowdin project.
 * @param {string} dirName The name of the directory to create.
 * @param {number | undefined} parentDirId The optional ID of the parent directory for the new directory.
 * @returns {Promise<CrowdinDirectoriesPOST | null>} The directory data for the created directory, or null on failure.
 */
const addDir = async (
  projectId: number,
  dirName: string,
  parentDirId: number | undefined
) => {
  const headers = { ...authHeader };
  const endPoint = `projects/${projectId}/directories`;
  let body: Record<string, unknown> = {
    name: dirName,
  };
  if (parentDirId) {
    body = { ...body, directoryId: parentDirId };
  }

  const response = await makeRequest<CrowdinDirectoriesPOST>({
    method: "post",
    endPoint,
    headers,
    body,
  });
  return response;
};

/**
 * Creates multiple new directories in Crowdin.
 *
 * @param {CrowdinDirectoriesGET.data} crowdinDirs The array of directory objects to create.
 * @param {string} dirPath The path to the directory to create the directories in.
 * @returns {Promise<number | null>} The last directoryId that was created, or null on failure.
 */
const createDirs = async (
  crowdinDirs: CrowdinDirectoriesGET["data"],
  dirPath: string
) => {
  // superParent is the top level directory on crowdin
  const superParent = crowdinDirs.find((dir) => !dir.data.directoryId);
  let lastParentId = superParent?.data.id;

  const splitDirPath = dirPath.split("/");
  splitDirPath.shift();

  // we are assuming that the first directory in 'newFile' is the same as the superParent
  // maybe throw a check in here to verify that's true
  const findCurrDir = (
    directory: string,
    crowdinDirs: CrowdinDirectoriesGET["data"]
  ) => {
    return crowdinDirs.find(({ data: { name, directoryId } }) => {
      return name === directory && directoryId === lastParentId;
    });
  };

  for (const directory of splitDirPath) {
    const currentDirectory = findCurrDir(directory, crowdinDirs);
    if (!currentDirectory) {
      const response = await addDir(10, directory, lastParentId);
      if (response && response.data) {
        // eslint-disable-next-line require-atomic-updates
        lastParentId = response.data.id;
      }
    } else {
      lastParentId = currentDirectory.data.id;
    }
  }
  return lastParentId;
};

export const CrowdinDirectoryHelper = {
  getDirs,
  createDirs,
  addDir,
};
