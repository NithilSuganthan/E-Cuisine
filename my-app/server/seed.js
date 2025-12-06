require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { connect } = require('./db');
const Service = require('./models/Service');

const DATA_FILE = path.join(__dirname, 'data', 'services.json');

async function seed() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('Please set MONGODB_URI in .env before running seed');
    process.exit(1);
  }

  await connect(uri);

  const raw = fs.readFileSync(DATA_FILE, 'utf8');
  const items = JSON.parse(raw || '[]');

  if (!Array.isArray(items) || items.length === 0) {
    console.log('No items to seed');
    process.exit(0);
  }

  // Check if collection already has data
  const existing = await Service.countDocuments();
  if (existing > 0) {
    console.log('Collection not empty; skipping seed');
    process.exit(0);
  }

  // Insert items (ensure id uniqueness)
  const docs = items.map(i => ({ ...i }));
  await Service.insertMany(docs);
  console.log(`Seeded ${docs.length} services`);
  process.exit(0);
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});