const ytdl = require("youtube-dl")
const textTools = require("./text")
const fs = require("fs")
const path = require("path")

function getSubs(url) {
    let options = {
        auto: false,
        all: false,
        format: "srt",
        lang: "ja",
        cwd: path.join(__dirname, "..", "temp")
    }

    return new Promise((resolve, reject) => {
        ytdl.getSubs(url, options, (err, files) => {
            if (err) { reject(err) }

            fs.readFile(path.join(__dirname, "..", "temp", files[0]), 'utf8', (error, data) => {
                if (error) { reject(error) }
                let lines = textTools.parseSRT(data)

                resolve(lines)
            })
        })
    })
}

module.exports = {
    getSubs
}