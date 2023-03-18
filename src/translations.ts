import { writeFile } from "./io";

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
