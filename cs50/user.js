const mongoose = require('mongoose');

// create an address schema to replace the address prop in userSchema
const addressSchema = new mongoose.Schema({
    street: String,
    city: String, 
});

const userSchema = new mongoose.Schema({ // define the fields that the schema will take in
    name: String,
    age: Number,
    email: String,
    bestFriend: { 
        type: mongoose.SchemaTypes.ObjectId,
        index: true
    },
    hobbies: [String], // an array of strings
    address: { // can have nested properties
        street: String,
        city: String,
    },
    createdAt: Date,
    updatedAt: Date,
}, {
    timestamps: {
        createdAt: 'createdAt',
        updatedAt: 'updatedAt',
    }
});

module.exports = mongoose.model('User', userSchema);