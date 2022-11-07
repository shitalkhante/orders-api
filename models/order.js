const mongo = require("mongoose");

const orderSchema = mongo.Schema({
    product_id:{type:String,required:true},
    customer_id:{type:String,required:true},
    product_name:String,
    quantity:Number
})

module.exports = mongo.model("orders",orderSchema);
