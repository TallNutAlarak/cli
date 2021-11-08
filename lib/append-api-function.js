import path from "path";
import fs from "fs-extra";
import { compile, letterUppercase } from "../util/index.js";
import chalk from "chalk";
import json2ts from "json2ts";
// {
//     type: 'POST',
//     url: '/1.0/app/user/review',
//     title: 'review',
//     description: '<p>确认执行用户信息</p>',
//     name: 'review',
//     group: 'User',
//     parameter:{fields: {
//     Parameter: [
//     {
//       group: 'Parameter',
//       type: 'String',
//       optional: false,
//       field: 'name',
//       description: '<p>区块链账户名</p>'
//     }
//   ]
// },
// examples: [
//     {
//     title: 'Request-Example:',
//     content: '{\n    "name": "ihaveawallet",\n}',
//     type: 'json'
//     }
// ]},
//     success: [Object],
//     error: [Object],
//     version: '0.0.0',
//     filename: './defs/user.js',
//     groupTitle: 'User'
//   }

const getDescription = (str) => str.match(/[^<>]+(?=<)/g)[0];

export default async (api, apiModulePath) => {
    const appendContent = async (templateName, templateParam) => {
        const apiFunctionContent = await compile(templateName, templateParam);
        fs.promises.appendFile(apiModulePath, apiFunctionContent);
    };
    // 请求参数
    const apiParams = (api.parameter?.fields?.Parameter || []).map((item) => ({
        field: item.field,
        type: item.type,
    }));
    const IRetName = `IRet${letterUppercase(api.name)}${letterUppercase(
        api.group
    )}`;
    const IRet = json2ts
        .convert(api.success?.examples?.[0]?.content)
        .replace("RootObject", IRetName)
        .replace(
            /Data/g,
            `IData${letterUppercase(api.name)}${letterUppercase(api.group)}`
        );
    // api错误处理
    const apiError = (api?.error?.examples || [])
        .filter((item) => item.code)
        .map((item) => {
            const errObj = JSON.parse(item.content);
            return errObj;
        });
    switch (api.type) {
        // TODO
        case "GET":
            console.log(chalk.red("GET TODO"));
            // await appendContent("api-function-get.ejs", {
            //     name: `request${letterUppercase(api.name)}${letterUppercase(
            //         api.group
            //     )}`,
            //     IParamsName: `IRequest${letterUppercase(
            //         api.name
            //     )}${letterUppercase(api.group)}`,
            //     url: api.url,
            //     method: api.type,
            //     description: getDescription(api.description),
            // });
            break;
        case "POST":
            await appendContent("api-function-post.ejs", {
                name: `request${letterUppercase(api.name)}${letterUppercase(
                    api.group
                )}`,
                IParamsName: `IRequest${letterUppercase(
                    api.name
                )}${letterUppercase(api.group)}`,
                IParams: apiParams,
                IRetName: `IRet${letterUppercase(api.name)}${letterUppercase(
                    api.group
                )}`,
                IRet: IRet,
                url: api.url,
                method: api.type,
                description: getDescription(api.description),
                error: apiError,
            });
            break;
        default:
            // TODO
            console.log(chalk.red("TODO"));
            break;
    }
};
