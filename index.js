const express = require('express')
const bodyParser = require("body-parser");
const multer = require("multer");
const path = require("path");
const bookRoutes = require("./router/bookRouter");
const authRoutes = require("./router/authRouter");
const userRouter = require("./router/userRouter");
require('dotenv').config()

const port = process.env.PORT || 5050

const app = express()


const mongoose = require("mongoose");

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Database Connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB connected"))
.catch(err => console.error("MongoDB connection error:", err));

// Routes
app.use("/api/books", bookRoutes);
app.use("/api/auth",authRoutes);
app.use("/api/user",userRouter);

app.listen(port,()=>{
    console.log(`port is listning in http://localhost:${port}`)
})