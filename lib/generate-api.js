import axios from "axios";
import path from "path";
import fs from "fs-extra";
import { handlePathExist, compile, letterLowercase } from "../util/index.js";
import appendApiFunction from "./append-api-function.js";
import chalk from "chalk";

export default async (url) => {
    try {
        const cwd = process.cwd();
        if (!fs.existsSync(path.join(cwd, "/src/services"))) {
            console.log(chalk.red("路径异常，请确保位于项目根目录"));
            return;
        }
        const modulesPath = path.join(cwd, `/src/services/modules-generated`);
        await handlePathExist(modulesPath);
        fs.mkdirSync(modulesPath); //创建文件夹

        const ret = await axios(url);
        const needString = ret.data.slice(15, -4);
        const parsedAry = JSON.parse(needString);
        let grouped = {};
        // 分组
        parsedAry
            .filter((item) => item.type && item.title)
            .forEach((item) => {
                if (!(item.group in grouped)) {
                    grouped[item.group] = [];
                }
                grouped[item.group].push(item);
            });
        // 遍历生成api模块
        Object.keys(grouped).forEach(async (moduleName) => {
            const moduleApiAry = grouped[moduleName];

            const apiModulePath = path.join(
                modulesPath,
                `${letterLowercase(moduleName)}.ts`
            );
            const apiModuleContent = await compile("api.ejs");
            fs.promises.writeFile(apiModulePath, apiModuleContent);
            // 向模块文件添加api函数
            moduleApiAry.forEach(async (api) => {
                appendApiFunction(api, apiModulePath);
            });
            fs.promises.appendFile(
                path.join(cwd, `/src/services/index.tsx`),
                `
                export * as ${letterLowercase(
                    moduleName
                )} from "./modules-generated/${letterLowercase(moduleName)}";
                `
            );
        });
        console.log(chalk.green(`finished`));
    } catch (err) {
        console.log(chalk.red(err));
    }
};
