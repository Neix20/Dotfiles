const vscode = require('vscode');

module.exports.macroCommands = {
    "Format SQL": {
        no: 1,
        func: formatSqlCsv
    },
    "Sort Json Object By Key": {
        no: 2,
        func: SortJsonByKey
    },
    "Make Into Array": {
        no: 3,
        func: MakeIntoArr
    },
    "Make Into Json": {
        no: 4,
        func: MakeIntoJson
    },
    "Format SQL Select Statement": {
        no: 5,
        func: formatSqlSelectStmt
    },
    "Indexfy Array": {
        no: 6,
        func: ConvertArrToDictWithIndex
    },
    "Get Keys only (JSON)": {
        no: 7,
        func: GetDictKeys
    },
    "Get Values only (JSON)": {
        no: 8,
        func: GetDictValues
    },
    "Stringify JSON, Array": {
        no: 9,
        func: StringifyObj
    },
    "Convert List of KvP to JSON": {
        no: 10,
        func: KvpToJson
    }
};

function MakeIntoArr() {

    const editor = vscode.window.activeTextEditor;

    if (!editor) {
        // Return an error message if necessary.
        return " Editor is not opening.";
    }

    const selection = editor.selection;
    const text = editor.document.getText(selection);

    if (text.length > 0) {
        const res = text.split("\n");

        editor.edit(editBuilder => {
            editBuilder.replace(selection, JSON.stringify(res, null, 4));
        });
    } else {
        return " Selection Cannot be Empty!"
    }
}

function MakeIntoJson() {

    const editor = vscode.window.activeTextEditor;

    if (!editor) {
        // Return an error message if necessary.
        return " Editor is not opening.";
    }

    const selection = editor.selection;
    const text = editor.document.getText(selection);

    if (text.length > 0) {
        const arr = text.split("\n");

        const res = arr.map(x => {
            const [key, val] = x.split(": ");
            return { [key]: val };
        })
            // Join Array of Objects into One
            .reduce((a, b) => ({ ...a, ...b }), {});

        editor.edit(editBuilder => {
            editBuilder.replace(selection, JSON.stringify(res, null, 4));
        });
    } else {
        return " Selection Cannot be Empty!"
    }
}

function SortJsonByKey() {

    const editor = vscode.window.activeTextEditor;

    if (!editor) {
        // Return an error message if necessary.
        return " Editor is not opening.";
    }

    const selection = editor.selection;
    const text = editor.document.getText(selection);

    if (text.length > 0) {
        // 1. Convert Selection to json Object
        const obj = JSON.parse(text);

        // 2. Sort JSON Object By Keys
        const keys = Object.keys(obj).sort();
        const res = {};

        for (let key of keys) {
            res[key] = obj[key];
        }

        editor.edit(editBuilder => {
            editBuilder.replace(selection, JSON.stringify(res, null, 4));
        });
    } else {
        return " Selection Cannot be Empty!"
    }
}

function formatSqlCsv() {

    const editor = vscode.window.activeTextEditor;

    if (!editor) {
        // Return an error message if necessary.
        return " Editor is not opening.";
    }

    const selection = editor.selection;
    const text = editor.document.getText(selection);

    if (text.length > 0) {
        let res = text.split("\n");

        res = res.slice(1);

        // Javascript regex match if string starts with " and ends with white string
        const rgx = /^"\s+$/;
        res = res.filter(x => !rgx.test(x));

        res = res.map(x => x.slice(1));

        res = res.join("\n")

        editor.edit(editBuilder => {
            editBuilder.replace(selection, res);
        });
    } else {
        return " Selection Cannot be Empty!"
    }
}

function formatSqlSelectStmt() {

    const editor = vscode.window.activeTextEditor;

    if (!editor) {
        // Return an error message if necessary.
        return " Editor is not opening.";
    }

    const selection = editor.selection;
    const text = editor.document.getText(selection);

    if (text.length > 0) {
        let res = text.split(/\s{2,}/g);

        res = res.map(x => `[${x}]`);

        res = res.join(",\n");

        editor.edit(editBuilder => {
            editBuilder.replace(selection, res);
        });
    } else {
        return " Selection Cannot be Empty!"
    }
}

function ConvertArrToDictWithIndex() {

    const editor = vscode.window.activeTextEditor;

    if (!editor) {
        // Return an error message if necessary.
        return " Editor is not opening.";
    }

    const selection = editor.selection;
    const text = editor.document.getText(selection);

    if (text.length > 0) {
        const arr = JSON.parse(text);

        const res = {};

        for (let ind = 0; ind < arr.length; ind++) {
            res[ind] = arr[ind];
        }

        editor.edit(editBuilder => {
            editBuilder.replace(selection, JSON.stringify(res, null, 4));
        });

    } else {
        return " Selection Cannot be Empty!"
    }
}

function GetDictKeys() {

    const editor = vscode.window.activeTextEditor;

    if (!editor) {
        // Return an error message if necessary.
        return " Editor is not opening.";
    }

    const selection = editor.selection;
    const text = editor.document.getText(selection);

    if (text.length > 0) {

        const obj = JSON.parse(text);
        const res = Object.keys(obj);

        editor.edit(editBuilder => {
            editBuilder.replace(selection, JSON.stringify(res, null, 4));
        });
    } else {
        return " Selection Cannot be Empty!"
    }
}

function GetDictValues() {

    const editor = vscode.window.activeTextEditor;

    if (!editor) {
        // Return an error message if necessary.
        return " Editor is not opening.";
    }

    const selection = editor.selection;
    const text = editor.document.getText(selection);

    if (text.length > 0) {
        const obj = JSON.parse(text);
        const res = Object.values(obj);

        editor.edit(editBuilder => {
            editBuilder.replace(selection, JSON.stringify(res, null, 4));
        });
    } else {
        return " Selection Cannot be Empty!"
    }
}

function StringifyObj() {

    const editor = vscode.window.activeTextEditor;

    if (!editor) {
        // Return an error message if necessary.
        return " Editor is not opening.";
    }

    const selection = editor.selection;
    const text = editor.document.getText(selection);

    if (text.length > 0) {
        const res = JSON.parse(text);

        editor.edit(editBuilder => {
            editBuilder.replace(selection, JSON.stringify(res));
        });
    } else {
        return " Selection Cannot be Empty!"
    }
}

function KvpToJson() {

    const editor = vscode.window.activeTextEditor;

    if (!editor) {
        // Return an error message if necessary.
        return " Editor is not opening.";
    }

    const selection = editor.selection;
    const text = editor.document.getText(selection);

    if (text.length > 0) {
        const arr = JSON.parse(text);

        const res = {};

        for (let obj of arr) {
            const { Key, Value } = obj;
            res[Key] = Value;
        };

        editor.edit(editBuilder => {
            editBuilder.replace(selection, JSON.stringify(res, null, 4));
        });
    } else {
        return " Selection Cannot be Empty!"
    }
}