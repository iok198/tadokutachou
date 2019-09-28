const express = require("express")
const http = require("http")
const logger = require("morgan")
const path = require("path")
const bodyParser = require("body-parser")
const hbs = require("express-handlebars")
const mongoose = require("mongoose")

const app = express()
const server = http.createServer(app)
mongoose.connect("mongodb://localhost/tadokutachou", {useNewUrlParser: true})

const db =  mongoose.connection

const dictionary = require("./tools/dictionary")
const api = require("./api/index")

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function() {
  console.log("We connected to the Mongo")
})

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(express.static("static"))

app.engine("hbs", hbs({ defaultLayout: "layout", extname: ".hbs" }))
app.set("views", path.join(__dirname, "views"))
app.set("view engine", "hbs")

app.use("/api", api)
app.get("/*", (req, res) => res.render("index"))

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
});

(async () => {
	await dictionary.setup()

	server.listen(3000, () => {
	    console.log(`Server listening on port 3000`)
	})
})().catch(console.error)
