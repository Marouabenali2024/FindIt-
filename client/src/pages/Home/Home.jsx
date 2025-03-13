import React from 'react';
import NavBar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import { Button, Container, Row, Col, Card, Image } from 'react-bootstrap'; // Import React Bootstrap components
import './Home.css';

function Home() {
  return (
    <Container className="container">
      <NavBar />
      <main className="hero-section">
        <Row className="align-items-center">
          <Col md={6} className="hero-left">
            <h2 className="headline">LWelcome to FindIt !</h2>
            <p className="description">
              FindIt is your go-to platform to connect with people who have lost
              and found items. With a user-friendly experience, you can report
              lost items, search through found items, and get reunited with your
              precious belongings.
            </p>
            <div className="action-buttons">
              <Button variant="danger" className="action-button lost-btn">
              Lost Item
              </Button>
              <Button variant="success" className="action-button found-btn">
                Found Item
              </Button>
            </div>
          </Col>

          <Col md={6} className="hero-right">
            <div className="image-container">
              <Image
                className="image1"
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSSG8NYZKLgejTmbPKBYFdc6mhs_LIp_aHzjQ&s"
                alt="A set of lost keys"
                fluid
              />
              <Image
                className="image2"
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRSqOoPNXSVXrO4-zg0Su-qBBjGFwErcjGcWA&s"
                alt="Example of a found item"
                fluid
              />
              <Image
                className="image3"
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSHEJfeUv6Qv0R7yGYH2RO-9oXX3SlQtO8kTQ&s"
                alt="A found item"
                fluid
              />
            </div>
          </Col>
        </Row>
      </main>

      {/* About Section */}
      <section className="about-section">
        <h2 className="section-title">About FindIt</h2>
        <p className="about-description">
          FindIt is a trusted online platform that helps individuals who have
          lost items connect with those who have found them. Whether you’ve lost
          a wallet, keys, or something else important, FindIt makes it easy to
          report your lost items or browse through the latest found items in
          your area. Our goal is to reunite you with your possessions in the
          fastest and safest way possible.
        </p>
      </section>

      {/* Latest Lost & Found Items Section */}
      <section className="latest-items-section">
        <h2 className="section-title">Latest Lost and Found Items</h2>
        <Row className="latest-items">
          <Col md={4}>
            <Card className="item-card">
              <Image
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSSG8NYZKLgejTmbPKBYFdc6mhs_LIp_aHzjQ&s"
                alt="A set of lost keys"
                className="item-image"
                fluid
              />
              <Card.Body>
                <Card.Title className="item-title">
                  Lost Keys - Jan 15, 2025
                </Card.Title>
                <Button className="item-action-btn" variant="primary">
                  View Details
                </Button>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="item-card">
              <Image
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRSqOoPNXSVXrO4-zg0Su-qBBjGFwErcjGcWA&s"
                alt="A lost wallet"
                className="item-image"
                fluid
              />
              <Card.Body>
                <Card.Title className="item-title">
                  Lost Wallet - Jan 14, 2025
                </Card.Title>
                <Button className="item-action-btn" variant="primary">
                  View Details
                </Button>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="item-card">
              <Image
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSHEJfeUv6Qv0R7yGYH2RO-9oXX3SlQtO8kTQ&s"
                alt="A lost phone"
                className="item-image"
                fluid
              />
              <Card.Body>
                <Card.Title className="item-title">
                  Lost Phone - Jan 13, 2025
                </Card.Title>
                <Button className="item-action-btn" variant="primary">
                  View Details
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </section>

      <Footer />
    </Container>
  );
}

export default Home;
