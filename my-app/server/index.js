const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

// Debug environment variables
console.log('Environment variables loaded:', {
  MONGODB_URI: process.env.MONGODB_URI ? 'Set' : 'Not set',
  JWT_SECRET: process.env.JWT_SECRET ? 'Set' : 'Not set'
});

const app = express();
const PORT = process.env.PORT || 5000;
const DATA_FILE = path.join(__dirname, 'data', 'services.json');

let ServiceModel = null; // populated if MongoDB is connected
const useMongo = !!process.env.MONGODB_URI;

app.use(cors());
app.use(express.json());

// Test endpoint (no auth required)
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Import auth routes
const authRoutes = require('./routes/auth');
// Use auth routes
app.use('/api/auth', authRoutes);
// Import admin routes (admin-only APIs)
const adminRoutes = require('./routes/admin');
// Use admin routes
app.use('/api/admin', adminRoutes);

if (useMongo) {
  // lazy require to avoid crash if mongoose not installed
  try {
    const { connect } = require('./db');
    connect(process.env.MONGODB_URI)
      .then(() => {
        console.log('MongoDB connected successfully');
        ServiceModel = require('./models/Service');
        // Initialize User model after successful connection
        require('./models/User');
        console.log('Models initialized successfully');
        
        // Start server after database connection
        const server = app.listen(PORT, () => {
          console.log(`API server listening on http://localhost:${PORT}`);
        });
        
        server.on('error', (err) => {
          console.error('Server error:', err);
          process.exit(1);
        });
        
        // Handle unhandled rejections and exceptions
        process.on('unhandledRejection', (reason, promise) => {
          console.error('Unhandled Rejection at:', promise, 'reason:', reason);
        });
        
        process.on('uncaughtException', (err) => {
          console.error('Uncaught Exception:', err);
          process.exit(1);
        });
      })
      .catch(err => {
        console.error('Failed to connect to MongoDB:', err.message || err);
        process.exit(1); // Exit if MongoDB connection fails
      });
  } catch (err) {
    console.error('MongoDB initialization error:', err);
    process.exit(1); // Exit if MongoDB initialization fails
  }
} else {
  console.error('No MONGODB_URI found in environment variables');
  process.exit(1); // Exit if no MongoDB URI is provided
}

function readData() {
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    return [];
  }
}

function writeData(arr) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(arr, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error('Failed to write data', err);
    return false;
  }
}

app.get('/api/services', async (req, res) => {
  if (ServiceModel) {
    const docs = await ServiceModel.find().sort({ createdAt: -1 }).lean();
    return res.json(docs);
  }
  const data = readData();
  res.json(data);
});

app.get('/api/services/:id', async (req, res) => {
  const id = String(req.params.id);
  if (ServiceModel) {
    const s = await ServiceModel.findOne({ id }).lean();
    if (!s) return res.status(404).json({ error: 'Not found' });
    return res.json(s);
  }

  const data = readData();
  const s = data.find(x => String(x.id) === id);
  if (!s) return res.status(404).json({ error: 'Not found' });
  res.json(s);
});

app.post('/api/services', async (req, res) => {
  const payload = req.body || {};
  const id = String(Date.now() + Math.floor(Math.random() * 1000));
  const newService = {
    id,
    servicename: payload.servicename || 'New Service',
    description: payload.description || '',
    city: payload.city || '',
    cuisinetype: payload.cuisinetype || 'Mixed',
    rating: payload.rating || 4.0,
    pricing: payload.pricing || (payload.monthlyprice ? { monthly: Number(payload.monthlyprice), yearly: Number(payload.yearlyprice || 0) } : { monthly: 0, yearly: 0 }),
    deliveryTimes: payload.deliveryTimes || { morning: '', lunch: '', dinner: '' },
    menu: payload.menu || { morning: [], lunch: [], dinner: [] },
    contact: payload.contact || { phone: '', email: '' },
    createdAt: new Date()
  };

  if (ServiceModel) {
    try {
      const doc = await ServiceModel.create(newService);
      return res.status(201).json(doc);
    } catch (err) {
      console.error('DB save error', err);
      return res.status(500).json({ error: 'Could not save to DB' });
    }
  }

  const data = readData();
  data.unshift(newService);
  if (!writeData(data)) return res.status(500).json({ error: 'Could not save' });
  res.status(201).json(newService);
});
