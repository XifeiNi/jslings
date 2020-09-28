import { Exercise } from "./exercises.types";
import { UserData } from "./user.types";

export type Command = {
    key: string;
    name: string;
    handler: (state: State) => Promise<void>;
};

export type State = {
    userdata: UserData;
    database: Exercise[];
};
