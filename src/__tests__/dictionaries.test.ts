import { mkdirSync, writeFileSync, rmdirSync, readFileSync } from "fs";
import {
    getDictionaries,
    initDictionaries,
    writeDictionaries,
} from "../dictionaries";
import { readFile, removeFile, writeFile } from "../io";
import { TEST_FOLDER } from "../const";
import * as config from "../config";

const DICTIONARIES_FILE = "dictionaries.json";
const DICTIONARIES_DATA = `{
  "en": "English",
  "es": "Spanish"
}`;

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
        try {
            rmdirSync(TEST_FOLDER + DICTIONARIES_FILE);
        } catch (e) {}
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
        // initNewTranslation;
    });
});
