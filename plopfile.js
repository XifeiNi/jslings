module.exports = (plop) => {
    plop.setGenerator("exercise", {
        description: "generate a new exercise with tests",
        prompts: [
            {
                type: "list",
                name: "concept",
                message: "pick a JS concept",
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
                message: "enter an exercise name (ex. strings1)",
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
        ],
    });
};
