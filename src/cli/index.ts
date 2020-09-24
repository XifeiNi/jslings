#!/usr/bin/env node
import React from "react";
import { AppProps, render } from "ink";
import { Command } from "commander";

import App from "./ui/ui";
const program = new Command();

program
  .name("jslings")
  .description("jslings can help YOU master Javascript on the terminal")
  .on("--help", () => {
    console.log("");
    console.log("Examples:");
    console.log("");
    console.log("  $ jslings watch");
    console.log("  $ jslings hint");
  });

program
  .command("watch")
  .alias("w")
  .description("jslings interactive code testing UI")
  .option("-t, --test <testName>", "path to the test")
  .action(async ({ test }: Command) => {
    render(
      React.createElement(App, {
        testFileName: test,
      }),
    );
  });

program.parse(process.argv);
