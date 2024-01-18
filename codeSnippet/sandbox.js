const { clsUtility, clsLogger, clsWriter, clsConst } = require("./utils");
const { MakeIntoArr, JsonHelper, ConvertArrToDictWithIndex, GetJsonKeyValue, FormatSqlCsv, MakeIntoJson, JoinIntoOneString, ParseSqlStoreProcedureIntoDict, FormatTasks, ConvertSqlToInsert } = clsUtility;

function main() {
    let arr;

    // MakeIntoJson
    arr = `
    "root@gmail.com",""
    "dsctan@pacnetsg.com","az1620024810932l2sij"
    maikuan11@gmail.com;az1619155289035WkJJy
    safwan@vigtech.net:az1686639458025Jbx6K
    test@admin.com, az1686639458025Jbx6K
    matthew@gmail.com: az1655168095015rLjjT
    txen2000@gmail.com; az1686639458025Jbx6K
`;

    // JSONHelper
    arr = "\"{\\\"test\\\":\\\"123\\\"}\"";

    try {
        arr = JsonHelper(arr);
        console.log(arr);
    } catch (err) {
        console.error(err)
    }
}

main();