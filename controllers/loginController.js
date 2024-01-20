const { validationResult } = require("express-validator");
const { Login } = require("../models/loginModel");

const getLogin = (req, res) => {
    if(!req.session.userLoggedIn) {
        res.render("pages/login");
    } else {
        res.redirect("/orders");
    }
}

const postLogin = async (req, res) => {
    let errors = validationResult(req);

    if(!errors.isEmpty()) {
        res.render("pages/login", { errors: errors.array() });
    } else {
        let username = req.body.username;
        let password = req.body.password;

        let user = await Login.findOne({ username: username, password: password }).exec();

        if(user) {
            req.session.username = username;
            req.session.userLoggedIn = true;

            res.redirect("/orders");
        } else {
            req.session.username = "";
            req.session.userLoggedIn = false;

            res.redirect("/login");
        }
    }

}

const getLogout = (req, res) => {
    req.session.username = "";
    req.session.userLoggedIn = false;

    res.redirect("/login");
}

module.exports = {
    getLogin,
    postLogin,
    getLogout
}
