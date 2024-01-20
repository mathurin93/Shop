const express = require("express");
const router = express.Router();

// Import controllers, validators
const { getOrder, postOrder, getAllOrders, getOneOrder, deleteOneOrder, getEditOrder, postEditOrder } = require("../controllers/orderController");
// const {getAllOrders, getOneOrder, deleteOneOrder, EditOrder, postEditOrder, getEditOrder} = require("../controllers/allorderController");
// const {getOrder, postOrder} = require("../controllers/orderController");
const { getLogin, postLogin, getLogout } = require("../controllers/loginController");
const { orderValidators, loginValidators } = require("../middleware/validators");


// Build Routes
router
    .get("/login", getLogin)
    .post("/login", loginValidators, postLogin)
    .get("/logout", getLogout)
    .get("/", getOrder)
    .post("/", orderValidators, postOrder)
    .get("/orders", getAllOrders)
    .get("/order/:id", getOneOrder)
    .get("/delete/:id", deleteOneOrder)
    .get("/edit/:id", getEditOrder)
    .post("/edit/:id", orderValidators, postEditOrder)
    ;

// Export router
module.exports = router;
