const User = require('../model/user');
const Expense = require('../model/expense');

exports.getExpenses = async (req) => {
    try {
        // Assuming req.user is the current user
        const userId = req.user._id;

        // Find expenses associated with the user
        const expenses = await Expense.find({ userId });

        return expenses;
    } catch (err) {
        console.error(err);
        throw err;
    }
}
