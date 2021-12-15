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
const core_1 = require("@actions/core");
const convert_chinese_1 = require("./plugins/convert-chinese");
const hide_curriculum_strings_1 = require("./plugins/hide-curriculum-strings");
const hide_specific_string_1 = require("./plugins/hide-specific-string");
const remove_deleted_files_1 = require("./plugins/remove-deleted-files");
const unhide_specific_string_1 = require("./plugins/unhide-specific-string");
const check_paths_1 = require("./utils/check-paths");
const generate_config_1 = require("./utils/generate-config");
const validate_environment_1 = require("./utils/validate-environment");
(() => __awaiter(void 0, void 0, void 0, function* () {
    const validEnvironment = (0, validate_environment_1.validateEnvironment)();
    if (!validEnvironment) {
        (0, core_1.setFailed)("Missing Crowdin credentials.");
        return;
    }
    const projectId = parseInt(process.env.CROWDIN_PROJECT_ID || "", 10);
    if (isNaN(projectId)) {
        (0, core_1.setFailed)("Invalid Crowdin project ID.");
        return;
    }
    const plugin = process.env.PLUGIN;
    if (!plugin) {
        (0, core_1.setFailed)("No plugins specified.");
        return;
    }
    switch (plugin) {
        case "check-paths":
            yield (0, check_paths_1.checkPaths)();
            break;
        case "generate-config":
            if (!process.env.PROJECT_NAME) {
                (0, core_1.setFailed)("Missing project name.");
                break;
            }
            (0, core_1.setOutput)("config", (0, generate_config_1.generateConfig)(process.env.PROJECT_NAME));
            break;
        case "convert-chinese":
            if (!process.env.FILE_PATH) {
                (0, core_1.setFailed)("Missing file path.");
                break;
            }
            yield (0, convert_chinese_1.convertChinese)(process.env.FILE_PATH);
            break;
        case "hide-curriculum-strings":
            yield (0, hide_curriculum_strings_1.hideCurriculumStrings)(projectId);
            break;
        case "hide-string":
            if (!process.env.FILE_NAME || !process.env.STRING_CONTENT) {
                (0, core_1.setFailed)("Missing file name and/or string content.");
                break;
            }
            yield (0, hide_specific_string_1.hideSpecificString)(projectId, process.env.FILE_NAME, process.env.STRING_CONTENT);
            break;
        case "remove-deleted-files":
            if (!process.env.FILE_PATH) {
                (0, core_1.setFailed)("Missing file path.");
                break;
            }
            yield (0, remove_deleted_files_1.removeDeletedFiles)(projectId, process.env.FILE_PATH);
            break;
        case "unhide-string":
            if (!process.env.FILE_NAME || !process.env.STRING_CONTENT) {
                (0, core_1.setFailed)("Missing file name and/or string content.");
                break;
            }
            yield (0, unhide_specific_string_1.unhideSpecificString)(projectId, process.env.FILE_NAME, process.env.STRING_CONTENT);
            break;
        default:
            (0, core_1.setFailed)("Invalid plugin specified.");
    }
}))();
