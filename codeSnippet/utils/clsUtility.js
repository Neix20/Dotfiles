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
            // Replace all Double quotation into Single Quotes
            res[0] = JSON.stringify(res[0])
                .replace(/\\{2,}/g, `\\`);
            return res[0];
        }

        return JSON.stringify(res, null, 4);
    } catch (error) {
        throw error;
    }
}

// This Functino took me 2 hours
function parseNestedJson(txt) {

    if (typeof txt === "object") {
        return txt;
    }

    try {
        txt = txt
            .replace(/\\{2,}/g, `\\`)
            .replace(/\\"/g, `"`)
            .replace(/"\{/g, "{")
            .replace(/\}"/g, "}")
            .replace(/"\[/g, "[")
            .replace(/\]"/g, "]");
        const obj = JSON.parse(txt);
        return obj;
    } catch (err) {
        const obj = JSON.parse(txt);
        return obj;
    }
}

function JsonHelper(text = "{}") {
    if (text.length <= 0) {
        return "";
    }

    try {

        // 1. Convert Selection to json Object
        let obj = text;

        // Convert all Child Object of 1 Level to Object
        obj = parseNestedJson(obj);

        const { sort = false, pairSwitch = false } = obj;

        if ("sort" in obj) {
            delete obj["sort"];
        }

        if ("pairSwitch" in obj) {
            delete obj["pairSwitch"];
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

            // 3. Pair Switch
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

        rgx = /,$/g;
        text = text.replace(rgx, "").trim();

        const data = JSON.parse(text);

        if (Array.isArray(data) && data.length > 0 && typeof data[0] === "object") {

            let res = [];

            for (const obj of data) {
                const t_res = Object.entries(obj)
                    .map(([key, value]) => {
                        if (typeof value === "object") {
                            return `${key}; ${JSON.stringify(value)}`
                        }
                        return `${key}; ${value}`
                    })
                    .join("\n");
                res.push(t_res);
            }

            res = res.join("\n");
            return res;
        } else {
            let res = [];

            const { type = "" } = data;

            if ("type" in data) {
                delete data["type"];
            }

            if (type == "values") {
                res = Object.values(data);
            } else if (type == "keys") {
                res = Object.keys(data);
            } else {
                res = Object.entries(data)
                    .map(([key, value]) => {
                        if (typeof value === "object") {
                            return `${key}; ${JSON.stringify(value)}`
                        }
                        return `${key}; ${value}`
                    });
            }

            if (res.length >= 1 && typeof res[0] === "object") {
                return JSON.stringify(res, null, 4);
            }

            res = res.join("\n");
            return res;
        }
    } catch (error) {
        throw error;
    }
}

// SQL
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

function MakeIntoJson(text = "[]") {

    if (text.length <= 0) {
        return "";
    }

    // Input I: Name; Ivan Holloway
    // Input II: Name; Ivan Holloway\\nName; Lora Garcia
    try {
        let rgx;
        let arr = text.split("\n");

        // Remove Whitespace
        arr = arr.map(x => x.trim());

        rgx = /^\s*$/;
        arr = arr.filter(x => !rgx.test(x));

        let res = {};

        let res_ls = [];

        for (let str of arr) {
            rgx = /, |; |\| |,|;|\|/;
            let t_arr = str.split(rgx);

            if (t_arr.length >= 2) {

                // Join Remaining String
                t_arr = [
                    t_arr[0],
                    t_arr.slice(1).join(", ")
                ];

                // Remove Quotes
                rgx = /^"?(.*?)"?$/g
                t_arr = t_arr.map(x => x.replace(rgx, "$1"));

                let [key, val] = t_arr;

                // Check If "[", "]", "{", "}" is in val
                rgx = /[{\[\]}]/g;
                if (rgx.test(val)) {
                    try {
                        val = `"${val}"`;
                        val = JSON.parse(val);
                    } catch (err) {

                    }
                }

                // Check if Duplicates
                if (key in res) {
                    res_ls.push({ ...res });
                    res = {};
                }

                res[key] = val;
            }
        };

        // Return List If Have Similar Key
        if (res_ls.length > 0) {
            res_ls.push(res);
            res = res_ls;
        }

        // Output I: { "Name": "Ivan Holloway" }
        // Output II: [{ "Name": "Ivan Holloway" }, { "Name": "Lora Garcia" }]
        res = JSON.stringify(res, null, 4)
            .replace(/\\{2,}/g, `\\`)
            .replace(/\\"\{/g, "{")
            .replace(/\}\\"/g, "}")
            .replace(/\\"\[/g, "[")
            .replace(/\]\\"/g, "]");
        return res;
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

// SQL
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

// Markdown
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
// #endregion

// #region Convert To SQL Helper
function ConvertJsonToSql(text = "{}") {
    if (text.length <= 0) {
        return "";
    }

    try {
        let res = "";

        const jObj = JSON.parse(text);

        const { type = "insert", data = [] } = jObj;

        if (type === "insert") {
            res = InsertSql(data);
        } else if (type === "update") {
            res = UpdateSql(data);
        } else if (type === "select") {
            res = SelectSql(data);
        }

        return res;
    } catch (error) {
        throw error;
    }
}

function InsertSql(data = []) {
    let res = [];

    if (Array.isArray(data)) {
        for (const obj of data) {

            const keys = Object.keys(obj)
                .map(x => `\t${x}`)
                .join(",\n");

            const values = Object.values(obj)
                .map(x => `\t'${x}'`)
                .join(",\n");

            let t_res = [
                "INSERT INTO tblName (",
                keys,
                ") VALUES (",
                values,
                ");"
            ];

            t_res = t_res.join("\n");

            res.push(t_res);
        }

        res = res.join("\n\n");
    }
    // If Its Object
    else {
        const keys = Object.keys(data)
            .map(x => `\t${x}`)
            .join(",\n");

        const values = Object.values(data)
            .map(x => `\t'${x}'`)
            .join(",\n");

        res = [
            "INSERT INTO tblName (",
            keys,
            ") VALUES (",
            values,
            ");"
        ];

        res = res.join("\n");
    }

    return res;
}

function UpdateSql(data = []) {
    let res = [];

    if (Array.isArray(data)) {
        for (const obj of data) {

            const keys = Object.keys(obj);
            const p_key = keys.at(0);

            const sql_values = keys
                .slice(1)
                .map(key => `[${key}] = '${obj[key]}'`)
                .map(x => `\t${x}`)
                .join(",\n");

            const where_cond = `AND [${p_key}] = '${obj[p_key]}';`;

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
    }
    // If Its Object
    else {
        const keys = Object.keys(data);
        const p_key = keys.at(0);

        const sql_values = keys
            .slice(1)
            .map(key => `[${key}] = '${data[key]}'`)
            .map(x => `\t${x}`)
            .join(",\n");

        const where_cond = `AND [${p_key}] = '${data[p_key]}';`;

        res = [
            "UPDATE tblName",
            "SET",
            sql_values,
            "WHERE 1=1",
            where_cond
        ];

        res = res.join("\n");
    }

    return res;
}

function SelectSql(data = []) {

    let res = [];

    if (Array.isArray(data)) {
        for (const obj of data) {

            const keys = Object.keys(obj)
            const p_key = keys.at(0);

            const sql_values = keys
                .slice(1)
                .map(x => `\t[${x}]`)
                .join(",\n");

            const values = Object.values(obj);

            const where_cond = `AND [${p_key}] = '${values[0]}';`

            let t_res = [
                "SELECT",
                sql_values,
                "FROM tblName",
                "WHERE 1=1",
                where_cond
            ];

            t_res = t_res.join("\n");

            res.push(t_res);
        }

        res = res.join("\n\n");
    }
    // If Its Object
    else {
        const keys = Object.keys(data)
        const p_key = keys.at(0);

        const sql_values = keys
            .slice(1)
            .map(x => `\t[${x}]`)
            .join(",\n");

        const values = Object.values(data);

        const where_cond = `AND [${p_key}] = '${values[0]}';`

        res = [
            "SELECT",
            sql_values,
            "FROM tblName",
            "WHERE 1=1",
            where_cond
        ];

        res = res.join("\n");
    }

    return res;
}
// #endregion

// #region Timestamp
function ConvertIsoToEpoch(txt) {

    if (txt.length <= 0) {
        return "";
    }

    // Input: 2024-03-28T19:34:26
    // Format: yyyy-MM-ddTHH:mm:ss

    // Input: 2024-03-28T19:34:26+08:00
    // Input: 2024-03-28T11:34:26.000Z
    let res = "0";

    try {
        // const rgx = /(.*?)[+.].*/g;
        // res = txt.replace(rgx, "$1");

        // Convert All String to String
        try {
            txt = JSON.parse(txt);
        } catch (ex2) {
            
        }

        // Convert To Timestamp
        res = new Date(txt).getTime();
      
        // Convert To Seconds
        res = Math.floor(res / 1000) + "";
    } catch (error) {
        throw error;
    }

    return res;
}

function ConvertEpochToIso(txt) {

    // Input: 1711625666 (s)
    // Input: 1711625666000 (ms)

    if (txt.length <= 0) {
        return "";
    }

    let res = "";

    try {

        // If String is Integer
        if (!isNaN(txt)) {
            res = +txt;

            if (res < 1000000000000) {
                res = res * 1000;
            }   
        } else {
            try {
                res = JSON.parse(txt);
            } catch (ex2) {
                res = txt;
            }
        }
        
        // Output: 2024-03-28T11:34:26.000Z
        const dt = new Date(res).toISOString();
        res = dt.split(".").at(0);
    } catch (error) {
        throw error;
    }

    return res;
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
    ConvertJsonToSql,
    FormatTasks,
};

utils = {
    ...utils,
    ConvertEpochToIso,
    ConvertIsoToEpoch,
}

module.exports = utils;