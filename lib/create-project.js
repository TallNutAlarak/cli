import path from "path";
import inquirer from "inquirer";
import fs from "fs-extra";
import download from "./download.js";
import chalk from "chalk";
import { commandSpan } from "../util/index.js";

export default async function (name, options) {
    // 当前命令行选择的目录
    const cwd = process.cwd();
    // 需要创建的目录地址
    const targetAir = path.join(cwd, name);

    // 目录是否已经存在？
    if (fs.existsSync(targetAir)) {
        // 是否为强制创建？
        if (options.force) {
            await fs.remove(targetAir);
        } else {
            // 询问用户是否确定要覆盖
            let { action } = await inquirer.prompt([
                {
                    name: "action",
                    type: "list",
                    message: "Target directory already exists Pick an action:",
                    choices: [
                        {
                            name: "Overwrite",
                            value: "overwrite",
                        },
                        {
                            name: "Cancel",
                            value: false,
                        },
                    ],
                },
            ]);
            if (!action) {
                return;
            } else if (action === "overwrite") {
                // 移除已存在的目录
                console.log(`\r\nRemoving...`);
                await fs.remove(targetAir);
                console.log(`\r\nRemoved`);
            }
        }
    }
    //
    let inquireTemplate = await inquirer.prompt([
        {
            name: "template",
            type: "list",
            message: "Choose Template:",
            choices: [
                {
                    name: "React",
                    value: "React",
                },
                {
                    name: "Cancel",
                    value: false,
                },
            ],
        },
    ]);
    if (!inquireTemplate.template) {
        return;
    } else if (inquireTemplate.template === "React") {
        // 从仓库中下载
        await download(targetAir);
        let { needInstall } = await inquirer.prompt([
            {
                name: "needInstall",
                type: "confirm",
                message: "need install dependencies(需要下载依赖吗)?",
            },
        ]);
        if (needInstall) {
            try {
                await commandSpan("yarn", [], {
                    cwd: `./${name}`,
                });
                console.log(chalk.green("dependencies installed"));
            } catch (err) {
                try {
                    await commandSpan("npm", ["i"], {
                        cwd: `./${name}`,
                    });
                    console.log(chalk.green("dependencies installed"));
                } catch (err) {
                    console.log(err);
                    console.log(chalk.red("dependencies install error"));
                }
            }
            // await commandSpan("yarn", ["start"], {
            //     cwd: `./${name}`,
            // });
        } else {
            console.log(chalk.green("finish!"));
            return;
        }
    }
}
