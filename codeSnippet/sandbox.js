const { compute_v1 } = require("googleapis");
const { clsUtility, clsLogger, clsWriter, clsConst } = require("./utils");
const { FormatSqlCsv, MakeIntoArr, MakeIntoJson, JoinIntoOneString, JsonHelper, GetJsonKeyValue, ParseSqlStoreProcedureIntoDict, ConvertJsonToSql, FormatTasks, } = clsUtility;
// const { ConvertEpochToIso, ConvertIsoToEpoch } = clsUtility;
const { EpochIsoConverter } = clsUtility;
const { YamlJsonFormatter, CsvJsonFormatter } = clsUtility;

function main() {
    let arr = [];
    let rgx = "";

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

    arr = [
        "const format = (num, str, ls, dict) => {",
    ];

    arr = [
        "def format(num, str, ls, dict):",
        "def format(num: int = 0, data: str = \"\", ls: list = [], dt: dict = {}) -> int:"
    ]

    arr = [
        "function format(num, str, ls, dict) {",
        "function format(num: number, str: string, ls: number[], dict: { [key: string]: number }): int {",
        "static int format(int num, String str, List<Integer> ls, Map<String, Integer> dict) {",
        "public static int format(int num, String str, List<Integer> ls, Map<String, Integer> dict) {",
        "int format(int num, string str, vector<int> ls, map<string, int> dict) {",
        "int format(int num, std::string str, std::vector<int> ls, std::map<std::string, int> dict) {",
        "static int format(int num, string str, List<int> ls, Dictionary<string, int> dict) {",
        "function format($num, $str, $ls, $dict) {"
    ];

    /**
     * 
     * @param {number} num 
     * @param {string} str 
     * @param {Array} ls 
     * @param {Dictionary} dict 
     * @returns {number}
     */

    /*
        """Descriptino

        Args:
            num (int, optional): _description_. Defaults to 0.
            data (str, optional): _description_. Defaults to "".
            ls (list, optional): _description_. Defaults to [].
            dt (dict, optional): _description_. Defaults to {}.

        Returns:
            int: _description_
        """
     */

    /*
        Returns the sum of two decimal numbers in binary digits.

        Parameters:
            a (int): A decimal integer
            b (int): Another decimal integer

        Returns:
            binary_sum (str): Binary string of the sum of a and b
     */
    
    // Write Function to Parse

    // If its python Function
}

main();