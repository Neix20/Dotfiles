const vscode = require('vscode');

const { clsUtility } = require("./utils");
const { MakeIntoArr, MakeIntoJson, JoinIntoOneString, ParseWhitespace, JsonHelper, GetJsonKeyValue } = clsUtility;
const { FormatSqlCsv, ParseSqlStoreProcedureIntoDict, FormatTasks } = clsUtility;
const { ConvertJsonToSql, EpochIsoConverter, YamlJsonFormatter, CsvJsonFormatter, GenerateDocStr } = clsUtility;

// #region VsCode Utils
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

function GetNextRegion() {
    const editor = vscode.window.activeTextEditor;

    if (!editor) {
        // Return an error message if necessary.
        return " Editor is not opening.";
    }

    let selectionArr = []

    editor.edit(editBuilder => {
        editor.selections.forEach(selection => {

            const text = editor.document.getText(selection);
            const position = selection.active;
            // vscode.window.showInformationMessage(text);

            const [a, a1, b, b1] = findRegion(editor, position);

            const res = new vscode.Selection(a, a1, b, b1)
            selectionArr.push(res);
        });
    });

    editor.selections = selectionArr;
}

function findRegion(editor, position) {
    const document = editor.document;

    let lineIndex = position.line;

    const start = lineIndex + 1;
    const startLen = 0;

    while (lineIndex < document.lineCount) {
        const line = document.lineAt(lineIndex);

        // Check if the line contains '#region'
        if (line.text.includes('#endregion')) {
            const end = lineIndex - 1;
            const endLen = document.lineAt(end).text.length;
            return [start, startLen, end, endLen];
        }

        lineIndex++;
    }

    return [];
}
// #endregion

const onFormatSqlCsv = () => Wrapper(FormatSqlCsv);
const onJoinIntoOneString = () => Wrapper(JoinIntoOneString);
const onParseWhitespace = () => Wrapper(ParseWhitespace);
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
    // Unique to Neix Use Case
    "Format SQL": {
        no: 1,
        func: onFormatSqlCsv
    },
    "Parse Store Procedure": {
        no: 2,
        func: onParseSqlStoreProcedureIntoDict
    },
    "Format TaskList": {
        no: 3,
        func: onFormatTasks
    },
    // Global For All
    "Join Into One String": {
        no: 4,
        func: onJoinIntoOneString
    },
    "Make Into Array": {
        no: 5,
        func: onMakeIntoArr
    },
    "Make Into Json": {
        no: 6,
        func: onMakeIntoJson
    },
    "Handle Json Object": {
        no: 7,
        func: OnJsonHelper
    },
    "Get Json Key And Values": {
        no: 8,
        func: onGetJsonKeyValue
    },
    "Convert JSON to SQL": {
        no: 9,
        func: onConvertJsonToSql
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
    // Curl Json Converter
    "Generate Documentation": {
        no: 13,
        func: OnGenerateDocStr
    },
    "Select In Region": {
        no: 14,
        func: GetNextRegion
    },
};