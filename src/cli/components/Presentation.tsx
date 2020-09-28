import React from "react";
import { Text, Box, useApp, useInput } from "ink";
import { UserData } from "../../types/user.types";
import { Exercise } from "../../types/exercises.types";
import { Command } from "../../types/cli.types";
import { writeFileToPath } from "../utils/fileSystem";
import { CodeEngine } from "../engine/code-engine";
import { completeExercise } from "../utils/user";
import chalk from "chalk";
import produce from "immer";

interface PresentationInterface {
    userdata: UserData;
    database: Exercise[];
    setUserData: React.Dispatch<React.SetStateAction<UserData>>;
}

interface CommandListProps {
    commands: Command[];
}
const CommandList: React.FC<CommandListProps> = ({ commands }) => (
    <Box marginTop={1}>
        {commands.map(({ key, name }) => (
            <Box key={key} marginRight={2}>
                <Box marginRight={1} flexShrink={0}>
                    <Text color="white">({key})</Text>
                </Box>
                <Text color="gray">{name}</Text>
            </Box>
        ))}
    </Box>
);

interface CompleteItemsInterface {
    ids: string[];
    database: Exercise[];
}

const CompleteItems: React.FC<CompleteItemsInterface> = ({ ids, database }) => {
    return (
        <Box flexDirection="column" alignItems="flex-start" paddingRight={10}>
            <Text color="greenBright">Completed Exercises</Text>
            {ids.map((id, idx) => {
                // Should be unique, hence can access 0th element
                const { name } = database.filter(
                    (ex: Exercise) => ex.id === id,
                )[0];
                return (
                    <Text color="green" key={id}>
                        {idx + 1}. {name}
                    </Text>
                );
            })}
        </Box>
    );
};

interface CurrentItemsInterface {
    userdata: UserData;
}

const CurrentItem: React.FC<CurrentItemsInterface> = ({ userdata }) => {
    // Will be unique, hence can access 0th element
    const hintsAlreadyShown = userdata.current.info.hints.filter(
        (_, idx) => idx < userdata.current.currentHintIndex,
    );

    const hintsPresentationalComponent = (hintsAlreadyShown: string[]) => {
        return (
            <Box
                flexDirection="column"
                alignItems="stretch"
                paddingLeft={10}
                paddingRight={10}>
                <Text color="yellowBright">Hints!</Text>
                {hintsAlreadyShown.map((hint, idx) => (
                    <Text color="yellow" key={idx}>
                        {idx + 1}. {hint}
                    </Text>
                ))}
            </Box>
        );
    };
    return (
        <Box flexDirection="column">
            <Text color="yellowBright">Currently Solving</Text>
            <Text color="yellow">{userdata.current.info.name}</Text>
            {hintsAlreadyShown.length > 0
                ? hintsPresentationalComponent(hintsAlreadyShown)
                : null}
        </Box>
    );
};

interface IncompleteItemsInterface {
    completedIds: string[];
    database: Exercise[];
}

const IncompleteItems: React.FC<IncompleteItemsInterface> = ({
    completedIds,
    database,
}) => {
    const remainingExercisesId = database
        .map((exercise) => exercise.id)
        .filter((id) => !completedIds.includes(id));
    const remainingExercises = database.filter((exercise) =>
        remainingExercisesId.includes(exercise.id),
    );
    return (
        <Box flexDirection="column" alignItems="flex-end" paddingLeft={10}>
            <Text color="redBright">Incomplete Exercises</Text>
            {remainingExercises.map((exercise, idx) => {
                return (
                    <Text color="red" key={idx}>
                        {idx + 1}. {exercise.name}
                    </Text>
                );
            })}
        </Box>
    );
};

const Presentation: React.FC<PresentationInterface> = ({
    userdata,
    database,
    setUserData,
}) => {
    const { exit } = useApp();
    const keyboardCommands: Map<string, Command> = new Map([
        [
            "q",
            {
                key: "q",
                name: "quit",
                handler: async ({ userdata }) => {
                    writeFileToPath<UserData>(userdata, ".", ".userdata.json");
                    exit();
                },
            },
        ],
        [
            "c",
            {
                key: "c",
                name: "check code",
                handler: async ({ userdata, database }) => {
                    const codeEngine = new CodeEngine(userdata, database);
                    try {
                        codeEngine.minifyCodeAndCheckSyntax();
                        await codeEngine.runTest();
                        setUserData(
                            completeExercise(
                                userdata,
                                userdata.current.id,
                                database,
                            ) as UserData,
                        );
                    } catch (err) {
                        console.log(chalk.red(err.message));
                    }
                },
            },
        ],
        [
            "h",
            {
                key: "h",
                name: "show hint",
                handler: async ({ userdata }) => {
                    if (
                        userdata.current.currentHintIndex >=
                        userdata.current.info.hints.length
                    ) {
                        console.log(
                            chalk.red("You have exhausted all your hints"),
                        );
                    } else {
                        setUserData(
                            produce(userdata, (draftUserData) => {
                                draftUserData.current.currentHintIndex += 1;
                                return draftUserData;
                            }) as UserData,
                        );
                    }
                },
            },
        ],
    ]);

    useInput((input, _) => {
        keyboardCommands.get(input)?.handler({ userdata, database });
    });

    return (
        <Box flexDirection="column">
            <Box marginY={1} marginLeft={1}>
                <Text bold backgroundColor="cyan" color="#000">
                    {" "}
                    JSLings{" "}
                </Text>
            </Box>
            <Box flexDirection="row">
                <CompleteItems ids={userdata.completed} database={database} />
                <CurrentItem userdata={userdata} />
                <IncompleteItems
                    completedIds={userdata.completed}
                    database={database}
                />
            </Box>
            <CommandList commands={Array.from(keyboardCommands.values())} />
        </Box>
    );
};

export default Presentation;
