import { useEffect, useState } from 'react';
import api from '../api';
import Spinner from '../components/Spinner';

const initialForm = {
  title: '',
  from: '',
  to: '',
  transportType: 'Bus',
  price: '',
  quantity: '',
  departureDate: '',
  perks: [],
  image: '',
};

const Dashboard = ({ user }) => {
  const [view, setView] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [bookings, setBookings] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [vendorTickets, setVendorTickets] = useState([]);
  const [requests, setRequests] = useState([]);
  const [adminUsers, setAdminUsers] = useState([]);
  const [adminTickets, setAdminTickets] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editId, setEditId] = useState(null);

  const fetchMyBookings = async () => {
    setLoading(true);
    try {
      const res = await api.get('/bookings/my');
      setBookings(res.data);
    } catch (error) {
      setMessage('Unable to load your bookings.');
    } finally {
      setLoading(false);
    }
  };

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const res = await api.get('/bookings/transactions');
      setTransactions(res.data);
    } catch (error) {
      setMessage('Unable to load transactions.');
    } finally {
      setLoading(false);
    }
  };

  const fetchVendorData = async () => {
    setLoading(true);
    try {
      const [{ data: ticketData }, { data: requestData }] = await Promise.all([
        api.get('/tickets/vendor'),
        api.get('/bookings/requests'),
      ]);
      setVendorTickets(ticketData);
      setRequests(requestData);
    } catch (error) {
      setMessage('Unable to load vendor data.');
    } finally {
      setLoading(false);
    }
  };

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [{ data: usersData }, { data: ticketsData }] = await Promise.all([
        api.get('/admin/users'),
        api.get('/admin/tickets'),
      ]);
      setAdminUsers(usersData);
      setAdminTickets(ticketsData);
    } catch (error) {
      setMessage('Unable to load admin data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [view]);

  useEffect(() => {
    if (user.role === 'vendor') fetchVendorData();
    if (user.role === 'admin') fetchAdminData();
  }, [user.role]);

  useEffect(() => {
    if (user.role === 'user') {
      if (view === 'tickets') fetchMyBookings();
      if (view === 'history') fetchTransactions();
    }
  }, [view, user.role]);

  const resetForm = () => {
    setForm(initialForm);
    setEditId(null);
  };

  const handleFormChange = (field, value) => {
    if (field === 'perks') {
      const current = form.perks.includes(value)
        ? form.perks.filter((item) => item !== value)
        : [...form.perks, value];
      setForm((prev) => ({ ...prev, perks: current }));
    } else {
      setForm((prev) => ({ ...prev, [field]: value }));
    }
  };

  const handleTicketSubmit = async (event) => {
    event.preventDefault();
    try {
      const payload = {
        title: form.title,
        from: form.from,
        to: form.to,
        transportType: form.transportType,
        price: Number(form.price),
        quantity: Number(form.quantity),
        departureDate: form.departureDate,
        perks: form.perks,
        image: form.image,
      };
      if (editId) {
        await api.put(`/tickets/${editId}`, payload);
        setMessage('Ticket updated successfully.');
      } else {
        await api.post('/tickets', payload);
        setMessage('Ticket added and sent for approval.');
      }
      resetForm();
      fetchVendorData();
    } catch (error) {
      setMessage(error.response?.data?.message || 'Unable to save ticket.');
    }
  };

  const handleEditTicket = (ticket) => {
    setEditId(ticket._id);
    setForm({
      title: ticket.title,
      from: ticket.from,
      to: ticket.to,
      transportType: ticket.transportType,
      price: ticket.price,
      quantity: ticket.quantity,
      departureDate: ticket.departureDate.slice(0, 16),
      perks: ticket.perks || [],
      image: ticket.image || '',
    });
    setView('addTicket');
  };

  const handleDeleteTicket = async (ticketId) => {
    try {
      await api.delete(`/tickets/${ticketId}`);
      setMessage('Ticket deleted');
      fetchVendorData();
    } catch (error) {
      setMessage('Unable to delete ticket.');
    }
  };

  const handleBookingStatus = async (bookingId, status) => {
    try {
      await api.put(`/bookings/${bookingId}/status`, { status });
      setMessage(`Booking ${status}`);
      fetchVendorData();
    } catch (error) {
      setMessage('Unable to update booking status.');
    }
  };

  const handlePay = async (bookingId) => {
    try {
      const res = await api.post(`/payments/checkout`, { bookingId });
      if (res.data.sessionId) {
        const stripe = await import('@stripe/stripe-js').then((m) => m.loadStripe(import.meta.env.VITE_STRIPE_KEY));
        await stripe.redirectToCheckout({ sessionId: res.data.sessionId });
      }
    } catch (error) {
      setMessage(error.response?.data?.message || 'Payment failed.');
    }
  };

  const handleUserRole = async (userId, role) => {
    try {
      await api.put(`/admin/users/${userId}/role`, { role });
      setMessage('User role updated.');
      fetchAdminData();
    } catch (error) {
      setMessage('Unable to update role.');
    }
  };

  const handleMarkFraud = async (userId) => {
    try {
      await api.put(`/admin/users/${userId}/fraud`);
      setMessage('Vendor marked as fraud.');
      fetchAdminData();
    } catch (error) {
      setMessage('Unable to mark fraud.');
    }
  };

  const handleAdminTicket = async (ticketId, status) => {
    try {
      await api.put(`/admin/tickets/${ticketId}/status`, { status });
      setMessage(`Ticket ${status}.`);
      fetchAdminData();
    } catch (error) {
      setMessage('Unable to update ticket status.');
    }
  };

  const handleAdvertise = async (ticketId) => {
    try {
      await api.put(`/admin/tickets/${ticketId}/advertise`);
      setMessage('Advertisement status changed.');
      fetchAdminData();
    } catch (error) {
      setMessage(error.response?.data?.message || 'Unable to update advertisement.');
    }
  };

  const revenueSummary = () => {
    const totalAdded = vendorTickets.length;
    const paidBookings = requests.filter((booking) => booking.status === 'paid');
    const totalSold = paidBookings.reduce((sum, booking) => sum + booking.quantity, 0);
    const totalRevenue = paidBookings.reduce((sum, booking) => sum + booking.totalPrice, 0);
    return { totalAdded, totalSold, totalRevenue };
  };

  const { totalAdded, totalSold, totalRevenue } = revenueSummary();

  return (
    <section className="page-section dashboard-page">
      <div className="container dashboard-layout">
        <aside className="dashboard-sidebar">
          <div className="profile-card">
            <div className="avatar-large">{user.name.charAt(0).toUpperCase()}</div>
            <h3>{user.name}</h3>
            <p>{user.email}</p>
            <p>Role: {user.role}</p>
          </div>
          <nav className="dashboard-nav">
            <button onClick={() => setView('profile')}>Profile</button>
            {user.role === 'user' && (
              <>
                <button onClick={() => setView('tickets')}>My Booked Tickets</button>
                <button onClick={() => setView('history')}>Transaction History</button>
              </>
            )}
            {user.role === 'vendor' && (
              <>
                <button onClick={() => setView('addTicket')}>Add Ticket</button>
                <button onClick={() => setView('myTickets')}>My Added Tickets</button>
                <button onClick={() => setView('requests')}>Requested Bookings</button>
                <button onClick={() => setView('revenue')}>Revenue Overview</button>
              </>
            )}
            {user.role === 'admin' && (
              <>
                <button onClick={() => setView('manageTickets')}>Manage Tickets</button>
                <button onClick={() => setView('manageUsers')}>Manage Users</button>
                <button onClick={() => setView('advertise')}>Advertise Tickets</button>
              </>
            )}
          </nav>
        </aside>
        <div className="dashboard-content">
          {message && <div className="status-message">{message}</div>}

          {view === 'profile' && (
            <div className="dashboard-panel">
              <h2>Profile</h2>
              <div className="profile-details">
                <p><strong>Name:</strong> {user.name}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Role:</strong> {user.role}</p>
              </div>
            </div>
          )}

          {view === 'tickets' && user.role === 'user' && (
            <div className="dashboard-panel">
              <h2>My Booked Tickets</h2>
              {loading ? <Spinner /> : (
                bookings.length ? bookings.map((booking) => (
                  <div className="booking-card" key={booking._id}>
                    <h3>{booking.ticket.title}</h3>
                    <p><strong>Quantity:</strong> {booking.quantity}</p>
                    <p><strong>Total Price:</strong> ${booking.totalPrice}</p>
                    <p><strong>Route:</strong> {booking.ticket.from} → {booking.ticket.to}</p>
                    <p><strong>Departure:</strong> {new Date(booking.ticket.departureDate).toLocaleString()}</p>
                    <p><strong>Status:</strong> {booking.status}</p>
                    {booking.status === 'accepted' && new Date(booking.ticket.departureDate) > new Date() && (
                      <button onClick={() => handlePay(booking._id)}>Pay Now</button>
                    )}
                  </div>
                )) : <p>No bookings yet.</p>
              )}
            </div>
          )}

          {view === 'history' && user.role === 'user' && (
            <div className="dashboard-panel">
              <h2>Transaction History</h2>
              {loading ? <Spinner /> : (
                transactions.length ? (
                  <table className="transactions-table">
                    <thead>
                      <tr>
                        <th>Transaction ID</th>
                        <th>Amount</th>
                        <th>Ticket</th>
                        <th>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions.map((booking) => (
                        <tr key={booking._id}>
                          <td>{booking.paymentIntentId || booking._id}</td>
                          <td>${booking.totalPrice}</td>
                          <td>{booking.ticket.title}</td>
                          <td>{new Date(booking.updatedAt).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : <p>No paid transactions yet.</p>
              )}
            </div>
          )}

          {view === 'addTicket' && user.role === 'vendor' && (
            <div className="dashboard-panel">
              <h2>{editId ? 'Update Ticket' : 'Add Ticket'}</h2>
              <form className="ticket-form" onSubmit={handleTicketSubmit}>
                <input value={form.title} onChange={(e) => handleFormChange('title', e.target.value)} placeholder="Ticket title" required />
                <input value={form.from} onChange={(e) => handleFormChange('from', e.target.value)} placeholder="From (Location)" required />
                <input value={form.to} onChange={(e) => handleFormChange('to', e.target.value)} placeholder="To (Location)" required />
                <select value={form.transportType} onChange={(e) => handleFormChange('transportType', e.target.value)}>
                  <option value="Bus">Bus</option>
                  <option value="Train">Train</option>
                  <option value="Launch">Launch</option>
                  <option value="Plane">Plane</option>
                </select>
                <input type="number" value={form.price} onChange={(e) => handleFormChange('price', e.target.value)} placeholder="Price per unit" required />
                <input type="number" value={form.quantity} onChange={(e) => handleFormChange('quantity', e.target.value)} placeholder="Ticket quantity" required />
                <input type="datetime-local" value={form.departureDate} onChange={(e) => handleFormChange('departureDate', e.target.value)} required />
                <div className="checkbox-group">
                  {['AC', 'Breakfast', 'WiFi', 'Window seat'].map((perk) => (
                    <label key={perk}>
                      <input type="checkbox" checked={form.perks.includes(perk)} onChange={() => handleFormChange('perks', perk)} /> {perk}
                    </label>
                  ))}
                </div>
                <input value={form.image} onChange={(e) => handleFormChange('image', e.target.value)} placeholder="Image URL" />
                <input value={user.name} readOnly placeholder="Vendor name" />
                <input value={user.email} readOnly placeholder="Vendor email" />
                <button type="submit">{editId ? 'Update Ticket' : 'Add Ticket'}</button>
              </form>
            </div>
          )}

          {view === 'myTickets' && user.role === 'vendor' && (
            <div className="dashboard-panel">
              <h2>My Added Tickets</h2>
              {loading ? <Spinner /> : (
                vendorTickets.length ? vendorTickets.map((ticket) => (
                  <div className="ticket-card dashboard-ticket-card" key={ticket._id}>
                    <div className="ticket-card-body">
                      <h3>{ticket.title}</h3>
                      <p>{ticket.from} → {ticket.to}</p>
                      <p>Type: {ticket.transportType}</p>
                      <p>Price: ${ticket.price}</p>
                      <p>Quantity: {ticket.quantity}</p>
                      <p>Status: {ticket.status}</p>
                      <p>Verification: {ticket.status}</p>
                      <div className="dashboard-actions">
                        <button onClick={() => handleEditTicket(ticket)} disabled={ticket.status === 'rejected'}>Update</button>
                        <button onClick={() => handleDeleteTicket(ticket._id)} disabled={ticket.status === 'rejected'}>Delete</button>
                      </div>
                    </div>
                  </div>
                )) : <p>No tickets added yet.</p>
              )}
            </div>
          )}

          {view === 'requests' && user.role === 'vendor' && (
            <div className="dashboard-panel">
              <h2>Requested Bookings</h2>
              {loading ? <Spinner /> : (
                requests.length ? (
                  <table className="transactions-table">
                    <thead>
                      <tr>
                        <th>User</th>
                        <th>Ticket</th>
                        <th>Quantity</th>
                        <th>Total</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {requests.map((booking) => (
                        <tr key={booking._id}>
                          <td>{booking.user.name} / {booking.user.email}</td>
                          <td>{booking.ticket.title}</td>
                          <td>{booking.quantity}</td>
                          <td>${booking.totalPrice}</td>
                          <td>{booking.status}</td>
                          <td>
                            <button onClick={() => handleBookingStatus(booking._id, 'accepted')} disabled={booking.status !== 'pending'}>Accept</button>
                            <button onClick={() => handleBookingStatus(booking._id, 'rejected')} disabled={booking.status !== 'pending'}>Reject</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : <p>No booking requests.</p>
              )}
            </div>
          )}

          {view === 'manageTickets' && user.role === 'admin' && (
            <div className="dashboard-panel">
              <h2>Manage Tickets</h2>
              {loading ? <Spinner /> : (
                adminTickets.length ? (
                  <table className="transactions-table">
                    <thead>
                      <tr>
                        <th>Title</th>
                        <th>Vendor</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {adminTickets.map((ticket) => (
                        <tr key={ticket._id}>
                          <td>{ticket.title}</td>
                          <td>{ticket.vendor?.name}</td>
                          <td>{ticket.status}</td>
                          <td>
                            <button onClick={() => handleAdminTicket(ticket._id, 'approved')}>Approve</button>
                            <button onClick={() => handleAdminTicket(ticket._id, 'rejected')}>Reject</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : <p>No tickets pending review.</p>
              )}
            </div>
          )}

          {view === 'manageUsers' && user.role === 'admin' && (
            <div className="dashboard-panel">
              <h2>Manage Users</h2>
              {loading ? <Spinner /> : (
                adminUsers.length ? (
                  <table className="transactions-table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {adminUsers.map((userRow) => (
                        <tr key={userRow._id}>
                          <td>{userRow.name}</td>
                          <td>{userRow.email}</td>
                          <td>{userRow.role}</td>
                          <td>
                            <button onClick={() => handleUserRole(userRow._id, 'admin')}>Make Admin</button>
                            <button onClick={() => handleUserRole(userRow._id, 'vendor')}>Make Vendor</button>
                            {userRow.role === 'vendor' && <button onClick={() => handleMarkFraud(userRow._id)}>Mark Fraud</button>}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : <p>No users available.</p>
              )}
            </div>
          )}

          {view === 'advertise' && user.role === 'admin' && (
            <div className="dashboard-panel">
              <h2>Advertise Tickets</h2>
              {loading ? <Spinner /> : (
                adminTickets.length ? (
                  <table className="transactions-table">
                    <thead>
                      <tr>
                        <th>Title</th>
                        <th>Status</th>
                        <th>Advertised</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {adminTickets.filter((ticket) => ticket.status === 'approved').map((ticket) => (
                        <tr key={ticket._id}>
                          <td>{ticket.title}</td>
                          <td>{ticket.status}</td>
                          <td>{ticket.advertised ? 'Yes' : 'No'}</td>
                          <td>
                            <button onClick={() => handleAdvertise(ticket._id)}>{ticket.advertised ? 'Unadvertise' : 'Advertise'}</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : <p>No approved tickets to advertise.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Dashboard;
