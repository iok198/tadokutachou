const express = require("express")
const path = require("path")
const { getSubs } = require("../tools/subtitles")
const { parseSentence } = require("../tools/mecab")

const router = express.Router()

router.get("/subtitles", (req, res, next) => {
    res.render("index", {loadedData: false});
})

router.post("/subtitles", (req, res, next) => {
    let url = req.body.url
    getSubs(url)
        .then(lines => Promise.all(lines.map(line => parseSentence(line.text).then(parsedLine => {
            return {
                parsedData: [...parsedLine],
                ...line
            }
        })))).then(results => {
            res.json(results)
        }).catch(console.error)
})

module.exports = router
