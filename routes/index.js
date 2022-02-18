const express = require('express');

const ec = require('../controllers/EntryController');

const router = express.Router();

router.get('/', ec.getDefaultPage);

router.get('/:id', ec.getEntryDetailPage);

router.post('/save', ec.saveEntry);

// router.post('/decrypt',ec.decryptPaste);

router.get('/details/:id', ec.detailsForEntry);

module.exports = router;
