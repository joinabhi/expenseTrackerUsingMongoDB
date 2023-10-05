const Razorpay = require("razorpay");
const Order = require('../model/order');
const jwt=require("jsonwebtoken");
// const Expense=require('../model/expense');
// const User=require('../model/user');
require('dotenv').config()

exports.purchasePremium = async (req, res) => {
  try {
    const rzp = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET
    });

    const options = {
      amount: 50000, // amount in the smallest currency unit
      currency: "INR",
    };

    const order = await new Promise((resolve, reject) => {
      rzp.orders.create(options, (err, order) => {
        if (err) {
          reject(err);
        } else {
          resolve(order);
        }
      });
    });
    await Order.create({ orderid: order._id, status: "PENDING", id:req.user.userId})
   return res.status(201).json({ order, key_id: rzp.key_id, payment_id: rzp});
  } catch (err) {
    console.log(err);
    res.status(403).json({ message: "Something went wrong", error: err.message });
  }
};


// exports.updateTransactionStatus = async (req, res) => {
//   try {
//     const {payment_id, order_id} = req.body;
   
//     // console.log('41---------------------bhai', existingUser)
//     const order = await Order.find({ orderid: order_id });
//     const promise1 = order.update({ paymentid: payment_id, status: 'SUCCESSFUL' });
//     const promise2 = req.user.update({ ispremiumuser: true });

//     Promise.all([promise1, promise2]).then(() => {
    
//       const token = jwt.sign(
//         {userId:req.user._id, ispremiumuser:true },
//         process.env.SECRET_KEY
//       );
//       console.log('New Token:', token);
//       return res.status(202).json({ success: true, message: "Transaction Successful", token: token });
//     }).catch(err => console.log(err));
//   } catch (err) {
//     console.log(err);
//     res.status(403).json({ error: err, message: "Something went wrong" });
//   }
// };



exports.updateTransactionStatus = async (req, res) => {
  try {
    const { payment_id, order_id } = req.body;

    // Find the order by order_id
    const order = await Order.findOne({ orderid: order_id });

    // Update the order and user documents
    if (order) {
      order.paymentid = payment_id;
      order.status = 'SUCCESSFUL';
      await order.save();

      // Assuming you have a user associated with the request (req.user)
      req.user.ispremiumuser = true;
      await req.user.save();

      // Generate a new JWT token
      const token = jwt.sign(
        { userId: req.user._id, ispremiumuser: true },
        process.env.SECRET_KEY
      );

      console.log('New Token:', token);
      return res.status(202).json({
        success: true,
        message: 'Transaction Successful',
        token: token,
      });
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (err) {
    console.log(err);
    res.status(403).json({ error: err, message: 'Something went wrong' });
  }
};
