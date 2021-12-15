import { readFileSync } from "fs";
import { join } from "path";

import matter from "gray-matter";

import {
  ChallengeTitleLookup,
  CrowdinFileData,
} from "../interfaces/CrowdinParsedData";
import { CrowdinFilesHelper } from "../utils/files";
import { CrowdinStringHelper } from "../utils/strings";

const createChallengeTitleLookup = (
  lookup: ChallengeTitleLookup,
  { fileId, path: crowdinFilePath }: CrowdinFileData
) => {
  const challengeFilePath = join(process.cwd(), crowdinFilePath);
  try {
    const challengeContent = readFileSync(challengeFilePath, "utf-8");
    const {
      data: { title: challengeTitle },
    } = matter(challengeContent);
    return {
      ...lookup,
      [fileId]: {
        crowdinFilePath,
        challengeTitle,
      },
    };
  } catch (err) {
    console.log(JSON.stringify(err), null, 2);
    return lookup;
  }
};

/**
 * Module to hide the curriculum strings.
 *
 * @param {number} projectId The ID of the project to hide the strings for.
 */
export const hideCurriculumStrings = async (projectId: number) => {
  console.log("Hiding non-translated strings...");
  const crowdinFiles = await CrowdinFilesHelper.getFiles(projectId);
  if (crowdinFiles && crowdinFiles.length) {
    const challengeTitleLookup: ChallengeTitleLookup = crowdinFiles.reduce(
      (lookup, file) => createChallengeTitleLookup(lookup, file),
      {}
    );
    const crowdinStrings = await CrowdinStringHelper.getStrings(projectId);
    if (crowdinStrings && crowdinStrings.length) {
      for (const string of crowdinStrings) {
        const { crowdinFilePath, challengeTitle } =
          challengeTitleLookup[string.data.fileId];
        await CrowdinStringHelper.updateFileString(
          projectId,
          string,
          challengeTitle,
          crowdinFilePath
        );
      }
    }
  }
  console.log("complete");
};
