const mongoose = require("mongoose");

// Create a Schema
const orderSchema = new mongoose.Schema({
    fullname: { type: String },
    email: { type: String, lowercase: true },
    phone: {type: String},
    address: {type: String},
    city: {type: String},
    postalCode: {type: String},
    province: {type: String}, 
    productOnePrice: {type: Number},
    productOneQuantity: {type: Number},
    productTwoPrice: {type: Number},
    productTwoQuantity: {type: Number},
    productThreePrice: {type: Number},
    productThreeQuantity: {type: Number},
    productOneTotal: {type: Number}, 
    productTwoTotal: {type: Number},
    productThreeTotal: {type: Number},
    shippingCharge: {type: Number},
    subtotal: {type: Number},
    taxRate: {type: Number},
    taxAmount: {type: Number},
    total: {type: Number}
});

// Create a Model
const Order = mongoose.model("orders", orderSchema);

// Export the Model
module.exports = {
    Order
}
