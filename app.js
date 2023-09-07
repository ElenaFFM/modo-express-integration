const express = require("express");
const modoRouter = require('./Routes/modoRoutes');

let app = express();

app.use(express.json());

app.use('/api/modo-checkout', modoRouter)

app.all('*', (req, res) => {
    res.status(404).json({
        status: 'fail',
        message: `Can't find ${req.originalUrl} on the server!`
    });
});

module.exports = app