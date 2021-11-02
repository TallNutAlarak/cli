#! /usr/bin/env node
import program from "commander";
import { createRequire } from "module";
import create from "./lib/create.js";

const require = createRequire(import.meta.url);

program
    // 配置版本号信息
    .version("v" + require("./package.json").version)
    .usage("<command> [option]");

program
    .command("create <name>")
    .description("create a new project")
    .option("-f, --force", "overwrite target directory if it exist")
    .action((name, options) => {
        create(name, options);
    });

program
    .command("add <name>")
    .description("create a new page")
    // .option("-f, --force", "overwrite target directory if it exist")
    .action((name, options) => {
        // TODO
    });

program.parse(process.argv);
