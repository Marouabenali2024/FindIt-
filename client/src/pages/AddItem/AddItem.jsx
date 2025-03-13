import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap'; // Importing React Bootstrap components
import './AddItem.css'; // Import the CSS file

const AddItem = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    location: '', // Added location to formData
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Item Added:', formData);
    // Handle form submission (e.g., API call)
  };

  return (
    <div className="add-item-container">
      <h2>Add Item</h2>
      <Form onSubmit={handleSubmit} className="add-item-form">
        <Form.Group controlId="formName">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Enter item name"
          />
        </Form.Group>

        <Form.Group controlId="formDescription">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            placeholder="Enter item description"
          />
        </Form.Group>

        <Form.Group controlId="formLocation">
          <Form.Label>Location</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
            placeholder="Enter item location"
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          Add Item
        </Button>
      </Form>
    </div>
  );
};

export default AddItem;
