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
exports.CrowdinDirectoryHelper = void 0;
const auth_header_1 = require("./auth-header");
const delay_1 = require("./delay");
const make_request_1 = require("./make-request");
/**
 * Generates a list of directories within a Crowdin project.
 *
 * @param {number} projectId The ID of the project to list directories for.
 * @returns {Promise<CrowdinDirectoriesGET>} A list of directories within the project.
 */
const getDirs = (projectId) => __awaiter(void 0, void 0, void 0, function* () {
    const headers = Object.assign({}, auth_header_1.authHeader);
    let done = false;
    let offset = 0;
    let files = [];
    while (!done) {
        const endPoint = `projects/${projectId}/directories?limit=500&offset=${offset}`;
        yield (0, delay_1.delay)(1000);
        const response = yield (0, make_request_1.makeRequest)({
            method: "get",
            endPoint,
            headers,
        });
        if (response && "data" in response) {
            if (response.data.length) {
                files = [...files, ...response.data];
                offset += 500;
            }
            else {
                done = true;
                return files;
            }
        }
        else {
            console.log(JSON.stringify(response, null, 2));
        }
    }
    return null;
});
/**
 * Creates a new directory within a Crowdin project.
 *
 * @param {number} projectId The ID of the Crowdin project.
 * @param {string} dirName The name of the directory to create.
 * @param {number | undefined} parentDirId The optional ID of the parent directory for the new directory.
 * @returns {Promise<CrowdinDirectoriesPOST | null>} The directory data for the created directory, or null on failure.
 */
const addDir = (projectId, dirName, parentDirId) => __awaiter(void 0, void 0, void 0, function* () {
    const headers = Object.assign({}, auth_header_1.authHeader);
    const endPoint = `projects/${projectId}/directories`;
    let body = {
        name: dirName,
    };
    if (parentDirId) {
        body = Object.assign(Object.assign({}, body), { directoryId: parentDirId });
    }
    const response = yield (0, make_request_1.makeRequest)({
        method: "post",
        endPoint,
        headers,
        body,
    });
    return response;
});
/**
 * Creates multiple new directories in Crowdin.
 *
 * @param {CrowdinDirectoriesGET.data} crowdinDirs The array of directory objects to create.
 * @param {string} dirPath The path to the directory to create the directories in.
 * @returns {Promise<number | null>} The last directoryId that was created, or null on failure.
 */
const createDirs = (crowdinDirs, dirPath) => __awaiter(void 0, void 0, void 0, function* () {
    // superParent is the top level directory on crowdin
    const superParent = crowdinDirs.find((dir) => !dir.data.directoryId);
    let lastParentId = superParent === null || superParent === void 0 ? void 0 : superParent.data.id;
    const splitDirPath = dirPath.split("/");
    splitDirPath.shift();
    // we are assuming that the first directory in 'newFile' is the same as the superParent
    // maybe throw a check in here to verify that's true
    const findCurrDir = (directory, crowdinDirs) => {
        return crowdinDirs.find(({ data: { name, directoryId } }) => {
            return name === directory && directoryId === lastParentId;
        });
    };
    for (const directory of splitDirPath) {
        const currentDirectory = findCurrDir(directory, crowdinDirs);
        if (!currentDirectory) {
            const response = yield addDir(10, directory, lastParentId);
            if (response && response.data) {
                // eslint-disable-next-line require-atomic-updates
                lastParentId = response.data.id;
            }
        }
        else {
            lastParentId = currentDirectory.data.id;
        }
    }
    return lastParentId;
});
exports.CrowdinDirectoryHelper = {
    getDirs,
    createDirs,
    addDir,
};
