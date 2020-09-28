import { Exercise, Status } from "./exercises.types";

/**
 * Current Exercise Information
 */
export interface CurrentExercise {
    id: string;
    info: Exercise;
    currentHintIndex: number;
    status: Status.CURRENT;
}

export interface UserData {
    completed: string[]; // IDs of completed exercises
    current: CurrentExercise;
}
