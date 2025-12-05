const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const RequestController = require('../controllers/request.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.use(authMiddleware);

router.post('/', [
  body('rideId').notEmpty().withMessage('ID da carona é obrigatório'),
  body('message').optional().isString()
], RequestController.createRequest);

router.get('/my', RequestController.getMyRequests);

router.put('/:id/accept', RequestController.acceptRequest);

router.put('/:id/reject', RequestController.rejectRequest);

router.delete('/:id', RequestController.cancelRequest);

module.exports = router;