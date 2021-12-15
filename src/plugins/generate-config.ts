import { exec } from "child_process";
import { promisify } from "util";

/**
 * Locates the correct config file for the provided project, and copies it to
 * the current file system.
 *
 * @param {string} projectName The name of the project to load a config for.
 */
export const generateConfig = async (projectName: string) => {
  const asyncExec = promisify(exec);
  const configPath = `${__dirname}/../configs/${projectName}.yml`;
  await asyncExec(`cp ${configPath} ./crowdin-config.yml`);
};
