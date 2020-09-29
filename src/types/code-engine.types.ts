import { Exercise } from "./exercises.types";
import { UserData } from "./user.types";

/**
 * This interface implements our testing engine
 */
export interface CodeEngineInterface {
    userdata: UserData;
    database: Exercise[];
    runTest(): void;
}
