const mongoose = require("mongoose");
require("dotenv").config()

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/notes-api"

function connectDB() {
    try {
        mongoose.connect(MONGO_URI)
        const connection = mongoose.connection

        connection.once("open", () => {
            console.log("MongoDB connection successful")
        })

    } catch (err) {
        console.error("Failed to connect to MongoDB: ", err)
    }
}

module.exports = connectDB