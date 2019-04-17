const fs = require("fs");
const path = require("path");

const promisify = require("util").promisify;
const readFile = promisify(fs.readFile);

async function validate(jsonToValidate, ruleFilePath) {
    let rules;
    try {
        rules = await getRules(ruleFilePath);
        return checkJsonAgainstRules(jsonToValidate.content, rules);
    } catch (err) {
        let fileIndication = "";
        if (rules) fileIndication = `${path.basename(jsonToValidate.name)} - `;
        throw new Error(`${fileIndication}${err.message}`);
    }
}

async function getRules(ruleFilePath) {
    try {
        return JSON.parse(await readFile(ruleFilePath, "UTF-8"));
    } catch {
        throw new Error("Impossibile trovare il file delle regole per la validazione del csv");
    }
}

function checkJsonAgainstRules(jsonToCheck, jsonRules) {
    const header = jsonToCheck[0];
    checkHeader(header, jsonRules);
    const checkedBody = checkBody(jsonToCheck.slice(1), jsonRules);
    return {ok: [header].concat(checkedBody.ok), nok: [header].concat(checkedBody.nok)};
}

function checkHeader(headers, rules) {
    if (headers.length !== rules.length)
        throw new Error(`Attesi ${rules.length} headers, trovati ${headers.length}`);

    for (let i = 0; i < rules.length; i++) {
        let csvFieldIndex = headers.findIndex(header => header.toUpperCase() === rules[i]["nome"].toUpperCase());
        if (csvFieldIndex < 0) throw new Error(`Header ${rules[i]["nome"]} non trovato`);
        rules[i]["csvIndex"] = csvFieldIndex;
    }
}

function checkBody(body, rules) {
    let result = {ok: [], nok: []};
    body.forEach((record) => {
        let validRecord = checkRecord(record, rules);
        validRecord ? result.ok.push(record) : result.nok.push(record);
    });
    return result;
}

function checkRecord(record, rules) {
    for (let i = 0; i < rules.length; i++) {
        if (record.length !== rules.length) {
            record.push(`Attesi ${rules.length} campi, trovati ${record.length}`);
            return false;
        }
        let fieldIndex = rules[i]["csvIndex"];
        if (!RegExp(rules[i]["regola"]).test(record[fieldIndex])) {
            record.push(`Campo ${rules[i]["nome"]} non valido! ${rules[i]["descrizione_regola"]}`);
            return false;
        }
    }
    return true;
}

module.exports.validate = validate;
