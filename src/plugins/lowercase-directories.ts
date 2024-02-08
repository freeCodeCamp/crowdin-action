import { rename } from "fs";
import { join } from "path";

/**
 *
 * @param {string[]} directories The directories that must be sorted through.
 */
export const lowercaseDirectories = async (directories: string[]) => {
  console.info("Getting file list...");
  for (const directory of directories) {
    if (directory.toLocaleLowerCase() !== directory) {
      const oldPath = join(process.cwd(), directory);
      const newPath = join(process.cwd(), directory.toLocaleLowerCase());
      await rename(oldPath, newPath, (err) => {
        if (err) {
          console.error("Error making directory lowercase:", err);
        } else {
          console.log(`${directory} has been made lowercase`);
        }
      });
    }
  }
};
