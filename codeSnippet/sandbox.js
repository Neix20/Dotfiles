const { clsUtility, clsLogger, clsWriter, clsConst } = require("./utils");
const { MakeIntoArr, MakeIntoJson, ConvertArrToDictWithIndex, getJsonKeyValue, formatSqlCsv, formatSqlSelectStmt, KvpToJson, JoinIntoOneString, parseSqlStoreProcedureIntoDict, FormatTasks, ConvertSqlToInsert } = clsUtility;

function main() {
    let arr = `
    ### Profile Workspace

    Completed SQL ERD & Database
    Complete API Function to Set Profile Workspace
    Ready to launch in App
    
    ### iOS & Google Play In-App Purchases
    
    Completed Restore Purchase Functionality
    Completed Purchase Callback, Able to retrieve Order based on transaction Id (Android)
    Fixed Issue, App now pulls complete product listing with updated price based on nationality
    
    ### Yatu Dashboard
    
    Completed Product Listing for Yatu Products
    Redesign Yatu Activation token, Profile Workspace Flow
    Completed Screens to redeem Yatu Activation token
    
    ### Yatu Data Alert
    
    Update Function to handle live alerts from Smartlife / Tuya App (Update Tuya Room)`;
    arr = FormatTasks(arr);
    console.log(arr);
}

main();

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