const path = require("path");

const LOG_DIR = path.join(__dirname, "../logs");

const NORMAL_LOG = path.join(__dirname, "../logs", "info.log");
const ERROR_LOG = path.join(__dirname, "../logs", "error.log");

module.exports = {
    LOG_DIR,
    NORMAL_LOG,
    ERROR_LOG
}