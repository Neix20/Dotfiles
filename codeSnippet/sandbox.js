const { clsUtility, clsLogger, clsWriter, clsConst } = require("./utils");
const {FormatSqlCsv, MakeIntoArr, MakeIntoJson, JoinIntoOneString, JsonHelper, GetJsonKeyValue, ParseSqlStoreProcedureIntoDict, ConvertJsonToSql, FormatTasks,} = clsUtility;

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

    let rgx = /^\{.*?\}$/g;
    let str = "\"type\": \"bar\"";
    console.log(!rgx.test(str));

    str = "{\"type\": \"bar\"}";
    console.log(rgx.test(str));

}

main();