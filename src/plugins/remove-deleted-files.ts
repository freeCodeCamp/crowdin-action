import { readdir } from "fs/promises";

import { CrowdinFilesHelper } from "../utils/files";

const recursiveWalk = async (path: string, files: string[] = []) => {
  const entities = await readdir(path, { withFileTypes: true });
  for (const entity of entities) {
    const fullPath = `${path}/${entity.name}`;
    if (entity.isDirectory()) {
      await recursiveWalk(fullPath, files);
    } else {
      files.push(fullPath);
    }
  }
  return files;
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
      const localFilesArray = await recursiveWalk(path);
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
