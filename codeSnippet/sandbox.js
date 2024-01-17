const { clsUtility, clsLogger, clsWriter, clsConst } = require("./utils");
const { MakeIntoArr, MakeIntoJson, ConvertArrToDictWithIndex, GetJsonKeyValue, FormatSqlCsv, KvpToJson, JoinIntoOneString, ParseSqlStoreProcedureIntoDict, FormatTasks, ConvertSqlToInsert } = clsUtility;

function main() {
    let arr = `[
        {
            "User_Id": 2,
            "MobileNo": "0179438831",
            "Username": "tedt",
            "Password": "root",
            "Email": "root@gmail.com",
            "Address": "280 Sieb Key",
            "Login_Fail_Count": 0,
            "Login_Lock": 0,
            "Force_Change_Password": 0,
            "Merchant_Id": 1,
            "Manager_Id": -1,
            "IsManager": 1,
            "User_Role_Id": 0,
            "Tuya_Id": "",
            "MetaData": "",
            "Status": 1,
            "Remark": "",
            "Created_By": "System",
            "Created_Date": "2023-08-08T14:16:14.000Z",
            "Last_Updated_By": "System",
            "Last_Updated_Date": "2023-08-08T14:16:14.000Z",
            "MGroupId": null,
            "PendingJoin": 0,
            "TuyaEmail": "root@gmail.com",
            "ProfileWorkspace": 0
        }
    ]`;
    try {
        arr = ConvertSqlToInsert(arr);
        console.log(arr);
    } catch (err) {
        console.error(err)
    }
}

main();

const TxtCommands = {
    "Format SQL": {
        no: 1,
        func: FormatSqlCsv
    },
    "Make Into Array": {
        no: 2,
        func: MakeIntoArr
    },
    "Make Into Json": {
        no: 7,
        func: MakeIntoJson
    },
    "Join Into One String": {
        no: 3,
        func: JoinIntoOneString
    },
    "Convert List of KvP to JSON": {
        no: 4,
        func: KvpToJson
    },
    "Indexfy Array": {
        no: 5,
        func: ConvertArrToDictWithIndex
    },
    "Get Json Key Or Values": {
        no: 6,
        func: GetJsonKeyValue
    },
    "Parse Store Procedure": {
        no: 9,
        func: ParseSqlStoreProcedureIntoDict
    },
    "Convert JSON to Insert SQL": {
        no: 10,
        func: ConvertSqlToInsert
    },
    "Format TaskList": {
        no: 11,
        func: FormatTasks
    },
};

function TestQuickPick() {

    const editor = vscode.window.activeTextEditor;

    if (!editor) {
        // Return an error message if necessary.
        return " Editor is not opening.";
    }

    const selection = editor.selection;
    const original = editor.document.getText(selection);

    const deleteAllTxt = () => {
        const document = editor.document;

        const start = document.lineAt(0).range.start;
        const end = document.lineAt(document.lineCount - 1).range.end;
        const range = new vscode.Range(start, end);

        editor.edit((editBuilder) => {
            editBuilder.delete(range);
          });
    }

    const quickPick = vscode.window.createQuickPick();

    const commandDict = TxtCommands;

    let qpItems = Object.keys(commandDict).map(key => {
        return {
            ...commandDict[key],
            label: key,
        };
    });
    qpItems = qpItems.sort((objA, objB) => objA.no - objB.no);
    quickPick.items = qpItems;

    quickPick.onDidChangeActive(items => {
        // Handle the event when the active items change (hovering over items)

        if (items.length > 0) {
            const { func = () => { } } = items[0];

            // Clear All Selection
            deleteAllTxt();

            const res = func(original);

            editor.edit(editBuilder => {
                editBuilder.replace(selection, res);
            });

            vscode.window.showInformationMessage(original)
        }
    });

    quickPick.onDidAccept(() => {
        // Handle the event when an item is selected
        const items = quickPick.selectedItems;

        if (items.length > 0) {
            const res = func(original);

            editor.edit(editBuilder => {
                editBuilder.replace(selection, res);
            });
        }

        quickPick.hide();
    });

    quickPick.show();
}

module.exports.macroCommands = {
    "TestQuickPick": {
        no: 1,
        func: TestQuickPick
    }
};