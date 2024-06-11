import { Dirent } from "fs";
import { readdir, rename } from "fs/promises";
import { join } from "path";

// Recursive function to process directories and subdirectories
async function lowerCaseSubDirectories(dir: string): Promise<void> {
  const files: Dirent[] = await readdir(dir, { withFileTypes: true });
  for (const file of files) {
    if (file.isDirectory()) {
      const filePath = join(dir, file.name);
      const newFilePath = join(dir, file.name.toLowerCase());

      console.log(`Renaming directory ${filePath} to ${newFilePath}`);
      await rename(filePath, newFilePath);
      await lowerCaseSubDirectories(newFilePath);
    }
  }
}

/**
 *
 * @param {string} directory The directory tree that must be sorted through.
 */
export const lowercaseDirectories = (directory: string) => {
  console.info("Getting directory list...");
  lowerCaseSubDirectories(directory);
};
