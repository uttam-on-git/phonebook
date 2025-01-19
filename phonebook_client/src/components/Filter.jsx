const Filter = ({ filter, setFilter }) => {
    const handleFilter = (event) => {
      setFilter(event.target.value)
    }
    return (
      <div>
        filter shown with: <input value={filter} onChange={handleFilter}/>
      </div>
    )
  }
  
  export default Filter