import { useState, useEffect } from "react";
import Filter from "./components/Filter";
import PersonForm from "./components/PersonForm";
import Persons from "./components/Persons";
import personService from './services/persons'

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [filter, setFilter] = useState("");

  useEffect(() => {
    personService.getAllPersons().then(intialPersons => setPersons(intialPersons))
  }, []);

  const addPerson = (event) => {
    event.preventDefault();
    const personObject = {
      name: newName,
      number: newNumber,
    };

    const existingPerson = persons.find((person) => person.name === newName);

    if (existingPerson) {
      const confirmUpdate = window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`);
      
      if (confirmUpdate) {
        const changedPerson = { ...existingPerson, number: newNumber };
        
        personService.updatePerson(existingPerson.id, changedPerson)
          .then(updatedPerson => {
            setPersons(updatedPerson);
            setNewName("");
            setNewNumber("");
          });
      }
      return;
    }
    personService.createPerson(personObject)
      .then( createdPerson => {
        setPersons(createdPerson);
        setNewName("");
        setNewNumber("");
      });
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter filter={filter} setFilter={setFilter} />
      <h3>Add a new</h3>
      <PersonForm
        addPerson={addPerson}
        newName={newName}
        setNewName={setNewName}
        newNumber={newNumber}
        setNewNumber={setNewNumber}
      />
      <h3>Numbers</h3>
      <Persons persons={persons} filter={filter} setPersons={setPersons}/>
    </div>
  );
};

export default App;
