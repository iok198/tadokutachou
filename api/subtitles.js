const express = require("express")
const router = express.Router()
const path = require("path")
const ytdl = require("youtube-dl")

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
        if (err) throw err;
        console.log('subtitle files downloaded:', files);
    })
})

module.exports = router