const fs = require("fs");

async function validate(jsonToValidate, ruleFilePath) {
    try {
        const rules = await getRules(ruleFilePath);
        return await checkJsonAgainstRules(jsonToValidate.content, rules);
    }
    catch (err) {
        throw new Error(`${jsonToValidate.name} - ${err.message}`);
    }
}

async function getRules(ruleFilePath) {
    try {
        return JSON.parse(fs.readFileSync(ruleFilePath, "UTF-8"));
    }
    catch {
        throw new Error("Impossibile trovare il file delle regole per la validazione del csv");
    }
}

async function checkJsonAgainstRules(jsonToCheck, jsonRules) {
    try {
        const header = jsonToCheck[0];
        await checkHeader(header, jsonRules);
        const checked = await checkBody(jsonToCheck.slice(1), jsonRules);
        return {ok: [header].concat(checked.ok), nok:  [header].concat(checked.nok)};
    }
    catch (err) {
        throw err;
    }
}

function checkHeader(headers, rules) {
    return new Promise((resolve, reject) => {
        // controllo la linghezza
        if (headers.length !== rules.length) return reject(new Error(`Attesi ${rules.length} headers, trovati ${headers.length}`));
        //controllo il valore dei campi
        for(let i = 0; i < headers.length; i++) {
            // cerco l'indice della regola con lo stesso nome
            let ruleIndex = rules.findIndex(x => x["nome"].toUpperCase() === headers[i].toUpperCase());
            // se lo trovo, aggiungo l'indeice' al file di regole per controllare meglio i contenuti
            if (ruleIndex < 0) return reject(new Error(`Header ${headers[i]} non trovato`));
            rules[ruleIndex]["index"] = i;
        }
        // cerco regole senza indice
        const badRuleIndex = rules.findIndex(x => x["index"] === undefined);
        if (badRuleIndex > 0) return reject(new Error(`Header ${rules[badRuleIndex]["nome"]} non trovato`));

        // se arrivo qua ho un json di regole ben formato per il check dei campi
        resolve();
    });
}

async function checkBody(body, rules) {
    try {
        let result = {ok: [], nok: []};
        await body.forEach((record) => {
            let ok = checkRecord(record, rules);
            ok ? result.ok.push(record) : result.nok.push(record);
        });
        return result;
    }
    catch (err) {
        throw err;
    }
}

function checkRecord(record, rules) {
    let valid = true;
    for (let i = 0; i< rules.length; i++) {
        // controllo la lunghezza
        if (record.length !== rules.length) {
            // aggiungo un campo per l'errore
            record.push(`Attesi ${rules.length} campi, trovati ${record.length}`);
            valid = false;
            break;
        }
        // controllo la regola del campo
        let fieldIndex = rules[i].index;
        if (!RegExp(rules[i]["regola"]).test(record[fieldIndex])) {
            // aggiungo un campo per l'errore
            record.push(`Il campo ${rules[i]["nome"]} non ha passato la validazione.`);
            valid = false;
            return false;
        }
    }
    return valid;
}

module.exports.validate = validate;
