const express = require("express")
const http = require("http")
const logger = require("morgan")
const path = require("path")
const bodyParser = require("body-parser")

const app = express()
const server = http.createServer(app)

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.get("/", (req, res) => res.send("<h1>Hello World!</h1>"))

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