import { readFile, readTypedFile, writeFile } from "./io";
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
