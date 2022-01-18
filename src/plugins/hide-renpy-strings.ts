import { CrowdinFilesHelper } from "../utils/files";
import { CrowdinStringHelper } from "../utils/strings";

const labelNames = [
  "new",
  "player",
  "kid",
  "mom",
  "dad",
  "mint",
  "annika",
  "girl",
  "boy",
  "college_boy",
  "college_girl",
  "female",
  "marco",
  "layla",
  "cafe_manager",
  "host",
  "journalist",
  "office_worker",
  "male",
  "trivia_guy",
  "interviewer",
  "npc",
];

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
    let prevStringHidden = false;
    for (const string of fileStrings) {
      const trimText = string.data.text.trim();
      const quoteRegex = /^['"]/;
      if (
        trimText.startsWith("translate") ||
        trimText.startsWith("old") ||
        trimText.startsWith("#") ||
        (prevStringHidden &&
          labelNames.every((label) => !trimText.startsWith(label)) &&
          !quoteRegex.test(trimText))
      ) {
        prevStringHidden = true;
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
        prevStringHidden = false;
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
