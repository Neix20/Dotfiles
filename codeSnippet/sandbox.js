const { clsUtility, clsLogger, clsWriter, clsConst } = require("./utils");
const {FormatSqlCsv, MakeIntoArr, MakeIntoJson, JoinIntoOneString, JsonHelper, GetJsonKeyValue, ParseSqlStoreProcedureIntoDict, ConvertJsonToSql, FormatTasks,} = clsUtility;

function main() {
    let arr;

    // GetJsonKeyValue
    arr = [
        // 1. Normal Json
        { "Name": "Brent Luna" },
        // 2. Json String
        "{ \"Name\": \"Brent Luna\" }",
        // 3. Json Object With Json String
        { "data": "{ \"Name\": \"Brent Luna\" }" },
        // 4. Json String With Json String
        "{ \"data\": \"{ \"Name\": \"Brent Luna\" }\" }",
        // 5. Json Object With Json Array
        { "data": [ "asdf", "asdf" ] },
        // 6. Json With Json String of Array
        { "data": "[ \"asdf\", \"asdf\" ]" },
        // 7. Json String With Json String of Array
        "{ \"data\": \"[ \"asdf\", \"asdf\" ]\" }",
        // 8. Hard One
        {
            "data": "{ \"data\": \"{ \"Name\": \"Brent Luna\" }\" }"
        },
        "{ \"data\": \"{ \"data\": \"{ \"Name\": \"Brent Luna\" }\" }\" }"
    ];

    // for ( const obj of arr) {
    //     try {
    //         const res = JsonHelper(obj);
    //         console.log(`Output: ${res}`);
    //     } catch (err) {
    //         console.error(`Error: ${obj}`)
    //     }
    // }

    arr = "data; \"{ \"data\": [ { \"Name\": \"Edwin Sutton\" }, { \"Name\": \"Addie Little\" }, { \"Name\": \"Etta Wise\" }, { \"Name\": \"Troy Stevenson\" }, { \"Name\": \"Clarence Ballard\" } ] }\""

    try {
        const res = MakeIntoJson(arr);
        console.log(`Output: ${res}`);
    } catch (err) {
        console.error(`Error: ${arr}`)
    }

}

main();