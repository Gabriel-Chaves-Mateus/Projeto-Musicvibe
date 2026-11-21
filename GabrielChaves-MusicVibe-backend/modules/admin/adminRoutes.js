const express = require('express');
const router = express.Router();

const { isAuthenticated, isAdmin } = require('../../middlewares/auth');
const asyncHandler = require('../../middlewares/asyncHandler');
const { reportsFilterValidator, blockUserValidator } = require('./adminValidator');
const adminController = require('./adminController');

// A ÚNICA guarda do painel: tudo que for registrado abaixo, em /admin/*, passa por
// isAuthenticated e depois isAdmin (a ordem importa: o isAdmin lê o req.user que o
// isAuthenticated monta). Inclusive /admin/rota-inexistente: 401/403, nunca 404 vazio.
router.use('/admin', isAuthenticated, isAdmin);

router.get('/admin/dashboard', asyncHandler(adminController.getDashboard));

router.get('/admin/reports', reportsFilterValidator, asyncHandler(adminController.getReports));
router.patch('/admin/reports/:id/review', asyncHandler(adminController.reviewReport));

router.get('/admin/users', asyncHandler(adminController.getUsers));
router.patch('/admin/users/:id/block', blockUserValidator, asyncHandler(adminController.setUserBlocked));

router.get('/admin/songs', asyncHandler(adminController.getSongs));
router.delete('/admin/songs/:id', asyncHandler(adminController.deleteSong));

module.exports = router;
