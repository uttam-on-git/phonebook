import mongoose from "mongoose";

if (process.argv.length < 3) {
  console.log(
    "Please provide the password as an argument: node mongo.js <password>"
  );
  process.exit(1);
}

const password = encodeURIComponent(process.argv[2]);
const name = process.argv[3];
const number = process.argv[4];
const url = `mongodb+srv://notestest:${password}@cluster0.o6djh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
mongoose.set("strictQuery", false);
mongoose.connect(url);

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model("Person", personSchema);

if (!name || !number) {
    console.log("Fetching all entries in the phonebook...");
    Person.find({})
      .then((result) => {
        result.forEach((person) => {
          console.log(`${person.name} ${person.number}`);
        });
      })
      .finally(() => mongoose.connection.close());
  } else {
    const person = new Person({
      name,
      number,
    });
  
    person.save().then(() => {
        console.log(`Added ${name} number ${number} to phonebook`);
      })
      .finally(() => mongoose.connection.close());
  }