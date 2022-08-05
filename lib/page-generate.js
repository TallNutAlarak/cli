import fs from "fs-extra";
import path from "path";
import chalk from "chalk";
import { compile, pageName2ComponentName } from "../util/index.js";
import prettier from "prettier";

export default async function (name, targetAir) {
    try {
        const outerDirPath = path.resolve(name, targetAir);
        fs.mkdirSync(outerDirPath); //创建文件夹

        const indexPath = path.resolve(outerDirPath, `index.tsx`);
        const indexContent = await compile("index.ejs", {
            componentName: name,
        });
        // fs.promises.writeFile(indexPath, indexContent);

        const lessPath = path.resolve(outerDirPath, `${name}.less`);
        const lessContent = await compile("component-less.ejs", {
            name: name,
        });
        // fs.promises.writeFile(lessPath, lessContent);

        const componentPath = path.resolve(outerDirPath, `${name}.tsx`);
        const componentContent = await compile("component.ejs", {
            componentName: pageName2ComponentName(name),
            name: name,
        });
        // fs.promises.writeFile(componentPath, componentContent);

        // 生成格式化后的文件
        prettier.resolveConfig(process.cwd()).then((options) => {
            console.log(options, "options");
            const formattedComponentContent = prettier.format(
                componentContent,
                options
            );
            const formattedLessContent = prettier.format(lessContent, {
                ...options,
                parser: "less",
            });
            const formattedIndexContent = prettier.format(
                indexContent,
                options
            );

            fs.promises.writeFile(indexPath, formattedIndexContent);
            fs.promises.writeFile(lessPath, formattedLessContent);
            fs.promises.writeFile(componentPath, formattedComponentContent);
        });

        console.log(chalk.green(`生成${name}成功`));
    } catch (err) {
        console.log(chalk.red("生成失败"));
        console.log(err);
    }
}
