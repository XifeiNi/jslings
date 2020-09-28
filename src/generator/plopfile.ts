import { NodePlopAPI } from "plop";
import * as path from "path";
import { v4 as uuidv4 } from "uuid";
import { Exercise } from "../types/exercises.types";
import { GeneratorData } from "../types/generator.types";

module.exports = (plop: NodePlopAPI) => {
    plop.setGenerator("exercise", {
        description: "generate a new exercise with tests",
        prompts: [
            {
                type: "list",
                name: "concept",
                message: "pick a JavaScript concept",
                choices: [
                    "strings",
                    "numbers",
                    "variables",
                    "conditions",
                    "functions",
                ],
            },
            {
                type: "input",
                name: "exercise",
                message: "enter an exercise name (e.g. strings1)",
            },
        ],
        actions: [
            {
                type: "add",
                path: path.join(
                    "..",
                    "..",
                    "exercises",
                    "{{concept}}",
                    "{{exercise}}.js",
                ),
                templateFile: path.join("templates", "exercise.hbs"),
            },
            {
                type: "add",
                path: path.join(
                    "..",
                    "__tests__",
                    "{{concept}}",
<<<<<<< HEAD
                    "{{exercise}}.ts",
=======
                    "{{exercise}}.test.ts",
>>>>>>> 44e06de6e4224dbba6b2bcbbcd47c952143c5f90
                ),
                templateFile: path.join("templates", "test.hbs"),
            },
            {
                type: "modify",
                path: path.join("..", "..", "exercises.json"),
                transform: (
                    contents: string,
                    { concept, exercise }: GeneratorData,
                ): string => {
                    const exerciseCatalogue: Exercise[] = JSON.parse(contents);

                    exerciseCatalogue.push({
                        id: uuidv4(),
                        name: exercise,
                        path: path.join(
                            "./",
                            "exercises",
                            concept,
                            `${exercise}.js`,
                        ),
                        testPath: path.join(
                            "..",
                            "__tests__",
                            concept,
                            `${exercise}.ts`,
                        ),
                        hints: ["Add hints to help the user"],
                    });
                    return JSON.stringify(exerciseCatalogue, null, 2);
                },
            },
        ],
    });
};
