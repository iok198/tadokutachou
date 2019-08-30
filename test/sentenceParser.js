const { expect, assert } = require("chai")
const { parseSentence } = require("../tools/mecab")

const testCases = require("./exampleCases.json")

describe("Sentence parser", () => {
    it("Retuns the right data types", async () => {
        let exampleParse = await parseSentence(testCases[0].sentence)

        assert.isNotEmpty(exampleParse.sentence)
        assert.typeOf(exampleParse.sentence, "array")

        assert.isNotEmpty(exampleParse.components)
        assert.typeOf(exampleParse.components, "array")

    })

    it("Parses the data correctly", async () => {
        for(let i = 0; i < testCases.length; i++) {
            let parsedSentence = await parseSentence(testCases[i].sentence)
            
            for(let j = 0; j < parsedSentence.sentence.length; j++) {
                assert.equal(parsedSentence.sentence[j], testCases[i].parsed[j], "Compares the generated thing with the test cases")
            }
        }
    })
})