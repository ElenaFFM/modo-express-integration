const express = require("express");
const modoRouter = require('./Routes/modoRoutes');

const app = express();

// console.log(process.env);

app.use(express.json());

app.use('/api/modo-checkout', modoRouter)

// app.all('*', (req, res, next) => {
//     // res.status(404).json({
//     //     status: 'fail',
//     //     message: `Can't find ${req.originalUrl} on the server!`
//     // });
//     // const err = new Error(`Can't find ${req.originalUrl} on the server!`);
//     // err.status = 'fail';
//     // err.statusCode = 404;
//     const err = new CustomError(`Can't find ${req.originalUrl} on the server!`, 404);
//     next(err);
// });
module.exports = app