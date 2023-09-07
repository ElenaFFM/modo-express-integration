const express = require('express');
const modoController = require("");

const router = express.Router();

router.route('/api/modo-checkout').post(modoController)

module.exports = router;