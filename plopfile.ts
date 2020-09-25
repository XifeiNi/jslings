import { NodePlopAPI } from 'plop';
import fs from 'fs';
import { GeneratorData } from './src/types/generator.types';

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
                path: "exercises/{{concept}}/{{exercise}}.js",
                templateFile: "templates/exercise.hbs",
            },
            {
                type: "add",
                path: "src/__tests__/{{concept}}/{{exercise}}.test.ts",
                templateFile: "templates/test.hbs",
            },
            {
                type: "modify",
                path: "exercises.json",
                transform: (contents: string, { concept, exercise }: GeneratorData): string => {
                    const exerciseCatalogue = JSON.parse(contents);

                    exerciseCatalogue.exercises.push({
                        name: exercise,
                        path: `exercises/${concept}/${exercise}.js`,
                        hints: ["Add hints to help the user"],
                        currentHintIndex: 0,
                        status: "PENDING"
                    });

                    return JSON.stringify(exerciseCatalogue, null, 4);
                }
            },
        ],
    });
};
