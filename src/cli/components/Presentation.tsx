import React from "react";
import { Text, Box, useApp, useInput } from "ink";
import { UserData } from "../../types/user.types";
import { Exercise } from "../../types/exercises.types";
import { useInteractionReducer } from "../utils/cli";
import { Command } from "../../types/cli.types";

interface PresentationInterface {
    userdata: UserData;
    database: Exercise[];
    reload: () => void;
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
                alignItems="center"
                paddingLeft={10}
                paddingRight={10}>
                <Text color="yellowBright">Hints shown so far</Text>
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
                : ""}
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
    reload,
}) => {
    const { exit } = useApp();
    const [state, dispatch] = useInteractionReducer(userdata, database);

    useInput((input, key) => {
        if (input === "q") {
            exit();
        } else {
            dispatch({
                type: "key",
                payload: { key: input, dispatch, reload },
            });
        }
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
            <CommandList
                commands={Array.from(state.keyboardCommands.values())}
            />
        </Box>
    );
};

export default Presentation;
