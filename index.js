const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;




// middleware
app.use(express.json());





app.get('/', (req, res) => {
    res.send('FazTudo server is working!')
});


app.listen(port, () => {
    console.log(`FazTudo server is doing work on PORT: ${port}`)
});