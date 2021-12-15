"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CrowdinFilesHelper = void 0;
const auth_header_1 = require("./auth-header");
const make_request_1 = require("./make-request");
/**
 * Module to upload a file to a project.
 *
 * @param {number} projectId The ID of the project to add a file to.
 * @param {string} fileName The name of the file to create.
 * @param {string} fileContent The content of the file to create.
 * @param {number} directoryId The ID of the directory to add the file to.
 * @returns {Promise<CrowdinFilesPOST.data | null>} The data of the file created, or null on failure.
 */
const addFile = (projectId, fileName, fileContent, directoryId) => __awaiter(void 0, void 0, void 0, function* () {
    const headers = Object.assign({ "Crowdin-API-FileName": fileName }, auth_header_1.authHeader);
    const endPoint = "storages";
    const contentType = "application/text";
    const body = fileContent;
    const storageResponse = yield (0, make_request_1.makeRequest)({
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
        const fileResponse = yield (0, make_request_1.makeRequest)({
            method: "post",
            endPoint: `projects/${projectId}/files`,
            headers,
            body: fileBody,
            contentType: "application/json",
        });
        if (fileResponse && fileResponse.data) {
            return fileResponse.data;
        }
        else {
            console.log("error");
            console.dir(fileResponse, { depth: null, colors: true });
        }
    }
    return null;
});
/**
 * Module to update an existing file on a project.
 *
 * @param {number} projectId The ID of the project to update a file on.
 * @param {number} fileId The ID of the file to update.
 * @param {string} fileContent The content of the file to update.
 * @returns {Promise<CrowdinFilesPOST.data | null>} The data of the file updated, or null on failure.
 */
const updateFile = (projectId, fileId, fileContent) => __awaiter(void 0, void 0, void 0, function* () {
    const headers = Object.assign({}, auth_header_1.authHeader);
    const endPoint = "storages";
    const contentType = "application/text";
    const body = fileContent;
    const storageResponse = yield (0, make_request_1.makeRequest)({
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
        const fileResponse = yield (0, make_request_1.makeRequest)({
            method: "put",
            endPoint: `projects/${projectId}/files/${fileId}`,
            headers,
            body: fileBody,
        });
        if (fileResponse && fileResponse.data) {
            return fileResponse.data;
        }
        else {
            console.log("error");
            console.dir(fileResponse, { depth: null, colors: true });
        }
    }
    return null;
});
/**
 * Module to delete a file from a Crowdin project.
 *
 * @param {number} projectId The ID of the project to delete the file from.
 * @param {number} fileId The ID of the file to delete.
 * @param {string} filePath The path of the file to delete.
 * @returns {Promise<null>} One big ol' null.
 */
const deleteFile = (projectId, fileId, filePath) => __awaiter(void 0, void 0, void 0, function* () {
    const headers = Object.assign({}, auth_header_1.authHeader);
    const endPoint = `projects/${projectId}/files/${fileId}`;
    yield (0, make_request_1.makeRequest)({
        method: "delete",
        endPoint,
        headers,
    });
    console.log(`Deleted file ${filePath}`);
    return null;
});
/**
 * Module to list all files on a Crowdin project.
 *
 * @param {number} projectId The ID of the project to list files for.
 * @returns {Promise<CrowdinFileData[] | null>} Trimmed data of the files listed, or null on failure.
 */
const getFiles = (projectId) => __awaiter(void 0, void 0, void 0, function* () {
    const headers = Object.assign({}, auth_header_1.authHeader);
    let done = false;
    let offset = 0;
    let files = [];
    while (!done) {
        const endPoint = `projects/${projectId}/files?offset=${offset}&limit=500`;
        const response = yield (0, make_request_1.makeRequest)({
            method: "get",
            endPoint,
            headers,
        });
        if (response && response.data) {
            if (response.data.length) {
                files = [...files, ...response.data];
                offset += 500;
            }
            else {
                done = true;
                const mappedFiles = files.map(({ data: { directoryId, id: fileId, path } }) => {
                    return { directoryId, fileId, path: path.slice(1) };
                });
                return mappedFiles;
            }
        }
        else {
            console.log(JSON.stringify(response, null, 2));
        }
    }
    return null;
});
exports.CrowdinFilesHelper = {
    addFile,
    updateFile,
    deleteFile,
    getFiles,
};
