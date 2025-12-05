const { validationResult } = require('express-validator');
const UserService = require('../services/user.service');

class UserController {
  async getProfile(req, res, next) {
    try {
      const userId = req.userId;
      const user = await UserService.getUserById(userId);

      res.status(200).json({
        data: user
      });
    } catch (error) {
      next(error);
    }
  }

  async updateProfile(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const userId = req.userId;
      const { name, course, photoUrl } = req.body;

      const updatedUser = await UserService.updateUser(userId, {
        name,
        course,
        photoUrl
      });

      res.status(200).json({
        message: 'Perfil atualizado com sucesso',
        data: updatedUser
      });
    } catch (error) {
      next(error);
    }
  }

  async getUserById(req, res, next) {
    try {
      const { id } = req.params;
      const user = await UserService.getUserById(id);

      res.status(200).json({
        data: user
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new UserController();