const express = require("express")
const path = require("path")
const { getSubs } = require("../tools/subtitles")
const { parseSentence } = require("../tools/mecab")
const { Content } = require("../schema")

const router = express.Router()

router.get("/:url", (req, res, next) => {
    let url = req.params.url
    Content.findOne({url}).then(value => {
        if (value) {
            res.json(value.subtitles)
        } else {
            return getSubs(url)
                .then(lines => Promise.all(lines.map(line => parseSentence(line.text).then(parsedLine => {
                    return {
                        parsedData: [...parsedLine],
                        ...line
                    }
                })))).then(async results => {
                    const content = await Content.create({ url, subtitles: results })
                    return results
                }).then(results => {
                    res.json(results)
                })
        }
    }).catch(console.error)
})

module.exports = router
