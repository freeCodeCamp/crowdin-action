/**
 * Filtered file data to expose specific properties and minimise
 * memory consumption.
 */
export interface CrowdinFileData {
  directoryId: number;
  fileId: number;
  path: string;
}

export interface ChallengeTitleLookup {
  [key: string]: { crowdinFilePath: string; challengeTitle: string };
}
