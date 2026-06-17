const express = require('express');
const Ticket = require('../models/ticketModel');
const { protect, authorize } = require('../middlewares/auth');

const router = express.Router();

router.post('/', protect, authorize('vendor'), async (req, res) => {
  try {
    const ticket = await Ticket.create({ ...req.body, vendor: req.user._id });
    res.status(201).json(ticket);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/', async (req, res) => {
  const { page = 1, limit = 8, search, transport, sort } = req.query;
  const query = { status: 'approved', isFraudTicket: false };
  if (search) {
    const words = search.split(' ').filter(Boolean);
    query.$or = [{ from: { $regex: search, $options: 'i' } }, { to: { $regex: search, $options: 'i' } }];
  }
  if (transport) query.transportType = transport;
  const sortOption = sort === 'high' ? { price: -1 } : sort === 'low' ? { price: 1 } : { createdAt: -1 };

  try {
    const tickets = await Ticket.find(query)
      .sort(sortOption)
      .skip((page - 1) * limit)
      .limit(parseInt(limit, 10));
    const total = await Ticket.countDocuments(query);
    res.json({ tickets, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/advertised', async (req, res) => {
  try {
    const tickets = await Ticket.find({ status: 'approved', advertised: true, isFraudTicket: false }).limit(6).sort({ updatedAt: -1 });
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/vendor', protect, authorize('vendor'), async (req, res) => {
  try {
    const tickets = await Ticket.find({ vendor: req.user._id }).sort({ createdAt: -1 });
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/:id', protect, async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id).populate('vendor', 'name email avatar');
    if (!ticket) return res.status(404).json({ message: 'Ticket not found' });
    res.json(ticket);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/:id', protect, authorize('vendor'), async (req, res) => {
  try {
    const ticket = await Ticket.findOne({ _id: req.params.id, vendor: req.user._id });
    if (!ticket) return res.status(404).json({ message: 'Ticket not found' });
    if (ticket.status === 'rejected') return res.status(400).json({ message: 'Cannot update rejected ticket' });
    Object.assign(ticket, req.body);
    await ticket.save();
    res.json(ticket);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/:id', protect, authorize('vendor'), async (req, res) => {
  try {
    const ticket = await Ticket.findOneAndDelete({ _id: req.params.id, vendor: req.user._id });
    if (!ticket) return res.status(404).json({ message: 'Ticket not found' });
    res.json({ message: 'Ticket deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
