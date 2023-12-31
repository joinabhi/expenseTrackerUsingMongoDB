const User=require('../model/user');
const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken");
require('dotenv').config()

const signUp=async(req, res)=>{
  //Existing user check
  const {name, email, password}=req.body;
  try{
    const existingUser=await User.findOne({email});
    if(existingUser){
      return res.status(400).json({message:"user already exists"});
    }
    //hashedPassword
    const hashedPassword=await bcrypt.hash(password, 10)
    //user Creation
    const result=await User.create({
          name:name,
          email:email,
          password:hashedPassword,
      })
    //generate token
    const token=jwt.sign({email:email, userId:result}, process.env.SECRET_KEY)
    return res.status(201).json({user:result, message:"Registration Successful", token:token})
   
  }catch(error){
    console.log(error);
    res.status(500).json({message:"something went wrong"})
  }
}

const signIn = async (req, res) => {
  const { email, password } = req.body;
  try {
    const existingUser = await User.findOne({email});
    console.log("41", existingUser)
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }
    const matchPassword = await bcrypt.compare(password, existingUser.password);
    if (!matchPassword) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const { email: useremail, id: userId, ispremiumuser } = existingUser;
    const token = jwt.sign(
      { email: useremail, userId: userId, ispremiumuser },
      process.env.SECRET_KEY
    );
    console.log("Token:", token);
    res
      .status(201)
      .json({ user: existingUser, message: "User logged in successfully", token:token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

module.exports={signUp, signIn}