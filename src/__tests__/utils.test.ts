import {
    clearEntries,
    generateInterface,
    pathAssign,
    pathExists,
    pathGet,
    pathRemove,
} from "../utils";

const TEST_JSON = { hi: "Hello World!", bye: "Bye bye" };
const TEST_INTERFACE_JSON = {
    uno: "uno",
    dos: "",
    general: { hello: "Ho la", bye: "Bye!" },
};

const TEST_INTERFACE_RESULT = `export interface TranslationInterface {
  uno: string,
  dos: string,
  general: {
    hello: string,
    bye: string
  }
};`;

test("Checks that it clears the JSON Object", () => {
    const json = JSON.parse(JSON.stringify(TEST_JSON));

    clearEntries(json);

    Object.keys(json).forEach((key) => {
        expect(json[key]).toBe("-");
    });
});

test("Checks that it generates the interface from the JSON Object", () => {
    const result = generateInterface(TEST_INTERFACE_JSON);

    expect(result).toBe(TEST_INTERFACE_RESULT);
});

test("Assigns to an object in a particular path", () => {
    const obj: any = {};

    pathAssign(obj, "general.hi", "Hola!");
    expect(obj["general"]["hi"]).toBe("Hola!");

    pathAssign(obj, "general.interesting.stuff", "Ciekawe!");
    expect(obj["general"]["interesting"]["stuff"]).toBe("Ciekawe!");

    expect(() => {
        pathAssign(obj, "general", "Hola!");
    }).toThrow("Incorrect path. Property general level 1");
});

test("Removes a path from an object", () => {
    const obj: any = {
        general: {
            hi: "Gello World",
        },
    };

    pathRemove(obj, "general.hi");

    expect(obj).toEqual({ general: {} });

    pathRemove(obj, "general");
    expect(obj).toEqual({});

    expect(() => {
        pathRemove(obj, "about");
    }).toThrow("Incorrect path. Property about level 1");
});

test("Checks existance of the path", () => {
    const obj: any = {
        general: {
            hi: "Gello World",
            interesting: {
                stuff: "Ciekawe!",
            },
        },
    };

    expect(pathExists(obj, "general.hi")).toBeTruthy();
    expect(pathExists(obj, "general.hello")).toBeFalsy();
    expect(pathExists(obj, "general")).toBeTruthy();
    expect(pathExists(obj, "general.interesting.stuff")).toBeTruthy();
});

test("Get's an object throught the path", () => {
    const obj: any = {
        general: {
            hi: "Gello World",
            interesting: {
                stuff: "Ciekawe!",
            },
        },
    };
    expect(pathGet(obj, "general.hi")).toBe("Gello World");
    expect(() => pathGet(obj, "general.hello")).toThrow(
        "Path doesn't exist property hello level 2"
    );
    expect(pathGet(obj, "general")).toEqual({
        hi: "Gello World",
        interesting: {
            stuff: "Ciekawe!",
        },
    });
    expect(pathGet(obj, "general.interesting.stuff")).toBe("Ciekawe!");
});
