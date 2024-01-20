const { validationResult } = require("express-validator");
const {Order} = require("../models/orderModel");

const getAllOrders = async (req, res) => {

    let allOrders = await Order.find({}).exec();

    console.log(allOrders);
    
    res.render("pages/allorders", {orders: allOrders});
}

const getOneOrder = async (req, res) => {
    let myOrder = await Order.findById(req.params.id).exec();
    res.render("pages/vieworder", {customer: myOrder});
}

const deleteOneOrder = async (req, res) => {
    await Order.findByIdAndDelete(req.params.id).exec();

    res.redirect("/orders");
}

const EditOrder = async (req, res) => {
    let myOrder = await Order.findById(req.params.id).exec();
    res.render("pages/editorder", {order: myOrder});

}

const postEditOrder = async (req, res) =>{

    let errors = validationResult(req);

    if(!errors.isEmpty()) {
        let order = await Order.findById(req.params.id).exec();

        res.render("pages/editorder", {order: order, errors: errors.array()});
    } else {
        let fullName = req.body.fullName;
        let email = req.body.email;
        
        await Order.findByIdAndUpdate(req.params.id, {fullName: fullName, email: email});
        res.redirect("/orders");
    }
   
    
    }

module.exports = {
    getAllOrders,
    getOneOrder, 
    deleteOneOrder,
    EditOrder,
    postEditOrder
}