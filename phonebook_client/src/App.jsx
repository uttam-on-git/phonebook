import { useState, useEffect } from "react";
import Filter from "./components/Filter";
import PersonForm from "./components/PersonForm";
import Persons from "./components/Persons";
import personService from "./services/persons";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [filter, setFilter] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    personService
      .getAllPersons()
      .then((intialPersons) => setPersons(intialPersons));
  }, []);

  const addPerson = (event) => {
    event.preventDefault();

    const existingPerson = persons.find((person) => person.name === newName);

    if (existingPerson) {
      const confirmUpdate = window.confirm(
        `${newName} is already added to phonebook, replace the old number with a new one?`
      );

      if (confirmUpdate) {
        const changedPerson = { ...existingPerson, number: newNumber };
        console.log(changedPerson);
        personService
          .updatePerson(existingPerson.id, changedPerson)
          .then((updatedPerson) => {
            setPersons(
              persons.map((person) =>
                person.id !== existingPerson.id ? person : updatedPerson
              )
            );
            setNewName("");
            setNewNumber("");
          })
          .catch((error) => {
            setErrorMessage(error.response.data.error);
            setTimeout(() => {
              setErrorMessage("");
            }, 6000);
          });
      }
      return;
    }
    const personObject = {
      name: newName,
      number: newNumber,
    };
    personService
      .createPerson(personObject)
      .then((createdPerson) => {
        setPersons(persons.concat(createdPerson));
        setNewName("");
        setNewNumber("");
      })
      .catch((error) => {
        setErrorMessage(error.response.data.error);
        setTimeout(() => {
          setErrorMessage("");
        }, 6000);
      });
  };

  return (
    <div>
      {errorMessage && <div className="error">{errorMessage}</div>}{" "}
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
      <Persons persons={persons} filter={filter} setPersons={setPersons} />
    </div>
  );
};

export default App;
