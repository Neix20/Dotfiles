const { clsUtility, clsLogger, clsWriter, clsConst } = require("./utils");
const { FormatSqlCsv, MakeIntoArr, MakeIntoJson, JoinIntoOneString, JsonHelper, GetJsonKeyValue, ParseSqlStoreProcedureIntoDict, ConvertJsonToSql, FormatTasks, } = clsUtility;
const { ConvertEpochToIso, ConvertIsoToEpoch } = clsUtility;

function main() {
    let arr;
    let rgx;

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
        "2024-03-01T00:00:00",
        "2024-05-01T00:00:00+08:00",
        "2024-07-01T00:00:00.000z",
    ]

    for (let val of arr) {
        val = ConvertIsoToEpoch(val);

        console.log(val);
    }

    // arr = [
    //     "1713490888",
    //     "1712775551",
    //     "1727024526",
    //     "1730895613",
    //     "1725372561"
    // ]

    // for (let val of arr) {
    //     val = ConvertEpochToIso(val);
    //     console.log(val);
    // }

}

main();