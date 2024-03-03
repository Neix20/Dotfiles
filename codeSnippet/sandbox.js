const { compute_v1 } = require("googleapis");
const { clsUtility, clsLogger, clsWriter, clsConst } = require("./utils");
const { FormatSqlCsv, MakeIntoArr, MakeIntoJson, JoinIntoOneString, JsonHelper, GetJsonKeyValue, ParseSqlStoreProcedureIntoDict, ConvertJsonToSql, FormatTasks, } = clsUtility;
// const { ConvertEpochToIso, ConvertIsoToEpoch } = clsUtility;
const { EpochIsoConverter } = clsUtility;
const { YamlJsonFormatter, CsvJsonFormatter } = clsUtility;

function main() {
    let arr;
    let rgx;

    // GetJsonKeyValue

    // arr = "2024-08-18T14:56:45+08:00";
    // arr = EpochIsoConverter(arr)
    // console.log(arr);
    
    // arr = "\"2024-08-18T14:56:45+08:00\"";
    // arr = EpochIsoConverter(arr)
    // console.log(arr);

    // arr = "1723964205";
    // arr = EpochIsoConverter(arr)
    // console.log(arr);

    // arr = "\"1723964205\"";
    // arr = EpochIsoConverter(arr)
    // console.log(arr);

    arr = "\"{\n    \"Token\": \"VGT219742\",\n    \"DeviceLs\": [    \n        {\n            \"Title\": \"Default Temperature & Humditity Device\",\n            \"Type\": \"Temp Humd\",\n            \"DeviceImg\": \"https://images.tuyaus.com/smart/icon/bay1595482780734o3bJ/8db638ed23689b0041da7b6130f78c0c.png\"\n        }\n    ]\n}\"";
    arr = JsonHelper(arr);
    console.log(arr);

    // arr = CsvJsonFormatter(arr)
    // console.log(arr);

    // arr = YamlJsonFormatter(arr);
    // console.log(arr);
}

main();