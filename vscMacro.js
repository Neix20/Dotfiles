const vscode = require('vscode');

module.exports.macroCommands = {
    // SQL Manipulation Special
    "Format SQL": {
        no: 1,
        func: formatSqlCsv
    },
    // Text Manipulation
    "Make Into Array": {
        no: 2,
        func: MakeIntoArr
    },
    "Join Into One String": {
        no: 4,
        func: JoinIntoOneString
    },
    "Make Into Json": {
        no: 3,
        func: MakeIntoJson
    },
    // Array Manipulation
    "Convert List of KvP to JSON": {
        no: 5,
        func: KvpToJson
    },
    "Indexfy Array": {
        no: 6,
        func: ConvertArrToDictWithIndex
    },
    // Json Manipulation
    "Get Json Key Or Values": {
        no: 7,
        func: getJsonKeyValue
    },
    "Sort Json Object By Key": {
        no: 8,
        func: SortJsonByKey
    },
    // SQL Manipulation
    "Format SQL Select Statement": {
        no: 9,
        func: formatSqlSelectStmt
    },
    "Convert SQL Select Statment to Update Statement": {
        no: 10,
        func: ConvertSqlSelectToUpdate
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
        let obj = text;

        let ind = 0;
        while (typeof obj === "string") {
            if (ind >= 5) {
                obj = { "response": "Error! Too many Objects!" };
                break;
            }
            obj = JSON.parse(obj);
            ind += 1;
        }

        const { flag = true } = obj;

        if ("flag" in obj) {
            delete obj["flag"];
        }

        const res = {};

        // 2. Sort JSON Object By Keys
        let keys = Object.keys(obj);

        if (flag) {
            keys = keys.sort();
        }

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

function getJsonKeyValue() {

    const editor = vscode.window.activeTextEditor;

    if (!editor) {
        // Return an error message if necessary.
        return " Editor is not opening.";
    }

    const selection = editor.selection;
    const text = editor.document.getText(selection);

    if (text.length > 0) {

        const obj = JSON.parse(text);

        let res = [];

        const { type = "values" } = obj;

        if ("type" in obj) { 
            delete obj["type"]; 
        }

        if (type == "values") {
            res = Object.values(obj);
        } else if (type == "keys") {
            res = Object.keys(obj);
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

function ConvertSqlSelectToUpdate() {

    const editor = vscode.window.activeTextEditor;

    if (!editor) {
        // Return an error message if necessary.
        return " Editor is not opening.";
    }

    const selection = editor.selection;
    const text = editor.document.getText(selection);

    if (text.length > 0) {

        let [selParam, selValue] = JSON.parse(text);

        selParam = selParam.split(/,\s*/);
        selValue = selValue.split(/,\s*/);

        let len = Math.min(selParam.length, selValue.length);

        let res = [];

        for (let ind = 0; ind < len; ind += 1) {
            res.push(`${selParam[ind]} = ${selValue[ind]}`);
        }

        res = res.join(",\n");

        editor.edit(editBuilder => {
            editBuilder.replace(selection, res);
        });
    } else {
        return " Selection Cannot be Empty!"
    }
}

function JoinIntoOneString() {

    const editor = vscode.window.activeTextEditor;

    if (!editor) {
        // Return an error message if necessary.
        return " Editor is not opening.";
    }

    const selection = editor.selection;
    const text = editor.document.getText(selection);

    if (text.length > 0) {

        let res = text.split("\n");

        res = res.map(x => x.trim());

        res = res.join("");

        editor.edit(editBuilder => {
            editBuilder.replace(selection, res);
        });
    } else {
        return " Selection Cannot be Empty!"
    }
}