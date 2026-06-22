import 'dotenv/config';
import connectDB from '../lib/db';
import { User } from '../lib/models';
import bcrypt from 'bcryptjs';

async function seedAdmin() {
  try {
    await connectDB();
    console.log('Connected to database...');

    const email = 'devsingh98011@gmail.com';
    const password = 'admin123';
    const hashedPassword = await bcrypt.hash(password, 10);

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('Admin user already exists. Updating password and verifying...');
      existingUser.password = hashedPassword;
      existingUser.name = 'Educazione Admin';
      existingUser.isVerified = true;
      await existingUser.save();
      console.log('Admin user updated successfully.');
    } else {
      console.log('Creating new admin user...');
      const adminUser = new User({
        email,
        password: hashedPassword,
        name: 'Educazione Admin',
        isVerified: true,
      });
      await adminUser.save();
      console.log('Admin user created successfully.');
    }

    console.log(`\n--------------------------------------------`);
    console.log(`Admin Login Credentials:`);
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);
    console.log(`--------------------------------------------\n`);

    process.exit(0);
  } catch (err) {
    console.error('❌ Error seeding admin:', err);
    process.exit(1);
  }
}

seedAdmin();
