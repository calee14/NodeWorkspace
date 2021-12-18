const mongoose = require('mongoose');

// create an address schema to replace the address prop in userSchema
const addressSchema = new mongoose.Schema({
    street: String,
    city: String, 
});

const userSchema = new mongoose.Schema({ // define the fields that the schema will take in
    name: String,
    age: {
        type: Number,
        // prebuilt validators for the `age` prop
        min: 1,
        max: 130,
        // create customer value of the validator
        validate: {
            validator: v => v % 2 === 0,
            message: props => `${props.value} is not an even number`
        }
    },
    email: {
        type: String,
        // prebuilt validators for the `age` prop
        minLength: 5,
        maxlength: 100,
        required: true,
        lowercase: true, // make all string letters lowercase
    },
    bestFriend: { 
        type: mongoose.SchemaTypes.ObjectId,
        index: true
    },
    hobbies: [String], // an array of strings
    address: addressSchema,
    createdAt: {
        type: Date,
        // need to pass a function to the default value
        // the function will be invoked everytime we create a new User obj
        // and need the current date
        // if we pass in an obj like new Date, it will only store the date
        // at which the model was instantiated 
        default: () => Date.now(), 
        // the value can no longe rbe changed afer
        immutable: true,
    },
    updatedAt: {
        type: Date,
        default: () => Date.now(),
    },
}, {
    timestamps: {
        createdAt: 'createdAt',
        updatedAt: 'updatedAt',
    }
});

module.exports = mongoose.model('User', userSchema);