const vscode = require('vscode');

const { clsUtility } = require("./utils");
const {FormatSqlCsv, MakeIntoArr, MakeIntoJson, JoinIntoOneString, JsonHelper, GetJsonKeyValue, ParseSqlStoreProcedureIntoDict, ConvertJsonToSql, FormatTasks,} = clsUtility;

function Wrapper(onFormat = () => { }) {

    const editor = vscode.window.activeTextEditor;

    if (!editor) {
        // Return an error message if necessary.
        return " Editor is not opening.";
    }

    editor.edit(editBuilder => {
        editor.selections.forEach(selection => {

            const text = editor.document.getText(selection);
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
    // [ ] Modify This to Cater for List of JSON
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
        no: 10,
        func: onFormatTasks
    },
};