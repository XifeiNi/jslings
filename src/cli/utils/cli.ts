import chalk from "chalk";
import produce from "immer";
import { useEffect, useReducer } from "react";
import { Action, State } from "../../types/cli.types";
import { Exercise } from "../../types/exercises.types";
import { UserData } from "../../types/user.types";
import { CodeEngine } from "../engine/code-engine";
import { writeFileToPath } from "./fileSystem";
import { completeExercise } from "./user";

export const stateForNormalMode = (state: State): State => {
    return {
        ...state,
        modeState: {
            type: "noHint",
        },
        keyboardCommands: new Map([
            [
                "h",
                {
                    key: "h",
                    name: "show hint",
                    handler: (state) => {
                        if (
                            state.userdata.current.currentHintIndex >=
                            state.userdata.current.info.hints.length
                        ) {
                            console.log(
                                chalk.red("You have exhausted all your hints"),
                            );
                        }
                        writeFileToPath<UserData>(
                            state.userdata,
                            ".",
                            ".userdata.json",
                        );
                        return {
                            ...state,
                            userdata: produce(
                                state.userdata,
                                (draftUserData) => {
                                    draftUserData.current.currentHintIndex += 1;
                                    return draftUserData;
                                },
                            ),
                        };
                    },
                },
            ],
            [
                "c",
                {
                    key: "c",
                    name: "check code",
                    handler: async (state) => {
                        const codeEngine = new CodeEngine(
                            state.userdata,
                            state.database,
                        );
                        try {
                            codeEngine.minifyCodeAndCheckSyntax();
                            const result = await codeEngine.runTest();
                            console.log(result);
                            writeFileToPath<UserData>(
                                state.userdata,
                                ".",
                                ".userdata.json",
                            );
                            return {
                                ...state,
                                userdata: completeExercise(
                                    state.userdata,
                                    state.userdata.current.id,
                                    state.database,
                                ) as UserData,
                            };
                        } catch (err) {
                            writeFileToPath<UserData>(
                                state.userdata,
                                ".",
                                ".userdata.json",
                            );
                            console.log(chalk.red(err.message));
                            return state;
                        }
                    },
                },
            ],
        ]),
    };
};

const initialState: Pick<State, "modeState" | "keyboardCommands"> = {
    modeState: { type: "noHint" },
    keyboardCommands: new Map(),
};

const initializedState = (userdata: UserData, database: Exercise[]): State => {
    return stateForNormalMode({
        ...initialState,
        userdata,
        database,
    });
};

const reducer = (state: Readonly<State>, action: Action): State => {
    switch (action.type) {
        case "initialize": {
            return initializedState(
                action.payload.userdata,
                action.payload.database,
            );
        }

        case "key": {
            const command = state.keyboardCommands.get(action.payload.key);
            if (!command) {
                return state;
            }

            return command.handler(state, action);
        }
    }
};

export const useInteractionReducer = (
    userdata: UserData,
    database: Exercise[],
): [State, React.Dispatch<Action>] => {
    const [state, dispatch] = useReducer(reducer, {}, () =>
        initializedState(userdata, database),
    );

    useEffect(() => {
        dispatch({ type: "initialize", payload: { userdata, database } });
    }, [userdata, database]);

    return [state, dispatch];
};
