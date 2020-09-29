import { run } from "jest-cli";
import childprocess from "child_process";
import { CodeEngineInterface } from "../../types/code-engine.types";
import { Exercise } from "../../types/exercises.types";
import { UserData } from "../../types/user.types";

export class CodeEngine implements CodeEngineInterface {
    userdata: UserData;
    database: Exercise[];
    constructor(userdata: UserData, database: Exercise[]) {
        this.userdata = userdata;
        this.database = database;
    }

    /**
     * Jest runner watching for changes in our script which consumes the user's code
     */
    async runTest(): Promise<Number | null> {
        // Config for the Jest test instance needs to be provided as is in an array
        const args: string[] = [
            this.userdata.current.info.testPath,
            "--detectOpenHandles",
        ];
        try {
            const child = childprocess.spawnSync("jest", args, {
                encoding: "utf8",
            });
            await run(args);
            return child.status;
        } catch (err) {
            throw err;
        }
    }
}
