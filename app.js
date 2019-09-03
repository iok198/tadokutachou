const express = require("express")
const http = require("http")
const logger = require("morgan")
const path = require("path")
const bodyParser = require("body-parser")
const hbs = require("express-handlebars")

const app = express()
const server = http.createServer(app)

const mecab = require("./tools/mecab")
const subtitles = require("./api/subtitles")

mecab.tokenizeSentence("どれも面白くなかったから").then(console.log)

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(express.static("static"))

app.engine("hbs", hbs({defaultLayout: "layout", extname: ".hbs"}))
app.set('views', path.join(__dirname, "views"))
app.set('view engine', 'hbs')

app.get("/*", (req, res) => res.render("index"))
app.use("/api", subtitles)

app.use((req, res, next) => {
    var err = new Error("Not Found")
    err.status = 404
    next(err)
})

if (app.get("env") === "development") {
    app.use((err, req, res, next) => {
        res.status(err.status || 500)
        res.render("error", {
            message: err.message,
            error: err
        })
    })
}

app.use((err, req, res, next) => {
    res.status(err.status || 500)
    res.render("error", {
      message: err.message,
      error: {}
    })
})

server.listen(3000, () => {
    console.log(`Server listening on port 3000`)
})