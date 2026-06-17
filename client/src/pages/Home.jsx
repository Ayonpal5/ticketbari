import { useEffect, useState } from 'react';
import api from '../api';
import TicketCard from '../components/TicketCard';

const Home = () => {
  const [advertised, setAdvertised] = useState([]);
  const [latest, setLatest] = useState([]);

  useEffect(() => {
    api.get('/tickets/advertised').then((res) => setAdvertised(res.data)).catch(() => {});
    api.get('/tickets?limit=6').then((res) => setLatest(res.data.tickets)).catch(() => {});
  }, []);

  return (
    <section className="home-page">
      <div className="hero-banner">
        <div>
          <h1>Travel Easier With TicketBari</h1>
          <p>Book bus, train, launch & flight tickets from one platform.</p>
        </div>
      </div>
      <div className="container">
        <section className="section-intro">
          <h2>Top Advertised Tickets</h2>
          <div className="ticket-grid">
            {advertised.map((ticket) => <TicketCard key={ticket._id} ticket={ticket} />)}
          </div>
        </section>
        <section className="section-intro">
          <h2>Latest Tickets</h2>
          <div className="ticket-grid">
            {latest.map((ticket) => <TicketCard key={ticket._id} ticket={ticket} />)}
          </div>
        </section>
        <section className="section-intro">
          <h2>Why Choose TicketBari?</h2>
          <div className="feature-grid">
            <div className="feature-card"><h3>Fast Booking</h3><p>Complete checkout with few clicks.</p></div>
            <div className="feature-card"><h3>Verified Vendors</h3><p>Admin-approved tickets ensure quality travel.</p></div>
          </div>
        </section>
      </div>
    </section>
  );
};

export default Home;
