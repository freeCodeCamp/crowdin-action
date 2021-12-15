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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hideCurriculumStrings = void 0;
const fs_1 = require("fs");
const path_1 = require("path");
const gray_matter_1 = __importDefault(require("gray-matter"));
const files_1 = require("../utils/files");
const strings_1 = require("../utils/strings");
const createChallengeTitleLookup = (lookup, { fileId, path: crowdinFilePath }) => {
    const challengeFilePath = (0, path_1.join)(process.cwd(), crowdinFilePath);
    try {
        const challengeContent = (0, fs_1.readFileSync)(challengeFilePath, "utf-8");
        const { data: { title: challengeTitle }, } = (0, gray_matter_1.default)(challengeContent);
        return Object.assign(Object.assign({}, lookup), { [fileId]: {
                crowdinFilePath,
                challengeTitle,
            } });
    }
    catch (err) {
        console.log(JSON.stringify(err), null, 2);
        return lookup;
    }
};
/**
 * Module to hide the curriculum strings.
 *
 * @param {number} projectId The ID of the project to hide the strings for.
 */
const hideCurriculumStrings = (projectId) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Hiding non-translated strings...");
    const crowdinFiles = yield files_1.CrowdinFilesHelper.getFiles(projectId);
    if (crowdinFiles && crowdinFiles.length) {
        const challengeTitleLookup = crowdinFiles.reduce((lookup, file) => createChallengeTitleLookup(lookup, file), {});
        const crowdinStrings = yield strings_1.CrowdinStringHelper.getStrings(projectId);
        if (crowdinStrings && crowdinStrings.length) {
            for (const string of crowdinStrings) {
                const { crowdinFilePath, challengeTitle } = challengeTitleLookup[string.data.fileId];
                yield strings_1.CrowdinStringHelper.updateFileString(projectId, string, challengeTitle, crowdinFilePath);
            }
        }
    }
    console.log("complete");
});
exports.hideCurriculumStrings = hideCurriculumStrings;
