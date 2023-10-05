const jwt=require('jsonwebtoken')
const User=require('../model/user')
require('dotenv').config()

exports.authenticate=(req, res, next)=>{
    try{
        const token=req.header('Authorization')
        const user=jwt.verify(token, process.env.SECRET_KEY)
        User.findById(user.userId).then(user=>{
            req.user=user
            next()
        });
    }catch(error){
        console.log(error)
        return res.status(401).json({success:false})
    }
}