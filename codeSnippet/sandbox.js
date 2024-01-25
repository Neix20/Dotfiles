const { clsUtility, clsLogger, clsWriter, clsConst } = require("./utils");
const { FormatSqlCsv, MakeIntoArr, MakeIntoJson, JoinIntoOneString, JsonHelper, GetJsonKeyValue, ParseSqlStoreProcedureIntoDict, ConvertJsonToSql, FormatTasks, } = clsUtility;
const { ConvertEpochToIso, ConvertIsoToEpoch } = clsUtility;

function main() {
    let arr;

    // GetJsonKeyValue
    arr = [];

    // for ( const obj of arr) {
    //     try {
    //         const res = JsonHelper(obj);
    //         console.log(`Output: ${res}`);
    //     } catch (err) {
    //         console.error(`Error: ${obj}, ${err}`)
    //     }
    // }

    // try {
    //     const res = JsonHelper(obj);
    //     console.log(`Output: ${res}`);
    // } catch (err) {
    //     console.error(`Error: ${obj}, ${err}`)
    // }

    // rgx = /^\{.*?\}$/g;
    // str = "\"type\": \"bar\"";
    // console.log(!rgx.test(str));

    // str = "{\"type\": \"bar\"}";
    // console.log(rgx.test(str));

    arr = [
        "2024-11-27T21:28:40+08:00",
        "2024-08-30T16:44:29+08:00",
        "2024-07-28T01:08:44+08:00",
        "2024-11-02T11:13:35+08:00"
    ]

    for (let val of arr) {
        val = ConvertIsoToEpoch(val);
        console.log(val);
    }

    arr = [
        "1713490888",
        "1712775551",
        "1727024526",
        "1730895613",
        "1725372561"
    ]

    for (let val of arr) {
        val = ConvertEpochToIso(val);
        console.log(val);
    }

}

main();