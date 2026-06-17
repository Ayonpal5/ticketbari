# TicketBari - MERN Online Ticket Booking Platform

## 📋 Project Overview

A full-stack MERN application for managing online ticket bookings with role-based access control:
- **User**: Browse, book, and manage tickets
- **Vendor**: Create and manage tickets, view bookings
- **Admin**: Approve tickets, manage users, advertise tickets, handle payments

## 🏗️ Technology Stack

### Backend
- **Node.js + Express**: RESTful API server
- **MongoDB + Mongoose**: Database & ODM
- **JWT**: Authentication & authorization
- **Stripe SDK**: Payment processing
- **bcryptjs**: Password hashing
- **Axios**: HTTP requests
- **CORS**: Cross-origin request handling

### Frontend
- **React 18**: UI library
- **Vite**: Build tool & dev server
- **React Router v6**: Client-side routing
- **Stripe React**: Payment UI components
- **Axios**: API client
- **CSS3**: Responsive design & dark/light modes

## 📁 Project Structure

```
ticketbari/
├── server/
│   ├── config/
│   │   └── db.js              # MongoDB connection
│   ├── middlewares/
│   │   └── auth.js            # JWT & role authorization
│   ├── models/
│   │   ├── User.js
│   │   ├── Ticket.js
│   │   ├── Booking.js
│   │   └── Transaction.js
│   ├── routes/
│   │   ├── authRoutes.js      # Register, Login
│   │   ├── ticketRoutes.js    # CRUD, Search, Filter
│   │   ├── bookingRoutes.js   # Create, Accept, Reject
│   │   ├── adminRoutes.js     # Admin management
│   │   ├── paymentRoutes.js   # Stripe checkout/confirm
│   │   └── uploadRoutes.js    # Image upload via imgbb
│   ├── .env                   # Environment variables
│   ├── .env.example           # Template
│   ├── server.js              # Express app setup
│   └── package.json
│
├── client/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Home.jsx       # Landing page
│   │   │   ├── AllTickets.jsx # Browse all tickets
│   │   │   ├── TicketDetails.jsx # Book ticket with modal
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx  # Role-based dashboard
│   │   │   ├── PaymentSuccess.jsx
│   │   │   ├── PaymentCancel.jsx
│   │   │   └── NotFound.jsx
│   │   ├── components/
│   │   │   ├── Navbar.jsx     # Header with theme toggle
│   │   │   ├── Footer.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   ├── TicketCard.jsx # Reusable ticket display
│   │   │   ├── Modal.jsx      # Booking modal
│   │   │   ├── Spinner.jsx
│   │   │   ├── ErrorBoundary.jsx
│   │   │   └── StripeCheckout.jsx
│   │   ├── App.jsx            # Main routing & Stripe wrapper
│   │   ├── main.jsx
│   │   └── styles.css         # Theme, responsive design
│   ├── .env                   # Environment variables
│   ├── .env.example           # Template
│   ├── vite.config.js
│   ├── index.html
│   └── package.json
│
├── .gitignore
├── README.md
└── SETUP.md (this file)
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm 9+
- MongoDB (local or cloud instance - MongoDB Atlas recommended)
- Stripe account for payment keys
- ImgBB account for image uploads

### 1. Backend Setup

```bash
cd server
npm install
```

**Create `.env` file in `server/` directory:**
```env
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/ticketbari?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_2024_ticketbari_development
PORT=5000
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
CLIENT_URL=http://localhost:5173
IMGBB_API_KEY=your_imgbb_api_key_here
NODE_ENV=development
```

**Start Backend:**
```bash
npm start        # Production mode
# or
npm run dev      # Development with nodemon auto-reload
```

✅ Backend runs at `http://localhost:5000`

### 2. Frontend Setup

```bash
cd client
npm install
```

**Create `.env` file in `client/` directory:**
```env
VITE_API_URL=http://localhost:5000/api
VITE_STRIPE_KEY=pk_test_your_public_key_here
```

**Start Frontend (Development):**
```bash
npm run dev      # Dev server with hot reload
```

✅ Frontend runs at `http://localhost:5173`

**Build Frontend (Production):**
```bash
npm run build    # Creates optimized dist/ folder
npm run preview  # Preview production build locally
```

## 🔐 Environment Variables Reference

### Server (.env)
| Variable | Purpose | Example |
|----------|---------|---------|
| `MONGO_URI` | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/db` |
| `JWT_SECRET` | JWT signing secret | `your_secret_key_here` |
| `PORT` | Server port | `5000` |
| `STRIPE_SECRET_KEY` | Stripe secret for payments | `sk_test_...` |
| `CLIENT_URL` | Frontend URL for CORS | `http://localhost:5173` |
| `IMGBB_API_KEY` | Image upload API key | `your_imgbb_key` |
| `NODE_ENV` | Environment | `development` or `production` |

### Client (.env)
| Variable | Purpose | Example |
|----------|---------|---------|
| `VITE_API_URL` | Backend API URL | `http://localhost:5000/api` |
| `VITE_STRIPE_KEY` | Stripe public key | `pk_test_...` |

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login

### Tickets
- `GET /api/tickets` - List all tickets (with search/filter/sort/pagination)
- `GET /api/tickets/:id` - Get ticket details
- `POST /api/tickets` - Create ticket (vendor)
- `PUT /api/tickets/:id` - Update ticket (vendor)
- `DELETE /api/tickets/:id` - Delete ticket (vendor)
- `GET /api/tickets/vendor/my-tickets` - Vendor's tickets
- `GET /api/tickets/advertised/featured` - Featured tickets

### Bookings
- `POST /api/bookings` - Create booking (user)
- `GET /api/bookings/user/my-bookings` - User's bookings
- `GET /api/bookings/vendor/requests` - Vendor booking requests
- `PUT /api/bookings/:id/status` - Accept/Reject booking (vendor)
- `GET /api/bookings/transactions` - Payment transactions

### Admin
- `GET /api/admin/users` - List all users
- `PUT /api/admin/users/:id/role` - Change user role
- `PUT /api/admin/users/:id/fraud` - Mark user as fraud
- `GET /api/admin/tickets/pending` - Pending ticket approvals
- `PUT /api/admin/tickets/:id/approve` - Approve ticket
- `PUT /api/admin/tickets/:id/advertise` - Toggle ticket advertising

### Payments (Stripe)
- `POST /api/payments/checkout-session` - Create Stripe checkout
- `POST /api/payments/confirm-payment` - Confirm payment completion

### Uploads
- `POST /api/upload` - Upload image to ImgBB

## 🔄 User Flows

### 1. User Booking Flow
1. Register/Login as User
2. Browse tickets with search/filter/sort
3. Click ticket → View details & countdown timer
4. Click "Book Now" → Fill booking modal
5. Proceed to Stripe checkout
6. Confirm payment → See payment success page
7. Admin approves booking
8. View confirmed bookings in dashboard

### 2. Vendor Flow
1. Register/Login as User → Ask admin to make Vendor
2. Dashboard → Create new ticket with image
3. View all created tickets
4. Accept/Reject incoming booking requests
5. View transaction history

### 3. Admin Flow
1. Register → Ask existing admin to promote to admin role
2. Dashboard → Manage Users (assign roles, mark fraud)
3. Review pending tickets for approval
4. Toggle ticket advertising for homepage features
5. View platform statistics

## 🎨 Features

### Core Features
✅ User authentication with JWT  
✅ Role-based access control (User/Vendor/Admin)  
✅ Ticket CRUD operations  
✅ Advanced search with filters, sorting, and pagination  
✅ Booking management with accept/reject workflow  
✅ Stripe payment integration  
✅ Admin approval & ticket advertising  

### UI/UX Features
✅ Responsive design (mobile, tablet, desktop)  
✅ Dark/Light mode toggle  
✅ Real-time countdown timer for bookings  
✅ Loading spinners and error handling  
✅ Protected routes with authentication checks  
✅ Image upload for tickets  
✅ Transaction history tracking  

## 🧪 Testing

### Manual API Testing
```bash
# Test backend is running
curl http://localhost:5000/

# Test registration
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@test.com","password":"test123","role":"user"}'

# Test login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@test.com","password":"test123"}'
```

### Frontend Testing
1. Open `http://localhost:5173` in browser
2. Test responsive design (DevTools F12)
3. Toggle dark/light mode
4. Register user account
5. Create ticket (as vendor)
6. Book ticket (as user)
7. Test payment flow with Stripe test keys

## 🐛 Troubleshooting

### MongoDB Connection Error
**Problem**: `querySrv ECONNREFUSED`
**Solution**: 
- Ensure MongoDB Atlas cluster is active
- Check IP whitelist allows your connection
- Verify MONGO_URI is correct
- For local MongoDB: `mongodb://localhost:27017/ticketbari`

### CORS Error
**Problem**: `Access to XMLHttpRequest blocked by CORS`
**Solution**:
- Check `CLIENT_URL` in server `.env` matches frontend URL
- Ensure CORS middleware is enabled in `server.js`

### Stripe Error
**Problem**: `Invalid API Key` or `undefined`
**Solution**:
- Ensure `.env` files exist with proper keys
- Restart frontend dev server after changing `.env`
- Use test keys (start with `sk_test_` and `pk_test_`)

### Build Fails
**Problem**: Vite build error
**Solution**:
- Delete `node_modules` and `dist` folders
- Run `npm install` again
- Check for JSX syntax errors
- Run `npm run build` with verbose output

## 📦 Dependencies

### Backend
```json
{
  "express": "^4.18.2",
  "mongoose": "^7.5.0",
  "jsonwebtoken": "^9.0.2",
  "bcryptjs": "^2.4.3",
  "stripe": "^12.17.0",
  "cors": "^2.8.5",
  "dotenv": "^16.3.1",
  "axios": "^1.5.1"
}
```

### Frontend
```json
{
  "react": "^18.3.1",
  "react-router-dom": "^6.17.0",
  "@stripe/react-stripe-js": "^2.9.0",
  "@stripe/stripe-js": "^4.0.0",
  "axios": "^1.6.2",
  "vite": "^5.4.1"
}
```

## 📝 Notes for Developers

1. **Security**: Never commit `.env` files to git. Use `.env.example` as template.
2. **JWT**: Token stored in localStorage on client. Implement token refresh for production.
3. **Images**: Uploaded to ImgBB (free cloud storage). Replace with AWS S3 for production.
4. **Payments**: Use Stripe test mode for development. Switch to live keys for production.
5. **Database**: Local MongoDB connection string: `mongodb://localhost:27017/ticketbari`

## 🚢 Deployment

### Deploy Backend (Node.js hosting: Render, Railway, Heroku)
1. Set environment variables on platform
2. Ensure MongoDB Atlas cluster is accessible
3. Deploy from GitHub/GitLab

### Deploy Frontend (Static hosting: Vercel, Netlify)
1. Build: `npm run build`
2. Deploy `dist` folder
3. Set environment variables for production API URL
4. Configure domain DNS

## 📞 Support

For issues or questions:
1. Check troubleshooting section above
2. Review API endpoint documentation
3. Check browser console for error details
4. Verify all `.env` variables are set correctly

---

**Last Updated**: June 2026  
**Version**: 1.0.0  
**Status**: ✅ Complete - Ready for Development
