const express = require('express');
const router = express.Router();
const { redirectToUrl } = require('../controllers/urlController');

router.get('/:shortId',redirectToUrl);

module.exports = router;