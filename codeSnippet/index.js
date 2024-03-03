const vscode = require('vscode');

const { clsUtility } = require("./utils");
const { MakeIntoArr, MakeIntoJson, JoinIntoOneString, JsonHelper, GetJsonKeyValue } = clsUtility;
const { FormatSqlCsv, ParseSqlStoreProcedureIntoDict, FormatTasks } = clsUtility;
const { ConvertJsonToSql, EpochIsoConverter, YamlJsonFormatter, CsvJsonFormatter, GenerateDocStr } = clsUtility;

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

    // Generate Snippet
    const res = onFormat(text);

    const snippetText = new vscode.SnippetString(res);
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
const onEpochIsoConverter = () => Wrapper(EpochIsoConverter);
const onConvertJsonToCsv = () => Wrapper(CsvJsonFormatter);
const onConvertJsonToYaml = () => Wrapper(YamlJsonFormatter);

const OnGenerateDocStr = () => Wrapper(GenerateDocStr);

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
        no: 10,
        func: onEpochIsoConverter
    },
    "CSV Json Converter": {
        no: 11,
        func: onConvertJsonToCsv
    },
    "YAML Json Converter": {
        no: 12,
        func: onConvertJsonToYaml
    },
    "Generate Documentation": {
        no: 13,
        func: OnGenerateDocStr
    }
};