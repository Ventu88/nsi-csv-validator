const csv = require("csv");
const fs = require("fs");

function csvToJson(csvFile) {
    return new Promise((resolve, reject) => {
        const input = fs.readFileSync(csvFile, "UTF-8");

        csv.parse(
            input,
            {
                delimiter: ";",
                relax_column_count: true,
                skip_lines_with_error: false
            },
            (err, records) => {
                if (err) return reject(err);
                return resolve(records);
            }
        );
    });
}

module.exports.csvToJson = csvToJson;