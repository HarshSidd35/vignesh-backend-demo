const express = require("express");
const mongoose = require("mongoose");
const Book = require("../models/Book");
const User = require("../models/User");
const multer = require("multer");
const path = require("path");

// Multer setup for image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

// Create a new book
exports.createBook = async (req, res) => {
  try {
    const { name, rent, count } = req.body;
    const cover = req.file ? req.file.path : null;
    
    if (!cover) {
      return res.status(400).json({ message: "Cover image is required" });
    }
    
    const book = new Book({ name, rent, count, cover });
    await book.save();
    res.status(201).json(book);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all books
exports.getAllBooks = async (req, res) => {
  try {
    const { page = 1, limit = 10, name, available, minRent, maxRent } = req.query;
    let filter = {};
    
    if (name) {
      filter.name = { $regex: name, $options: "i" };
    }
    if (available) {
      filter.inStock = available === "true";
    }
    if (minRent || maxRent) {
      filter.rent = {};
      if (minRent) filter.rent.$gte = parseFloat(minRent);
      if (maxRent) filter.rent.$lte = parseFloat(maxRent);
    }
    
    const books = await Book.find(filter)
      .populate("lastUsers.user")
      .populate("personHaveThatBook")
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Get a book by ID
exports.getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id).populate("lastUsers.user").populate("personHaveThatBook");
    if (!book) return res.status(404).json({ message: "Book not found" });
    res.json(book);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a book
exports.updateBook = async (req, res) => {
  try {
    const { name, rent, count } = req.body;
    let updateData = { name, rent, count };
    
    if (req.file) {
      updateData.cover = req.file.path;
    }
    
    const book = await Book.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!book) return res.status(404).json({ message: "Book not found" });
    
    res.json(book);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a book
exports.deleteBook = async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) return res.status(404).json({ message: "Book not found" });
    res.json({ message: "Book deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Rent a book
exports.addLastUser = async (req, res) => {
  try {
    const { userId, fromDate, toDate } = req.body;
    const book = await Book.findById(req.params.id);
    const user = await User.findById(userId);
    console.log(userId, fromDate, toDate)

    if (!book) return res.status(404).json({ message: "Book not found" });
    if (!user) return res.status(404).json({ message: "User not found" });
    if (!book.inStock) return res.status(400).json({ message: "Book is already rented" });
    if (user.rentedBooks.length > 0) return res.status(400).json({ message: "User can only rent one book at a time" });

    book.lastUsers.push({ user: userId, fromDate, toDate });
    book.personHaveThatBook = userId;
    book.inStock = false;
    await book.save();

    user.rentedBooks.push(book._id);
    await user.save();

    res.json(book);
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: error.message });
  }
};

// Return a book
exports.returnBook = async (req, res) => {
  try {
    const { userId } = req.body;
    const book = await Book.findById(req.params.id);
    const user = await User.findById(userId);
    
    if (!book) return res.status(404).json({ message: "Book not found" });
    if (!user) return res.status(404).json({ message: "User not found" });
    if (book.personHaveThatBook.toString() !== userId) return res.status(400).json({ message: "User does not have this book" });

    book.personHaveThatBook = null;
    book.inStock = true;
    await book.save();

    user.rentedBooks = user.rentedBooks.filter(id => id.toString() !== book._id.toString());
    await user.save();

    res.json(book);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
