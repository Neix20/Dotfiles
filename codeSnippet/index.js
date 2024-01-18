const vscode = require('vscode');

const { clsUtility } = require("./utils");
const { FormatSqlCsv, MakeIntoArr, MakeIntoJson, JoinIntoOneString, JsonHelper, GetJsonKeyValue, ConvertArrToDictWithIndex, ParseSqlStoreProcedureIntoDict, ConvertJsonToInsertSql, ConvertJsonToUpdateSql, FormatTasks } = clsUtility;

function Wrapper(onFormat = () => { }) {

    const editor = vscode.window.activeTextEditor;

    if (!editor) {
        // Return an error message if necessary.
        return " Editor is not opening.";
    }

    const selection = editor.selection;
    const text = editor.document.getText(selection);

    if (text.length > 0) {
        // Execute Code Function
        const res = onFormat(text);

        editor.edit(editBuilder => {
            editBuilder.replace(selection, res);
        });
    } else {
        return " Selection Cannot be Empty!";
    }
}

const onFormatSqlCsv = () => Wrapper(FormatSqlCsv);
const onJoinIntoOneString = () => Wrapper(JoinIntoOneString);
const onMakeIntoArr = () => Wrapper(MakeIntoArr);
const onMakeIntoJson = () => Wrapper(MakeIntoJson);
const OnJsonHelper = () => Wrapper(JsonHelper);
const onGetJsonKeyValue = () => Wrapper(GetJsonKeyValue);
const onConvertArrToDictWithIndex = () => Wrapper(ConvertArrToDictWithIndex);
const onParseSqlStoreProcedureIntoDict = () => Wrapper(ParseSqlStoreProcedureIntoDict);
const onConvertJsonToInsertSql = () => Wrapper(ConvertJsonToInsertSql);
const onConvertJsonToUpdateSql = () => Wrapper(ConvertJsonToUpdateSql);
const onFormatTasks = () => Wrapper(FormatTasks);

// Stringify Json

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
    "Get Json Key Or Values": {
        no: 6,
        func: onGetJsonKeyValue
    },
    "Indexfy Array": {
        no: 7,
        func: onConvertArrToDictWithIndex
    },
    "Parse Store Procedure": {
        no: 8,
        func: onParseSqlStoreProcedureIntoDict
    },
    "Convert JSON to Insert SQL": {
        no: 9,
        func: onConvertJsonToInsertSql
    },
    "Convert JSON to Update SQL": {
        no: 10,
        func: onConvertJsonToUpdateSql
    },
    "Format TaskList": {
        no: 11,
        func: onFormatTasks
    },
};