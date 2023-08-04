// const mongoose = require("mongoose");
// const { ObjectId } = mongoose.Schema.Types

// const userSchema = new mongoose.Schema({
//     name: {
//         type: String,
//         required: true
//     },
//     userName: {
//         type: String,
//         required: true
//     },
//     email: {
//         type: String,
//         required: true
//     },
//     password: {
//         type: String,
//         required: true
//     },
//     Photo: {
//         type: String,
//     },
//     followers: [{ type: ObjectId, ref: "USER" }],
//     following: [{ type: ObjectId, ref: "USER" }]
// })

// mongoose.model("USER", userSchema)
const mongoose = require("mongoose");
const { Schema, Types } = mongoose;

const userSchema = new Schema({
    name: {
        type: String,
        required: false
    },
    userName: {
        type: String,
        required: false
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    Photo: {
        type: String,
    },
    token: {
        type: String,
    },
    userId: {
        type: Types.ObjectId,
        ref: 'User',
        required: false
    },
    followers: [{ type: Types.ObjectId, ref: "USER" }],
    following: [{ type: Types.ObjectId, ref: "USER" }]
});

const Users = mongoose.model('USER', userSchema);

module.exports = Users;
