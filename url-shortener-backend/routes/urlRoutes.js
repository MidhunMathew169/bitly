const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { createShortUrl, getUserUrls, deleteUrl } = require('../controllers/urlController');

router.post('/shorten',auth,createShortUrl);
router.get('/user',auth,getUserUrls);
router.get('/my-urls', auth,getUserUrls);
router.delete('/delete/:id',auth,deleteUrl);

module.exports = router;