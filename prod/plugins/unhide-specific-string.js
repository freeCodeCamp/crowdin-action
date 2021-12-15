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
exports.unhideSpecificString = void 0;
const files_1 = require("../utils/files");
const strings_1 = require("../utils/strings");
/**
 * Module to unhide a specific string on Crowdin.
 *
 * @param {number} projectId The ID of the project to hide the string for.
 * @param {string} fileName The name of the file to hide the string in.
 * @param {string} string The content of the string to hide.
 * @returns {Promise<boolean>} True if the string was unhidden, false otherwise.
 */
const unhideSpecificString = (projectId, fileName, string) => __awaiter(void 0, void 0, void 0, function* () {
    const fileResponse = yield files_1.CrowdinFilesHelper.getFiles(projectId);
    if (!fileResponse) {
        return false;
    }
    const targetFile = fileResponse.find((el) => el.path.endsWith(fileName));
    if (!targetFile) {
        return false;
    }
    const stringResponse = yield strings_1.CrowdinStringHelper.getStrings(projectId, targetFile.fileId);
    if (!stringResponse) {
        return false;
    }
    const targetString = stringResponse.find((el) => el.data.text === string);
    if (!targetString) {
        return false;
    }
    yield strings_1.CrowdinStringHelper.changeHiddenStatus(projectId, targetString.data.id, false);
    return true;
});
exports.unhideSpecificString = unhideSpecificString;
