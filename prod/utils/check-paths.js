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
exports.checkPaths = void 0;
const child_process_1 = require("child_process");
const util_1 = require("util");
/**
 * Utility to print the current directory and its contents.
 */
const checkPaths = () => __awaiter(void 0, void 0, void 0, function* () {
    const currentDirectory = process.cwd();
    const awaitExec = (0, util_1.promisify)(child_process_1.exec);
    const currentDirectoryContents = (yield awaitExec("ls -a")).stdout;
    console.table({ currentDirectory, currentDirectoryContents });
});
exports.checkPaths = checkPaths;
