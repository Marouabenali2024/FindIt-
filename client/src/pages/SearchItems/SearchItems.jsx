import React, { useState } from 'react';
import { Card, Button, Form, Container, Row, Col } from 'react-bootstrap';
import './SearchItems.css';

function SearchItems() {
  const [search, setSearch] = useState('');

  const itemsData = [
    {
      id: 1,
      name: 'Lost Watch',
      description: 'Black leather strap',
      status: 'Lost',
    },
    {
      id: 2,
      name: 'Found Keys',
      description: 'Silver keychain with a car key',
      status: 'Found',
    },
    {
      id: 3,
      name: 'Lost Wallet',
      description: 'Brown leather, contains ID card',
      status: 'Lost',
    },
    {
      id: 4,
      name: 'Found Phone',
      description: 'iPhone 13 found at the park',
      status: 'Found',
    },
  ];

  const filteredItems = itemsData.filter(
    (item) =>
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Container className="my-4">
      <Form.Control
        type="text"
        placeholder="Search for lost or found items..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-3"
      />

      <Row xs={1} md={2} lg={3} className="g-4 latest-items">
        {filteredItems.length > 0 ? (
          filteredItems.map((item) => (
            <Col key={item.id}>
              <Card className="item-card">
                <Card.Body>
                  <Card.Title className="item-title">{item.name}</Card.Title>
                  <Card.Text>{item.description}</Card.Text>
                  <Button
                    variant={item.status === 'Lost' ? 'danger' : 'success'}
                    className="item-action-btn"
                  >
                    {item.status}
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))
        ) : (
          <p>No items found</p>
        )}
      </Row>
    </Container>
  );
}

export default SearchItems;
