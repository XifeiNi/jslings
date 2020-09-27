import produce from 'immer';
import nullthrows from 'nullthrows'
import { Exercise, Status } from '../../types/exercises.types';
import { UserData } from '../../types/user.types'
import { obtainStringifiedFileContents, jsonParsedFileContents } from '../utils/fileSystem'

/**
 * Obtain the users progress
 * @param userDataPath Points to the .userdata file
 */
export const getUserInfo = (userDataPath: string): UserData => {
    try {
        const stringData = obtainStringifiedFileContents(userDataPath);
        const userData = jsonParsedFileContents<UserData>(stringData);
        return userData
    } catch(err) {
        throw err as Error
    }
}

/**
 * Returns the next exercise if available
 * @param database Current knowledge bank for jslings
 * @param completedId Id of the completed exercise
 */
const returnNextIncompleteExercise = (database: Exercise[], completedId: string): Exercise | undefined => {
    const idxOfCompleted = database.map((exercise) => exercise.id ).indexOf(completedId)
    if (idxOfCompleted !== database.length - 1) {
        return database[idxOfCompleted + 1]
    }
}

/**
 * Returns a fresh copy of userdata with updated details after completing an exercise
 * @param currentUserData Object indicating current progress
 * @param completedId ID of the last completed exercise
 * @param database Current knowledge bank for jslings
 */
export const completeExercise = (currentUserData: UserData, completedId: string, database: Exercise[]) => {
    return produce(currentUserData, (draftUserData) => {
        // 1. Add Completed Id to currentUserData
        draftUserData.completed.push(completedId)
        // 2. Find next incomplete exercise of user
        const nextExercise = nullthrows(returnNextIncompleteExercise(database,completedId))
        draftUserData.current = { 
            id: nextExercise.id,
            info: nextExercise,
            currentHintIndex: 0,
            status: Status.CURRENT
        }
        // 3. Return a modified userData
        return draftUserData
    })
}