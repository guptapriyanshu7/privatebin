const express = require('express');

const controller = require('../controllers/EntryController');

const router = express.Router();

router.get('/', controller.getDefaultPage);

router.get('/my-snippets', controller.getMySnippets);

router.get('/details/:id', controller.detailsForEntry);

router.get('/:id', controller.getEntryDetailPage);

router.post('/save', controller.saveEntry);

router.post('/decrypt', controller.decrypt);

router.delete('/delete/:id', controller.deleteEntry);

module.exports = router;
