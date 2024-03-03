const { compute_v1 } = require("googleapis");
const { clsUtility, clsLogger, clsWriter, clsConst } = require("./utils");

const { MakeIntoArr, MakeIntoJson, JoinIntoOneString, JsonHelper, GetJsonKeyValue } = clsUtility;
const { FormatSqlCsv, ParseSqlStoreProcedureIntoDict, FormatTasks } = clsUtility;
const { ConvertJsonToSql, EpochIsoConverter, YamlJsonFormatter, CsvJsonFormatter, GenerateDocStr } = clsUtility;

/**
 * @name 
 * @param {number} num 
 * @param {string} str 
 * @param {Array} ls 
 * @param {Dictionary} dict 
 * @returns {number}
 */
function main() {
    
    let arr = [];
    let rgx = "";

    // arr = "2024-08-18T14:56:45+08:00";
    // arr = EpochIsoConverter(arr)
    // console.log(arr);

    arr = [
        "const format = (num, str, ls, dict) => {",
        "def format(num, str, ls, dict):",
        "def format(num: int = 0, data: str = \"\", ls: list = [], dt: dict = {}) -> int:",
        "function format(num, str, ls, dict) {",
        "function format(num: number, str: string, ls: number[], dict: { [key: string]: number }): int {",
        "static int format(int num, String str, List<Integer> ls, Map<String, Integer> dict) {",
        "public static int format(int num, String str, List<Integer> ls, Map<String, Integer> dict) {",
        "int format(int num, string str, vector<int> ls, map<string, int> dict) {",
        "int format(int num, std::string str, std::vector<int> ls, std::map<std::string, int> dict) {",
        "static int format(int num, string str, List<int> ls, Dictionary<string, int> dict) {",
        "function format($num, $str, $ls, $dict) {"
    ];

    arr = [
        "def format(num, str, ls, dict):",
        "def format(num: int = 0, data: str = \"\", ls: list = [], dt: dict = {}) -> int:",
        "function format(num, str, ls, dict)",
        "function format(num: number, str: string, ls: number[], dict: { [key: string]: number }): int {",
        "int format(int num, std::string str, std::vector<int> ls, std::map<std::string, int> dict) {"
    ]

    arr = [
        "\"function format(num, str, ls, dict)\""
    ]

    for (let val of arr) {
        const res = GenerateDocStr(val);
        console.log(res);
    }
}

main();