import { exec } from "child_process";
import { promisify } from "util";

import { CrowdinFilesHelper } from "../utils/files";

const getOutputFromShellCommand = async (command: string) => {
  try {
    const awaitExec = promisify(exec);
    const { stdout } = await awaitExec(command);
    return stdout;
  } catch (error) {
    console.log("Error");
    console.log(command);
    console.log(JSON.stringify(error, null, 2));
  }
};

/**
 * Module to remove files from a Crowdin project if they are no longer present
 * in the source repository.
 *
 * @param {number} projectId The ID of the project to remove files from.
 * @param {string[]} paths The base paths for the files to check.
 * @returns {boolean} True if files were successfully removed, false if no files were present on Crowdin.
 */
export const removeDeletedFiles = async (
  projectId: number,
  paths: string[]
) => {
  console.log("Cleaning deleted files...");
  const crowdinFiles = await CrowdinFilesHelper.getFiles(projectId);
  if (crowdinFiles && crowdinFiles.length) {
    let totalFiles: string[] = [];
    for (const path of paths) {
      const shellCommand = `find ${path} -name \\*.*`;
      const localFiles = await getOutputFromShellCommand(shellCommand);
      const localFilesArray = localFiles?.split("\n");
      if (localFilesArray?.length) {
        totalFiles = totalFiles.concat(localFilesArray);
      }
    }
    const localFilesMap: { [key: string]: string } = totalFiles.reduce(
      (map, filename) => ({ ...map, [filename]: true }),
      {}
    );
    for (const { fileId, path: crowdinFilePath } of crowdinFiles) {
      if (!localFilesMap[crowdinFilePath]) {
        await CrowdinFilesHelper.deleteFile(projectId, fileId, crowdinFilePath);
      }
    }
  } else {
    console.log(`WARNING! No files found for project ${projectId}`);
    return false;
  }
  console.log("File deletion process complete.");
  return true;
};
