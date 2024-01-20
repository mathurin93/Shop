const mongoose = require("mongoose");

const loginSchema = new mongoose.Schema({
    "username": { type: String, unique: true },
    "password" : { type: String }
});

const Login = mongoose.model("admins", loginSchema);

module.exports = {
    Login
}
