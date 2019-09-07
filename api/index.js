const express = require("express")
const router = express.Router()

const subtitlesRouter = require("./subtitles")
const searchRouter = require("./search")

router.use("/subtitles", subtitlesRouter)
router.use("/dictionary", searchRouter)

module.exports = router