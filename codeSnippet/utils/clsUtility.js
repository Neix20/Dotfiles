function genDt() {
    const dt = new Date();

    const year = dt.getFullYear();
    const month = String(dt.getMonth() + 1).padStart(2, '0');
    const day = String(dt.getDate()).padStart(2, '0');

    const t = `${year}${month}${day}`;

    const hours = String(dt.getHours()).padStart(2, '0');
    const minutes = String(dt.getMinutes()).padStart(2, '0');
    const seconds = String(dt.getSeconds()).padStart(2, '0');

    const t2 = `${hours}${minutes}${seconds}`;

    return `${t}T${t2}`;
}

function MakeIntoArr(text = "") {
    if (text.length <= 0) {
        return "";
    }

    try {
        let res = text.split("\n");
        return JSON.stringify(res, null, 4);
    } catch (error) {
        throw error;
    }
}

function MakeIntoJson(text = "{}") {
    if (text.length <= 0) {
        return "";
    }

    try {
        // 1. Convert Selection to json Object
        let obj = text;

        let ind = 0;
        while (typeof obj === "string") {
            if (ind >= 5) {
                obj = { "response": "Error! Too many Objects!" };
                break;
            }
            obj = JSON.parse(obj);
            ind += 1;
        }

        const { sort = false } = obj;

        if ("sort" in obj) {
            delete obj["sort"];
        }

        let res = {};

        // 2. Sort JSON Object By Keys
        let keys = Object.keys(obj);

        if (sort) {
            keys = keys.sort();
        }

        for (let key of keys) {
            res[key] = obj[key];
        }

        return JSON.stringify(res, null, 4);
    } catch (error) {
        throw error;
    }
}

function ConvertArrToDictWithIndex(text = "[]") {
    if (text.length <= 0) {
        return "";
    }

    try {
        const arr = JSON.parse(text);

        let res = {};

        for (let ind = 0; ind < arr.length; ind++) {
            res[ind] = arr[ind];
        }

        return JSON.stringify(res, null, 4);
    } catch (error) {
        throw error;
    }
}

function GetJsonKeyValue(text = "[]") {
    if (text.length <= 0) {
        return "";
    }

    try {
        const obj = JSON.parse(text);

        let res = [];

        const { type = "values" } = obj;

        if ("type" in obj) {
            delete obj["type"];
        }

        if (type == "values") {
            res = Object.values(obj);
        } else if (type == "keys") {
            res = Object.keys(obj);
        }

        return JSON.stringify(res, null, 4);
    } catch (error) {
        throw error;
    }
}

function FormatSqlCsv(text = "") {
    if (text.length <= 0) {
        return "";
    }

    try {
        let res = text.split("\n");

        res = res.slice(1);

        // Javascript regex match if string starts with " and ends with white string
        const rgx = /^"\s+$/;
        res = res.filter(x => !rgx.test(x));

        res = res.map(x => x.slice(1));

        res = res.join("\n");

        return res;
    } catch (error) {
        throw error;
    }
}

function KvpToJson(text = "[]") {
    if (text.length <= 0) {
        return "";
    }

    try {
        const arr = JSON.parse(text);

        let res = {};

        for (let obj of arr) {
            const { Key, Value } = obj;
            res[Key] = Value;
        };

        return JSON.stringify(res, null, 4);
    } catch (error) {
        throw error;
    }
}

function JoinIntoOneString(text = "") {
    if (text.length <= 0) {
        return "";
    }

    try {
        let res = text.split("\n");

        res = res.map(x => x.trim());

        res = res.join(" ");

        return res;
    } catch (error) {
        throw error;
    }
}

function ParseSqlStoreProcedureIntoDict(text = "[]") {
    if (text.length <= 0) {
        return "";
    }

    try {
        let arr = JSON.parse(text);

        // 1. Filter out empty Objects
        arr = arr.filter(x => x.name !== "" || x.data_type !== "");

        let res = {};

        if (arr.length <= 1) {
            return "";;
        }

        // Add Stop Condition
        arr.push({ "name": "", "data_type": "" });

        let cur_ind = 0;
        for (let ind = 1; ind < arr.length; ind += 1) {
            const { data_type } = arr[ind];

            if (data_type === "") {
                const { name } = arr[cur_ind];
                res[name] = arr.slice(cur_ind + 1, ind);
                cur_ind = ind;
            }
        }

        return JSON.stringify(res, null, 4);
    } catch (error) {
        throw error;
    }
}

function FormatTasks(text = "") {
    if (text.length <= 0) {
        return "";
    }

    try {
        let arr = text.split("\n");

        // Remove Whitespace
        const rgx = /^\s*$/;
        arr = arr.filter(x => !rgx.test(x));

        let res = [];

        // Add Stop Condition
        arr.push("#");

        let obj = { title: "" };
        let description = [];

        for (let str of arr) {

            // Remove Whitespace at Front
            str = str.trim();

            if (str.includes("#")) {

                if (description.length > 0) {
                    obj["description"] = description;
                    res.push(obj);

                    // Reset to New Array
                    description = [];
                }

                const title = str.replace(/#+ /g, "");
                obj = { title };
            } else {
                description.push(str);
            }
        }

        return JSON.stringify(res, null, 4);
    } catch (error) {
        throw error;
    }
}

function ConvertSqlToInsert(text = "[]") {
    if (text.length <= 0) {
        return "";
    }

    try {
        const arr = JSON.parse(text);

        let res = []

        for (const obj of arr) {
            let val = Object.values(obj);

            val = val.map(x => `'${x}'`);

            val = val.join(", ");

            res.push(`INSERT INTO tblName VALUES (${val});`)
        }

        res = res.join("\n");

        return res;
    } catch (error) {
        throw error;
    }
}

let utils = {};

utils = {
    ...utils,
    genDt
};

utils = {
    ...utils,
    MakeIntoArr,
    MakeIntoJson,
    ConvertArrToDictWithIndex,
    GetJsonKeyValue,
    FormatSqlCsv,
    KvpToJson,
    JoinIntoOneString,
    ParseSqlStoreProcedureIntoDict,
    FormatTasks,
    ConvertSqlToInsert,
};

module.exports = utils;