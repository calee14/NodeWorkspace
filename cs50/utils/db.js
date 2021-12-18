// mongoose.js practice for lecture6.md

const mongoose = require('mongoose');
const connection = mongoose.createConnection('mongodb://localhost:27017/ks-store'); // ks-store is name of database

module.exports = connection;