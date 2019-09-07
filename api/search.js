const express = require("express")
const { Dictionary } = require("../tools/dictionary")

const router = express.Router() 
const dict = new Dictionary()

router.get("/:word", (req, res) => {
    const word = req.params.word
    res.json(dict.search(word))
})

module.exports = router