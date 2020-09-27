/**
 * The status of all tests can be only among these types
 */
export enum Status {
    PENDING = "P",
    CURRENT = "C",
    DONE = "X",
}

/**
 * The Status of the Test Files
 */
export enum FileStatus {
    INCONCLUSIVE = "X", // Inconclusive simply means we could not uniquely identify the filename in our directory structure. A drawback of using partial test names
    SUCCESS = "S",
    FAILURE = "F",
}

/**
 * Each exercise should follow this interface and contain these dataPoints
 */
export interface Exercise {
    id: string;
    name: string;
    path: string;
    hints: [string];
    testPath: string;
}

/**
 * Test file points to the location of the file on the filesystem
 */
export type TestFile = { testFileName: string };