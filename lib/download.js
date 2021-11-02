import util from "util";
import downloadGitRepo from "download-git-repo";
import path from "path";
import ora from "ora";
import config from "../config/index.js";

// 添加加载动画
async function wrapLoading(fn, message, ...args) {
    // 使用 ora 初始化，传入提示信息 message
    const spinner = ora(message);
    // 开始加载动画
    spinner.start();
    try {
        // 执行传入方法 fn
        const result = await fn(...args);
        // 状态为修改为成功
        spinner.succeed();
        return result;
    } catch (error) {
        // 状态为修改为失败
        spinner.fail("Request failed");
    }
}
export default async function (targetDir) {
    await wrapLoading(
        util.promisify(downloadGitRepo), // 远程下载方法
        "waiting download template", // 加载提示信息
        config.repositoryPath, // 参数1: 下载地址
        path.resolve(process.cwd(), targetDir) // 参数2: 创建位置
    );
}
