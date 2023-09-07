const express = require('express');
const modoController = require("../Controllers/modoController.js");

const router = express.Router();

router.route('/')
    .post(modoController.createPaymentInt)

module.exports = router;
