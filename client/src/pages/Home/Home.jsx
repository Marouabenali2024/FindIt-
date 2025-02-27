import React from 'react';
import NavBar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import './Home.css';
function Home() {
  return (
    <div className="container">
      <NavBar />
      <main className="Hero-section">
        <section className="Text-section">
          <h2 className="welcome-text">
            Welcome to Our Lost and Found Website!
          </h2>
          <p className="description">
            We're excited to help you find and recover lost items. Easily report
            lost belongings, search for found items, and connect with others.
            Our user-friendly platform aims to reunite you with your lost
            possessions quickly and efficiently.
          </p>
          <p className="thank-you">
            Thank you for choosing our service. If you need assistance, feel
            free to contact us.
          </p>
          <section className="actions">
            <button className="action-button"> Lost</button>
            <button className="action-button"> Found</button>
          </section>
        </section>
        <section className="btn-img">
          {/* Images Section */}
          <section className="images">
            <img
              className="image1"
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSSG8NYZKLgejTmbPKBYFdc6mhs_LIp_aHzjQ&s"
              alt="Lost keys"
            />
            <img
              className="image2"
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRSqOoPNXSVXrO4-zg0Su-qBBjGFwErcjGcWA&s"
              alt="Lost Item 2"
            />
            <img
              className="image3"
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSHEJfeUv6Qv0R7yGYH2RO-9oXX3SlQtO8kTQ&s"
              alt="Lost Item 3"
            />
          </section>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default Home;
