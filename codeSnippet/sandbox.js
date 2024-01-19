const { clsUtility, clsLogger, clsWriter, clsConst } = require("./utils");
const { FormatSqlCsv, MakeIntoArr, MakeIntoJson, JoinIntoOneString, JsonHelper, GetJsonKeyValue, ParseSqlStoreProcedureIntoDict, ConvertJsonToInsertSql, ConvertJsonToUpdateSql, FormatTasks } = clsUtility;

function main() {
    let arr;

    // MakeIntoJson
    arr = `
    "root@gmail.com",""
    "dsctan@pacnetsg.com","az1620024810932l2sij"
    maikuan11@gmail.com;az1619155289035WkJJy
    safwan@vigtech.net:az1686639458025Jbx6K
    test@admin.com, az1686639458025Jbx6K
    matthew@gmail.com: az1655168095015rLjjT
    txen2000@gmail.com; az1686639458025Jbx6K
`;

    // JSONHelper
    arr = "\"{\\\"test\\\":\\\"123\\\"}\"";

    // MakeIntoJson
    arr = `
    Email; hihekiz@bijisogav.co
    Email; ub@badude.tf
    Email; gowi@voecik.vc
    Email; afduz@dupejom.bt
`;

    arr = `
"User_Id","Email"
2,"root@gmail.com"
37,"dsctan@pacnetsg.com"
41,"maikuan11@gmail.com"
58,"safwan@vigtech.net"
65,"test@admin.com"
71,"matthewting90@gmail.com"
72,"asdf@gmail.com"
75,"matthew.ting90@gmail.com"
77,"ysiowpoo@gmail.com"
79,"matthewting@vigtech.net"
88,"aaa@gmail.com"
89,"bbb@gmail.com"
90,"matthew@gmail.com"
91,"nathannorth2005@gmail.com"
94,"txen2000@gmail.com"
95,"yonilim@gmail.com"
`

    arr = `
Email; hihekiz@bijisogav.co
90,"matthew@gmail.com"
Email; ub@badude.tf
91,"nathannorth2005@gmail.com"
Email; gowi@voecik.vc
94,"txen2000@gmail.com"
Email; afduz@dupejom.bt
95,"yonilim@gmail.com"
`

    try {
        arr = MakeIntoJson(arr);
        console.log(arr);
    } catch (err) {
        console.error(err)
    }
}

main();