import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import Modal from '../components/Modal';

const TicketDetails = ({ user }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [countdown, setCountdown] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    api.get(`/tickets/${id}`).then((res) => setTicket(res.data)).catch(() => setTicket(null));
  }, [id, user, navigate]);

  useEffect(() => {
    let interval;
    if (ticket) {
      const updateCountdown = () => {
        const diff = new Date(ticket.departureDate) - new Date();
        if (diff <= 0) {
          setCountdown('Departed');
          clearInterval(interval);
          return;
        }
        const days = Math.floor(diff / 86400000);
        const hours = Math.floor((diff % 86400000) / 3600000);
        const minutes = Math.floor((diff % 3600000) / 60000);
        const seconds = Math.floor((diff % 60000) / 1000);
        setCountdown(`${days}d ${hours}h ${minutes}m ${seconds}s`);
      };
      updateCountdown();
      interval = setInterval(updateCountdown, 1000);
    }
    return () => clearInterval(interval);
  }, [ticket]);

  const handleBook = async () => {
    if (!user) return navigate('/login');
    try {
      await api.post('/bookings', { ticketId: id, quantity });
      setMessage('Booking request submitted.');
      setShowModal(false);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error booking ticket');
    }
  };

  if (!ticket) return <div className="container">Loading...</div>;

  const departed = new Date(ticket.departureDate) <= new Date();
  const canBook = ticket.quantity > 0 && !departed;
  const totalPrice = ticket.price * quantity;

  return (
    <section className="page-section">
      <div className="container ticket-details">
        <img src={ticket.image || 'https://via.placeholder.com/500x300'} alt={ticket.title} />
        <div>
          <h2>{ticket.title}</h2>
          <p>{ticket.from} → {ticket.to}</p>
          <p>Type: {ticket.transportType}</p>
          <p>Price: ${ticket.price}</p>
          <p>Seats available: {ticket.quantity}</p>
          <p>Perks: {ticket.perks?.join(', ')}</p>
          <p>Departure: {new Date(ticket.departureDate).toLocaleString()}</p>
          <p>Countdown: {countdown}</p>
          <button disabled={!canBook} onClick={() => setShowModal(true)}>Book Now</button>
          {message && <p className="message">{message}</p>}
        </div>
      </div>
      <Modal open={showModal} title="Book Ticket" onClose={() => setShowModal(false)}>
        <div className="modal-booking">
          <label>Quantity</label>
          <input type="number" min="1" max={ticket.quantity} value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} />
          <p>Total price: ${totalPrice}</p>
          <button onClick={handleBook} disabled={quantity < 1 || quantity > ticket.quantity}>Confirm Booking</button>
        </div>
      </Modal>
    </section>
  );
};

export default TicketDetails;
