const csvReader = require("./csv-to-json");
const csvWriter = require("./json-to-csv");
const validator = require("./validator");

const validateCsv = async function (csvFilePath, ruleFilePath) {
    try {
        const jsonCsv = await csvReader.csvToJson(csvFilePath);
        const jsonToValidate = {
            name: csvFilePath,
            content: jsonCsv
        };

        const result = await validator.validate(jsonToValidate, ruleFilePath);

        const csvFilePath_ok =
            csvFilePath.substring(0, csvFilePath.lastIndexOf(".")) +
            "_ok" + csvFilePath.substring(csvFilePath.lastIndexOf("."));
        const okFile = await csvWriter.jsonToCsv(result.ok, csvFilePath_ok);

        const csvFilePath_nok =
            csvFilePath.substring(0, csvFilePath.lastIndexOf(".")) +
            "_nok" + csvFilePath.substring(csvFilePath.lastIndexOf("."));
        const nokFile = await csvWriter.jsonToCsv(result.nok, csvFilePath_nok);

        return {ok: okFile, nok: nokFile};
    }
    catch (err) {
       throw(err);
    }
};

module.exports.validateCsv = validateCsv;