const { expect, assert } = require("chai")
const { parseSentence } = require("../tools/mecab")

const testCases = require("./exampleCases.json")

describe("Sentence parser", () => {
    it("Retuns the right data types", async () => {
        let exampleParse = await parseSentence(testCases[0].sentence)

        assert.typeOf(exampleParse, "array")
		assert.isNotEmpty(exampleParse)
    })

    it("Parses the data correctly", async () => {
        for (const testCase of testCases) {
            const parsedSentence = await parseSentence(testCase.sentence)
			for (const [index, x] of parsedSentence.entries()) {
            	assert.equal(x.original, testCase.parsed[index], "Compares the generated thing with the test cases")
			}
        }
    })
})
