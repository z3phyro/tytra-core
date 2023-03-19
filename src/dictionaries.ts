import { readFile, readTypedFile, removeFile, writeFile } from "./io";
import { writeTranslation } from "./translations";
import { clearEntries } from "./utils";

export const getDictionaries = (): { [id: string]: string } =>
    readFile("dictionaries.json") as any;

export const writeDictionaries = (dicts: any) => {
    const keys = Object.keys(dicts);
    let result = "";

    for (let key of keys) {
        result += `import { ${dicts[key]}Translation } from "./${dicts[
            key
        ].toLowerCase()}.translation";\n`;
    }

    result += "\n";
    result += "export default {\n";
    for (let key of keys) {
        result += `  "${key}": ${dicts[key]}Translation,\n`;
    }
    result += "} as const;\n";

    writeFile("translation.ts", result);
};

export const initDictionaries = () => {
    const dicts = {
        en: "English",
        es: "Spanish",
    };

    console.log("Initializing dictionaries... \n");

    writeFile("dictionaries.json", JSON.stringify(dicts));
    writeDictionaries(dicts);

    console.log("Dictionaries initialized \n");
};

export const initNewTranslation = (name: string) => {
    const dicts = getDictionaries();
    const defaultKey = Object.values(dicts)[0];

    const json = readTypedFile(`${defaultKey.toLowerCase()}.translation.ts`);
    clearEntries(json);
    writeTranslation(json, name);
};

export const removeTranslationFile = (name: string) => {
    removeFile(`${name.toLowerCase()}.translation.ts`);
};

export const removeDictionary = (shortName: string) => {
    const dicts = getDictionaries();
    const name = dicts[shortName];
    delete dicts[shortName];

    writeFile("dictionaries.json", JSON.stringify(dicts, null, 2));
    writeDictionaries(dicts);
    removeTranslationFile(name);

    console.log(`Dictionary ${name} Removed`);
};

export const addDictionary = (shortName: string, name: string) => {
    console.log("Adding new dict");
    const dicts = getDictionaries();
    dicts[shortName] = name;

    writeFile("dictionaries.json", JSON.stringify(dicts, null, 2));
    writeDictionaries(dicts);
    initNewTranslation(name);

    console.log(`Added ${name} dictionary`);
};

export const listDictionaries = () => {
    const dicts = getDictionaries();

    console.log("Dictionaries: \n");
    for (let dict of Object.entries(dicts)) {
        console.log(`${dict[0]} ${dict[1]} `);
    }
};
