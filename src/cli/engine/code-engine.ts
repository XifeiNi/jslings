import nullthrows from "nullthrows";
import { minify, MinifyOutput } from "terser";
import { run } from "jest-cli";
import {
    MinifyError,
    CodeEngineInterface,
} from "../../types/code-engine.types";
import { obtainStringifiedFileContents } from "../utils/fileSystem";
import { Exercise } from "../../types/exercises.types";
import { UserData } from "../../types/user.types";

export class CodeEngine implements CodeEngineInterface {
    userdata: UserData;
    database: Exercise[];
    minifiedCode?: string;
    constructor(userdata: UserData, database: Exercise[]) {
        this.userdata = userdata;
        this.database = database;
    }

    /**
     * Checks for the syntax of minified code
     */
    async minifyCodeAndCheckSyntax(): Promise<void> {
        try {
            const localCode = obtainStringifiedFileContents(
                this.userdata.current.info.path,
            );
            const minifyOutput = await this._checkSyntaxAndMinify(localCode);
            this.minifiedCode = nullthrows(minifyOutput.code);
        } catch (err) {
            throw err;
        }
    }

    /**
     * Jest runner watching for changes in our script which consumes the user's code
     */
    async runTest() {
        // Config for the Jest test instance needs to be provided as is in an array
        const args: string[] = [this.userdata.current.info.testPath];
        try {
            return await run(args);
        } catch (err) {
            throw err;
        }
    }

    /**
     * The code passed is checked for syntax and minified
     * @param code Stringified code
     * @throws If syntax is invalid
     */
    private async _checkSyntaxAndMinify(code: string): Promise<MinifyOutput> {
        try {
            return await minify(code);
        } catch (err) {
            const errObject: MinifyError = {
                name: err.name,
                message: err.message,
                filename: err.filename,
                line: err.line,
                col: err.col,
                pos: err.pos,
            };
            throw errObject;
        }
    }
}
