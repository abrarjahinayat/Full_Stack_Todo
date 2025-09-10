const express = require('express'); 
const { default: mongoose } = require('mongoose');
const app = express();
require('dotenv').config();

mongoose.connect(process.env.DATABASE_URL)
    .then(() => console.log('Connected to the database'))
    .catch(err => console.error('Database connection error:', err));


app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});


// routes start here

app.post('/addtodo', (req, res) => {
    res.status(201).json({ success: true, message: 'Todo added successfully' });
});

app.get('/gettodos', (req, res) => {
    res.status(200).json({ success: true, todos: [] });
});