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
exports.CrowdinStringHelper = void 0;
const auth_header_1 = require("./auth-header");
const make_request_1 = require("./make-request");
const isReservedHeading = (context, str) => {
    const reservedHeadings = [
        "after-user-code",
        "answers",
        "before-user-code",
        "description",
        "fcc-editable-region",
        "hints",
        "instructions",
        "question",
        "seed",
        "seed-contents",
        "solutions",
        "text",
        "video-solution",
    ];
    const captureGroupString = `(${reservedHeadings.join("|")})`;
    const regex = new RegExp(`--${captureGroupString}--`);
    return !!(context.match(/^Headline/) && str.match(regex));
};
const isCode = (str) => /^\/pre\/code|\/code$/.test(str);
const isTitle = (str) => str.endsWith("title");
const shouldHide = (text, context, challengeTitle, crowdinFilePath) => {
    if (crowdinFilePath.endsWith("yml")) {
        return !isTitle(context);
    }
    if (isReservedHeading(context, text) || isCode(context)) {
        return true;
    }
    return text !== challengeTitle && context.includes("id=front-matter");
};
const getStrings = (projectId, fileId) => __awaiter(void 0, void 0, void 0, function* () {
    const headers = Object.assign({}, auth_header_1.authHeader);
    let done = false;
    let offset = 0;
    let strings = [];
    while (!done) {
        let endPoint = `projects/${projectId}/files/${fileId}/strings?limit=500&offset=${offset}`;
        if (fileId) {
            endPoint += `&file_id=${fileId}`;
        }
        const response = yield (0, make_request_1.makeRequest)({
            method: "get",
            endPoint,
            headers,
        });
        if (response && response.data) {
            if (response.data.length) {
                strings = [...strings, ...response.data];
                offset += 500;
            }
            else {
                done = true;
                return strings;
            }
        }
        else {
            console.log(JSON.stringify(response, null, 2));
            return null;
        }
    }
});
const updateString = (projectId, stringId, propsToUpdate) => __awaiter(void 0, void 0, void 0, function* () {
    const headers = Object.assign({}, auth_header_1.authHeader);
    const endPoint = `projects/${projectId}/strings/${stringId}`;
    const body = propsToUpdate.map(({ path, value }) => ({
        op: "replace",
        path,
        value,
    }));
    yield (0, make_request_1.makeRequest)({
        method: "patch",
        endPoint,
        headers,
        body,
        contentType: "application/json",
    });
});
const changeHiddenStatus = (projectId, stringId, newStatus) => __awaiter(void 0, void 0, void 0, function* () {
    yield updateString(projectId, stringId, [
        { path: "/isHidden", value: newStatus },
    ]);
});
const updateFileStrings = (projectId, fileId, challengeTitle) => __awaiter(void 0, void 0, void 0, function* () {
    const fileStrings = yield getStrings(projectId, fileId);
    if (!fileStrings) {
        return;
    }
    for (const { data: { id: stringId, text, isHidden, context, type }, } of fileStrings) {
        const hideString = shouldHide(text, context, challengeTitle, type);
        if (!isHidden && hideString) {
            yield changeHiddenStatus(projectId, stringId, true);
        }
        else if (isHidden && !hideString) {
            yield changeHiddenStatus(projectId, stringId, false);
        }
    }
});
const updateFileString = (projectId, string, challengeTitle, crowdinFilePath) => __awaiter(void 0, void 0, void 0, function* () {
    const { data: { id: stringId, text, isHidden, context }, } = string;
    const hideString = shouldHide(text, context, challengeTitle, crowdinFilePath);
    if (!isHidden && hideString) {
        yield changeHiddenStatus(projectId, stringId, true);
        console.log(`${challengeTitle} - stringId: ${stringId} - changed isHidden to true`);
    }
    else if (isHidden && !hideString) {
        yield changeHiddenStatus(projectId, stringId, false);
        console.log(`${challengeTitle} - stringId: ${stringId} - changed isHidden to false`);
    }
});
exports.CrowdinStringHelper = {
    getStrings,
    shouldHide,
    changeHiddenStatus,
    updateFileString,
    updateFileStrings,
};
