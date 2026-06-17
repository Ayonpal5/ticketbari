# Quick Start Guide

## 🎯 Start the Project (First Time)

### Terminal 1: Backend
```bash
cd server
npm install
npm start
```

### Terminal 2: Frontend  
```bash
cd client
npm install
npm run dev
```

### Open in Browser
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

---

## 🏃 Fast Startup (After First Installation)

### Terminal 1: Backend
```bash
cd server
npm start
```

### Terminal 2: Frontend
```bash
cd client
npm run dev
```

---

## 📋 Default Test Credentials

Use these to test after creating accounts:

```
Email: test@ticketbari.com
Password: Test@123
Role: Can be User, Vendor, or Admin
```

---

## 🧪 Test User Roles

1. **User Role** (Browse & Book Tickets)
   - Can view all tickets
   - Can book tickets
   - Can see booking history

2. **Vendor Role** (Create & Manage Tickets)
   - Can create tickets with images
   - Can view booking requests
   - Can accept/reject bookings
   - Can see transaction history

3. **Admin Role** (Manage Platform)
   - Can approve/reject tickets
   - Can assign user roles
   - Can mark vendors as fraud
   - Can advertise tickets on homepage

---

## 🔄 Common Development Tasks

### Restart Backend
```bash
cd server && npm start
```

### Restart Frontend  
```bash
cd client && npm run dev
```

### Build Frontend for Production
```bash
cd client && npm run build
```

### Check Backend API Health
```bash
curl http://localhost:5000/
# Should return: "TicketBari API running"
```

### Clear Frontend Cache
```bash
cd client && rm -rf dist node_modules && npm install
```

### View Backend Logs
```bash
# Check terminal where backend is running
```

---

## 🎨 Dark/Light Mode
- Click the theme toggle button in top-right of navbar
- Theme preference is saved in localStorage

---

## 🔑 Environment Files Needed

### `server/.env`
```env
MONGO_URI=mongodb://localhost:27017/ticketbari
JWT_SECRET=your_jwt_secret
PORT=5000
STRIPE_SECRET_KEY=sk_test_xxxxx
CLIENT_URL=http://localhost:5173
IMGBB_API_KEY=your_imgbb_key
NODE_ENV=development
```

### `client/.env`
```env
VITE_API_URL=http://localhost:5000/api
VITE_STRIPE_KEY=pk_test_xxxxx
```

---

## ✅ Verification Checklist

- [ ] Both `.env` files created with credentials
- [ ] MongoDB connection working (check server console)
- [ ] Backend server running on port 5000
- [ ] Frontend running on port 5173
- [ ] Can access http://localhost:5173 in browser
- [ ] Navbar appears with theme toggle
- [ ] Can register new account
- [ ] Can login with credentials
- [ ] Can browse tickets on home page

---

## 🐛 Quick Troubleshooting

| Issue | Solution |
|-------|----------|
| Port 5000 already in use | Kill process: `lsof -i :5000` then `kill -9 <PID>` |
| Port 5173 already in use | Kill process: `lsof -i :5173` then `kill -9 <PID>` |
| `MONGO_URI undefined` | Create `.env` file in server folder |
| `STRIPE_KEY undefined` | Create `.env` file in client folder |
| API returns 404 | Check backend is running on correct port |
| Blank page in browser | Check browser console for errors (F12) |
| Build fails | Delete `node_modules` and `.env`, run `npm install` again |

---

## 📊 Project Files Overview

| File | Purpose |
|------|---------|
| `server/server.js` | Backend entry point |
| `server/routes/` | API endpoint definitions |
| `server/middlewares/auth.js` | JWT & role verification |
| `client/src/App.jsx` | Frontend routing setup |
| `client/src/pages/Dashboard.jsx` | Role-based dashboard |
| `client/src/styles.css` | All styling & theming |

---

## 🎯 Next Steps

1. Set up `.env` files with your credentials
2. Start both backend and frontend servers
3. Create a test account and explore features
4. Review API endpoints in `SETUP.md`
5. Test the booking flow end-to-end

**Happy coding! 🚀**
