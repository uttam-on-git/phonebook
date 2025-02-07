import personService from "../services/persons";
const Persons = ({ persons = [], filter = "", setPersons }) => {
  const validPersons = Array.isArray(persons) ? persons : [];
  const filteredPersons = validPersons.filter((person) =>
    person.name?.toLowerCase().includes(filter.toLowerCase().trim())
  );
  const handleDeletePerson = (id, name) => {
    const confirmDelete = window.confirm(`delete ${name} ?`);
    if (!confirmDelete) return;
    personService.deletePerson(id).then(() => {
      setPersons(persons => persons.filter(person => person.id !== id));
    });
  };

  return (
    <div>
      {filteredPersons.map((person) => (
        <div key={person.id}>
          <ul>
            <li className="person">
              {person.name} {person.number}
              <button className="deleteButton" onClick={() => handleDeletePerson(person.id, person.name)}>delete</button>
            </li>
          </ul>
        </div>
      ))}
    </div>
  );
};

export default Persons;
