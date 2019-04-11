const csv = require("csv");
const fs = require("fs");
const stripBom = require('strip-bom');

const promisify = require("util").promisify;
const readFile = promisify(fs.readFile);
const csvParse = promisify(csv.parse);

async function csvToJson(csvFile) {
    try {
        const input = await readFile(csvFile, "utf8");
        return await csvParse(
            stripBom(input),
            {
                delimiter: ";",
                relax_column_count: true,
                skip_lines_with_error: false
            }
        );
    }
    catch(err) {throw new Error(err.message)}
}

module.exports.csvToJson = csvToJson;