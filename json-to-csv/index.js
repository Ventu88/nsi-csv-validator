const fs = require("fs");

function jsonToCsv(json, csvFilePath) {
    return new Promise((resolve, reject) => {
        try{
            fs.exists(csvFilePath, function(exists) {
                if(exists) fs.unlinkSync(csvFilePath);

                for(let i = 0; i < json.length; i++) {
                    for(let j = 0; j < json[i].length; j++) {
                        fs.appendFileSync(csvFilePath, json[i][j], "utf8");
                        if (j < json[i].length - 1) fs.appendFileSync(csvFilePath, ";", "utf8");
                    }
                    if (i < json.length - 1) fs.appendFileSync(csvFilePath, "\n", "utf8");
                }

                resolve(csvFilePath)
            });
        }
        catch(err) {
            reject(err);
        }
    });
}

module.exports.jsonToCsv = jsonToCsv;