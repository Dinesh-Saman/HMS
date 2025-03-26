const express = require('express')
const app = express()
const http = require('http')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const cors = require('cors')
const dotenv = require('dotenv')
const morgan = require('morgan')

const server = http.createServer(app)

// API configuration
// Remove the express.json() and express.urlencoded() or set their limits
app.use(express.json({ limit: '30mb', extended: true }))
app.use(express.urlencoded({ limit: '30mb', extended: true }))
app.use(morgan("common"))
dotenv.config()

// CORS configuration
const corsOptions = {
    origin: 'http://localhost:3000', 
    credentials: true,
    optionSuccessStatus: 200
}
app.use(cors(corsOptions));

// Additional CORS headers (you might not need these with proper corsOptions)
app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

// Routes
const memberRoutes = require('./routes/member')
app.use('/member-management', memberRoutes)

const groceryItemsRoutes = require('./routes/GroceryItem')
app.use('/grocery-item-management', groceryItemsRoutes)

const HomeInventory = require('./routes/HomeInventory')
app.use('/inventory', HomeInventory)

// MongoDB setup
const PORT = process.env.PORT || 5000 // Add fallback port
mongoose.set('strictQuery', true)
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        server.listen(PORT, () => {
            console.log(`SMART HOME api server running on port ${PORT}`)
        })
    })
    .catch((err) => {
        console.error('MongoDB connection error:', err)
    })