const mongoose=require('mongoose')
const Schema=mongoose.Schema;

const userSchema=new Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    // expenses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Expense' }],
    
    totalExpense: {
        type: Number,
        default: 0
      },
   
    //   ispremiumuser: {
    //     type: String, // Use STRING type instead of BOOLEAN
    //     default: 'false', // Set default value as a string
    //     get() {
    //       const rawValue = this.getDataValue('ispremiumuser');
    //       return rawValue === 'true'; // Convert string to boolean
    //     },
    //     set(value) {
    //       const convertedValue = value ? 'true' : 'false'; // Convert boolean to string
    //       this.setDataValue('ispremiumuser', convertedValue);
    //     }
    //   },
    ispremiumuser:{
        type:Boolean,
        default:false
    }
});

userSchema.methods.getExpenses = async function () {
    try {
      // Populate the 'expenses' field to retrieve the associated expenses
      await this.populate('expenses')
      return this.expenses;
    } catch (error) {
      throw error;
    }
  }

module.exports=mongoose.model('User', userSchema)