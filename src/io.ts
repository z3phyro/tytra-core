import fs from "fs";
import { getFolder } from "./config";

export const removeFile = (filename: string) => {
    const folder = getFolder();
    if (fs.existsSync(`${folder}${filename}`)) {
        fs.rmSync(`${folder}${filename}`);
    }
};

export const readTypedFile = (filename: string): object => {
    const folder = getFolder();
    let result = {};

    try {
        if (fs.existsSync(`${folder}${filename}`)) {
            const raw = fs.readFileSync(`${folder}${filename}`).toString();
            const regex = /= ({.*})/s;
            const regResult = regex.exec(raw);
            const rawJSON = regResult![1]
                .replace(/(\w+)\s*:/g, '"$1":')
                .replace(/: '(.*)'/g, ': "$1"');
            return JSON.parse(rawJSON);
        }
    } catch (e) {
        console.log(e);
    }

    return result;
};

export const readFile = (filename: string): object => {
    const folder = getFolder();
    let result = {};
    try {
        if (fs.existsSync(`${folder}${filename}`)) {
            result = JSON.parse(
                fs.readFileSync(`${folder}${filename}`).toString()
            );
        }
    } catch (e) {
        console.log(e);
    }
    return result;
};

export const writeFile = (filename: string, data: string) => {
    const folder = getFolder();
    console.log("writing file " + filename);

    fs.writeFileSync(`${folder}${filename}`, data);
};
