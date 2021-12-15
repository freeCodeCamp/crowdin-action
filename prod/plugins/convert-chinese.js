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
exports.convertChinese = void 0;
const promises_1 = require("fs/promises");
const path_1 = require("path");
const fs_extra_1 = require("fs-extra");
const node_opencc_1 = __importDefault(require("node-opencc"));
const getFiles = (directory, fileList = []) => __awaiter(void 0, void 0, void 0, function* () {
    const files = yield (0, promises_1.readdir)(directory);
    for (const file of files) {
        const fileStat = yield (0, promises_1.stat)((0, path_1.join)(directory, file));
        if (fileStat.isDirectory()) {
            // eslint-disable-next-line no-param-reassign
            fileList = yield getFiles((0, path_1.join)(directory, file), fileList);
        }
        else {
            fileList.push((0, path_1.join)(directory, file));
        }
    }
    return fileList;
});
/**
 * Module to convert Simplified Chinese files to Traditional Chinese.
 *
 * @param {string} directory The directory to convert.
 */
const convertChinese = (directory) => __awaiter(void 0, void 0, void 0, function* () {
    console.info("Getting file list...");
    const files = yield getFiles((0, path_1.join)(process.cwd(), directory));
    for (const file of files) {
        console.info(`Converting ${file}...`);
        const fileText = yield (0, promises_1.readFile)(file, "utf-8");
        const translatedText = yield node_opencc_1.default.simplifiedToTraditional(fileText);
        yield (0, fs_extra_1.outputFile)(file.replace("chinese", "chinese-traditional"), translatedText);
    }
});
exports.convertChinese = convertChinese;
