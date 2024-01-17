const fs = require("fs");

const { LOG_DIR, NORMAL_LOG, ERROR_LOG } = require("./clsConst");
const { genDt } = require("./clsUtility");

// Check If Folder exists
if (!fs.existsSync(LOG_DIR)) {
    fs.mkdirSync(LOG_DIR);
    console.log(`Directory ${LOG_DIR} created!`);
}

class Log {
    info(content) {
        try {
            let dt = genDt();
            content = JSON.stringify(content);
            content = dt + ' ' + content + '\n';

            console.log(content.slice(0, -1));
            fs.writeFileSync(NORMAL_LOG, content, { flag: "a+" });
        } catch (err) {
            console.log(err);
        }
    }

    error(content) {
        try {
            let dt = genDt();
            content = JSON.stringify(content);
            content = dt + ' ' + content + '\n';

            console.log(content.slice(0, -1));
            fs.writeFileSync(ERROR_LOG, content, { flag: "a+" });
        } catch (err) {
            console.error(err);
        }
    }
}

module.exports = new Log();