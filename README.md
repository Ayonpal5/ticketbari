# TicketBari - Online Ticket Booking Platform

TicketBari is a MERN stack ticket booking platform for bus, train, launch, and flight tickets. Users can register, browse approved routes, book tickets, and manage their dashboard. Vendors can add tickets and approve booking requests. Admins manage tickets, users, and homepage advertisements.

## Key Features

- Role-based authentication: User, Vendor, Admin
- JWT-protected API routes
- Ticket discovery: search, filter, sort, pagination
- Ticket details and protected booking flow
- Vendor ticket management and booking approvals
- Admin ticket moderation and homepage advertisement
- Dark / Light mode toggle
- Responsive layout with fixed header and footer

## Technologies

- Frontend: React, Vite, React Router, Axios
- Backend: Node.js, Express, MongoDB, Mongoose
- Authentication: JWT
- Payment: Stripe integration scaffolded

## Setup

1. Copy `server/.env.example` to `server/.env` and fill values.
2. Copy `client/.env.example` to `client/.env` and fill values.
3. Install server dependencies:
   - `cd server && npm install`
4. Install client dependencies:
   - `cd client && npm install`
5. Run backend:
   - `cd server && npm run dev`
6. Run frontend:
   - `cd client && npm run dev`

## Environment Variables

### server/.env
- `MONGO_URI`
- `JWT_SECRET`
- `STRIPE_SECRET_KEY`
- `PORT`

### client/.env
- `VITE_API_URL`
- `VITE_STRIPE_KEY`

## Notes

This project is designed to be extended with production deployment and full Stripe payment setup.
