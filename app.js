const path=require('path')
const express=require('express')
const cors=require('cors')

const app=express();
const dotenv=require('dotenv')
dotenv.config()


const bodyParser=require('body-parser')
const mongoose=require('mongoose')
const userRoute=require('./route/user')
const expenseRoute=require('./route/expense')
const userExpenseRoute=require('./route/expense')
const premiumFeatureRoute=require('./route/premium')
const purchaseRoute=require('./route/purchase')

app.use(cors())
app.use(bodyParser.json())

app.use('/user', userRoute);
app.use('/expense', expenseRoute);
app.use('/userexpense', userExpenseRoute)
app.use('/premium', premiumFeatureRoute)
app.use('/purchase', purchaseRoute)

mongoose.connect('mongodb+srv://abhishekgpt123:abhishekgpt123@cluster0.znmblvx.mongodb.net/expense?retryWrites=true&w=majority')
.then(result=>{
    app.listen(4646)
    console.log('Your app.js has started on port no.- 4646')
}).catch(err=>{
    console.log(err)
});