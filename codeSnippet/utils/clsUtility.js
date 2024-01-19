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

// #region Core Functions
function MakeIntoArr(text = "") {
    if (text.length <= 0) {
        return "";
    }

    try {
        let res = text.split("\n");

        if (res.length == 1) {
            return JSON.stringify(res[0]);
        }

        return JSON.stringify(res, null, 4);
    } catch (error) {
        throw error;
    }
}

// Check If It Contains JSON Object Node
// This Does Indexy As Well I dk how
function JsonHelper(text = "{}") {
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

            if (ind == 0) {
                obj = obj
                    .replace(/\\"/g, `"`)
                    .replace(/"\{/g, "{")
                    .replace(/\}"/g, "}");
            }

            obj = JSON.parse(obj);
            ind += 1;
        }

        const { sort = false, type = "json", pairSwitch = false } = obj;

        if ("sort" in obj) {
            delete obj["sort"];
        }

        if ("type" in obj) {
            delete obj["type"];
        }

        if ("pairSwitch" in obj) {
            delete obj["pairSwitch"];
        }

        if (type === "string") {
            const res = JSON.stringify(obj)
                .replace(/"/g, '\\"')
                .replace(/\\{2,}/g, '\\')
            // .replace(/\{/g, '\\{')
            // .replace(/\}/g, '\\}')

            return `\"${res}\"`;
        }

        let res = {};

        // 2. Sort JSON Object By Keys
        // Object.keys on Array return Index
        let keys = Object.keys(obj);

        if (sort) {
            keys = keys.sort();
        }

        for (let key of keys) {
            const val = obj[key];

            if (pairSwitch) {
                res[val] = key;
            } else {
                res[key] = val;
            }
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

        // Remove FirstLine
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

// [ ] Make Into List of JSON if Same Key
function MakeIntoJson(text = "[]") {

    if (text.length <= 0) {
        return "";
    }

    try {
        let rgx;
        let arr = text.split("\n");

        // Remove Whitespace
        arr = arr.map(x => x.trim());

        rgx = /^\s*$/;
        arr = arr.filter(x => !rgx.test(x));

        let res = {};

        let res_ls = []

        for (let str of arr) {
            rgx = /, |; |\| |,|;|\|/;
            let t_arr = str.split(rgx);

            if (t_arr.length >= 2) {

                // Join Remaining String
                t_arr = [
                    t_arr[0],
                    t_arr.slice(1).join(", ")
                ]

                // Remove Quotes
                rgx = /"?(.*?)"?/g
                t_arr = t_arr.map(x => x.replace(rgx, "$1"));

                const [key, val] = t_arr;

                if (key in res) {
                    res_ls.push({...res});
                    res = {};
                } 

                res[key] = val;
            }
        };

        // Return List
        if (res_ls.length > 0) {
            res_ls.push(res);
            res = res_ls;
        }

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

function ConvertJsonToInsertSql(text = "[]") {
    if (text.length <= 0) {
        return "";
    }

    try {
        const arr = JSON.parse(text);

        let res = [];

        for (const obj of arr) {

            let key = Object.keys(obj);

            key = key.map(x => x);

            key[0] = "\t" + key[0];
            key = key.join(",\n\t");

            let value = Object.values(obj);

            value = value.map(x => `'${x}'`);

            value[0] = "\t" + value[0];
            value = value.join(",\n\t");

            let t_res = [
                "INSERT INTO tblName (",
                key,
                ") VALUES (",
                value,
                ");",
            ];
            t_res = t_res.join("\n");

            res.push(t_res)
        }

        res = res.join("\n\n");

        return res;
    } catch (error) {
        throw error;
    }
}

function ConvertJsonToUpdateSql(text = "[]") {
    if (text.length <= 0) {
        return "";
    }

    try {
        const arr = JSON.parse(text);

        let res = [];

        for (const obj of arr) {

            let sql_values = [];

            // [User_Id] = 12

            const keys = Object.keys(obj);
            const p_key = keys[0];

            for (const key of keys.slice(1)) {
                const val = obj[key];
                sql_values.push(`[${key}] = '${val}'`);
            }

            sql_values[0] = "\t" + sql_values[0];
            sql_values = sql_values.join(",\n\t");

            const where_cond = `AND ${p_key} = '${obj[p_key]}';`;

            let t_res = [
                "UPDATE tblName",
                "SET",
                sql_values,
                "WHERE 1=1",
                where_cond
            ];
            t_res = t_res.join("\n");
        
            res.push(t_res);
        }

        res = res.join("\n\n");

        return res;
    } catch (error) {
        throw error;
    }
}
// #endregion

let utils = {};

utils = {
    ...utils,
    genDt
};

utils = {
    ...utils,
    FormatSqlCsv,
    MakeIntoArr,
    MakeIntoJson,
    JoinIntoOneString,
    JsonHelper,
    GetJsonKeyValue,
    ParseSqlStoreProcedureIntoDict,
    ConvertJsonToInsertSql,
    ConvertJsonToUpdateSql,
    FormatTasks,
};

module.exports = utils;