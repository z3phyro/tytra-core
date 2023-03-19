import { existsSync, mkdirSync } from "fs";
import {
    getDictionaries,
    initDictionaries,
    writeDictionaries,
} from "./dictionaries";
import { readFile, readTypedFile, writeFile } from "./io";
import { generateInterface, pathAssign, pathGet, pathRemove } from "./utils";
import { getFolder } from "./config";

export const writeTranslation = (json: object, dictName = "English") => {
    let result = `import { TranslationInterface } from "./translation.interface"; 

export const ${dictName}Translation: TranslationInterface = ${JSON.stringify(
        json,
        null,
        2
    ).replace(/"(\w+)"\s*:/g, "$1:")};
`;

    writeFile(`${dictName.toLowerCase()}.translation.ts`, result);
};

export const surfTranslations = (
    json: any,
    trail = "",
    list: string[] = []
) => {
    const keys = Object.keys(json);

    for (let key of keys) {
        const path = `${trail ? trail + "." : ""}${key}`;
        if (typeof json[key] == "object")
            surfTranslations(json[key], path, list);
        else {
            console.log(path, json[key]);
            list.push(path);
        }
    }
};

export const listTranslation = () => {
    const json = readTranslation();
    surfTranslations(json);
};

export const addTranslation = (
    entry_path: string,
    default_values: string[]
) => {
    try {
        const dicts = getDictionaries();
        const languages = Object.values(dicts);

        let count = 0;
        for (let dict of languages) {
            let json = readTranslation(dict);
            pathAssign(json, entry_path, default_values[count] || "-");
            writeTranslation(json, dict);

            if (count == 0) {
                writeInterface(json);
            }

            count++;
        }

        console.log(
            `Entry added ${entry_path} ${default_values} in ${count} Dictionaries \n`
        );
    } catch (e) {
        console.log(e);
        return false;
    }

    return true;
};

export const writeInterface = (json: any) => {
    const result = generateInterface(json);
    writeFile("translation.interface.ts", result);
};

export const readTranslation = (dictName = "english"): object => {
    return readTypedFile(`${dictName.toLowerCase()}.translation.ts`);
};

export const removeTranslations = (entry_path: string) => {
    const dicts = getDictionaries();

    for (let language of Object.values(dicts)) {
        removeTranslation(entry_path);
    }
};

export const removeTranslation = (entry_path: string) => {
    const dicts = getDictionaries();

    for (let dict in dicts) {
        const json = readTranslation(dicts[dict]);

        pathRemove(json, entry_path);

        try {
            const parts = entry_path.split(".");
            parts.pop();

            const obj = pathGet(json, parts.join("."));
            if (Object.keys(obj).length === 0) {
                pathRemove(json, parts.join("."));
            }
        } catch (e) {
            console.log(e);
        }

        writeTranslation(json, dicts[dict]);
    }

    console.log(`Entry removed ${entry_path} for all languages\n`);
};

export const initTranslations = () => {
    try {
        if (!existsSync(getFolder())) {
            mkdirSync(getFolder());
        }
    } catch (e) {}

    initDictionaries();

    const json = [
        {
            general: {
                hello: "Hello World!",
            },
            about: {
                company: "Company",
            },
        },
        {
            general: {
                hello: "Hola Mundo!",
            },
            about: {
                company: "-",
            },
        },
    ];

    const dicts = getDictionaries();

    writeInterface(json[0]);
    let c = 0;
    for (let dict of Object.values(dicts)) {
        writeTranslation(json[c++], dict);
    }
};

export const translationImport = () => {
    const dicts = getDictionaries();
    writeDictionaries(dicts);

    let count = 0;
    for (let dict of Object.values(dicts)) {
        const json = readFile(`${dict.toLowerCase()}.translation.json`);
        if (count == 0) writeInterface(json);

        writeTranslation(json, dict);
    }
};

export const getCoverage = (dict: any, verbose = false) => {
    let totalKeys = 0;
    let translatedKeys = 0;
    const result: { percent: string; paths: string[] } = {
        percent: "",
        paths: [],
    };

    const arraySurfer = (json: any, trail: string) => {
        const keys = Object.keys(json);

        for (let key of keys) {
            const path = `${trail ? trail + "." : ""}${key}`;
            if (typeof json[key] == "object") arraySurfer(json[key], path);
            else {
                totalKeys++;
                if (json[key] && json[key] != "-") {
                    translatedKeys++;
                } else {
                    result.paths.push(path);
                    if (verbose) {
                        console.log(path);
                    }
                }
            }
        }
    };

    arraySurfer(dict, "");

    result.percent = ((translatedKeys * 100) / totalKeys).toFixed(0) + "%";

    return result;
};

export const getAllCoverage = () => {
    const dicts = getDictionaries();
    const result: any = {};

    for (let dict in dicts) {
        const json = readTypedFile(
            `${dicts[dict].toLowerCase()}.translation.ts`
        );
        console.log(json);
        result[dict] = getCoverage(json);
    }

    return result;
};

export const translationCoverage = (language: string | undefined) => {
    const dicts = getDictionaries();
    if (!language) {
        for (let dict of Object.keys(dicts)) {
            console.log(
                `${dict} ${dicts[dict]} ${
                    getCoverage(
                        readTypedFile(
                            `${dicts[dict].toLowerCase()}.translation.ts`
                        )
                    ).percent
                }`
            );
        }
    } else {
        let index = language.toLowerCase();

        if (dicts[index]) {
            index = dicts[index];
        }
        console.log(
            `${index} ${getCoverage(
                readTypedFile(`${index.toLowerCase()}.translation.ts`),
                true
            )}%`
        );
    }
};
