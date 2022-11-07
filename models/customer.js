const mongo = require("mongoose");

const customerSchema = mongo.Schema({
    customer_id:{type:String,required:true},
    customer_name:String,
    email:{type:String,required:true},
    balance:Number
})

module.exports = mongo.model("customer",customerSchema);