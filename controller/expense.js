const Expense=require('../model/expense');
const User=require('../model/user')



const mongoose=require('mongoose')
const UserService=require('../service/userservice')
const S3Service=require('../service/s3service')

// exports.addExpense=async(req, res, next)=>{
//     console.log('444444444444444444$$$$$$$$$$$$$$$___________---------->', req.user.id)
//     const {description, category, amount}=req.body;
//     const data=await Expense.create({
//         description:description,
//         category:category,
//         amount:amount,
//         userId:req.user._id
//     })
//     res.status(201).json({expenseDetails:data})
// }

exports.addExpense=async(req, res, next)=>{
    let session=null;
    try{
        session=await mongoose.startSession();
        session.startTransaction()//start a mongoose transaction;

        const description=req.body.description;
        const category=req.body.category;
        const amount=req.body.amount;

        const expense=new Expense({
            description:description,
            category:category,
            amount:amount,
            userId:req.user._id
        });
        await expense.save({session});
        const totalExpense=req.user.totalExpense+amount;
        await User.findByIdAndUpdate(req.user._id, {totalExpense:totalExpense}, {session});
        await session.commitTransaction();
        res.status(201).json({expenseDetails:expense})
    }catch(error){
    if(session!==null){
        session.abortTransaction();
        session.endSession()
    }
    console.error(error)
    res.status(500).json({message:'something went wrong'})
    }
}

exports.getExpense=async(req, res, next)=>{
    try{
        const expenses=await Expense.find({userId:req.user._id})
        res.status(200).json({allExpenses:expenses})
    }catch(error){
        console.log(error)
        res.status(500).json({message:"somethings went wrong"})
    }
}

exports.deleteExpense = async (req, res, next) => {
    const expenseId = req.params._id;
    console.log('26___________----------->>>>>>>>', expenseId)

    try {
        // Check if the provided _id is a valid ObjectId
        if (!mongoose.isValidObjectId(expenseId)) {
            return res.status(400).json({ message: 'Invalid expense ID' });
        }

        // Find and delete the expense by _id and userId
        const deletedExpense = await Expense.findByIdAndRemove({ _id: expenseId, userId: req.user._id });

        if (!deletedExpense) {
            return res.status(404).json({ message: 'Expense not found' });
        }
       res.status(200).json({ message: 'Expense deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

exports.userExpenseDownload=async(req, res, next)=>{
    try{
        const expenses=await UserService.getExpenses(req);
        console.log("65++++++++++++++++++++++++++++",expenses);
        const stringifiedExpenses=JSON.stringify(expenses)
        console.log("67__________________",stringifiedExpenses)
        const userId=req.user._id
        const filename=`Expense${userId}/${new Date()}.txt`;
       

        const fileUrl=await S3Service.uploadToS3(stringifiedExpenses, filename);
        console.log('70--------', fileUrl)
        res.status(200).json({fileUrl, success:true})
    }catch(err){
        console.log(err)
        res.status(500).json({fileUrl:'Abhi bhi nhi aaya kya', success:false})
    }

}




  
