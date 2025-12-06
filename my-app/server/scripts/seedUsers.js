require('dotenv').config({ path: require('path').join(__dirname, '..', '..', '.env') });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error('MONGODB_URI not set in .env');
  process.exit(1);
}

async function main() {
  try {
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    const User = require('../models/User');

    // Sample users to seed
    const usersToCreate = [
      { username: 'john_doe', email: 'john@example.com', password: 'Pass123456!', role: 'user' },
      { username: 'jane_smith', email: 'jane@example.com', password: 'Pass123456!', role: 'user' },
      { username: 'mike_wilson', email: 'mike@example.com', password: 'Pass123456!', role: 'user' },
      { username: 'sarah_johnson', email: 'sarah@example.com', password: 'Pass123456!', role: 'user' },
      { username: 'admin_chef', email: 'chef@e-cuisine.example', password: 'ChefPass123!', role: 'admin' },
      { username: 'support_admin', email: 'support@e-cuisine.example', password: 'SupportPass123!', role: 'admin' }
    ];

    const salt = await bcrypt.genSalt(10);
    const createdUsers = [];

    for (const userData of usersToCreate) {
      // Check if user already exists
      const existing = await User.findOne({ $or: [{ email: userData.email }, { username: userData.username }] });
      if (existing) {
        console.log(`⊘ User already exists: ${userData.email}`);
        continue;
      }

      // Hash password and create user
      const hashedPassword = await bcrypt.hash(userData.password, salt);
      const user = new User({
        username: userData.username,
        email: userData.email,
        password: hashedPassword,
        role: userData.role
      });

      await user.save();
      createdUsers.push({ ...userData, password: '***' });
      console.log(`✓ Created: ${userData.username} (${userData.email}) [${userData.role}]`);
    }

    console.log(`\n✓ ${createdUsers.length} new users added`);
    
    // Show all users now
    const allUsers = await User.find().select('-password').lean();
    console.log(`\nTotal users in database: ${allUsers.length}`);
    allUsers.forEach((u, i) => {
      console.log(`${i + 1}. ${u.username} <${u.email}> [${u.role}]`);
    });

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Error seeding users:', err.message || err);
    process.exit(1);
  }
}

main();
