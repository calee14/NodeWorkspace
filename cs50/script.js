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

async function newRun() {
    const user = await User.create({
        name: "Kylo",
        age: 30,
        email: 'kylo@deathstar.com',
        hobbies: ['The Dark Side', 'Lightsaber training', 'Jerking'],
        address: {
            street: 'Officer Quarters 1233',
            city: 'Star Destroyer 1349'
        },
        bestFriend: '61bd6c3441a8b19a07f22c88'
        // catch the errors
    }).catch(error => {
        console.log('error is ', error.message);
    });
    
    console.log(user);
}

// newRun();


async function queries() {
    const user = await User.findById('61bd4bfde8e7b7150ee956f3')
    .then(user => {
        // console.log(user);
    }).catch(error => {
        console.log(error)
    });

    // find one entry in the db by a property specificed which is the name prop
    const oneUser = await User.findOne({ name: 'Kylo'});
    // console.log(oneUser);

    // delete one entry in the db by a property specificed which is the name prop
    // const deletedUser = await User.deleteOne({ name: 'Kylo'});
    // console.log(deletedUser);

    // query options have greater than, `gt()`; less than equal to, `lte()`;
    // then the `where()` can be chained to the result after the first `where()`
    // we can `limit()` the query results and `select()` certain props of the obj
    // the `populate()` is very powerful for if you set the 'ref' variable 
    // then you can join two different model obj in the query
    const query = await User.where('age')
                    .gt(12)
                    .lte(30)
                    .where('name')
                    .equals('Kylo')
                    .populate('bestFriend')
                    .limit(2)
    // query[0].bestFriend = '61bd6c3441a8b19a07f22c88';
    // await query[0].save();

    // console.log(query[0]);

    const customQuery = await User.findByName('Kyle');
    console.log(customQuery[0])

    const customQueryChained = await User.find().byName('Kyle');
    console.log(customQueryChained[0].namedEmail)
}

queries();