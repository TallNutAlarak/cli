import fs from "fs-extra";
import path from "path";
import chalk from "chalk";
import { compile } from "../util/index.js";
export default async function (name, targetAir) {
    try {
        const outerDirPath = path.resolve(name, targetAir);
        fs.mkdirSync(outerDirPath); //创建文件夹
        const indexPath = path.resolve(outerDirPath, `index.tsx`);
        const indexContent = await compile("index.ejs", {
            componentName: name,
        });
        fs.promises.writeFile(indexPath, indexContent);

        const componentPath = path.resolve(outerDirPath, `${name}.tsx`);
        const componentContent = await compile("component.ejs", {
            componentName: name,
        });
        fs.promises.writeFile(componentPath, componentContent);
        console.log(chalk.green(`生成${name}成功`));
    } catch (err) {
        console.log(chalk.red("生成失败"));
        console.log(err);
    }
}
