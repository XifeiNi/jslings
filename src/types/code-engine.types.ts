import { Exercise } from "./exercises.types";
import { UserData } from "./user.types";

/**
 * This interface implements our testing engine
 */
export interface CodeEngineInterface {
    userdata: UserData;
    database: Exercise[];
    minifiedCode?: string;
    /**
     * Checks the syntax of provided code. Use of Terser also minifies the code which we can use for further analysis
     */
    minifyCodeAndCheckSyntax(): Promise<void>;

    runTest(): void;
}

/**
 * Implements the err returned by Terser
 */
export interface MinifyError extends Error {
    name: string;
    message: string;
    filename?: string;
    line?: number;
    col?: number;
    pos?: number;
}
