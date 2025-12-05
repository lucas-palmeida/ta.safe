const express = require('express');
const router = express.Router();
const { body, query } = require('express-validator');
const RideController = require('../controllers/ride.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.use(authMiddleware);

router.get('/', [
  query('type').optional().isIn(['CAR', 'MOTORCYCLE', 'SHARED_UBER', 'GROUP']),
  query('destination').optional().isString(),
  query('date').optional().isISO8601()
], RideController.listRides);

router.get('/:id', RideController.getRideById);

router.post('/', [
  body('type').isIn(['CAR', 'MOTORCYCLE', 'SHARED_UBER', 'GROUP']).withMessage('Tipo de carona inválido'),
  body('origin').notEmpty().withMessage('Origem é obrigatória'),
  body('destination').notEmpty().withMessage('Destino é obrigatório'),
  body('meetingPoint').notEmpty().withMessage('Ponto de encontro é obrigatório'),
  body('departureTime').isISO8601().withMessage('Data/hora inválida'),
  body('availableSeats').optional().isInt({ min: 1 }).withMessage('Número de vagas deve ser maior que 0'),
  body('description').optional().isString()
], RideController.createRide);

router.put('/:id', [
  body('origin').optional().notEmpty(),
  body('destination').optional().notEmpty(),
  body('meetingPoint').optional().notEmpty(),
  body('departureTime').optional().isISO8601(),
  body('availableSeats').optional().isInt({ min: 1 }),
  body('description').optional().isString(),
  body('status').optional().isIn(['ACTIVE', 'FULL', 'CANCELLED', 'COMPLETED'])
], RideController.updateRide);

router.delete('/:id', RideController.deleteRide);

router.get('/my/offered', RideController.getMyOfferedRides);

module.exports = router;