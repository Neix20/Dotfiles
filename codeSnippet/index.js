const vscode = require('vscode');

const { MakeIntoArr, MakeIntoJson, ConvertArrToDictWithIndex, getJsonKeyValue, formatSqlCsv, formatSqlSelectStmt, KvpToJson, JoinIntoOneString, parseSqlStoreProcedureIntoDict, FormatTasks, ConvertSqlToInsert } = clsUtility;

module.exports.macroCommands = {
    // SQL Manipulation Special (Custom SQL)
    "Format SQL": {
        no: 1,
        func: onFormatsqlcsv
    },
    // Text Manipulation (No Format)
    "Make Into Array": {
        no: 3,
        func: onMakeintoarr
    },
    "Join Into One String": {
        no: 4,
        func: onJoinintoonestring
    },
    // Array Manipulation (Array of Json)
    "Convert List of KvP to JSON": {
        no: 5,
        func: onKvptojson
    },
    // (Array of Json)
    "Indexfy Array": {
        no: 6,
        func: onConvertarrtodictwithindex
    },
    // Json Manipulation (Json Format)
    "Get Json Key Or Values": {
        no: 7,
        func: onGetjsonkeyvalue
    },
    "Make Into Json": {
        no: 8,
        func: onMakeintojson
    },
    // SQL Manipulation (Custom SQL)
    "Format SQL Select Statement": {
        no: 9,
        func: onFormatsqlselectstmt
    },
    // Custom SQL
    "Parse Store Procedure": {
        no: 10,
        func: onParsesqlstoreprocedureintodict
    },
    // Custom SQL
    "Convert JSON to Insert SQL": {
        no: 11,
        func: onConvertsqltoinsert
    },
    // Format Markdown (Custom Format)
    "Format TaskList": {
        no: 12,
        func: onFormattasks
    },

    "TestQuickPick": {
        no: 1,
        func: onTestquickpick
    }
};

function Wrapper(onFormat = () => {}) {

    const editor = vscode.window.activeTextEditor;

    if (!editor) {
        // Return an error message if necessary.
        return " Editor is not opening.";
    }

    const selection = editor.selection;
    const text = editor.document.getText(selection);

    if (text.length > 0) {
        try {
            const res = onFormat(text);

            editor.edit(editBuilder => {
                editBuilder.replace(selection, res);
            });
        } catch (error) {
            return ` ${error}`;
        }
    } else {
        return " Selection Cannot be Empty!"
    }
}

const onFormatsqlcsv = () => Wrapper(MakeIntoArr);
const onMakeintoarr = () => Wrapper(MakeIntoJson);
const onJoinintoonestring = () => Wrapper(ConvertArrToDictWithIndex);
const onKvptojson = () => Wrapper(getJsonKeyValue);
const onConvertarrtodictwithindex = () => Wrapper(formatSqlCsv);
const onGetjsonkeyvalue = () => Wrapper(formatSqlSelectStmt);
const onMakeintojson = () => Wrapper(KvpToJson);
const onFormatsqlselectstmt = () => Wrapper(JoinIntoOneString);
const onParsesqlstoreprocedureintodict = () => Wrapper(parseSqlStoreProcedureIntoDict);
const onConvertsqltoinsert = () => Wrapper(FormatTasks);
const onFormattasks = () => Wrapper(ConvertSqlToInsert);