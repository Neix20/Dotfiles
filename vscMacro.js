const vscode = require('vscode');

module.exports.macroCommands = {
    // SQL Manipulation Special (Custom SQL)
    "Format SQL": {
        no: 1,
        func: formatSqlCsv
    },
    // Text Manipulation (No Format)
    "Make Into Array": {
        no: 3,
        func: MakeIntoArr
    },
    "Join Into One String": {
        no: 4,
        func: JoinIntoOneString
    },
    // Array Manipulation (Array of Json)
    "Convert List of KvP to JSON": {
        no: 5,
        func: KvpToJson
    },
    // (Array of Json)
    "Indexfy Array": {
        no: 6,
        func: ConvertArrToDictWithIndex
    },
    // Json Manipulation (Json Format)
    "Get Json Key Or Values": {
        no: 7,
        func: getJsonKeyValue
    },
    "Make Into Json": {
        no: 8,
        func: MakeIntoJson
    },
    // SQL Manipulation (Custom SQL)
    "Format SQL Select Statement": {
        no: 9,
        func: formatSqlSelectStmt
    },
    // Custom SQL
    "Parse Store Procedure": {
        no: 10,
        func: parseSqlStoreProcedureIntoDict
    },
    // Custom SQL
    "Convert JSON to Insert SQL": {
        no: 11,
        func: ConvertSqlToInsert
    },
    // Format Markdown (Custom Format)
    "Format TaskList": {
        no: 12,
        func: FormatTasks
    },

    "TestQuickPick": {
        no: 1,
        func: TestQuickPick
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

        const { sort = true } = obj;

        if ("sort" in obj) {
            delete obj["sort"];
        }

        const res = {};

        // 2. Sort JSON Object By Keys
        let keys = Object.keys(obj);

        if (sort) {
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

        res = res.join(" ");

        editor.edit(editBuilder => {
            editBuilder.replace(selection, res);
        });
    } else {
        return " Selection Cannot be Empty!"
    }
}

function parseSqlStoreProcedureIntoDict() {

    const editor = vscode.window.activeTextEditor;

    if (!editor) {
        // Return an error message if necessary.
        return " Editor is not opening.";
    }

    const selection = editor.selection;
    const text = editor.document.getText(selection);

    if (text.length > 0) {

        let arr = JSON.parse(text);

        // 1. Filter out empty Objects
        arr = arr.filter(x => x.name !== "" || x.data_type !== "");

        const res = {};

        if (arr.length <= 1) {
            return res;
        }

        // Add Stop Condition
        arr.push({ "name": "", "data_type": "" });

        let cur_ind = 0;
        for (let ind = 1; ind < arr.length; ind += 1) {
            const { data_type } = arr[ind];

            if (data_type === "") {
                const { name } = arr[cur_ind];
                res[name] = arr.slice(cur_ind + 1, ind);
                cur_ind = ind;
            }
        }

        editor.edit(editBuilder => {
            editBuilder.replace(selection, JSON.stringify(res, null, 4));
        });
    } else {
        return " Selection Cannot be Empty!"
    }
}

function FormatTasks() {

    const editor = vscode.window.activeTextEditor;

    if (!editor) {
        // Return an error message if necessary.
        return " Editor is not opening.";
    }

    const selection = editor.selection;
    const text = editor.document.getText(selection);

    if (text.length > 0) {
        let arr = text.split("\n");

        // Remove Whitespace
        const rgx = /^\s*$/;
        arr = arr.filter(x => !rgx.test(x));

        const res = [];

        // Add Stop Condition
        arr.push("#");

        let obj = { title: "" };
        let description = [];

        for (let str of arr) {

            // Remove Whitespace at Front
            str = str.trim();

            if (str.includes("#")) {

                if (description.length > 0) {
                    obj["description"] = description;
                    res.push(obj);

                    // Reset to New Array
                    description = [];
                }

                const title = str.replace(/#+ /g, "");
                obj = { title };
            } else {
                description.push(str);
            }
        }

        editor.edit(editBuilder => {
            editBuilder.replace(selection, JSON.stringify(res, null, 4));
        });
    } else {
        return " Selection Cannot be Empty!"
    }
}

function ConvertSqlToInsert() {

    const editor = vscode.window.activeTextEditor;

    if (!editor) {
        // Return an error message if necessary.
        return " Editor is not opening.";
    }

    const selection = editor.selection;
    const text = editor.document.getText(selection);

    if (text.length > 0) {
        const arr = JSON.parse(text);

        let res = []

        for (const obj of arr) {
            let val = Object.values(obj);

            val = val.map(x => `'${x}'`);

            val = val.join(", ");

            res.push(`INSERT INTO tblName VALUES (${val});`)
        }

        res = res.join("\n")

        editor.edit(editBuilder => {
            editBuilder.replace(selection, res);
        });
    } else {
        return " Selection Cannot be Empty!"
    }
}

function TestQuickPick() {

    const editor = vscode.window.activeTextEditor;

    if (!editor) {
        // Return an error message if necessary.
        return " Editor is not opening.";
    }

    let prevUndo = false;
    let undo = true;

    const selection = editor.selection;
    const original = editor.document.getText(selection);

    const commands = [
        {
            label: 'Join To One String',
            func: JoinIntoOneString
        },
        {
            label: 'Make Into Array',
            func: MakeIntoArr
        },
    ];

    const quickPick = vscode.window.createQuickPick();

    quickPick.items = commands.map((obj, pos) => ({ ...obj, pos }));

    // quickPick.onDidTriggerButton(items => {
    //     if (items.length > 0) {
    //         const { func = () => {}, pos = 0 } = items[0];
    //         func();

    //         undo = true;
    //     }
    // })

    quickPick.onDidChangeActive(items => {
        // Handle the event when the active items change (hovering over items)

        if (items.length > 0) {
            const { func = () => {}, pos = 0 } = items[0];
            func();

            vscode.window.showInformationMessage(JSON.stringify(original));
        }
    });

    quickPick.onDidAccept(() => {
        // Handle the event when an item is selected
        const items = quickPick.selectedItems;

        if (items.length > 0) {
            const { func = () => {} } = items[0];
            func();
        }

        quickPick.hide();
    });

    quickPick.show();
}