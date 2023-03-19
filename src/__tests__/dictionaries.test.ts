import {
    mkdirSync,
    writeFileSync,
    rmdirSync,
    readFileSync,
    existsSync,
} from "fs";
import {
    addDictionary,
    getDictionaries,
    initDictionaries,
    initNewTranslation,
    removeDictionary,
    removeTranslationFile,
    writeDictionaries,
} from "../dictionaries";
import { readFile, readTypedFile, removeFile, writeFile } from "../io";
import * as config from "../config";
import { writeTranslation } from "../translations";

const DICTIONARIES_FILE = "dictionaries.json";
const DICTIONARIES_DATA = `{
  "en": "English",
  "es": "Spanish"
}`;

const TEST_FOLDER = "src/__tests__/sandbox_dict/";

describe("Testing dictionaries", () => {
    beforeAll(() => {
        const getFolderMock = jest.spyOn(config, "getFolder");

        getFolderMock.mockImplementation(() => TEST_FOLDER);

        try {
            mkdirSync(TEST_FOLDER);
        } catch (e) {}
        writeFileSync(TEST_FOLDER + DICTIONARIES_FILE, DICTIONARIES_DATA);
    });

    afterAll(() => {
        removeFile("dictionaries.json");
        removeFile("translation.ts");
    });

    test("Get dictionaries", () => {
        const json = getDictionaries();

        expect(json).toEqual(JSON.parse(DICTIONARIES_DATA));
    });

    test("Write dictionaries", () => {
        const json = {
            en: "English",
            kl: "Klingon",
        };

        writeDictionaries(json);

        const translationFile = readFileSync(
            TEST_FOLDER + "translation.ts"
        ).toString();

        expect(translationFile)
            .toBe(`import { EnglishTranslation } from "./english.translation";
import { KlingonTranslation } from "./klingon.translation";

export default {
  "en": EnglishTranslation,
  "kl": KlingonTranslation,
} as const;
`);
    });

    test("Initialize dictionaries", () => {
        initDictionaries();

        const json = readFile("dictionaries.json");
        expect(json).toEqual(JSON.parse(DICTIONARIES_DATA));

        const translationFile = readFileSync(
            TEST_FOLDER + "translation.ts"
        ).toString();

        expect(translationFile)
            .toBe(`import { EnglishTranslation } from "./english.translation";
import { SpanishTranslation } from "./spanish.translation";

export default {
  "en": EnglishTranslation,
  "es": SpanishTranslation,
} as const;
`);
    });

    test("Initializes new translations", () => {
        const json = {
            general: {
                hi: "Hello World!",
            },
        };
        writeTranslation(json, "English");
        initNewTranslation("Klingon");

        const klingonFile = readTypedFile("klingon.translation.ts");

        expect(klingonFile).toEqual({ general: { hi: "-" } });
    });

    test("Removes translation files", () => {
        removeTranslationFile("klingon");

        expect(existsSync(TEST_FOLDER + "klingon.translation.ts")).toBeFalsy();
    });

    test("Removes dictionary", () => {
        writeTranslation({ general: "General" }, "english");
        removeDictionary("en");

        const dicts = readFileSync(
            TEST_FOLDER + "dictionaries.json"
        ).toString();

        expect(JSON.parse(dicts)).toEqual({ es: "Spanish" });
    });

    // test("Adds dictionary", () => {
    //     initDictionaries();
    //     addDictionary("kl", "Klingon");

    //     const klingonFile = readTypedFile("klingon.translation.ts");
    //     console.log(klingonFile);
    //     expect(klingonFile).toEqual({ general: { hi: "-" } });
    // });
});
