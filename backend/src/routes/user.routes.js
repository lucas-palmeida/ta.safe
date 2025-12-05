const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const UserController = require('../controllers/user.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.use(authMiddleware);

router.get('/profile', UserController.getProfile);

router.put('/profile', [
  body('name').optional().notEmpty().withMessage('Nome não pode ser vazio'),
  body('course').optional().isString(),
  body('photoUrl').optional().isURL().withMessage('URL da foto inválida')
], UserController.updateProfile);

router.get('/:id', UserController.getUserById);

module.exports = router;