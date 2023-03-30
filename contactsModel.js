const mongoose = require("mongoose")

const contactSchema = new mongoose.Schema({

    firstName: String,
    lastName: String,
    email: String,
    gender: String,
    phone: String,
    street: String
})

const User = mongoose.model("users", contactSchema);

module.exports = User;