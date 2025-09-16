const mongoose = require("mongoose")
const Mongo_db = process.env.MONGO_URI

const database = () => {
    mongoose.connect(Mongo_db)
        .then(() => { console.log("mongo db connect successfully") })
        .catch((e) => { console.log(e.message) })
}

module.exports = database

