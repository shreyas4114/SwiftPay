const express = require('express');
const zod = require("zod");
const { User, Account } = require("../db");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");
const router = express.Router();
const { authMiddleware } = require("../middleware");

const signupBody = zod.object({
    username: zod.string().email(),
    password: zod.string(),
    firstName: zod.string(),
    lastName: zod.string()
});

const signinBody = zod.object({
    username: zod.string().email(),
    password: zod.string()
});

router.post("/signup", async (req, res) => {
    const { success, error } = signupBody.safeParse(req.body);
    if (!success) {
        return res.status(400).json({
            message: "Incorrect Inputs",
            error: error.issues
        });
    }

    const existingUser = await User.findOne({
        username: req.body.username
    });

    if (existingUser) {
        return res.status(400).json({
            message: "Email already taken"
        });
    }

    const user = await User.create({
        username: req.body.username,
        password: req.body.password,
        firstName: req.body.firstName,
        lastName: req.body.lastName
    });

    const userId = user._id;

    // Crete banking account
    await Account.create({
        userId,
        balance: 1 + Math.floor(Math.random() * 100000) / 100
    })

    try {
        const token = jwt.sign({
            userId
        }, JWT_SECRET);

        res.status(201).json({
            message: "User created successfully",
            token: token,
            userId
        });
    } catch (err) {
        res.json({
            message: "Error occured at token",
            error: err
        })
    }
});

router.post("/signin", async (req, res) => {
    const { success, error } = signinBody.safeParse(req.body);
    if (!success) {
        return res.status(400).json({
            message: "Incorrect Inputs",
            error: error.issues
        });
    }

    const user = await User.findOne({
        username: req.body.username
    });

    if (!user) {
        return res.status(404).json({
            message: "User not found"
        });
    }

    if (user.password !== req.body.password) {
        return res.status(401).json({
            message: "Incorrect password"
        });
    }

    const token = jwt.sign({
        userId: user._id
    }, JWT_SECRET);

    res.status(200).json({
        message: "Signed in successfully",
        token: token,
        userId: user._id
    });
});

const updateBody = zod.object({
    username: zod.string().email().min(3).max(30).optional(),
    password: zod.string().min(6).optional(),
    firstName: zod.string().min(3).max(50).optional(),
    lastName: zod.string().min(3).max(50).optional(),
})

router.put("/", authMiddleware, async (req, res) => {
    const { success } = updateBody.safeParse(req.body);
    if (!success) {
        return res.status(411).json({
            message: "Requirement not fullfilled"
        })
    }

    await User.updateOne({ _id: req.userId }, req.body);

    res.json({
        message: "Updated Successfully"
    })
})

router.get("/bulk", async (req, res) => {
    const filter = req.query.filter || "";

    const users = await User.find({
        $or: [{
            firstName: {
                "$regex": filter
            }
        }, {
            lastName: {
                "$regex": filter
            }
        }]
    })

    res.json({
        user: users.map(user => ({
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            _id: user._id
        }))
    })
})

module.exports = router;
