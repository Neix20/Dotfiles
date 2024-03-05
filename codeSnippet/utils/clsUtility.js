/**
 * @name genDt
 * @param 
 * @returns {*}
 */
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

// #region Core Utils
/**
 * @name MakeIntoArr
 * @param text
 * @returns {*}
 */
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

function ParseWhitespace(txt = "[]") {
    if (txt.length <= 0) {
        return "";
    }

    try {
        txt = JSON.stringify(txt)
            .replace(/\\[abfnrtv]/g, "")
            .replace(/\\{2,}/g, "\\")
            .replace(/\\(.)/g, "$1")
            .replace(/"\{/g, "{")
            .replace(/\}"/g, "}")
            .replace(/"\[/g, "[")
            .replace(/\]"/g, "]")
            .replace(/^"(.*?)"$/g, "$1");

    } catch (error) {
        throw error;
    }

    return txt;
}

/**
 * @name parseNestedJson
 * @param txt
 * @returns {*}
 */
function parseNestedJson(txt) {

    if (typeof txt === "object") {
        return txt;
    }
    
    try {
        txt = ParseWhitespace(txt);
        const obj = JSON.parse(txt);
        return obj;
    } catch (err) {
        const obj = JSON.parse(txt);
        return obj;
    }
}

/**
 * @name JsonHelper
 * @param text
 * @returns {*}
 */
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

/**
 * @name GetJsonKeyValue
 * @param text
 * @returns {*}
 */
function GetJsonKeyValue(text = "[]") {
    if (text.length <= 0) {
        return "";
    }

    try {

        const rgx = /,$/g;
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
/**
 * @name FormatSqlCsv
 * @param text
 * @returns {*}
 */
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

/**
 * @name MakeIntoJson
 * @param text
 * @returns {*}
 */
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

/**
 * @name JoinIntoOneString
 * @param text
 * @returns {*}
 */
function JoinIntoOneString(text = "") {
    if (text.length <= 0) {
        return "";
    }

    try {
        let res = text.split("\n");

        res = res.map(x => x.trim());
        res = res.join("");

        return res;
    } catch (error) {
        throw error;
    }
}

// SQL
/**
 * @name ParseSqlStoreProcedureIntoDict
 * @param text
 * @returns {*}
 */
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
/**
 * @name FormatTasks
 * @param text
 * @returns {*}
 */
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
/**
 * @name ConvertJsonToSql
 * @param text
 * @returns {*}
 */
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

/**
 * @name InsertSql
 * @param data
 * @returns {*}
 */
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

/**
 * @name UpdateSql
 * @param data
 * @returns {*}
 */
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

/**
 * @name SelectSql
 * @param data
 * @returns {*}
 */
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
/**
 * @name ConvertIsoToEpoch
 * @param txt
 * @returns {*}
 */
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

        // Convert To Timestamp
        res = new Date(txt).getTime();

        // Convert To Seconds
        res = Math.floor(res / 1000) + "";
    } catch (error) {
        throw error;
    }

    return res;
}

/**
 * @name ConvertEpochToIso
 * @param txt
 * @returns {*}
 */
function ConvertEpochToIso(txt) {

    // Input: 1711625666 (s)
    // Input: 1711625666000 (ms)

    if (txt.length <= 0) {
        return "";
    }

    let res = "";

    try {

        // If String is Integer
        res = +txt;

        if (res < 1000000000000) {
            res = res * 1000;
        }

        // Output: 2024-03-28T11:34:26.000Z
        const dt = new Date(res).toISOString();
        res = dt.split(".").at(0);
    } catch (error) {
        throw error;
    }

    return res;
}

/**
 * @name EpochIsoConverter
 * @param data
 * @returns {*}
 */
function EpochIsoConverter(data) {

    let dataType = "string";

    try {
        data = JSON.parse(data)
    } catch (err_2) {
        
    }

    // Check If String is integer
    if (!isNaN(data)) {
        dataType = "number";
    }

    if (dataType === "number") {
        return ConvertEpochToIso(data);
    }
    return ConvertIsoToEpoch(data);
}
// #endregion

// #region YAML
const yaml = require('js-yaml');

/**
 * @name jsonToYaml
 * @param txt
 * @returns {*}
 */
function jsonToYaml(txt) {
    try {
        let jsonData = txt;
        if (typeof jsonData === "string") {
            jsonData = JSON.parse(jsonData); // Here Must be Txt
        }
        const res = yaml.dump(jsonData, { indent: 4 });
        return res;
    } catch (error) {
        throw error;
    }
}

/**
 * @name yamlToJson
 * @param txt
 * @returns {*}
 */
function yamlToJson(txt) {
    try {
        const res = yaml.load(txt, { schema: yaml.JSON_SCHEMA });
        return res;
    } catch (error) {
        throw error;
    }
}

/**
 * @name detectYamlJson
 * @param data
 * @returns {*}
 */
function detectYamlJson(data) {

    if (typeof data === "object") {
        return 'json';
    }

    try {
        // Try parsing as JSON
        JSON.parse(data);
        return 'json';
    } catch (jsonError) {
        try {
            // Try parsing as YAML
            yaml.load(data);
            return 'yaml';
        } catch (yamlError) {
            // If it fails to parse as both JSON and YAML, it's neither
            return "";
        }
    }
}

/**
 * @name YamlJsonFormatter
 * @param text
 * @returns {*}
 */
function YamlJsonFormatter(text = "") {
    if (text.length <= 0) {
        return "";
    }

    try {
        const dataType = detectYamlJson(text);

        if (dataType === "json") {
            const res = jsonToYaml(text);
            return res;
        }

        if (dataType === "yaml") {
            const res = yamlToJson(text);
            return JSON.stringify(res, null, 4);
        }

        return "";
    } catch (error) {
        throw error;
    }
}
// #endregion

// #region CSV
const csvConverter = require("json-2-csv");

/**
 * @name jsonToCsv
 * @param txt
 * @returns {*}
 */
function jsonToCsv(txt) {
    try {
        let json = txt;

        if (typeof json === "string") {
            json = JSON.parse(json); // Here Must be Txt
        }

        const res = csvConverter.json2csv(json);
        return res;
    } catch (error) {
        throw error;
    }
}

/**
 * @name csvToJson
 * @param txt
 * @returns {*}
 */
function csvToJson(txt) {
    try {
        const res = csvConverter.csv2json(txt);
        return res;
    } catch (error) {
        throw error;
    }
}

/**
 * @name detectCsvJson
 * @param data
 * @returns {*}
 */
function detectCsvJson(data) {

    try {
        // Try parsing as JSON
        JSON.parse(data);
        return 'json';
    } catch (error) {
        try {
            csvConverter.csv2json(data);
            return "csv";
        } catch (error_2) {
            throw error_2;
        }
    }
}

/**
 * @name CsvJsonFormatter
 * @param text
 * @returns {*}
 */
function CsvJsonFormatter(text = "[]") {
    if (text.length <= 0) {
        return "";
    }

    try {
        const dataType = detectCsvJson(text);

        if (dataType === "json") {
            const res = jsonToCsv(text);
            return res;
        }

        if (dataType === "csv") {
            const res = csvToJson(text);
            return JSON.stringify(res, null, 4);
        }

        return "";
    } catch (error) {
        throw error;
    }
}
// #endregion

// #region Documentation
/**
 * @name ExtractTokenAndParam
 * @param val
 * @returns {*}
 */
function ExtractTokenAndParam(val = "") {

    // Output: {"func_name": "format","func_param": [ "num", "str", "ls", "dict" ]}
    let rgx = "";

    rgx = /(.*?\)).*$/g;
    val = val.replace(rgx, "$1");

    rgx = /(.*)(\(.*)/g;
    let token = val.replace(rgx, "$1");
    let param = val.replace(rgx, "$2");

    // Get Token
    token = token.split("=").at(0).trim();
    token = token.split(" ").at(-1);

    // Remove Start and End Bracket
    param = param.slice(1, param.length - 1);
    param = param.split(/, (?![^<>]*>)/g);

    // Remove Default Values
    param = param.map(x => x.split("=").at(0).trim());

    return {
        func_name: token,
        func_param: param
    }
}

/**
 * @name GenParamDataType
 * @param param
 * @returns {*}
 */
function GenParamDataType(param = []) {
    // Input: [ "num", "str", "ls", "dict" ]
    // Input: [ "num: number", "str: string", "ls: number[]", "dict: { [key: string]: number }" ]
    // Input: [ "int num", "std::string str", "std::vector<int> ls", "std::map<std::string, int> dict" ]

    let param_res = [];

    const key = param[0];
    if (key.includes(": ")) {
        param_res = param
            .map(x => x.split(": "))
            .map(x => [x[0], x.slice(1).join(" ")])
            .map(x => x.reverse());
    }

    if (param_res.length == 0) {
        param_res = param
            .map(x => x.replace(/std::/g, ""))
            .map(x => x.split(" "))
            .map(x => [x.slice(0, x.length - 1).join(" "), x.at(-1)]);
    }

    return param_res;
}

/**
 * @name GenDocGeneral
 * @param name
 * @param param
 * @returns {*}
 */
function GenDocGeneral(name = "", param = []) {
    let param_res = GenParamDataType(param);

    param_res = param_res.map((x, ind) => {
        const [data_type, param_name] = x;
        if (data_type === "") {
            return ` * @param ${param_name}`
        }

        return ` * @param {${data_type}} ${param_name}`
    });

    const res = [
        "/**",
        ` * @name ${name}`,
        ...param_res,
        " * @returns {*}",
        " */"
    ]

    return res;
}

/**
 * @name GenDocPython
 * @param name
 * @param param
 * @returns {*}
 */
function GenDocPython(name = "", param = []) {
    let param_res = GenParamDataType(param);

    param_res = param_res.map((x, ind) => {
        const [data_type, param_name] = x;
        if (data_type === "") {
            return `\t\t${param_name}:`
        }

        return `\t\t${param_name} (${data_type}):`;
    });

    const res = [
        "\t\"\"\"",
        "",
        "\tArgs:",
        ...param_res,
        "",
        "\tReturns:",
        `\t\t${name} (*):`,
        "\t\"\"\""
    ]

    return res;
}

/**
 * @name GenerateDocStr
 * @param text
 * @returns {*}
 */
function GenerateDocStr(text = "[]") {
    if (text.length <= 0) {
        return "";
    }

    try {
        const kw = text.split(" ").at(0);

        const { func_name: token, func_param: param } = ExtractTokenAndParam(text);

        let res = [];

        if (kw === "def") {
            const t_arr = GenDocPython(token, param);

            res = [
                text,
                ...t_arr
            ]
        } else {
            const t_arr = GenDocGeneral(token, param);
            res = [
                ...t_arr,
                text
            ]
        }

        return res.join("\n");

    } catch (error) {
        throw error;
    }
}
// #endregion

module.exports.genDt = genDt;
module.exports.MakeIntoArr = MakeIntoArr;
module.exports.MakeIntoJson = MakeIntoJson;
module.exports.JoinIntoOneString = JoinIntoOneString;
module.exports.ParseWhitespace = ParseWhitespace;
module.exports.JsonHelper = JsonHelper;
module.exports.GetJsonKeyValue = GetJsonKeyValue;
module.exports.FormatSqlCsv = FormatSqlCsv;
module.exports.ParseSqlStoreProcedureIntoDict = ParseSqlStoreProcedureIntoDict;
module.exports.FormatTasks = FormatTasks;
module.exports.ConvertJsonToSql = ConvertJsonToSql;
module.exports.EpochIsoConverter = EpochIsoConverter;
module.exports.YamlJsonFormatter = YamlJsonFormatter;
module.exports.CsvJsonFormatter = CsvJsonFormatter;
module.exports.GenerateDocStr = GenerateDocStr;