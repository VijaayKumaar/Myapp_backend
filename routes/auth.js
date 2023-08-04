const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const USER = mongoose.model("USER");
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken")
const { Jwt_secret } = require("../keys");
const requireLogin = require("../middlewares/requireLogin");
const UserToken = require('../models/model'); 
router.get('/', (req, res) => {
    res.send("hello")
})

router.post("/signup", (req, res) => {
    const { name, userName, email, password } = req.body;
    if (!name || !email || !userName || !password) {
        return res.status(422).json({ error: "Please add all the fields" })
    }
    USER.findOne({ $or: [{ email: email }, { userName: userName }] }).then((savedUser) => {
        if (savedUser) {
            return res.status(422).json({ error: "User already exist with that email or userName" })
        }
        bcrypt.hash(password, 12).then((hashedPassword) => {

            const user = new USER({
                name,
                email,
                userName,
                password: hashedPassword
            })

            user.save()
                .then(user => { res.json({ message: "Registered successfully" }) })
                .catch(err => { console.log(err) })
        })
    })




})






router.post("/signin", (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(422).json({ error: "Please add email and password" });
    }
    USER.findOne({ email: email }).then((savedUser) => {
        if (!savedUser) {
            return res.status(422).json({ error: "Invalid email" });
        }
        bcrypt.compare(password, savedUser.password).then((match) => {
            if (match) {
                const token = jwt.sign({ _id: savedUser.id }, Jwt_secret);
                const { _id, name, email, userName } = savedUser;

                // Update the token in MongoDB
                UserToken.findOneAndUpdate(
                    { userId: savedUser.id },
                    { token: token },
                    { new: true, upsert: true }
                ).then(() => {
                    res.json({ token, user: { _id, name, email, userName } });
                    console.log({ token, user: { _id, name, email, userName } });
                }).catch(err => {
                    console.log(err);
                    return res.status(500).json({ error: "Failed to update token" });
                });
            } else {
                return res.status(422).json({ error: "Invalid password" });
            }
        }).catch(err => {
            console.log(err);
            return res.status(500).json({ error: "Error comparing passwords" });
        });
    }).catch(err => {
        console.log(err);
        return res.status(500).json({ error: "Error finding user" });
    });
});






module.exports = router;