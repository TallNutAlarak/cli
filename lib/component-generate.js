import fs from "fs-extra";
import path from "path";
import chalk from "chalk";
import { compile, name2ReactComponentName } from "../util/index.js";
import prettier from "prettier";
import ejs from "ejs";
import config from '../config/index.js'

const defaultTemplatePath = path.resolve(
    decodeURI(import.meta.url.slice(7)),
    "../../templates"
);

export default async function (componentName, targetDir) {
    try {
        const cwd = process.cwd();

        const outerDirPath = path.resolve(componentName, targetDir);
        fs.mkdirSync(outerDirPath); //创建文件夹

        const prettierOptions = await prettier.resolveConfig(process.cwd());

        const projectTemplatePath = path.resolve(cwd, config.defaultProjectTemplateDirectoryName);
        const isProjectHaveTemplate = fs.existsSync(projectTemplatePath);
        const templatePath = path.resolve(isProjectHaveTemplate
            ? projectTemplatePath
            : defaultTemplatePath,'component') ;
        // 读取模板
        const templateNames = await fs.readdir(templatePath);
        const filesInfo = templateNames.map((templateName) => {
            const filename = templateName
                .split(".")
                .slice(0, -1)
                .join('.')
                .replaceAll(/\[[\w\W]*?\]/g, (match) => {
                    switch (match) {
                        case "[name]":
                            return componentName;
                        default:
                            return match;
                    }
                });
            return {
                templatePath: path.resolve(templatePath, templateName),
                filename: filename,
            };
        });

        await Promise.all(
            filesInfo.map((fileInfo) =>
                ejs
                    .renderFile(fileInfo.templatePath, {
                        // ejs template variable
                        data: {
                            name: componentName,
                            reactComponentName: name2ReactComponentName(componentName),
                        },
                    })
                    .then((fileContent) => {
                        return prettier.format(fileContent, {
                            ...prettierOptions,
                            filepath: path.resolve(
                                outerDirPath,
                                fileInfo.filename
                            ),
                        });
                    })
                    .then((formattedContent) => {
                        return fs.promises.writeFile(
                            path.resolve(outerDirPath, fileInfo.filename),
                            formattedContent
                        );
                    })
            )
        );

        console.log(chalk.green(`生成${componentName}成功`));
    } catch (err) {
        console.log(chalk.red("生成失败"));
        console.log(err);
    }
}
