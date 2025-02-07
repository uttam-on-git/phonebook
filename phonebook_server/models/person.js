import mongoose from "mongoose";
mongoose.set("strictQuery", false);

const url = process.env.MONGODB_URI;
console.log('Connecting to...', url)

mongoose
  .connect(url)
  .then((result) => {
    console.log("connect to mongoDB");
  })
  .catch((error) => {
    console.log("error while connnecting to mongoDB", error.message);
  });

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: 3
  },
  number: {
    type: Number,
    validate: {
      validator: function(v) {
        return v.toString().length >= 10 && v.toString().length <= 12;
      },
      message: props => `${props.value} is not a valid phone number!`
    },
    required: true
  }
});

personSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

const Person = mongoose.model('person', personSchema)

export default Person; 