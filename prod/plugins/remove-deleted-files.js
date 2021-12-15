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
exports.removeDeletedFiles = void 0;
const child_process_1 = require("child_process");
const util_1 = require("util");
const files_1 = require("../utils/files");
const getOutputFromShellCommand = (command) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const awaitExec = (0, util_1.promisify)(child_process_1.exec);
        const { stdout } = yield awaitExec(command);
        return stdout;
    }
    catch (error) {
        console.log("Error");
        console.log(command);
        console.log(JSON.stringify(error, null, 2));
    }
});
/**
 * Module to remove files from a Crowdin project if they are no longer present
 * in the source repository.
 *
 * @param {number} projectId The ID of the project to remove files from.
 * @param {string} path The base path for the files to check.
 * @returns {boolean} True if files were successfully removed, false if no files were present on Crowdin.
 */
const removeDeletedFiles = (projectId, path) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Cleaning deleted files...");
    const crowdinFiles = yield files_1.CrowdinFilesHelper.getFiles(projectId);
    if (crowdinFiles && crowdinFiles.length) {
        const shellCommand = `find ${path} -name \\*.*`;
        const localFiles = yield getOutputFromShellCommand(shellCommand);
        const localFilesArray = localFiles === null || localFiles === void 0 ? void 0 : localFiles.split("\n");
        if (localFilesArray === null || localFilesArray === void 0 ? void 0 : localFilesArray.length) {
            const localFilesMap = localFilesArray.reduce((map, filename) => (Object.assign(Object.assign({}, map), { [filename]: true })), {});
            for (const { fileId, path: crowdinFilePath } of crowdinFiles) {
                if (!localFilesMap[crowdinFilePath]) {
                    yield files_1.CrowdinFilesHelper.deleteFile(projectId, fileId, crowdinFilePath);
                }
            }
        }
    }
    else {
        console.log(`WARNING! No files found for project ${projectId}`);
        return false;
    }
    console.log("File deletion process complete.");
    return true;
});
exports.removeDeletedFiles = removeDeletedFiles;
