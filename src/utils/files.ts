import { CrowdinFileData } from "../interfaces/CrowdinParsedData";
import {
  CrowdinFilesGET,
  CrowdinFilesPOST,
  CrowdinStoragePOST,
} from "../interfaces/CrowdinResponses";

import { authHeader } from "./auth-header";
import { makeRequest } from "./make-request";

/**
 * Module to upload a file to a project.
 *
 * @param {number} projectId The ID of the project to add a file to.
 * @param {string} fileName The name of the file to create.
 * @param {string} fileContent The content of the file to create.
 * @param {number} directoryId The ID of the directory to add the file to.
 * @returns {Promise<CrowdinFilesPOST.data | null>} The data of the file created, or null on failure.
 */
const addFile = async (
  projectId: number,
  fileName: string,
  fileContent: string,
  directoryId: number
) => {
  const headers = { "Crowdin-API-FileName": fileName, ...authHeader };
  const endPoint = "storages";
  const contentType = "application/text";
  const body = fileContent;
  const storageResponse = await makeRequest<CrowdinStoragePOST>({
    method: "post",
    contentType,
    endPoint,
    headers,
    body,
  });
  if (storageResponse && storageResponse.data) {
    const fileBody = {
      storageId: storageResponse.data.id,
      name: fileName,
      directoryId,
    };
    const fileResponse = await makeRequest<CrowdinFilesPOST>({
      method: "post",
      endPoint: `projects/${projectId}/files`,
      headers,
      body: fileBody,
      contentType: "application/json",
    });
    if (fileResponse && fileResponse.data) {
      return fileResponse.data;
    } else {
      console.log("error");
      console.dir(fileResponse, { depth: null, colors: true });
    }
  }
  return null;
};

/**
 * Module to update an existing file on a project.
 *
 * @param {number} projectId The ID of the project to update a file on.
 * @param {number} fileId The ID of the file to update.
 * @param {string} fileContent The content of the file to update.
 * @returns {Promise<CrowdinFilesPOST.data | null>} The data of the file updated, or null on failure.
 */
const updateFile = async (
  projectId: number,
  fileId: number,
  fileContent: string
) => {
  const headers = { ...authHeader };
  const endPoint = "storages";
  const contentType = "application/text";
  const body = fileContent;
  const storageResponse = await makeRequest<CrowdinStoragePOST>({
    method: "post",
    contentType,
    endPoint,
    headers,
    body,
  });
  if (storageResponse && storageResponse.data) {
    const fileBody = {
      storageId: storageResponse.data.id,
    };
    const fileResponse = await makeRequest<CrowdinFilesPOST>({
      method: "put",
      endPoint: `projects/${projectId}/files/${fileId}`,
      headers,
      body: fileBody,
    });
    if (fileResponse && fileResponse.data) {
      return fileResponse.data;
    } else {
      console.log("error");
      console.dir(fileResponse, { depth: null, colors: true });
    }
  }
  return null;
};

/**
 * Module to delete a file from a Crowdin project.
 *
 * @param {number} projectId The ID of the project to delete the file from.
 * @param {number} fileId The ID of the file to delete.
 * @param {string} filePath The path of the file to delete.
 * @returns {Promise<null>} One big ol' null.
 */
const deleteFile = async (
  projectId: number,
  fileId: number,
  filePath: string
) => {
  const headers = { ...authHeader };
  const endPoint = `projects/${projectId}/files/${fileId}`;
  await makeRequest({
    method: "delete",
    endPoint,
    headers,
  });
  console.log(`Deleted file ${filePath}`);
  return null;
};

/**
 * Module to list all files on a Crowdin project.
 *
 * @param {number} projectId The ID of the project to list files for.
 * @returns {Promise<CrowdinFileData[] | null>} Trimmed data of the files listed, or null on failure.
 */
const getFiles = async (
  projectId: number
): Promise<CrowdinFileData[] | null> => {
  const headers = { ...authHeader };
  let done = false;
  let offset = 0;
  let files: CrowdinFilesGET["data"] = [];
  while (!done) {
    const endPoint = `projects/${projectId}/files?offset=${offset}&limit=500`;
    const response = await makeRequest<CrowdinFilesGET>({
      method: "get",
      endPoint,
      headers,
    });
    if (response && response.data) {
      if (response.data.length) {
        files = [...files, ...response.data];
        offset += 500;
      } else {
        done = true;
        const mappedFiles = files.map(
          ({ data: { directoryId, id: fileId, path } }) => {
            return { directoryId, fileId, path: path.slice(1) };
          }
        );
        return mappedFiles;
      }
    } else {
      console.log(JSON.stringify(response, null, 2));
    }
  }
  return null;
};

export const CrowdinFilesHelper = {
  addFile,
  updateFile,
  deleteFile,
  getFiles,
};
