const User = require('../model/user');
const Expense = require('../model/expense');
const mongoose = require('mongoose');

exports.getUserLeaderBoard = async (req, res) => {
    try {
        const getUserLeaderBoard = await User.aggregate([
            {
                $lookup: {
                    from: 'expenses', // The name of the Expense collection in MongoDB
                    localField: '_id',
                    foreignField: 'userId',
                    as: 'userExpenses'
                }
            },
            {
                $addFields: {
                    totalExpense: {
                        $sum: '$userExpenses.amount'
                    }
                }
            },
            {
                $sort: {
                    totalExpense: -1 // Sort in descending order
                }
            }
        ]);

        res.status(200).json(getUserLeaderBoard);
    } catch (err) {
        console.error(err);
        res.status(500).json(err);
    }
}
