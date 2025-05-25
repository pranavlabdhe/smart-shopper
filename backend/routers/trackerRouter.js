// routers/trackerRouter.js
const express = require('express');
const { addTrackedProduct } = require('../controller/trackerController');

const router = express.Router();

router.post('/track', addTrackedProduct);

module.exports = router;
