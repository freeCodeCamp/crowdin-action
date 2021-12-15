import { CrowdinFilesHelper } from "../utils/files";
import { CrowdinStringHelper } from "../utils/strings";

/**
 * Module to unhide a specific string on Crowdin.
 *
 * @param {number} projectId The ID of the project to hide the string for.
 * @param {string} fileName The name of the file to hide the string in.
 * @param {string} string The content of the string to hide.
 * @returns {Promise<boolean>} True if the string was unhidden, false otherwise.
 */
export const unhideSpecificString = async (
  projectId: number,
  fileName: string,
  string: string
) => {
  const fileResponse = await CrowdinFilesHelper.getFiles(projectId);
  if (!fileResponse) {
    return false;
  }
  const targetFile = fileResponse.find((el) => el.path.endsWith(fileName));
  if (!targetFile) {
    return false;
  }
  const stringResponse = await CrowdinStringHelper.getStrings(
    projectId,
    targetFile.fileId
  );
  if (!stringResponse) {
    return false;
  }
  const targetString = stringResponse.find((el) => el.data.text === string);
  if (!targetString) {
    return false;
  }
  await CrowdinStringHelper.changeHiddenStatus(
    projectId,
    targetString.data.id,
    false
  );
  return true;
};
