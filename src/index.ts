import { setFailed } from "@actions/core";

import { checkPaths } from "./plugins/check-paths";
import { commitChanges } from "./plugins/commit-changes";
import { convertChinese } from "./plugins/convert-chinese";
import { generateConfig } from "./plugins/generate-config";
import { hideCurriculumStrings } from "./plugins/hide-curriculum-strings";
import { hideReplitStrings } from "./plugins/hide-replit-strings";
import { hideSpecificString } from "./plugins/hide-specific-string";
import { createPullRequest } from "./plugins/pull-request";
import { removeDeletedFiles } from "./plugins/remove-deleted-files";
import { unhideSpecificString } from "./plugins/unhide-specific-string";
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
    case "commit-changes":
      if (
        !process.env.GH_USERNAME ||
        !process.env.GH_EMAIL ||
        !process.env.GH_BRANCH ||
        !process.env.GH_MESSAGE
      ) {
        setFailed("Missing commit configuration data.");
        break;
      }
      await commitChanges(
        process.env.GH_USERNAME,
        process.env.GH_EMAIL,
        process.env.GH_BRANCH,
        process.env.GH_MESSAGE
      );
      break;
    case "convert-chinese":
      if (!process.env.FILE_PATHS) {
        setFailed("Missing file paths.");
        break;
      }
      await convertChinese(JSON.parse(process.env.FILE_PATHS));
      break;
    case "generate-config":
      if (!process.env.PROJECT_NAME) {
        setFailed("Missing project name.");
        break;
      }
      await generateConfig(process.env.PROJECT_NAME);
      break;
    case "hide-curriculum-strings":
      await hideCurriculumStrings(projectId);
      break;
    case "hide-renpy-strings":
      await hideReplitStrings(projectId);
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
    case "pull-request":
      if (
        !process.env.GH_TOKEN ||
        !process.env.BRANCH ||
        !process.env.REPOSITORY ||
        !process.env.BASE ||
        !process.env.TITLE ||
        !process.env.BODY
      ) {
        setFailed("Missing pull request configuration data.");
        break;
      }
      (await createPullRequest(
        process.env.GH_TOKEN,
        process.env.BRANCH,
        process.env.REPOSITORY,
        process.env.BASE,
        process.env.TITLE,
        process.env.BODY,
        process.env.LABELS,
        process.env.REVIEWERS,
        process.env.TEAM_REVIEWERS
      ))
        ? null
        : setFailed("Failed to create pull request.");
      break;
    case "remove-deleted-files":
      if (!process.env.FILE_PATHS) {
        setFailed("Missing file path.");
        break;
      }
      await removeDeletedFiles(projectId, JSON.parse(process.env.FILE_PATHS));
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
