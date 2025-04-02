const mongoose = require("mongoose");
const User = require("./models/User");
const Book = require("./models/Book");
const bcrypt = require("bcrypt");
require("dotenv").config();

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");

    // Clear existing data
    await User.deleteMany();
    await Book.deleteMany();
    console.log("Cleared old data");

    // Hash password for users
    const hashedPassword = await bcrypt.hash("password123", 10);

    // Create admin user
    const adminUser = await User.create({
      name: "Admin",
      email: "admin@example.com",
      password: hashedPassword,
      isAdmin: true,
    });

    // Create sample users
    const users = await User.insertMany([
      { name: "John Doe", email: "john@example.com", password: hashedPassword, isAdmin: false },
      { name: "Jane Doe", email: "jane@example.com", password: hashedPassword, isAdmin: false },
    ]);

    // Create sample books
    const books = await Book.insertMany([
      { name: "The Great Gatsby", rent: 10, count: 5, cover: "/uploads/gatesby.jpg" },
      { name: "To Kill a Mockingbird", rent: 12, count: 3, cover: "/uploads/mockingbird.jpg" },
      { name: "1984", rent: 15, count: 4, cover: "/uploads/1984.jpg" },
    ]);

    console.log("Database seeded successfully");
    process.exit();
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};

seedDatabase();