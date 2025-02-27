import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ItemList = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/items');
      setItems(response.data);
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  };

  return (
    <div>
      <h2>FindIt</h2>
      <ul>
        {items.map((item) => (
          <li key={item._id}>
            {item.name} - {item.found ? 'Found' : 'Lost'}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ItemList;
