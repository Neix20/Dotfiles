const { clsUtility, clsLogger, clsWriter, clsConst } = require("./utils");
const {FormatSqlCsv, MakeIntoArr, MakeIntoJson, JoinIntoOneString, JsonHelper, GetJsonKeyValue, ParseSqlStoreProcedureIntoDict, ConvertJsonToSql, FormatTasks,} = clsUtility;

function main() {
    let arr;

    // GetJsonKeyValue
    arr = `
    [
        {
            "Email": "hihekiz@bijisogav.co",
            "Name": "Josie Nichols",
            "Age": "24"
        },
        {
            "Email": "ub@badude.tf",
            "Name": "Hester Pratt",
            "Age": "3"
        },
        {
            "Email": "gowi@voecik.vc",
            "Name": "Calvin Hall",
            "Age": "22"
        },
        {
            "Email": "afduz@dupejom.bt",
            "Name": "Samuel Bowen",
            "Age": "28"
        }
    ]
`;

    try {
        arr = GetJsonKeyValue(arr);
        console.log(arr);
    } catch (err) {
        console.error(err)
    }
}

main();