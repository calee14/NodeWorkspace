# Database
## Reasons 
- persistant data that's organized and accessible
- CRUD (create, read, update, delete)
- ORMs and ODMs (object-relatinal mapping vs object-document mapping)
    - objects to relate data for storing in database
- relational vs document-based
    - tables vs json-like documents
    - robust vs flexible
    - sql vs object matching
## Mongoose.js
- allows for data integrity in a document-basd database
- `Schema` object properties
```js
// assign a function to the "methods" object of our animalSchema
animalSchema.methods.findSimilarTypes = function(cb) { // schemas can have property methods available to the models
    return mongoose.model('Animal').find({ type: this.type }, cb);
};

const opts = {
  timestamps: {
    createdAt: 'created_at', // can name the timestamp props in the schema
    updatedAt: 'updated_at'
  }
};

const userSchema = mongoose.Schema({ email: String }, opts);
const User = mongoose.model('User', userSchema);

const doc = await User.create({ email: 'test@google.com' });
doc.updated_at; // 2020-07-06T20:38:52.917Z
```

## Advanced Mongoose.js (baby)
- __schema__ = defines the structure of what your data looks like
  - usually also known as a collection
- __model__ = is an individual object or set of data from the collections
- __query__ = query against the database
__Mongoose.js__ = schema based odm to define your model `Collections`
- tables = collections (in noSql terminology) 
- mongodb and mongoose.js combinations for queries:
```js
/* FILTER QUERIES */
// $eq = checks for equality
db.users.find({ name: { $eq: 'Cap'} });
// can also be written as:
db.users.find({ name: 'Cap' });
// $ne = checks if not equal
db.users.find({ name: { $ne: 'Cap'} });
// $gt/gte = checks if greater than or equal to
db.users.find({ age: { $gte: 10} });
// $lt/lte = checks if less than or equal to
db.users.find({ age: { $lte: 20} });
// $in = checks if value is in the set of values provided
db.users.find({ name: { $in: ['Cap', 'Jose']} });
// $nin = checks if value is not in the set of values provided
// gets all users without the names in the array
db.users.find({ name: { $nin: ['Cap', 'Jose']} });
// $and = checks if multiple conditions are all true
db.users.find({ $and: [name: 'Cap', age: 18 ] });
// generally don't need the $and
db.users.find({ name: 'Cap', age: 18 }); 
// $or = checks that at least one of the conditions is true
db.users.find({ $or: [name: 'Cap', age: 18 ] });
// $not = checks that the document doesn't have the value
db.users.find({ name: { $not: {$eq: 'Cap' } } });
// $exists = checks if a field exists
db.users.find({ name: { $exists: true } });
// $expr = compares two differen fields
// compares if the balance field is greater than the debt field
db.users.find({ $expr: { $gt: ['$balance', '$debt'] } });
```
```js
/* Update Objects */
// $set = updates the fields only passed to set
// set the first user's name with age 12 to 'Hi'
db.users.updateOne({ age: 12 }, { $set: { name: 'Hi' } });
// $inc = increment the value of the selected field by the passed amount
db.users.updateOne({ age: 12 }, { $inc: { age: 7 } });
// $rename = renames a field
// renames the field, 'age', of all objects in the db with 'years'
db.users.updateMany({}, { $rename: { age: "years" } });
// $unset = remove a field for the queried documents
// removes the age field for the first document with age equal to 12
db.users.updateOne({ age: 12}, { $unset: { age: "" } });
// $push = add a value to an array field
// adds John as a friend to all users in the db
db.users.updateMany({}, { $push: { friends: "John" } });
// $pull = removes a value from an array field
// removes Matty as a frield from all users friends array in the db
db.users.updateMany({}, { $push: { friends: "Matty" } });
```
- By using the model functions `updateMany()` and `updateOne()` it won't go by the model validator.
  - only the `.save()` function will run the validator function