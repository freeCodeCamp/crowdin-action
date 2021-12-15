/**
 * Constructs a path name based on a project name to point to the
 * Crowdin config file for that project.
 *
 * @param {string} projectName The name of the project to load a config for.
 * @returns {string} The path to the config yaml file.
 */
export const generateConfig = (projectName: string) => {
  return `${process.cwd()}/prod/configs/${projectName}.yml`;
};
