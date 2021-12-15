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
exports.getLanguages = void 0;
const auth_header_1 = require("./auth-header");
const make_request_1 = require("./make-request");
/**
 * Utility to list the language IDs available on a given Crowdin project.
 *
 * @param {string} projectId The project ID from Crowdin.
 * @returns {Promise<string[]>} A promise that resolves to an array of language IDs.
 */
const getLanguages = (projectId) => __awaiter(void 0, void 0, void 0, function* () {
    const headers = Object.assign({}, auth_header_1.authHeader);
    const endPoint = `/projects/${projectId}?limit=500`;
    const response = yield (0, make_request_1.makeRequest)({
        method: "GET",
        endPoint,
        headers,
    });
    if (response && response.targetLanguageIds.length) {
        return response.targetLanguageIds;
    }
    else {
        console.log(JSON.stringify(response, null, 2));
        return null;
    }
});
exports.getLanguages = getLanguages;
