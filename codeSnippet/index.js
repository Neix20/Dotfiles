const { clsUtility, clsLogger, clsWriter } = require("./utils");
const path = require("path");

function main() {
    let dt = clsUtility.genDt();
    console.log(dt);

    const data = [
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
    ];
    
    const fp = path.join("temp", "temp.json");
    clsWriter.write(data, fp);

    const tData = clsWriter.read(fp);
    console.log(tData);
}

main();