const express = require("express");
const { authMiddleware } = require("../middleware");
const { User, Account, Transactions } = require("../db");
const { default: mongoose } = require("mongoose");
const { v4: uuidv4 } = require('uuid');

const router = express.Router();

router.post('/balance', authMiddleware, async (req, res) => {
    try {
        const { userId } = req.body;
        if (!userId) {
            return res.status(400).json({ message: 'User ID is required' });
        }

        const account = await Account.findOne({ userId });
        if (!account) return res.status(404).json({ message: 'Account not found' });

        res.json({ balance: account.balance });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

router.post("/transfer", authMiddleware, async (req, res) => {
    const session = await mongoose.startSession();

    try {
        //Start the session
        session.startTransaction();
        const { amount, to } = req.body;

        if (!amount || !to) {
            await session.abortTransaction();
            return res.status(400).json({ message: "Amount and recipient user ID are required" });
        }

        if (amount <= 0) {
            await session.abortTransaction();
            return res.status(400).json({ message: "Amount must be positive" });
        }
        
        const account = await Account.findOne({ userId: req.userId }).session(session);
        const user = await User.findOne({ _id: req.userId }).session(session);

        if (!account || account.balance < amount) {
            await session.abortTransaction();
            return res.status(400).json({                    // return
                message: "Insufficient balance"
            });
        }

        const toAccount = await Account.findOne({ userId: to }).session(session);
        const toUser = await User.findOne({ _id: to }).session(session);

        if (!toAccount) {
            await session.abortTransaction();
            return res.status(400).json({
                message: "Invalid account"
            });
        }

        // Perform transfer
        await Account.updateOne({ userId: req.userId }, { $inc: { balance: -amount } }).session(session);
        await Account.updateOne({ userId: to }, { $inc: { balance: amount } }).session(session);

        const transId = uuidv4();
        
        await Transactions.create([{
            from: req.userId,
            to: to,
            fromName: `${user.firstName} ${user.lastName}`,
            toName: `${toUser.firstName} ${toUser.lastName}`,
            amount: amount,
            id: transId,
        }], { session });

        await session.commitTransaction();
        res.json({
            message: "Transfer successful"
        });

    } catch (err) {
        await session.abortTransaction();
        res.status(400).json({
            message: "Transaction aborted",
            error: err.message
        });
    }
    session.endSession();
});

router.post("/history", authMiddleware, async (req, res) => {
    try {
        const userId = req.userId;

        const transactions = await Transactions.find({
            $or: [
                {from: userId},
                {to: userId}
            ]
        }).sort({time: -1});    // sort by time in descending order based on index

        res.status(200).json({
            message: 'Transaction history fetched successfully',
            transactions: transactions
        });

    } catch(error) {
        res.status(500).json({
            message: 'Error fetching transaction history',
            error: error.message
        });
    }
});

module.exports = router;
