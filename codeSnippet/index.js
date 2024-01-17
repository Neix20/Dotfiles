const vscode = require('vscode');

const { clsUtility } = require("./utils");
const { MakeIntoArr, MakeIntoJson, ConvertArrToDictWithIndex, GetJsonKeyValue, FormatSqlCsv, KvpToJson, JoinIntoOneString, ParseSqlStoreProcedureIntoDict, FormatTasks, ConvertSqlToInsert } = clsUtility;

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
const onMakeIntoArr = () => Wrapper(MakeIntoArr);
const onMakeIntoJson = () => Wrapper(MakeIntoJson);
const onJoinIntoOneString = () => Wrapper(JoinIntoOneString);
const onKvpToJson = () => Wrapper(KvpToJson);
const onConvertArrToDictWithIndex = () => Wrapper(ConvertArrToDictWithIndex);
const onGetJsonKeyValue = () => Wrapper(GetJsonKeyValue);
const onParseSqlStoreProcedureIntoDict = () => Wrapper(ParseSqlStoreProcedureIntoDict);
const onConvertSqlToInsert = () => Wrapper(ConvertSqlToInsert);
const onFormatTasks = () => Wrapper(FormatTasks);

module.exports.macroCommands = {
    "Format SQL": {
        no: 1,
        func: onFormatSqlCsv
    },
    "Make Into Array": {
        no: 2,
        func: onMakeIntoArr
    },
    "Make Into Json": {
        no: 3,
        func: onMakeIntoJson
    },
    "Join Into One String": {
        no: 4,
        func: onJoinIntoOneString
    },
    "Convert List of KvP to JSON": {
        no: 5,
        func: onKvpToJson
    },
    "Indexfy Array": {
        no: 6,
        func: onConvertArrToDictWithIndex
    },
    "Get Json Key Or Values": {
        no: 7,
        func: onGetJsonKeyValue
    },
    "Parse Store Procedure": {
        no: 8,
        func: onParseSqlStoreProcedureIntoDict
    },
    "Convert JSON to Insert SQL": {
        no: 9,
        func: onConvertSqlToInsert
    },
    "Format TaskList": {
        no: 10,
        func: onFormatTasks
    },
};