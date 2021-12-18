const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({ // define the fields that the schema will take in
    name: String,
    age: Number,
    email: String,
    bestFriend: { 
        type: mongoose.SchemaTypes.ObjectId,
        ref: userSchema, 
        index: true
    },
    timestamps: {
        createdAt: true,
        updatedAt: true,
    }
})

module.exports = mongoose.model('User', userSchema);