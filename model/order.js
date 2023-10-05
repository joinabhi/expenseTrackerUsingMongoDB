const mongoose=require('mongoose')

const Schema=mongoose.Schema;

const orderSchema=new Schema({
  paymentid:{
  type:String
},
orderid:{
  type:String
},
status:{
  type:String
},
placedBy: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'User'
}
});

module.exports=mongoose.model('Order', orderSchema)