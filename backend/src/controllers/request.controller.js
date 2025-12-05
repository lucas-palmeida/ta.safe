const { validationResult } = require('express-validator');
const RequestService = require('../services/request.service');

class RequestController {
  async createRequest(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const userId = req.userId;
      const { rideId, message } = req.body;

      const request = await RequestService.createRequest(userId, rideId, message);

      res.status(201).json({
        message: 'Solicitação enviada com sucesso',
        data: request
      });
    } catch (error) {
      next(error);
    }
  }

  async getMyRequests(req, res, next) {
    try {
      const userId = req.userId;
      const requests = await RequestService.getMyRequests(userId);

      res.status(200).json({
        data: requests
      });
    } catch (error) {
      next(error);
    }
  }

  async acceptRequest(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.userId;

      const request = await RequestService.acceptRequest(id, userId);

      res.status(200).json({
        message: 'Solicitação aceita com sucesso',
        data: request
      });
    } catch (error) {
      next(error);
    }
  }

  async rejectRequest(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.userId;

      const request = await RequestService.rejectRequest(id, userId);

      res.status(200).json({
        message: 'Solicitação rejeitada',
        data: request
      });
    } catch (error) {
      next(error);
    }
  }

  async cancelRequest(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.userId;

      await RequestService.cancelRequest(id, userId);

      res.status(200).json({
        message: 'Solicitação cancelada com sucesso'
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new RequestController();