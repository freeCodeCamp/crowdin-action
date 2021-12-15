import { setFailed, setOutput } from "@actions/core";

import { convertChinese } from "./plugins/convert-chinese";
import { hideCurriculumStrings } from "./plugins/hide-curriculum-strings";
import { hideSpecificString } from "./plugins/hide-specific-string";
import { removeDeletedFiles } from "./plugins/remove-deleted-files";
import { unhideSpecificString } from "./plugins/unhide-specific-string";
import { checkPaths } from "./utils/check-paths";
import { generateConfig } from "./utils/generate-config";
import { validateEnvironment } from "./utils/validate-environment";

(async () => {
  const validEnvironment = validateEnvironment();

  if (!validEnvironment) {
    setFailed("Missing Crowdin credentials.");
    return;
  }

  const projectId = parseInt(process.env.CROWDIN_PROJECT_ID || "", 10);

  if (isNaN(projectId)) {
    setFailed("Invalid Crowdin project ID.");
    return;
  }

  const plugin = process.env.PLUGIN;

  if (!plugin) {
    setFailed("No plugins specified.");
    return;
  }

  switch (plugin) {
    case "check-paths":
      await checkPaths();
      break;
    case "generate-config":
      if (!process.env.PROJECT_NAME) {
        setFailed("Missing project name.");
        break;
      }
      await generateConfig(process.env.PROJECT_NAME);
      break;
    case "convert-chinese":
      if (!process.env.FILE_PATH) {
        setFailed("Missing file path.");
        break;
      }
      await convertChinese(process.env.FILE_PATH);
      break;
    case "hide-curriculum-strings":
      await hideCurriculumStrings(projectId);
      break;
    case "hide-string":
      if (!process.env.FILE_NAME || !process.env.STRING_CONTENT) {
        setFailed("Missing file name and/or string content.");
        break;
      }
      await hideSpecificString(
        projectId,
        process.env.FILE_NAME,
        process.env.STRING_CONTENT
      );
      break;
    case "remove-deleted-files":
      if (!process.env.FILE_PATH) {
        setFailed("Missing file path.");
        break;
      }
      await removeDeletedFiles(projectId, process.env.FILE_PATH);
      break;
    case "unhide-string":
      if (!process.env.FILE_NAME || !process.env.STRING_CONTENT) {
        setFailed("Missing file name and/or string content.");
        break;
      }
      await unhideSpecificString(
        projectId,
        process.env.FILE_NAME,
        process.env.STRING_CONTENT
      );
      break;
    default:
      setFailed("Invalid plugin specified.");
  }
})();
