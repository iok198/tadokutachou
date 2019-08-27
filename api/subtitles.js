const express = require("express")
const fs = require('fs')
const path = require("path")
const textTools = require("../tools/text")
const ytdl = require("youtube-dl")

const router = express.Router()

router.get("/subtitles", (req, res, next) => {
    res.render("index");
})

router.post("/subtitles", (req, res, next) => {
    let url = req.body.url
    let options = {
        auto: false,
        all: false,
        format: "srt",
        lang: "ja",
        cwd: __dirname
    }

    ytdl.getSubs(url, options, (err, files) => {
        if (err) throw err
        console.log('subtitle files downloaded:', files)
        fs.readFile(path.join(__dirname, files[0]), 'utf8', (err, data) => {
            if (err) throw err
            let lines = textTools.parseSRT(data)
			console.log(lines)
        })
    })
})

module.exports = router
