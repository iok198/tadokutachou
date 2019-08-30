const mecab = require("node-wakame")

function tokenizeSentence(sentence) {
    return new Promise((resolve, reject) => {
        let process = mecab.parse(sentence);
        let result = []

        process.on("record",  (record) => {
            result.push({
                original: record[0],
                partOfSpeech: record[1],
                partOfSpeechDescriptors: [record[2], record[3], record[4]],
                conjugation: record[5],
                inflection: record[6],
                dictionaryForm: record[7],
                reading: record[8],
                prounciation: record[9]
            })
        })

        process.on("error",  (error) => {
            reject(error)
        })

        process.on("end", function (count) {
            result.pop()
            resolve(result)
        });
    })
}

async function parseSentence(sentence) {
    let mecabResults = await tokenizeSentence(sentence)

    return mecabResults.reduce((results, mecabResult) => {
        let joinPrevious = () => {
            results.sentence[results.sentence.length - 1] += mecabResult.original
        }

        /* -------- Edge cases -------- */ 
        if(mecabResult.partOfSpeech === "助詞") {
            
            if(mecabResult.partOfSpeechDescriptors[0] === "接続助詞") {
                joinPrevious()
                results.components.push(mecabResult)
                return results
            } else {
                results.sentence.push(mecabResult.original)   
                results.components.push(mecabResult)
        
                return results
            }
        }

        if(mecabResult.conjugation === "特殊・タ") {
            joinPrevious()
            results.components.push(mecabResult)
            return results
        } else {
            results.sentence.push(mecabResult.original)   
            results.components.push(mecabResult)
    
            return results
        }

        /* -------------------------- */

        results.sentence.push(mecabResult.original)   
        results.components.push(mecabResult)

        return results
    }, { components: [], sentence: [] })
}

module.exports = {
    tokenizeSentence,
    parseSentence
}