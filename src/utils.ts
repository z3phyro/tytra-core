export const clearEntries = (json: any, value = "-") => {
    for (let key in json) {
        if (typeof json[key] == "object") clearEntries(json[key], value);
        else json[key] = value;
    }
};

export const generateInterface = (json: any, name = "Translation") => {
    return `export interface ${name}Interface ${JSON.stringify(json, null, 2)
        .replace(/("\w+"): (".*")(,?\n)/g, "$1: string$3")
        .replace(/"(\w+)"\s*:/g, "$1:")};`;
};

export const pathAssign = (json: any, path: string, value: string) => {
    let curObj = json;
    const parts = path.split(".");
    let counter = 1;
    for (let part of parts) {
        if (counter++ < parts.length) {
            if (typeof curObj[part] == "undefined") {
                curObj[part] = {};
                curObj = curObj[part];
                continue;
            }

            if (typeof curObj[part] == "object") {
                curObj = curObj[part];
                continue;
            }

            throw `Incorrect path. Property ${part} level ${counter - 1}`;
        }

        if (typeof curObj[part] == "object") {
            throw `Incorrect path. Property ${part} level ${counter - 1}`;
        }
        curObj[part] = value;
    }

    return json;
};

export const pathRemove = (json: any, path: string) => {
    let curObj = json;
    const parts = path.split(".");
    let counter = 1;
    for (let part of parts) {
        if (counter++ < parts.length) {
            if (typeof curObj[part] == "object") {
                curObj = curObj[part];
                continue;
            }

            throw `Incorrect path. Property ${part} level ${counter - 1}`;
        }

        if (typeof curObj[part] == "undefined")
            throw `Incorrect path. Property ${part} level ${counter - 1}`;

        delete curObj[part];
    }

    return json;
};

export const pathExists = (json: any, path: string): boolean => {
    let curObj = json;
    const parts = path.split(".");
    let counter = 1;
    for (let part of parts) {
        if (counter++ < parts.length) {
            if (typeof curObj[part] == "object") {
                curObj = curObj[part];
                continue;
            }

            return false;
        }

        if (typeof curObj[part] == "undefined") return false;

        return true;
    }

    return json;
};

export const pathGet = (json: any, path: string): boolean => {
    let curObj = json;
    const parts = path.split(".");
    let counter = 1;
    for (let part of parts) {
        if (counter++ < parts.length) {
            if (typeof curObj[part] == "object") {
                curObj = curObj[part];
                continue;
            }

            throw `Path doesn't exist property ${part} level ${counter - 1}`;
        }

        if (typeof curObj[part] == "undefined")
            throw `Path doesn't exist property ${part} level ${counter - 1}`;

        return curObj[part];
    }

    return json;
};
