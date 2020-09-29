#!/usr/bin/env node

import React from "react";
import { render } from "ink";
import { Command } from "commander";
import { clearUserDataAndStartFresh } from "../cli/utils/user";
import Landing from "./components/landingUI";
import { greenBright } from "chalk";
import { loadJSONDataFromFileIfPresentElseCreateFileAndLoad } from "./utils/fileSystem";
import { Exercise } from "../types/exercises.types";

const program = new Command();

program
    .name("jslings")
    .description("jslings can help YOU master Javascript on the terminal")
    .on("--help", () => {
        console.log("");
        console.log("Examples:");
        console.log("");
        console.log("  $ jslings watch");
        console.log("  $ jslings clear");
    });

program
    .command("watch")
    .alias("w")
    .description("jslings interactive code testing UI")
    .action(async () => {
        render(React.createElement(Landing));
    });

program
    .command("clear")
    .alias("r")
    .description("Clears all your userdata to start fresh")
    .action(() => {
        const database = loadJSONDataFromFileIfPresentElseCreateFileAndLoad<
            Exercise[]
        >(process.cwd(), "exercises.json");
        clearUserDataAndStartFresh(database);
        console.log(greenBright("Reset successful"));
    });

program.parse(process.argv);
