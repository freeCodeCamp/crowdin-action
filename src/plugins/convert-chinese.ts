import { readdir, readFile, stat } from "fs/promises";
import { join } from "path";

import { outputFile } from "fs-extra";
import opencc from "node-opencc";

const getFiles = async (directory: string, fileList: string[] = []) => {
  const files = await readdir(directory);
  for (const file of files) {
    const fileStat = await stat(join(directory, file));
    if (fileStat.isDirectory()) {
      // eslint-disable-next-line no-param-reassign
      fileList = await getFiles(join(directory, file), fileList);
    } else {
      fileList.push(join(directory, file));
    }
  }
  return fileList;
};

/**
 * Module to convert Simplified Chinese files to Traditional Chinese.
 *
 * @param {string[]} directories The directory to convert.
 */
export const convertChinese = async (directories: string[]) => {
  console.info("Getting file list...");
  for (const directory of directories) {
    const files = await getFiles(join(process.cwd(), directory));
    for (const file of files) {
      console.info(`Converting ${file}...`);
      const fileText = await readFile(file, "utf-8");
      const translatedText = await opencc.simplifiedToTraditional(fileText);
      if (process.env.USE_LANG_CODE) {
        await outputFile(file.replace("zh", "zh-TW"), translatedText);
      } else {
        await outputFile(
          file.replace("chinese", "chinese-traditional"),
          translatedText
        );
      }
    }
  }
};
