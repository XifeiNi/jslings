import produce from "immer";
import nullthrows from "nullthrows";
import { Exercise, Status } from "../../types/exercises.types";
import { UserData } from "../../types/user.types";
import {
    obtainStringifiedFileContents,
    jsonParsedFileContents,
    writeFileToPath,
} from "../utils/fileSystem";

/**
 * Obtain the users progress
 * @param userDataPath Points to the .userdata file
 */
export const getUserInfo = (userDataPath: string): UserData => {
    try {
        const stringData = obtainStringifiedFileContents(userDataPath);
        const userData = jsonParsedFileContents<UserData>(stringData);
        return userData;
    } catch (err) {
        throw err as Error;
    }
};

/**
 * Returns the next exercise if available, returns undefined if it is the last exercise
 * @param database Current knowledge bank for jslings
 * @param completedId Id of the completed exercise
 */
const returnNextIncompleteExercise = (
    database: Exercise[],
    completedId: string = "",
): Exercise | undefined => {
    if (completedId.length > 0) {
        const idxOfCompleted = database
            .map((exercise) => exercise.id)
            .indexOf(completedId);
        if (idxOfCompleted === -1) {
            throw new Error("Invalid exercise selected");
        }
        if (idxOfCompleted !== database.length - 1) {
            return database[idxOfCompleted + 1];
        }
        throw new Error("Congratulations! You have completed jslings");
    }
    return database[0];
};

/**
 * Returns a fresh copy of userdata with updated details after completing an exercise
 * @param currentUserData Object indicating current progress
 * @param completedId ID of the last completed exercise
 * @param database Current knowledge bank for jslings
 */
export const completeExercise = (
    currentUserData: UserData,
    completedId: string,
    database: Exercise[],
) => {
    return produce(currentUserData, (draftUserData) => {
        // 1. Add Completed Id to currentUserData
        draftUserData.completed.push(completedId);
        // 2. Find next incomplete exercise of user
        const nextExercise = nullthrows(
            returnNextIncompleteExercise(database, completedId),
        );
        draftUserData.current = {
            id: nextExercise.id,
            info: nextExercise,
            currentHintIndex: 0,
            status: Status.CURRENT,
        };
        // 3. Return a modified userData
        return draftUserData;
    });
};

/**
 * As we require some setup for userdata, we need to consure we follow the correct format from the start
 */
export const clearUserDataAndStartFresh = (database: Exercise[]) => {
    const currentExercise = returnNextIncompleteExercise(database)!;
    const data: UserData = {
        completed: [],
        current: {
            info: currentExercise,
            id: currentExercise.id,
            currentHintIndex: 0,
            status: Status.CURRENT,
        },
    };
    writeFileToPath<UserData>(data, ".", ".userdata.json");
};
