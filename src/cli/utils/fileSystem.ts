import * as fs from "fs";
import * as path from "path";
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
        return fs.readFileSync(path, "utf-8");
    } catch (_) {
        throw new Error(`File not found at ${path}`);
    }
};

/**
 * Parse the contents of stringified data and return it as an object
 * @param stringifiedData
 */
export const jsonParsedFileContents = <T>(stringifiedData: string): T => {
    try {
        return JSON.parse(stringifiedData) as T;
    } catch (_) {
        throw new Error(
            `Stringified file could not be parsed in the provided type`,
        );
    }
};

/**
 * Loads a json file if present and converts to specified interface. If not present, create and then retrieve data
 * @param folderPath Path to the file's folder
 * @param filename Name of the file: can be partial too
 */
export const loadJSONDataFromFileIfPresentElseCreateFileAndLoad = <T>(
    folderPath: string,
    filename: string,
): T => {
    try {
        if (!isFilePresent(folderPath, filename)) {
            fs.writeFileSync(path.join(folderPath, filename), "{}", "utf-8");
        }
        const dataPath = path.join(folderPath, filename);
        return jsonParsedFileContents<T>(
            obtainStringifiedFileContents(dataPath),
        );
    } catch (err) {
        throw err;
    }
};

/**
 * Save the contents of data to file
 * @param data Data to save
 * @param folderpath Folder to save to
 * @param filename Name of the file
 */
export const writeFileToPath = <T>(
    data: T,
    folderpath: string,
    filename: string,
) => {
    try {
        const filePath = path.join(folderpath, filename);
        fs.writeFileSync(filePath, JSON.stringify(data, null, 4), "utf-8");
    } catch (err) {
        throw new Error(`Could not save to ${path.join(folderpath, filename)}`);
    }
};
