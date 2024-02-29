import { Dirent } from "fs";
import { readdir, rename } from "fs/promises";
import { join } from "path";

async function readAllFiles(dir: string): Promise<string[]> {
  const files: Dirent[] = await readdir(dir, { withFileTypes: true });
  let allFiles: string[] = [];
  for (const file of files) {
    const filePath = join(dir, file.name);
    if (file.isDirectory()) {
      const subFiles = await readAllFiles(filePath);
      allFiles = allFiles.concat(subFiles);
    } else {
      allFiles.push(filePath);
    }
  }
  return allFiles;
}

// Recursive function to process directories and subdirectories
const processDirectory = async (dirPath: string) => {
  // Get all files recursively
  const allFiles = await readAllFiles(dirPath);

  // Lowercase directory names
  for (const filePath of allFiles) {
    const dirPath = filePath.split("/").slice(0, -1).join("/");
    const dirName = filePath.split("/").pop();
    const lowercasedDirName = dirName?.toLowerCase();
    if (lowercasedDirName === undefined) {
      throw new Error("Lowercased DirName Required");
    }

    if (lowercasedDirName !== dirName) {
      const newPath = join(dirPath, lowercasedDirName);
      console.log(`Renaming directory ${filePath} to ${newPath}`);
      await rename(filePath, newPath);
    }
  }
};

/**
 *
 * @param {string} directory The directory tree that must be sorted through.
 */
export const lowercaseDirectories = (directory: string) => {
  console.info("Getting directory list...");
  processDirectory(directory);
};
