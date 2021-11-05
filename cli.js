#! /usr/bin/env node
import program from "commander";
import { createRequire } from "module";
import createProject from "./lib/create-project.js";
import createPage from "./lib/create-page.js";
import generateApi from "./lib/generate-api.js";

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
        createProject(name, options);
    });

program
    .command("add <name>")
    .description("create a new page")
    .option("-f, --force", "overwrite target directory if it exist")
    .action((name, options) => {
        createPage(name, options);
    });

program
    .command("api <url>")
    .description("generate services function")
    // .option("-f, --force", "overwrite target directory if it exist")
    .action((url, options) => {
        // TODO
        generateApi("http://210.74.12.207:8811/apidoc/api_data.js?v=1635933683444");
        // generateApi("http://210.74.13.141:8811/apidoc/api_data.js?v=1635991507224");
    });

program.parse(process.argv);
