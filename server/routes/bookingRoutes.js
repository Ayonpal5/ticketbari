const express = require('express');
const Booking = require('../models/bookingModel');
const Ticket = require('../models/ticketModel');
const { protect, authorize } = require('../middlewares/auth');

const router = express.Router();

router.post('/', protect, authorize('user'), async (req, res) => {
  const { ticketId, quantity } = req.body;
  try {
    const ticket = await Ticket.findById(ticketId);
    if (!ticket || ticket.status !== 'approved' || ticket.isFraudTicket) return res.status(404).json({ message: 'Ticket not available' });
    if (ticket.departureDate <= new Date()) return res.status(400).json({ message: 'Cannot book past departure' });
    if (quantity > ticket.quantity) return res.status(400).json({ message: 'Quantity exceeds availability' });
    const totalPrice = ticket.price * quantity;
    const booking = await Booking.create({ user: req.user._id, ticket: ticket._id, quantity, totalPrice });
    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/my', protect, authorize('user'), async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id }).populate('ticket');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/transactions', protect, authorize('user'), async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id, status: 'paid' }).populate('ticket');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/requests', protect, authorize('vendor'), async (req, res) => {
  try {
    const bookings = await Booking.find().populate({ path: 'ticket', match: { vendor: req.user._id } }).populate('user', 'name email');
    res.json(bookings.filter((b) => b.ticket));
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/:id/pay', protect, authorize('user'), async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('ticket');
    if (!booking || booking.user.toString() !== req.user._id.toString()) return res.status(404).json({ message: 'Booking not found' });
    if (booking.status !== 'accepted') return res.status(400).json({ message: 'Booking must be accepted before payment' });
    if (new Date(booking.ticket.departureDate) <= new Date()) return res.status(400).json({ message: 'Cannot pay for expired departure' });
    booking.status = 'paid';
    await booking.save();
    booking.ticket.quantity = Math.max(0, booking.ticket.quantity - booking.quantity);
    await booking.ticket.save();
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/:id/status', protect, authorize('vendor'), async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findById(req.params.id).populate('ticket');
    if (!booking || booking.ticket.vendor.toString() !== req.user._id.toString()) return res.status(404).json({ message: 'Booking not found' });
    if (!['accepted', 'rejected'].includes(status)) return res.status(400).json({ message: 'Invalid status' });
    booking.status = status;
    await booking.save();
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
