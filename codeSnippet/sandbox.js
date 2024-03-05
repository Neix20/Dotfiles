const { compute_v1 } = require("googleapis");
const { clsUtility, clsLogger, clsWriter, clsConst } = require("./utils");

const { MakeIntoArr, MakeIntoJson, JoinIntoOneString, ParseWhitespace, JsonHelper, GetJsonKeyValue } = clsUtility;
const { FormatSqlCsv, ParseSqlStoreProcedureIntoDict, FormatTasks } = clsUtility;
const { ConvertJsonToSql, EpochIsoConverter, YamlJsonFormatter, CsvJsonFormatter, GenerateDocStr } = clsUtility;


function main() {
    
    let arr = [];
    let rgx = "";

    // arr = "2024-08-18T14:56:45+08:00";
    // arr = EpochIsoConverter(arr)
    // console.log(arr);

    arr = [
        "[ \"Sierra Leone\n\", \"Ukraine\n\", \"Solomon Islands\n\", \"French Southern Territories\n\", \"U.S. Virgin Islands\n\", \"Brazil\" ]",
        "\"{ \"data\": \"{ \"Name\": \"Brent Luna\" }\" }\"",
        "[ { \"Name\": \"Somalia\", \"Age\": \"22\", \"Data\": \"{ \"Name\": \"Dominican Republic\", \"Age\": \"18\" }\" }, { \"Name\": \"Lithuania\", \"Age\": \"15\", \"Data\": \"{ \"Name\": \"Dominican Republic\", \"Age\": \"18\" }\" }, { \"Name\": \"Northern Mariana Islands\", \"Age\": \"25\", \"Data\": \"{ \"Name\": \"Dominican Republic\", \"Age\": \"18\" }\" }, { \"Name\": \"Solomon Islands\", \"Age\": \"29\", \"Data\": \"{ \"Name\": \"Dominican Republic\", \"Age\": \"18\" }\" }, { \"Name\": \"Togo\", \"Age\": \"20\", \"Data\": \"{ \"Name\": \"Dominican Republic\", \"Age\": \"18\" }\" } ]"
    ];

    arr = [
        ...arr,
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
        { "data": "{ \"data\": \"{ \"Name\": \"Brent Luna\" }\" }" },
        // 9. Convert
        "{ \"data\": \"{ \"data\": \"{ \"Name\": \"Brent Luna\" }\" }\" }",
        // 10.
        { "data": [ { "Name": "Edwin Sutton" }, { "Name": "Addie Little" }, { "Name": "Etta Wise" }, { "Name": "Troy Stevenson" }, { "Name": "Clarence Ballard" } ] },
        // 11. 
        { "data": [ "{ \"Name\": \"Edwin Sutton\" }", "{ \"Name\": \"Addie Little\" }", "{ \"Name\": \"Etta Wise\" }", "{ \"Name\": \"Troy Stevenson\" }", "{ \"Name\": \"Clarence Ballard\" }" ] },
        // 12.
        { "data": "{ \"data\": [ { \"Name\": \"Edwin Sutton\" }, { \"Name\": \"Addie Little\" }, { \"Name\": \"Etta Wise\" }, { \"Name\": \"Troy Stevenson\" }, { \"Name\": \"Clarence Ballard\" } ] }" },
        // 13.
        {"data":"{\"data\":\"{\\\"data\\\":\\\"{\\\\\\\"data\\\\\\\":\\\\\\\"{\\\\\\\\\\\\\\\"data\\\\\\\\\\\\\\\":\\\\\\\\\\\\\\\"{\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"Name\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\":\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"Brent Luna\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"}\\\\\\\\\\\\\\\"}\\\\\\\"}\\\"}\"}"}
    ]

    for (let val of arr) {
        val = ParseWhitespace(val);
        val = JSON.parse(val);
        console.log(val);
        // console.log(typeof val);
    }
}

main();