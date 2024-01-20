const { check, oneOf, body, validationResult } = require("express-validator");
const { Login } = require("../models/loginModel");

const orderValidators = [
    check("fullname").not().isEmpty().withMessage("Please enter your full name"),
    check("email").isEmail().withMessage("Please enter a valid email address"),
    check("phone").matches(/^(\()?\d{3}(\))?(-|\s)?\d{3}(-|\s)\d{4}$/).withMessage("Please enter a valid contact number"),
    check("address").not().isEmpty().withMessage("Please enter your street name and number"),
    check("city").not().isEmpty().withMessage("Please enter your city"),
    check("province").not().isEmpty().withMessage("Please enter a province"),
    check("productOne").optional({ checkFalsy: true }).isNumeric().withMessage("Please enter a number for Product 1"),
    check("productTwo").optional({ checkFalsy: true }).isNumeric().withMessage("Please enter a number for Product 2"),
    check("productThree").optional({ checkFalsy: true }).isNumeric().withMessage("Please enter a number for Product 1"),

    oneOf([
        body("productOne").not().isEmpty(),
        body("productTwo").not().isEmpty(),
        body("productThree").not().isEmpty()
    ], {message: "At least one product must be purchased"}),
    //body().custom(CalculatePretotal).withMessage("Please make a purcahse greater than $10.")
    (req, res, next) => {
        const errors = validationResult(req);
    if (!errors.isEmpty()){
      return res.render("pages/order", { errors: errors.array()});
    }
        const productOnePrice = 8;
        const productTwoPrice = 5;
        const productThreePrice = 11;

        const productOneQuantity = parseInt(req.body.productOne || 0);
        const productTwoQuantity = parseInt(req.body.productTwo || 0);
        const productThreeQuantity = parseInt(req.body.productThree || 0);

        const pretotal = (productOnePrice * productOneQuantity) + (productTwoQuantity * productTwoPrice) + 
        (productThreeQuantity * productThreePrice);

        if(pretotal < 10) {
            const errors = [{ msg: "Please make a purcahse greater than $10."}];
            return res.render("pages/order", { errors});
         }
         next();
        } 
];

const loginValidators = [
    check("username").not().isEmpty().withMessage("Please enter your username"),
    check("password").not().isEmpty().withMessage("Please enter your password"),
    body("username").custom(async (username, { req }) => {
        const user = await Login.findOne({ username: username, password: req.body.password }).exec();

        if(!user) {
            throw new Error(`Invalid credentials`);
        }
    })
];

module.exports = {
    orderValidators,
    loginValidators
};
