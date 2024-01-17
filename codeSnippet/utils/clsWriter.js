const fs = require("fs");

const clsLogger = require("./clsLogger");

class Writer {
    read(filePath) {
        try {
            const data = fs.readFileSync(filePath, 'utf-8');
            const res = JSON.parse(data);

            clsLogger.info(res);
            clsLogger.info(`Successfully read Data from ${filePath}!`);

            return res;
        } catch (err) {
            clsLogger.error(`Error! Unable to write Data to ${filePath}! Exception: ${err}`);
            return null;
        }
    }
    write(content, filePath) {
        try {
            const res = JSON.stringify(content, null, 4);
            fs.writeFileSync(filePath, res, 'utf-8');

            clsLogger.info(content);
            clsLogger.info(`Successfully write Data to ${filePath}!`);
        } catch (err) {
            clsLogger.error(`Error! Unable to write Data to ${filePath}! Exception: ${ex}`);
        }
    }
}

module.exports = new Writer();