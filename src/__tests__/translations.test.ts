import { mkdirSync, readFileSync } from "fs";
import * as config from "../config";
import {
    addTranslation,
    getAllCoverage,
    getCoverage,
    initTranslations,
    readTranslation,
    removeTranslation,
    surfTranslations,
    translationImport,
    updateTranslation,
    writeInterface,
    writeTranslation,
} from "../translations";
import { readTypedFile, removeFile, writeFile } from "../io";
import { initDictionaries } from "../dictionaries";

const TEST_FOLDER = "src/__tests__/sandbox_trans/";

describe("Test translation functions", () => {
    beforeAll(() => {
        const getFolderMock = jest.spyOn(config, "getFolder");

        getFolderMock.mockImplementation(() => TEST_FOLDER);

        try {
            mkdirSync(TEST_FOLDER);
        } catch (e) {}
    });

    afterAll(() => {
        try {
            removeFile("english.translation.ts");
            removeFile("spanish.translation.ts");
            removeFile("translation.interface.ts");
            removeFile("translation.ts");
            removeFile("dictionaries.json");
            removeFile("english.translation.json");
        } catch (e) {}
    });

    test("Writes translation file", () => {
        const json = {
            general: {
                hi: "Hello World!",
                menu: {
                    about: "About",
                },
            },
        };

        writeTranslation(json, "English");

        const result = readTypedFile("english.translation.ts");
        expect(json).toEqual(result);

        removeFile("english.translation.ts");
    });

    test("Test Surf translations", () => {
        const json = {
            general: {
                hi: "Hello",
                bye: "Good Bye",
            },
        };
        const result: string[] = [];
        surfTranslations(json, "", result);

        expect(result).toEqual(["general.hi", "general.bye"]);
    });

    test("Add translation", () => {
        initDictionaries();
        initTranslations();

        const json = {
            general: {
                hi: "Hello",
            },
        };

        writeTranslation(json, "English");

        addTranslation("general.good", ["Good", "Bueno"]);

        const result = readTypedFile("english.translation.ts");

        expect(result).toEqual({ general: { hi: "Hello", good: "Good" } });
    });

    test("Add interface", () => {
        const json = {
            uno: "uno",
            dos: "",
            general: { hello: "Ho la", bye: "Bye!" },
        };

        const expectedResult = `export interface TranslationInterface {
  uno: string,
  dos: string,
  general: {
    hello: string,
    bye: string
  }
};`;

        writeInterface(json);

        const result = readFileSync(
            TEST_FOLDER + "translation.interface.ts"
        ).toString();

        expect(result).toBe(expectedResult);
    });

    test("Read translation", () => {
        const result = readTranslation("english");

        expect(result).toEqual({ general: { hi: "Hello", good: "Good" } });
    });

    test("Remove translation", () => {
        removeTranslation("general.good");

        const result = readTranslation("english");

        expect(result).toEqual({ general: { hi: "Hello" } });
    });

    test("Init translations", () => {
        initTranslations();

        const json = readTranslation("english");

        expect(json).toEqual({
            general: {
                hello: "Hello World!",
            },
            about: {
                company: "Company",
            },
        });

        const jsonSpaish = readTranslation("spanish");

        expect(jsonSpaish).toEqual({
            general: {
                hello: "Hola Mundo!",
            },
            about: {
                company: "-",
            },
        });
    });

    test("Import translation", () => {
        const json = { general: { yes: "yes", no: "no" } };
        writeFile("english.translation.json", JSON.stringify(json));
        translationImport();

        const result = readTypedFile("english.translation.ts");

        expect(result).toEqual(json);
    });

    test("Get Coverage", () => {
        const json = { general: { yes: "yes", no: "-" } };

        const result = getCoverage(json);

        expect(result.percent).toBe("50%");
        expect(result.paths).toEqual(["general.no"]);
    });

    test("Get all coverage", () => {
        writeTranslation({ general: { yes: "yes", no: "-" } }, "spanish");
        writeTranslation({ general: { yes: "yes", no: "no" } }, "english");

        const result = getAllCoverage();

        expect(result).toEqual({
            en: {
                paths: [],
                percent: "100%",
            },
            es: {
                paths: ["general.no"],
                percent: "50%",
            },
        });
    });

    test("Update translation", () => {
        writeTranslation({ general: { yes: "yes", no: "no" } }, "english");

        updateTranslation("english", "general.yes", "Sure Thing!");

        const result: any = readTranslation("english") ?? {};

        expect(result["general"]["yes"]).toBe("Sure Thing!");
    });
});
