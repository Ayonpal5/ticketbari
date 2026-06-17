const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Booking = require('../models/bookingModel');
const Ticket = require('../models/ticketModel');
const { protect, authorize } = require('../middlewares/auth');

const router = express.Router();

router.post('/checkout', protect, authorize('user'), async (req, res) => {
  const { bookingId } = req.body;
  try {
    const booking = await Booking.findById(bookingId).populate('ticket');
    if (!booking || booking.user.toString() !== req.user._id.toString()) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    if (booking.status !== 'accepted') {
      return res.status(400).json({ message: 'Booking is not accepted' });
    }
    if (new Date(booking.ticket.departureDate) <= new Date()) {
      return res.status(400).json({ message: 'Departure has already passed' });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: { name: booking.ticket.title },
            unit_amount: Math.round(booking.ticket.price * 100),
          },
          quantity: booking.quantity,
        },
      ],
      customer_email: req.user.email,
      client_reference_id: bookingId,
      success_url: `${process.env.CLIENT_URL}/payment-success?bookingId=${bookingId}`,
      cancel_url: `${process.env.CLIENT_URL}/payment-cancel`,
    });

    res.json({ sessionId: session.id });
  } catch (error) {
    res.status(500).json({ message: 'Payment initialization failed' });
  }
});

router.post('/confirm', protect, authorize('user'), async (req, res) => {
  const { bookingId } = req.body;
  try {
    const booking = await Booking.findById(bookingId).populate('ticket');
    if (!booking || booking.user.toString() !== req.user._id.toString()) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    if (booking.status !== 'accepted') {
      return res.status(400).json({ message: 'Booking not accepted yet' });
    }
    booking.status = 'paid';
    await booking.save();
    booking.ticket.quantity = Math.max(0, booking.ticket.quantity - booking.quantity);
    await booking.ticket.save();
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Payment confirmation failed' });
  }
});

module.exports = router;
