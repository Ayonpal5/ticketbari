const express = require('express');
const User = require('../models/userModel');
const Ticket = require('../models/ticketModel');
const { protect, authorize } = require('../middlewares/auth');

const router = express.Router();

router.get('/users', protect, authorize('admin'), async (req, res) => {
  const users = await User.find().select('-password');
  res.json(users);
});

router.put('/users/:id/role', protect, authorize('admin'), async (req, res) => {
  const { role } = req.body;
  if (!['user', 'vendor', 'admin'].includes(role)) return res.status(400).json({ message: 'Invalid role' });
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  user.role = role;
  await user.save();
  res.json(user);
});

router.put('/users/:id/fraud', protect, authorize('admin'), async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user || user.role !== 'vendor') return res.status(404).json({ message: 'Vendor not found' });
  user.isFraud = true;
  await user.save();
  await Ticket.updateMany({ vendor: user._id }, { isFraudTicket: true, advertised: false });
  res.json({ message: 'Vendor marked as fraud' });
});

router.get('/tickets', protect, authorize('admin'), async (req, res) => {
  const tickets = await Ticket.find().populate('vendor', 'name email');
  res.json(tickets);
});

router.put('/tickets/:id/status', protect, authorize('admin'), async (req, res) => {
  const { status } = req.body;
  const ticket = await Ticket.findById(req.params.id);
  if (!ticket) return res.status(404).json({ message: 'Ticket not found' });
  ticket.status = status;
  if (status === 'rejected') ticket.advertised = false;
  await ticket.save();
  res.json(ticket);
});

router.put('/tickets/:id/advertise', protect, authorize('admin'), async (req, res) => {
  const ticket = await Ticket.findById(req.params.id);
  if (!ticket) return res.status(404).json({ message: 'Ticket not found' });
  const count = await Ticket.countDocuments({ advertised: true, status: 'approved', isFraudTicket: false });
  if (!ticket.advertised && count >= 6) return res.status(400).json({ message: 'Cannot advertise more than 6 tickets' });
  ticket.advertised = !ticket.advertised;
  await ticket.save();
  res.json(ticket);
});

module.exports = router;
