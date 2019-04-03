const crvReader = require("./csv-to-json");
const csvWriter = require("./json-to-csv");
const validator = require("./validator");

const validateCsv = async function (csvFilePath, ruleFilePath) {
    try {
        const jsonToValidate = await crvReader.csvToJson(csvFilePath);
        const result = await validator.validate(jsonToValidate, ruleFilePath);

        const csvFilePath_ok =
            csvFilePath.substring(0, csvFilePath.lastIndexOf(".")) +
            "_ok" + csvFilePath.substring(csvFilePath.lastIndexOf("."));
        csvWriter.jsonToCsv(result.ok, csvFilePath_ok);

        const csvFilePath_nok =
            csvFilePath.substring(0, csvFilePath.lastIndexOf(".")) +
            "_nok" + csvFilePath.substring(csvFilePath.lastIndexOf("."));
        csvWriter.jsonToCsv(result.nok, csvFilePath_nok);

    }
    catch (err) {
       throw(err);
    }
};

module.exports.validateCsv = validateCsv;