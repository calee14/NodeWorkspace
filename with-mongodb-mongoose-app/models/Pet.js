import mongoose from 'mongoose'

// Schemas will be stored as collections in the DB
// the PetSchema will be stored under 'pet'
// use PetSchema.add() to add new key properties
const PetSchema = new mongoose.Schema({
  name: {
    /* The name of this pet */

    type: String,
    required: [true, 'Please provide a name for this pet.'],
    maxlength: [20, 'Name cannot be more than 60 characters'],
  },
  owner_name: {
    /* The owner of this pet */

    type: String,
    required: [true, "Please provide the pet owner's name"],
    maxlength: [20, "Owner's Name cannot be more than 60 characters"],
  },
  species: {
    /* The species of your pet */

    type: String,
    required: [true, 'Please specify the species of your pet.'],
    maxlength: [30, 'Species specified cannot be more than 40 characters'],
  },
  age: {
    /* Pet's age, if applicable */

    type: Number,
  },
  poddy_trained: {
    /* Boolean poddy_trained value, if applicable */

    type: Boolean,
  },
  diet: {
    /* List of dietary needs, if applicable */

    type: Array,
  },
  image_url: {
    /* Url to pet image */

    required: [true, 'Please provide an image url for this pet.'],
    type: String,
  },
  likes: {
    /* List of things your pet likes to do */

    type: Array,
  },
  dislikes: {
    /* List of things your pet does not like to do */

    type: Array,
  },
})

PetSchema.query.byName = function(name) {
  return this.where({ name: new RegExp(name, 'i') })
};

// Retrieve the model or compile a collectionn
export default mongoose.models.Pet || mongoose.model('Pet', PetSchema)
