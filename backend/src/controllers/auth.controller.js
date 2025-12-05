const { validationResult } = require('express-validator');
const AuthService = require('../services/auth.service');

class AuthController {
  async register(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { name, email, password, role, course, photoUrl } = req.body;

      const result = await AuthService.register({
        name,
        email,
        password,
        role,
        course,
        photoUrl
      });

      res.status(201).json({
        message: 'Usuário registrado com sucesso',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  async login(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password } = req.body;

      const result = await AuthService.login(email, password);

      res.status(200).json({
        message: 'Login realizado com sucesso',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AuthController();