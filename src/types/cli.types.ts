import { Exercise } from "./exercises.types";
import { UserData } from "./user.types";

export type Command = {
    key: string;
    name: string;
    handler: (state: State, action: KeyAction) => State;
};

type ShowHintMode = {
    type: "showHint";
};

type NoHintMode = {
    type: "noHint";
};

type InitializeAction = {
    type: "initialize";
    payload: {
        userdata: UserData;
        database: Exercise[];
    };
};
type KeyAction = {
    type: "key";
    payload: {
        key: string;
        dispatch: React.Dispatch<Action>;
        reload: () => void;
    };
};
export type Action = InitializeAction | KeyAction;

export type State = {
    userdata: UserData;
    database: Exercise[];
    keyboardCommands: Map<string, Command>;
    modeState: ShowHintMode | NoHintMode;
};
