const mongoose=require('mongoose')
const Schema=mongoose.Schema;

const expenseSchema=new Schema({
    description:{
        type:String,
        required:true
    },
    category:{
        type:String,
        required:true
    },
    amount:{
        type:Number,
        required:true
    },
    userId:{
        type:Schema.Types.ObjectId,
        ref:'User',
        required:true
    }
})

module.exports=mongoose.model('Expense', expenseSchema)