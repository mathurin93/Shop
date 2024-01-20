const { validationResult } = require("express-validator");
const { Order } = require("../models/orderModel");

// const { calculateTax } = require("../services/calculation");

const getOrder = (req, res) => {
    res.render("pages/order");
};

const postOrder = async (req, res) => {
    let errors = validationResult(req);

    if(!errors.isEmpty()) {
        res.render("pages/order", { errors: errors.array() });
    } else {
        let fullname = req.body.fullname;
        let email = req.body.email;
        let phone = req.body.phone;
        let address = req.body.address;
        let city = req.body.city;
        let postalCode = req.body.postalCode;
        let province = req.body.province;

    //Sample product definitions

    const productOnePrice = 8;
    const productTwoPrice = 5;
    const productThreePrice = 11;

    const productOneQuantity = parseInt(req.body.productOne || 0);
    const productTwoQuantity = parseInt(req.body.productTwo || 0);
    const productThreeQuantity = parseInt(req.body.productThree || 0);
    const productOneTotal = productOnePrice * productOneQuantity;
    const productTwoTotal= productTwoPrice * productTwoQuantity;
    const productThreeTotal = productThreePrice * productThreeQuantity;


    const pretotal = (productOnePrice * productOneQuantity) + (productTwoQuantity * productTwoPrice) + 
    (productThreeQuantity * productThreePrice);

     let shippingCharge = 0;
     let selectedShipping = parseInt(req.body.delivery);

    switch(selectedShipping)
  {
    case 1:
      shippingCharge = 10;
      break;
    case 2:
      shippingCharge = 8;
      break;
    case 3:
      shippingCharge = 6;
      break;
    case 4:
      shippingCharge = 4;
      break;
     case 5: 
      shippingCharge = 2;
      break;
      case 6:
        shippingCharge = 0;
        break;
    default:
        shippingCharge = 0;
      break;

  }
    let subtotal = calculateSubtotal(pretotal, shippingCharge);
    let taxRate = getTaxRate(province); 
    let taxAmount = calculateTax(subtotal, taxRate);
    let total = subtotal + taxAmount;


        let newOrder = new Order({
            fullname: fullname,
            email: email,
            phone : phone,
            address,
            city : city,
            postalCode : postalCode,
            province : province,
            productOneTotal : productOneTotal,
            productTwoTotal : productTwoTotal,
            productThreeTotal : productThreeTotal,
            productOnePrice : productOnePrice,
            productOneQuantity : productOneQuantity,
            productTwoPrice: productTwoPrice,
            productTwoQuantity: productTwoQuantity, 
            productThreePrice: productThreePrice,
            productThreeQuantity : productThreeQuantity,
            shippingCharge : shippingCharge,
            subtotal : subtotal,
            taxAmount : (taxAmount).toFixed(2),
            total : (total).toFixed(2),
            taxRate: (taxRate * 100).toFixed(2),
        });

        newOrder.save()
            .then(() => { console.log(`Saved!`) })
            .catch((error) => { console.log(error.message) });

        res.render("pages/receipts", { 
            fullname: fullname, 
            email: email,
            phone : phone,
            address : address,
            city : city,
            postalCode : postalCode,
            province : province,
            productOneTotal : productOneTotal,
            productTwoTotal : productTwoTotal,
            productThreeTotal : productThreeTotal,
            productOnePrice : productOnePrice,
            productOneQuantity : productOneQuantity,
            productTwoPrice: productTwoPrice,
            productTwoQuantity: productTwoQuantity, 
            productThreePrice: productThreePrice,
            productThreeQuantity : productThreeQuantity,
            shippingCharge : shippingCharge,
            subtotal : subtotal,
            taxAmount : taxAmount,
            total : total,
            taxRate: (taxRate * 100).toFixed(2), 
        });
    }
};

function calculateSubtotal(pretotal, shippingCharge) {
    const subtotal = 
          pretotal + shippingCharge;
    return subtotal;
  }
  
  function getTaxRate(province) {
    const taxRates = {
      AB: 0.05, 
      BC: 0.07, 
      MB: 0.08, 
      NB: 0.15, 
      NL: 0.15, 
      NS: 0.15,
      NT: 0.05, 
      NU: 0.05, 
      ON: 0.13, 
      PE: 0.15, 
      QC: 0.14975, 
      SK: 0.06, 
      YT: 0.05, 
    };
  
    return taxRates[province] || 0;
  }
  
  function calculateTax(subtotal, taxRate) {
    return subtotal * taxRate;
  } 

const getAllOrders = async (req, res) => {
    if(req.session.userLoggedIn) {
        let orders = await Order.find({}).exec();
        res.render("pages/allorders", { orders: orders });
    } else {
        res.redirect("/login");
    }
}

const getOneOrder = async (req, res) => {
    let order = await Order.findById(req.params.id).exec();

    res.render("pages/vieworder", { order: order });
}

const deleteOneOrder = async (req, res) => {
    await Order.findByIdAndDelete(req.params.id).exec();

    res.redirect("/orders");
}

const getEditOrder = async (req, res) => {
    let order = await Order.findById(req.params.id).exec();

    res.render("pages/editorder", { order: order });
}

const postEditOrder = async (req, res) => {
    let errors = validationResult(req);

    if(!errors.isEmpty()) {
        let order = await Order.findById(req.params.id).exec();

        res.render("pages/editorder", { order: order, errors: errors.array() });
    } else {
        let fullname = req.body.fullname;
        let email = req.body.email;

        let tax = calculateTax(120, 0.13); 

        await Order.findByIdAndUpdate(req.params.id, { fullname: fullname, email: email });

        res.redirect("/orders");
    }
}

module.exports = {
    getOrder,
    postOrder,
    getAllOrders,
    getOneOrder,
    deleteOneOrder,
    getEditOrder,
    postEditOrder
};
