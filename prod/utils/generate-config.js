"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateConfig = void 0;
/**
 * Constructs a path name based on a project name to point to the
 * Crowdin config file for that project.
 *
 * @param {string} projectName The name of the project to load a config for.
 * @returns {string} The path to the config yaml file.
 */
const generateConfig = (projectName) => {
    return `${process.cwd()}/prod/configs/${projectName}.yml`;
};
exports.generateConfig = generateConfig;
