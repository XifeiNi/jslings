import * as fs from "fs";
import { FileStatus } from "../../types/exercises.types";

/**
 * Returns status of file with name starting with `partialFileName` in `path`
 * @param path Path to look into
 * @param partialFileName Partial name to match
 */
export const isFilePresent = (
    path: string,
    partialFileName: string,
): FileStatus => {
    try {
        const files = fs
            .readdirSync(path)
            .map((file) => file.startsWith(partialFileName));
        if (files.length > 0) {
            if (files.length === 1) {
                return FileStatus.SUCCESS;
            }
            return FileStatus.INCONCLUSIVE;
        }
        // Should never reach here
        return FileStatus.FAILURE;
    } catch (_) {
        return FileStatus.FAILURE;
    }
};

/**
 * A utility function to list all the file names present inside a folder
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


/**
 * Given a file, obtain its contents as a string
 * @param path Path to the file
 */
export const obtainStringifiedFileContents = (path: string): string => {
    try {
        return fs.readFileSync(path, 'utf-8')
    } catch(_) {
        throw new Error(`File not found at ${path}`)
    }
}

/**
 * Parse the contents of stringified data and return it as an object
 * @param stringifiedData
 */
export const jsonParsedFileContents = <T>(stringifiedData: string): T => {
    try {
        return JSON.parse(stringifiedData) as T
    } catch(_) {
        throw new Error(`Stringified file could not be parsed in the provided type`)
    }
}