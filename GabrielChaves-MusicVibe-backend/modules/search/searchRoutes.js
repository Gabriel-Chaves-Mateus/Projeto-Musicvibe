const express = require('express');
const router = express.Router();

const asyncHandler = require('../../middlewares/asyncHandler');
const searchController = require('./searchController');

// Busca global. Rota pública.
router.get('/search', asyncHandler(searchController.search));

module.exports = router;
