#! /usr/bin/env node
import program from "commander";
import { createRequire } from "module";
import createProject from "./lib/create-project.js";
import createPage from "./lib/create-page.js";
import generateApi from "./lib/generate-api.js";
import chalk from "chalk";

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
    .command("api <ip>")
    .description("generate services function by apiDoc ip")
    // .option("-f, --force", "overwrite target directory if it exist")
    .action((ip) => {
        let verifyIp;
        try {
            verifyIp = new URL(ip);
        } catch (err) {
            console.log(chalk.red("ip地址解析失败，请确认是否写错"));
            return;
        }
        generateApi(`${verifyIp.href}apidoc/api_data.js?v=${Date.now()}`);
    });

program.parse(process.argv);
