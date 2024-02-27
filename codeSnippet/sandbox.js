const { clsUtility, clsLogger, clsWriter, clsConst } = require("./utils");
// const { FormatSqlCsv, MakeIntoArr, MakeIntoJson, JoinIntoOneString, JsonHelper, GetJsonKeyValue, ParseSqlStoreProcedureIntoDict, ConvertJsonToSql, FormatTasks, } = clsUtility;
const { ConvertEpochToIso, ConvertIsoToEpoch } = clsUtility;
const { YamlJsonFormatter, CsvJsonFormatter } = clsUtility;

function main() {
    let arr;
    let rgx;

    // GetJsonKeyValue
    arr = `User_Id,MobileNo,Username,Password,Email,Address,Login_Fail_Count,Login_Lock,Force_Change_Password,Merchant_Id,Manager_Id,IsManager,User_Role_Id,Tuya_Id,MetaData,Status,Remark,Created_By,Created_Date,Last_Updated_By,Last_Updated_Date,MGroupId,PendingJoin,TuyaEmail,ProfileWorkspace,TariffType
    2,0179438831,tedt,root,root@gmail.com,280 Sieb Key,0,0,0,1,-1,1,0,,,1,,System,2023-08-08T14:16:14.000Z,System,2023-08-08T14:16:14.000Z,null,0,root@gmail.com,0,1
    37,,,,dsctan@pacnetsg.com,,0,0,0,36,-1,1,0,az1620024810932l2sij,,1,,Justin,2023-10-03T01:05:44.000Z,Justin,2023-10-03T01:05:44.000Z,1,0,dsctan@pacnetsg.com,0,1
    41,,,,maikuan11@gmail.com,,0,0,0,40,-1,1,0,az1619155289035WkJJy,,1,,Justin,2023-10-03T10:44:40.000Z,Justin,2023-10-03T10:44:40.000Z,1,0,maikuan11@gmail.com,0,1
    58,null,null,null,safwan@vigtech.net,null,null,null,null,57,-1,1,null,null,null,1,,Justin,2023-10-16T14:57:13.793Z,Justin,2023-10-16T14:57:13.793Z,1,0,safwan@vigtech.net,0,1
    65,,,,test@admin.com,,0,0,0,64,-1,1,0,az1686639458025Jbx6K,,6,,Justin,2023-10-17T14:16:35.000Z,YatuDashboard,2023-11-20T15:33:09.000Z,2,1,,6,1
    72,null,null,null,asdf@gmail.com,null,null,null,null,68,-1,1,null,null,null,1,,Justin,2023-11-30T02:08:16.390Z,Justin,2023-11-30T02:08:16.390Z,null,null,txen123@gmail.com,0,1
    75,,,,matthew.ting90@gmail.com,,0,0,0,71,-1,1,0,-1,,1,,Justin,2023-11-30T22:41:23.000Z,Justin,2023-11-30T22:41:23.000Z,0,0,matthew90510@gmail.com,0,1
    77,null,null,null,ysiowpoo@gmail.com,null,null,null,null,73,-1,1,null,null,null,1,,Justin,2023-12-01T14:53:42.320Z,Justin,2023-12-01T14:53:42.320Z,null,null,ysiowpoo@gmail.com,0,1
    79,null,null,null,matthewting@vigtech.net,null,null,null,null,75,-1,1,null,null,null,1,,Justin,2023-12-01T16:31:07.437Z,Justin,2023-12-01T16:31:07.437Z,null,null,null,0,1
    88,null,null,null,aaa@gmail.com,null,null,null,null,84,-1,1,null,null,null,1,,Justin,2023-12-05T17:13:13.710Z,Justin,2023-12-05T17:13:13.710Z,null,null,null,0,1
    89,null,null,null,bbb@gmail.com,null,null,null,null,85,-1,1,null,null,null,1,,Justin,2023-12-07T16:08:09.150Z,Justin,2023-12-07T16:08:09.150Z,null,null,null,0,1
    90,0166489466,txe1,,matthew@gmail.com,,0,0,0,86,-1,1,0,az1655168095015rLjjT,,6,,Justin,2023-12-13T16:19:33.000Z,Justin,2023-12-13T16:19:33.000Z,0,0,matthewting90510@gmail.com,0,1
    91,null,null,null,nathannorth2005@gmail.com,null,null,null,null,87,-1,1,null,null,null,1,,Justin,2023-12-14T17:41:22.830Z,Justin,2023-12-14T17:41:22.830Z,null,null,null,0,1
    94,,,,txen2000@admin.com,,0,0,0,90,-1,1,0,az1686639458025Jbx6K,,1,,Justin,2024-01-02T15:55:25.000Z,Justin,2024-01-02T15:55:25.000Z,0,0,,0,1
    95,,,,yonilim@gmail.com,,0,0,0,91,-1,1,0,az1685957616071FoQ3v,,1,,Justin,2024-01-02T17:52:52.000Z,Justin,2024-01-02T17:52:52.000Z,0,0,yonilim@gmail.com,0,1
    98,,,,txen2001@admin.com,,0,0,0,94,-1,1,0,az1686639458025Jbx6K,,2,,Justin,2024-01-26T03:45:41.000Z,Justin,2024-01-26T03:45:41.000Z,0,0,txen2001@admin.com,0,0
    112,,,,nadirahnordin94@gmail.com,,0,0,0,108,-1,1,0,az1706588537137lgCiA,,1,,Justin,2024-01-30T15:17:12.000Z,Justin,2024-01-30T15:17:12.000Z,0,0,nadirahizzety@yahoo.com,0,0
    114,null,null,null,test@test.com,null,null,null,null,110,-1,1,null,null,null,0,,Justin,2024-01-30T18:19:14.310Z,Justin,2024-01-30T18:19:14.310Z,null,null,null,null,null
    115,null,null,null,test1234@gmail.com,null,null,null,null,111,-1,1,null,null,null,0,,Justin,2024-01-30T18:38:35.593Z,Justin,2024-01-30T18:38:35.593Z,null,null,null,null,null
    146,null,null,null,tantingwei007@gmail.com,null,null,null,null,142,-1,1,null,null,null,0,,Justin,2024-02-17T16:02:46.413Z,Justin,2024-02-17T16:02:46.413Z,null,null,tantingwei007@gmail.com,null,null
    151,,,,nurkhirafakhira9704@gmail.com,,0,0,0,147,-1,1,0,az1694422225378MxAc9,,1,,Justin,2024-02-23T10:03:21.000Z,Justin,2024-02-23T10:03:21.000Z,0,0,nurkhirafakhira9704@gmail.com,0,0`;

    arr = CsvJsonFormatter(arr)
    console.log(arr);

    // arr = CsvJsonFormatter(arr)
    // console.log(arr);

    // arr = YamlJsonFormatter(arr);
    // console.log(arr);
}

main();