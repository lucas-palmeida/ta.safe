const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const AuthController = require('../controllers/auth.controller');

router.post('/register', [
  body('name').notEmpty().withMessage('Nome é obrigatório'),
  body('email')
    .isEmail().withMessage('Email inválido')
    .custom((value) => {
      const domain = value.split('@')[1];
      if (domain !== process.env.ALLOWED_EMAIL_DOMAIN) {
        throw new Error(`Email deve ser do domínio ${process.env.ALLOWED_EMAIL_DOMAIN}`);
      }
      return true;
    }),
  body('password')
    .isLength({ min: 6 }).withMessage('Senha deve ter no mínimo 6 caracteres'),
  body('role').optional().isIn(['STUDENT', 'STAFF']).withMessage('Role inválido'),
  body('course').optional().isString()
], AuthController.register);

router.post('/login', [
  body('email').isEmail().withMessage('Email inválido'),
  body('password').notEmpty().withMessage('Senha é obrigatória')
], AuthController.login);

module.exports = router;