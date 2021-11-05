import fs from "fs-extra";
import path from "path";
import ejs from "ejs";
import { spawn } from "child_process";
import inquirer from "inquirer";
import chalk from "chalk";

export const commandSpan = (...args) => {
    return new Promise((resolve, reject) => {
        const childProcess = spawn(...args);
        childProcess.stdout.pipe(process.stdout);
        childProcess.stderr.pipe(process.stderr);
        childProcess.on("close", resolve);
        childProcess.on("error", reject);
    });
};

export const compile = (fileName, data) => {
    const filePath = `../../templates/${fileName}`;
    const absPath = path.resolve(decodeURI(import.meta.url.slice(7)), filePath);
    return new Promise((resolve, reject) => {
        ejs.renderFile(absPath, { data }, {}, (err, data) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(data);
        });
    });
};
// 首字母大写
export const letterUppercase = (string) =>
    string.charAt(0).toUpperCase() + string.slice(1);
// 首字母小写
export const letterLowercase = (string) =>
    string.charAt(0).toLowerCase() + string.slice(1);

export const pageName2ComponentName = (name) => {
    let ret;
    if (name.indexOf("-") !== -1) {
        ret = name.split("-");
        ret = ret.map((string) => letterUppercase(string)).join("");
    } else {
        ret = letterUppercase(name);
    }
    return ret;
};

export const handlePathExist = async (targetAir) => {
    // 目录是否已经存在？
    if (fs.existsSync(targetAir)) {
        // 是否为强制创建？
        // 询问用户是否确定要覆盖
        let { action } = await inquirer.prompt([
            {
                name: "action",
                type: "list",
                message: `Target directory(${targetAir}) already exists Pick an action:`,
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
            await fs.remove(targetAir);
            console.log(`Removed`);
        }
    }
};
