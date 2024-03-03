const vscode = require('vscode');

const { clsUtility } = require("./utils");
const { FormatSqlCsv, MakeIntoArr, MakeIntoJson, JoinIntoOneString, JsonHelper, GetJsonKeyValue, ParseSqlStoreProcedureIntoDict, ConvertJsonToSql, FormatTasks } = clsUtility;
const { EpochIsoConverter } = clsUtility;
const { YamlJsonFormatter, CsvJsonFormatter } = clsUtility;

/**
 * 
 * @param {number} num 
 * @param {string} str 
 * @param {Array} ls 
 * @param {Dictionary} dict 
 * @returns {number}
 */
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

function WrapperSnippet(onFormat = () => { }) {

    const editor = vscode.window.activeTextEditor;

    if (!editor) {
        // Return an error message if necessary.
        return " Editor is not opening.";
    }

    const selection = editor.selection;

    const text = editor.document.getText(selection);
    const position = selection.active;

    const snippetText = new vscode.SnippetString('console.log(${1:"Hello, world!"});');

    editor.insertSnippet(snippetText, position);

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
// const onConvertEpochToIso = () => Wrapper(ConvertEpochToIso);
// const onConvertIsoToEpoch = () => Wrapper(ConvertIsoToEpoch);
const onEpochIsoConverter = () => Wrapper(EpochIsoConverter);
const onConvertJsonToCsv = () => Wrapper(CsvJsonFormatter);
const onConvertJsonToYaml = () => Wrapper(YamlJsonFormatter);

const TestSnippet = () => WrapperSnippet();

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
    "Epoch Iso Converter": {
        no: 110,
        func: onEpochIsoConverter
    },
    "CSV Json Converter": {
        no: 111,
        func: onConvertJsonToCsv
    },
    "YAML Json Converter": {
        no: 112,
        func: onConvertJsonToYaml
    },
    "TestSnippet": {
        no: 1,
        func: TestSnippet
    }
};