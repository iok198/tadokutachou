const express = require("express")
const http = require("http")
const logger = require("morgan")
const path = require("path")
const bodyParser = require("body-parser")
const hbs = require("express-handlebars")

const app = express()
const server = http.createServer(app)

let subtitles = require("./api/subtitles")

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.engine("hbs", hbs({defaultLayout: "layout", extname: ".hbs"}))
app.set('views', path.join(__dirname, "front"))
app.set('view engine', 'hbs')

app.get("/", (req, res) => res.send("<h1>Hello World!</h1>"))
app.use("/api", subtitles)

app.get("/test", (req, res, next) => {
    res.sendFile(path.join(__dirname + "../index.hbs"));
})

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