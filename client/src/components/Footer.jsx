const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div>
          <h3>TicketBari</h3>
          <p>Book bus, train, launch & flight tickets easily.</p>
        </div>
        <div>
          <h4>Quick Links</h4>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/tickets">All Tickets</a></li>
            <li><a href="/#contact">Contact Us</a></li>
            <li><a href="/#about">About</a></li>
          </ul>
        </div>
        <div>
          <h4>Contact Info</h4>
          <p>Email: support@ticketbari.com</p>
          <p>Phone: +880 1234 567890</p>
          <p>Facebook: /TicketBari</p>
        </div>
        <div>
          <h4>Payment Methods</h4>
          <p>Stripe</p>
        </div>
      </div>
      <div className="footer-bottom">© 2025 TicketBari. All rights reserved.</div>
    </footer>
  );
};

export default Footer;
