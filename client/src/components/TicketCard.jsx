import { Link } from 'react-router-dom';

const TicketCard = ({ ticket }) => {
  return (
    <article className="ticket-card">
      <img src={ticket.image || 'https://via.placeholder.com/400x220'} alt={ticket.title} />
      <div className="ticket-card-body">
        <h3>{ticket.title}</h3>
        <p>{ticket.from} → {ticket.to}</p>
        <p>Type: {ticket.transportType}</p>
        <p>Price: ${ticket.price}</p>
        <p>Seats: {ticket.quantity}</p>
        <p>Perks: {ticket.perks?.join(', ')}</p>
        <Link to={`/tickets/${ticket._id}`} className="button button-secondary">See details</Link>
      </div>
    </article>
  );
};

export default TicketCard;
