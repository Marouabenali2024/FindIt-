import React, { useState } from "react";
import "./AddItem.css"; // Import the CSS file

const AddItem = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Item Added:", formData);
    // Handle form submission (e.g., API call)
  };

  return (
    <div className="add-item-container">
      <h2>Add Item</h2>
      <form onSubmit={handleSubmit} className="add-item-form">
        <label>
          Name:
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Description:
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Location:
          <textarea
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
          />
        </label>

        <button type="submit">Add Item</button>
      </form>
    </div>
  );
};

export default AddItem;
