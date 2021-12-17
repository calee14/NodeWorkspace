const mongoose = require('mongoose');
const connection = require('../utils/db');
const Customer = require('./customer');

const order = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    customer_id: {
        type: mongoose.Schema.ObjectId,
        ref: Customer, // takes a customer obj id to reference to
        required: true,
        // the index will help mongodb with efficient queries.
        // mongodb won't have to run a collection scan, meaning search everything
        // create an index if the value needs to be queried quickly
        index: true,     
    }
})

const Order = connection.model('Order', order);

module.exports = Order;