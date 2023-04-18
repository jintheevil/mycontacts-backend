const express = require("express");
const cookieParser = require('cookie-parser');
const dotenv = require("dotenv").config();
const app = express();
const dbConnect = require('./config/dbConnection');
const { handleError } = require('./middleware/ErrorHandler');
const port = process.env.DEV_PORT || 5001
app.listen(port, () => {
    console.log(`${process.env.status} running on port ${port}`);
});

// Connects app to database
dbConnect();

// Use JSON and Cookies
app.use(express.json());
app.use(cookieParser());

// API routes
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/contacts", require("./routes/contactRoutes"));

//Error handling middleware
app.use(handleError);
