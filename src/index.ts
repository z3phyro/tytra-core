import {
    addTranslation,
    getCoverage,
    initTranslations,
    readTranslation,
    removeTranslation,
    surfTranslations,
    translationImport,
    writeInterface,
    writeTranslation,
    translationCoverage,
} from "./translations";

import {
    clearEntries,
    generateInterface,
    pathAssign,
    pathExists,
    pathGet,
    pathRemove,
} from "./utils";

import {
    addDictionary,
    getDictionaries,
    initDictionaries,
    initNewTranslation,
    removeDictionary,
    removeTranslationFile,
    writeDictionaries,
} from "./dictionaries";

import { readFile, readTypedFile, removeFile, writeFile } from "./io";

export {
    addTranslation,
    getCoverage,
    initTranslations,
    readTranslation,
    removeTranslation,
    surfTranslations,
    translationImport,
    writeInterface,
    writeTranslation,
    translationCoverage,
    readFile,
    readTypedFile,
    removeFile,
    writeFile,
    clearEntries,
    generateInterface,
    pathAssign,
    pathExists,
    pathGet,
    pathRemove,
    addDictionary,
    getDictionaries,
    initDictionaries,
    initNewTranslation,
    removeDictionary,
    removeTranslationFile,
    writeDictionaries,
};
