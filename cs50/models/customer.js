const mongoose = require('mongoose');
const connection = require('../utils/db');

const custumer = new mongoose.Schema({ // the schema will say how our customer collection will look like
    name: {
        type: 'string',
        required: true
    },
    email: { 
        type: String,
        required: true
    }
})

const Customer = connection.model('Customer', customer);

module.exports = Customer; // export the collection so we can use it later to add fields to the customer collection