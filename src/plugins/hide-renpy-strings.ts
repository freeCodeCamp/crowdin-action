import { CrowdinFilesHelper } from "../utils/files";
import { CrowdinStringHelper } from "../utils/strings";

/**
 * Module to hide strings for Renpy translations (such as in LearnToCodeRPG).
 * Hides any string that doesn't start with `new`.
 *
 * @param {number} projectId The Crowdin project ID for strings to hide.
 */
export const hideRenpyStrings = async (projectId: number) => {
  const projectFiles = await CrowdinFilesHelper.getFiles(projectId);
  if (!projectFiles || !projectFiles.length) {
    return;
  }
  for (const file of projectFiles) {
    const fileStrings = await CrowdinStringHelper.getStrings(
      projectId,
      file.fileId
    );
    if (!fileStrings || !fileStrings.length) {
      continue;
    }
    for (const string of fileStrings) {
      if (
        string.data.text.startsWith("translate") ||
        string.data.text.startsWith("old") ||
        string.data.text.startsWith("#")
      ) {
        if (string.data.isHidden) {
          console.log(`string already hidden: ${string.data.text}`);
          continue;
        }
        console.log(`hiding string: ${string.data.text}`);
        await CrowdinStringHelper.changeHiddenStatus(
          projectId,
          string.data.id,
          true
        );
      } else {
        if (!string.data.isHidden) {
          console.log(`string already visible: ${string.data.text}`);
          continue;
        }
        console.log(`keeping string: ${string.data.text}`);
        await CrowdinStringHelper.changeHiddenStatus(
          projectId,
          string.data.id,
          false
        );
      }
    }
  }
};
