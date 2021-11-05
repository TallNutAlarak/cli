import util from "util";
import downloadGitRepo from "download-git-repo";
import path from "path";
import chalk from "chalk";
import config from "../config/index.js";
import { wrapLoading } from "../util/index.js";

export default async function (targetDir) {
    try {
        await wrapLoading(
            util.promisify(downloadGitRepo), // 远程下载方法
            "waiting download template...", // 加载提示信息
            config.baseProjectRepositoryPath, // 参数1: 下载地址
            path.resolve(process.cwd(), targetDir) // 参数2: 创建位置
        );
        console.log(chalk.green("download success"));
    } catch (err) {
        console.log(err);
        console.log(chalk.red("download error"));
    }
}
