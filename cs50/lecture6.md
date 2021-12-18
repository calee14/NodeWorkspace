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