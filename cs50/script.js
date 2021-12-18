const mongoose = require('mongoose');
const User = require('./user')
mongoose.connect('mongodb+srv://cap:tothemoon@cluster0.7uudc.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', () => {
    console.log('connected to the db');
});

async function run() {
    // User.create is a model function that does the exact same thing 
    // as creating the user method below
    const userCreate = await User.create({ name: "Kyle", age: 27});
    // edit the model instance's name
    userCreate.name = "Sally";
    // update the obj in the db by saving 
    userCreate.save(); 

    // create a new user obj
    const user = new User({ name: "Jack", age: 26});

    // save the user to the db and catch the promise with `then()`
    // the save() is an async func thus the run function will have to be async
    await user.save().then(user => {
        console.log("User was created", user);
    });
    console.log('we have finished the db query')
}

run();