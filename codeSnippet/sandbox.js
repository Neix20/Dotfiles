function apply(text) {

    let arr = text.split("\n");

    // Remove Whitespace
    let rgx = /^\s*$/;
    arr = arr.filter(x => !rgx.test(x));

    const res = [];

    // Add Stop Condition
    arr.push("#");

    let obj = {};
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

    return res;
}

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
    arr = apply(arr);
    console.log(arr);
}

main();