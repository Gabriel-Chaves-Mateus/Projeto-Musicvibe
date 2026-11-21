const express = require('express');
const router = express.Router();

const { isAuthenticated } = require('../../middlewares/auth');
const asyncHandler = require('../../middlewares/asyncHandler');
const { reportValidator } = require('./reportValidator');
const reportController = require('./reportController');

router.post(
  '/songs/:songId/report',
  isAuthenticated,
  reportValidator,
  asyncHandler(reportController.reportSong)
);

module.exports = router;
