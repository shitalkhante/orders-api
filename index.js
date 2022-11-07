const express = require("express");
const app = express();
const product = require("./models/product");
const customer = require("./models/customer");
const orders = require("./models/order");
const mongo = require("mongoose");
const bodyparser = require("body-parser");
const cors = require("cors");

mongo.connect("mongodb://localhost:27017/orders", () => console.log("db connected"));
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));
app.use(cors());

app.post("/product", async (req, res) => {
    const obj = req.body;
    await product.create(obj).then((data) => {
        res.status(200).json({
            messege: "Successfull",
            record: data
        })
    }).catch(err => {
        res.status(404).json({
            err
        })
    })
})

app.post("/customer", async (req, res) => {
    const obj = req.body;
    await customer.create(obj).then((data) => {
        res.status(200).json({
            messege: "Successfull",
            record: data
        })
    }).catch(err => {
        res.status(404).json({
            err
        })
    })
})

app.post("/order", async (req, res, next) => {
    try {
        const obj = req.body;
        var bal, qty, price;
        await product.findOne({ product_id: obj.product_id }).then(data => {
            qty = data.availability_quantity - obj.quantity
            if (qty < 0) {
                res.status(300).json({
                    messege: "Out of Stock"
                })

                // next()
            }
            price = data.product_price;

        }).catch(err => {
            res.json({ err1: err });

        })
        if (qty >= 0) {
            // console.log(price);
            await customer.findOne({ customer_id: obj.customer_id }).then(data => {
                bal = data.balance - (price * obj.quantity);
                // console.log(data);
                if (bal < 0) {
                    res.status(300).json({
                        messege: "Insufficient Funds"
                    })
                }
            }).catch(err => {
                res.json({ err2: err })
            })
            // return
        }
        if (qty>=0 && bal>=0) {
            await product.updateOne({ product_id: obj.product_id }, { availability_quantity: qty });
            await customer.updateOne({ customer_id: obj.customer_id }, { balance: bal });
            await orders.create(obj).then(async (data1) => {
                res.status(200).json({
                    messege: "Successfull",
                    record: data1
                })
            }).catch(err => {
                res.status(400).json({ err3: err });
            })
            // return
        }
    }catch (err) {
        res.json({msg:err})
    }
})

app.get("/orders/orderID", async (req, res) => {
    const id = req.headers.id;

    await orders.find({ _id: id }).then(data => {
        res.status(200).json({
            messege: "Successfull",
            data: data
        })
    }).catch(err => {
        res.status(404).json(err);
    })
})

app.get("/product/productID", async (req, res) => {
    const id = req.headers.product_id;
    await product.find({ product_id: id }).then(data => {
        res.status(200).json({
            messege: "Successfull",
            data: data
        })
    }).catch(err => {
        res.status(404).json(err);
    })
})

app.get("/customer/customerID", async (req, res) => {
    const id = req.headers.customer_id;
    await customer.find({ customer_id: id }).then(data => {
        res.status(200).json({
            messege: "Successfull",
            data: data
        })
    }).catch(err => {
        res.status(404).json(err);
    })
})

app.get("/product/productType", async (req, res) => {
    const product = req.headers.product_type;
    await orders.find({ product_type: product }).then(data => {
        res.status(200).json({
            messege: "Successfull",
            data: data
        })
    }).catch(err => {
        res.status(404).json(err);
    })
})

app.put("/productName/availableQuantity", async (req, res) => {
    try{var qty = req.body.available_quantity;
    var id = req.body.product_id;
    await product.findOneAndUpdate({ product_id: id }, { availability_quantity: qty })
        .then(data => {
            if(data==null){
                res.status(200).json({
                    messege: "Failed, ID not found"
                })
            }else{
            res.status(200).json({
                messege: "Successfull",
                data: data
            })
        }
        })
        .catch(err => {
            res.status(404).json(err);
        })}catch(err){
            res.json({err:err})
        }
})

app.put("/email/costOfAnOrder", async (req, res) => {
    var email = req.body.email;
    var bal = req.body.balance;
    await customer.findOneAndUpdate({ email: email }, { balance: bal })
        .then(data => {
            if(data==null){
                res.status(200).json({
                    messege: "Failed, email not found"
                })
            }else{
            res.status(200).json({
                messege: "Successfull",
                data: data
            })
        }
        })
        .catch(err => {
            res.status(404).json(err);
        })
})

app.listen(3000, (() => console.log("server is listening on port 3000")))