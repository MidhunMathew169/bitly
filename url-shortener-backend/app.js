require("dotenv").config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const path = require('path');
const authRoute = require('./routes/authRoute');
console.log("Auth routes loaded:",authRoute);
const urlRoutes = require('./routes/urlRoutes');
const redirectRoutes = require('./routes/redirect');

const app = express();

//connect DB
connectDB();

//CORS configuration
app.use(
    cors({
        origin: process.env.CLIENT_URL,
        credentials:true,
    })
);

app.use(express.json());
app.use(express.urlencoded({ extended:true }));

//API Routes
app.use("/api/auth",authRoute);
app.use("/api/url",urlRoutes);

//URL redirection route
app.use("/",redirectRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`);
});