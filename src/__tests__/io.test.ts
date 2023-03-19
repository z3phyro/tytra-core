import { readFile, readTypedFile, removeFile, writeFile } from "../io";
import {
    existsSync,
    mkdirSync,
    readFileSync,
    rmSync,
    rmdirSync,
    writeFileSync,
} from "node:fs";
import * as config from "../config";

const TEST_FOLDER = "src/__tests__/sandbox_io/";
const TEST_DATA = `{"hi": "Hello World!"}`;
const TEST_TYPED_DATA = `export const Maykel: TranslationInterface = {hi: "Hello World!"};`;
const TEST_TYPED_DATA_SINGLE_QUOTES = `export const Maykel: TranslationInterface = {hi: 'Hello World!'};`;
const TEST_TYPED_DATA_JSON = { hi: "Hello World!" };
const TEST_FILE = "write_test.json";
const TEST_TYPED_FILE = "write_file.typed";

describe("Checking IO functions", () => {
    beforeAll(() => {
        const getFolderMock = jest.spyOn(config, "getFolder");

        getFolderMock.mockImplementation(() => TEST_FOLDER);

        try {
            mkdirSync(TEST_FOLDER);
        } catch (e) {}
    });

    afterAll(() => {});

    test("Writes the file into the system", () => {
        writeFile(TEST_FILE, TEST_DATA);

        const loadedFile = readFileSync(TEST_FOLDER + TEST_FILE);

        expect(loadedFile.toString()).toBe(TEST_DATA);
    });

    test("Reads a file", () => {
        const data = readFile(TEST_FILE);

        expect(data).toEqual(JSON.parse(TEST_DATA));
    });

    test("Removes a file", () => {
        removeFile(TEST_FILE);

        const loadFile = existsSync(TEST_FOLDER + TEST_FILE);

        expect(loadFile).toBeFalsy();
    });

    test("Reads a typed file", () => {
        writeFileSync(TEST_FOLDER + TEST_TYPED_FILE, TEST_TYPED_DATA);

        const json = readTypedFile(TEST_TYPED_FILE);

        expect(json).toEqual(TEST_TYPED_DATA_JSON);

        rmSync(TEST_FOLDER + TEST_TYPED_FILE);
    });

    test("Reads a typed file with single quotes", () => {
        writeFileSync(
            TEST_FOLDER + TEST_TYPED_FILE,
            TEST_TYPED_DATA_SINGLE_QUOTES
        );

        const json = readTypedFile(TEST_TYPED_FILE);

        expect(json).toEqual(TEST_TYPED_DATA_JSON);

        rmSync(TEST_FOLDER + TEST_TYPED_FILE);
    });
});
