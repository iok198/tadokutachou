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
		let shouldJoinToPrevious = false

        if (mecabResult.partOfSpeechDescriptors.some(d => d === "接続助詞") && ["で", "て"].includes(mecabResult.dictionaryForm)) {
			// て形
			shouldJoinToPrevious = true
        } else if (["特殊・タ", "特殊・ナイ"].includes(mecabResult.conjugation)) {
			// 〜た・〜ない
            shouldJoinToPrevious = true
        }

		let previousResult = results[results.length - 1]
		if (typeof previousResult !== 'undefined' && shouldJoinToPrevious) {
			previousResult.original += mecabResult.original
			previousResult.dictionaryForm += mecabResult.dictionaryForm
			previousResult.reading += mecabResult.reading
			previousResult.prounciation += mecabResult.prounciation
			previousResult.components.push(mecabResult)
		} else {
			results.push({
				original: mecabResult.original,
				dictionaryForm: mecabResult.dictionaryForm,
				reading: mecabResult.reading,
				prounciation: mecabResult.prounciation,
				components: [mecabResult]
			})
		}

        return results
    }, [])
}

module.exports = {
    tokenizeSentence,
    parseSentence
}
