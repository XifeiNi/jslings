import * as fs from "fs";

/**
 * Returns true if a file with name starting with `partialFileName` is present in `path`
 * @param path Path to look into
 * @param partialFileName Partial name to match
 */
export const isFilePresent = (
  path: string,
  partialFileName: string,
): boolean => {
  try {
    const files = fs
      .readdirSync(path)
      .filter((fn) => fn.startsWith(partialFileName));

    return files.length > 0;
  } catch (_) {
    return false;
  }
};

/**
 * A utility function to list all the files present inside a folder
 * @param source Path to look into
 */
export const listFiles = (source: string): string[] => {
  try {
    return fs
      .readdirSync(source, { withFileTypes: true })
      .filter((dirent) => dirent.isDirectory())
      .map((dirent) => dirent.name);
  } catch (_) {
    return [];
  }
};
