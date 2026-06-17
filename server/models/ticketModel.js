const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    from: { type: String, required: true },
    to: { type: String, required: true },
    transportType: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    departureDate: { type: Date, required: true },
    perks: [{ type: String }],
    image: { type: String },
    vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    advertised: { type: Boolean, default: false },
    isFraudTicket: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Ticket', ticketSchema);
