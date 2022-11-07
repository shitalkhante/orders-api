const mongo = require("mongoose");

const productSchema = mongo.Schema({
    product_id:{type:String,required:true},
    product_type:String,
    product_name:String,
    product_price:Number,
    availability_quantity:Number
})

module.exports = mongo.model("product",productSchema);
