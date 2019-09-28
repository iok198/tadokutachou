const mongoose = require("mongoose")

const ContentSchema = new mongoose.Schema({
    url: String,
    subtitles: [{}]
})

const UserSchema = new mongoose.Schema({
    username: String,
    password: String,
    library: [ContentSchema]
})

ContentSchema.static('findOneOrCreate', async function findOneOrCreate(condition, doc) {
    const one = await this.findOne(condition);

    return one || this.create(doc);
})

const Content = mongoose.model("Content", ContentSchema)
const User = mongoose.model("User", UserSchema)

module.exports = {
    Content, User
}