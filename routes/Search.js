const express = require('express');
const router = express.Router();
const { validateToken } = require('../middlewares/AuthMiddleware');
const { newSearch, deleteSearch, result, topResult } = require('../controllers/Search');

router.get('/top', validateToken, topResult);

router.get('/', validateToken, result);

router.post('/', validateToken, newSearch);

router.delete('/:id', validateToken, deleteSearch);

module.exports = router;