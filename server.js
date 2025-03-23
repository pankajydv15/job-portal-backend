const express = require('express')
const app = express()
const PORT = process.env.PORT || 5000;
require('dotenv').config();
const bodyParser= require("body-parser")
const cors = require('cors');
const mongoose = require('mongoose');
const authRoutes = require("./routes/authRoutes")
// const jobseekerProfileRoutes = require('./routes/jobseekerProfileRoutes');  


const corsOptions = {
  origin: ['http://localhost:5173'], // Your frontend URL
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Allowed HTTP methods
  credentials: true, // Allow credentials (cookies, authorization headers, etc.)
};

app.use(cors(corsOptions));
app.use(bodyParser.json())

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection failed:", err));

app.get('/', (req, res) => {
  res.send('Hello form backend')
})

app.use("/api/auth",authRoutes)
app.use("/api/users", require("./routes/authRoutes"));

// app.use('/api/jobseeker', jobseekerProfileRoutes);


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));