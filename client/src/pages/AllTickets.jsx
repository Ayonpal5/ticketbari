import { useEffect, useState } from 'react';
import api from '../api';
import TicketCard from '../components/TicketCard';

const AllTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [search, setSearch] = useState('');
  const [transport, setTransport] = useState('');
  const [sort, setSort] = useState('');

  useEffect(() => {
    api.get('/tickets', { params: { page, limit: 8, search, transport, sort } }).then((res) => {
      setTickets(res.data.tickets);
      setPages(res.data.pages);
    });
  }, [page, search, transport, sort]);

  return (
    <section className="page-section">
      <div className="container">
        <h2>All Tickets</h2>
        <div className="filter-row">
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search from or to" />
          <select value={transport} onChange={(e) => setTransport(e.target.value)}>
            <option value="">All Types</option>
            <option value="Bus">Bus</option>
            <option value="Train">Train</option>
            <option value="Launch">Launch</option>
            <option value="Plane">Plane</option>
          </select>
          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="">Newest</option>
            <option value="low">Price: Low to High</option>
            <option value="high">Price: High to Low</option>
          </select>
        </div>
        <div className="ticket-grid">
          {tickets.map((ticket) => <TicketCard key={ticket._id} ticket={ticket} />)}
        </div>
        <div className="pagination-row">
          {Array.from({ length: pages }, (_, idx) => idx + 1).map((pg) => (
            <button key={pg} className={pg === page ? 'active' : ''} onClick={() => setPage(pg)}>{pg}</button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AllTickets;
