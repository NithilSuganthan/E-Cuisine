require('dotenv').config({ path: require('path').join(__dirname, '..', '..', '.env') });
const mongoose = require('mongoose');

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error('MONGODB_URI not set in .env');
  process.exit(1);
}

async function main() {
  try {
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    const User = require('../models/User');
    const users = await User.find().select('-password').lean();
    console.log(`Found ${users.length} users:`);
    users.forEach(u => console.log(`- ${u.username} <${u.email}> [${u.role}] (id: ${u._id})`));
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Error listing users:', err.message || err);
    process.exit(1);
  }
}

main();
