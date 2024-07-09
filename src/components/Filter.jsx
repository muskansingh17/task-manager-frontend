import React from "react";

const Filter = ({ filter, setFilter }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilter({
      ...filter,
      [name]:
        value === "all" && ["priority", "status"].includes(name) ? "" : value,
    });
  };

  return (
    <div className="filter">
      <input
        type="text"
        name="search"
        value={filter.search}
        onChange={handleChange}
        placeholder="Search by title, description or tags"
      />
      <select name="priority" value={filter.priority} onChange={handleChange}>
        <option value="all">Priority (All)</option>
        <option value="Low">Low</option>
        <option value="Medium">Medium</option>
        <option value="High">High</option>
      </select>
      <select name="status" value={filter.status} onChange={handleChange}>
        <option value="all">Status (All)</option>
        <option value="Pending">Pending</option>
        <option value="In Progress">In Progress</option>
        <option value="Completed">Completed</option>
      </select>
    </div>
  );
};

export default Filter;
