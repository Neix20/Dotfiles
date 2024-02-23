const vscode = require('vscode');

const { clsUtility } = require("./utils");
const { FormatSqlCsv, MakeIntoArr, MakeIntoJson, JoinIntoOneString, JsonHelper, GetJsonKeyValue, ParseSqlStoreProcedureIntoDict, ConvertJsonToSql, FormatTasks } = clsUtility;
const { ConvertEpochToIso, ConvertIsoToEpoch } = clsUtility;
const { YamlJsonFormatter, CsvJsonFormatter } = clsUtility;

function Wrapper(onFormat = () => { }) {

    const editor = vscode.window.activeTextEditor;

    if (!editor) {
        // Return an error message if necessary.
        return " Editor is not opening.";
    }

    editor.edit(editBuilder => {
        editor.selections.forEach(selection => {

            const text = editor.document.getText(selection);
            // vscode.window.showInformationMessage(text);

            const res = onFormat(text);
            editBuilder.replace(selection, res);
        });
    });
}

const onFormatSqlCsv = () => Wrapper(FormatSqlCsv);
const onJoinIntoOneString = () => Wrapper(JoinIntoOneString);
const onMakeIntoArr = () => Wrapper(MakeIntoArr);
const onMakeIntoJson = () => Wrapper(MakeIntoJson);
const OnJsonHelper = () => Wrapper(JsonHelper);
const onGetJsonKeyValue = () => Wrapper(GetJsonKeyValue);
const onParseSqlStoreProcedureIntoDict = () => Wrapper(ParseSqlStoreProcedureIntoDict);
const onConvertJsonToSql = () => Wrapper(ConvertJsonToSql);
const onFormatTasks = () => Wrapper(FormatTasks);
const onConvertEpochToIso = () => Wrapper(ConvertEpochToIso);
const onConvertIsoToEpoch = () => Wrapper(ConvertIsoToEpoch);
const onConvertJsonToCsv = () => Wrapper(CsvJsonFormatter);
const onConvertJsonToYaml = () => Wrapper(YamlJsonFormatter);

module.exports.macroCommands = {
    "Format SQL": {
        no: 1,
        func: onFormatSqlCsv
    },
    "Join Into One String": {
        no: 2,
        func: onJoinIntoOneString
    },
    "Make Into Array": {
        no: 3,
        func: onMakeIntoArr
    },
    "Make Into Json": {
        no: 4,
        func: onMakeIntoJson
    },
    "Handle Json Object": {
        no: 5,
        func: OnJsonHelper
    },
    "Get Json Key And Values": {
        no: 6,
        func: onGetJsonKeyValue
    },
    "Parse Store Procedure": {
        no: 7,
        func: onParseSqlStoreProcedureIntoDict
    },
    "Convert JSON to SQL": {
        no: 8,
        func: onConvertJsonToSql
    },
    "Format TaskList": {
        no: 9,
        func: onFormatTasks
    },
    "Convert DateTime to Seconds": {
        no: 10,
        func: onConvertIsoToEpoch
    },
    "Convert Seconds To DateTime": {
        no: 11,
        func: onConvertEpochToIso
    },

    "onConvertJsonToCsv": {
        no: 12,
        func: onConvertJsonToCsv
    },
    "onConvertJsonToYaml": {
        no: 13,
        func: onConvertJsonToYaml
    }
};