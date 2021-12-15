import { exec } from "child_process";
import { promisify } from "util";

/**
 * Utility to print the current directory and its contents.
 */
export const checkPaths = async () => {
  const currentDirectory = process.cwd();
  const awaitExec = promisify(exec);
  const currentDirectoryContents = (await awaitExec("ls -a")).stdout;
  console.table({ currentDirectory, currentDirectoryContents });
};
