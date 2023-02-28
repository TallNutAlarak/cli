import path from "path";
import inquirer from "inquirer";
import fs from "fs-extra";
import componentGenerate from "./component-generate.js";
import chalk from "chalk";

export default async function (name, options) {
    // 当前命令行选择的目录
    const cwd = process.cwd();
    if (
        !fs.existsSync(
            path.join(cwd, options.component ? "/src/components" : "/src/pages")
        )
    ) {
        console.log(chalk.red("路径异常，请确保位于项目根目录"));
        return;
    }
    // 需要创建的目录地址
    const targetDir = options.target ? path.resolve(cwd,options.target,name) : path.join(
        cwd,
        `/src/pages/${name}`
    );
    // 目录是否已经存在？
    if (fs.existsSync(targetDir)) {
        // 是否为强制创建？
        if (options.force) {
            await fs.remove(targetDir);
        } else {
            // 询问用户是否确定要覆盖
            let { action } = await inquirer.prompt([
                {
                    name: "action",
                    type: "list",
                    message: `Target directory: "${targetDir}" already exists Pick an action:`,
                    choices: [
                        {
                            name: "Cancel",
                            value: false,
                        },
                        {
                            name: "Overwrite",
                            value: "overwrite",
                        },
                    ],
                },
            ]);
            if (!action) {
                return;
            } else if (action === "overwrite") {
                // 移除已存在的目录
                console.log(`Removing...`);
                await fs.remove(targetDir);
                console.log(`Removed`);
            }
        }
    }
    // let inquireTemplate = await inquirer.prompt([
    //     {
    //         name: "template",
    //         type: "list",
    //         message: "Choose Template:",
    //         choices: [
    //             {
    //                 name: "React",
    //                 value: "React",
    //             },
    //             {
    //                 name: "Cancel",
    //                 value: false,
    //             },
    //         ],
    //     },
    // ]);
    // if (!inquireTemplate.template) {
    //     return;
    // } else if (inquireTemplate.template === "React") {
    componentGenerate(name, targetDir);
    // }
}
