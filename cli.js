#! /usr/bin/env node
import program from "commander";
import { createRequire } from "module";
import createProject from "./lib/create-project.js";
import createPage from "./lib/create-page.js";
import generateApi from "./lib/generate-api.js";
import chalk from "chalk";
import { wrapLoading } from "./util/index.js";

const require = createRequire(import.meta.url);

program
    // 配置版本号信息
    .version("v" + require("./package.json").version)
    .usage("<command> [option]");

program
    .command("create <name>")
    .description("create a new project")
    .option("-f, --force", "overwrite target directory if it exist")
    .option("-s, --strict", "use strict mode in project")
    .action((name, options) => {
        createProject(name, options);
    });

program
    .command("add <name>")
    .description("create a new page")
    .option("-f, --force", "overwrite target directory if it exist")
    .option("-c, --component", "create a new component")
    .action((name, options) => {
        createPage(name, options);
    });

program
    .command("api <ip> [module-dir-name]")
    .description("generate services function by apiDoc ip")
    // .option("-f, --force", "overwrite target directory if it exist")
    .action((ip, moduleDirName) => {
        let verifyIp;
        try {
            verifyIp = new URL(ip);
        } catch (err) {
            console.log(chalk.red("ip地址解析失败，请确认是否写错"));
            return;
        }
        generateApi(
            `${verifyIp.href}apidoc/api_data.js?v=${Date.now()}`,
            moduleDirName
        );
    });

program.parse(process.argv);
