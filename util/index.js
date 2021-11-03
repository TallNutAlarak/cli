import fs from "fs-extra";
import path from "path";
import ejs from "ejs";
import { ChildProcess, spawn } from "child_process";
// https://github1s.com/zhangbanghui/zhang-cli/blob/master/lib/utils/utils.js

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
