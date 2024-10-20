const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const ruleRoutes = require('./routes/ruleRoutes.js');
const cors = require('cors');


const app = express();
const PORT = 3000 || 3001;

app.use(cors())
// Middleware
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb+srv://shivam13202:Q9VwaCz7h6b35nVL@cluster0.lxdjy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0').then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('Failed to connect to MongoDB', err));

// Routes
app.use('/api', ruleRoutes);

// Root Route
app.get('/', (req, res) => {
    res.send('Welcome to the Rule Engine API');
});


// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
