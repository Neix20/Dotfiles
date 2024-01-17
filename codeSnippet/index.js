const vscode = require('vscode');

const { clsUtility, clsLogger, clsWriter, clsConst } = require("./utils");
const { MakeIntoArr, MakeIntoJson, ConvertArrToDictWithIndex, getJsonKeyValue, formatSqlCsv, formatSqlSelectStmt, KvpToJson, JoinIntoOneString, parseSqlStoreProcedureIntoDict, FormatTasks, ConvertSqlToInsert } = clsUtility;

function Wrapper(onFormat = () => { }) {

    const editor = vscode.window.activeTextEditor;

    if (!editor) {
        // Return an error message if necessary.
        return " Editor is not opening.";
    }

    const selection = editor.selection;
    const text = editor.document.getText(selection);

    if (text.length > 0) {
        const res = onFormat(text);

        editor.edit(editBuilder => {
            editBuilder.replace(selection, res);
        });
    } else {
        return " Selection Cannot be Empty!"
    }
}

const onFormatsqlcsv = () => Wrapper(formatSqlCsv);
const onMakeintoarr = () => Wrapper(MakeIntoArr);
const onJoinintoonestring = () => Wrapper(JoinIntoOneString);
const onKvptojson = () => Wrapper(KvpToJson);
const onConvertarrtodictwithindex = () => Wrapper(ConvertArrToDictWithIndex);
const onGetjsonkeyvalue = () => Wrapper(getJsonKeyValue);
const onMakeintojson = () => Wrapper(MakeIntoJson);
const onFormatsqlselectstmt = () => Wrapper(formatSqlSelectStmt);
const onParsesqlstoreprocedureintodict = () => Wrapper(parseSqlStoreProcedureIntoDict);
const onConvertsqltoinsert = () => Wrapper(ConvertSqlToInsert);
const onFormattasks = () => Wrapper(FormatTasks);

module.exports.macroCommands = {
    // SQL Manipulation Special (Custom SQL)
    "Format SQL": {
        no: 1,
        func: onFormatsqlcsv
    },
    // Text Manipulation (No Format)
    "Make Into Array": {
        no: 2,
        func: onMakeintoarr
    },
    "Join Into One String": {
        no: 3,
        func: onJoinintoonestring
    },
    // Array Manipulation (Array of Json)
    "Convert List of KvP to JSON": {
        no: 4,
        func: onKvptojson
    },
    // (Array of Json)
    "Indexfy Array": {
        no: 5,
        func: onConvertarrtodictwithindex
    },
    // Json Manipulation (Json Format)
    "Get Json Key Or Values": {
        no: 6,
        func: onGetjsonkeyvalue
    },
    "Make Into Json": {
        no: 7,
        func: onMakeintojson
    },
    // SQL Manipulation (Custom SQL)
    "Format SQL Select Statement": {
        no: 8,
        func: onFormatsqlselectstmt
    },
    // Custom SQL
    "Parse Store Procedure": {
        no: 9,
        func: onParsesqlstoreprocedureintodict
    },
    // Custom SQL
    "Convert JSON to Insert SQL": {
        no: 10,
        func: onConvertsqltoinsert
    },
    // Format Markdown (Custom Format)
    "Format TaskList": {
        no: 11,
        func: onFormattasks
    },
};