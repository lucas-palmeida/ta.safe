const { validationResult } = require('express-validator');
const RideService = require('../services/ride.service');

class RideController {
  async listRides(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { type, destination, date } = req.query;
      const rides = await RideService.listRides({ type, destination, date });

      res.status(200).json({
        data: rides
      });
    } catch (error) {
      next(error);
    }
  }

  async getRideById(req, res, next) {
    try {
      const { id } = req.params;
      const ride = await RideService.getRideById(id);

      res.status(200).json({
        data: ride
      });
    } catch (error) {
      next(error);
    }
  }

  async createRide(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const userId = req.userId;
      const rideData = req.body;

      const ride = await RideService.createRide(userId, rideData);

      res.status(201).json({
        message: 'Carona criada com sucesso',
        data: ride
      });
    } catch (error) {
      next(error);
    }
  }

  async updateRide(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { id } = req.params;
      const userId = req.userId;
      const updateData = req.body;

      const ride = await RideService.updateRide(id, userId, updateData);

      res.status(200).json({
        message: 'Carona atualizada com sucesso',
        data: ride
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteRide(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.userId;

      await RideService.deleteRide(id, userId);

      res.status(200).json({
        message: 'Carona removida com sucesso'
      });
    } catch (error) {
      next(error);
    }
  }

  async getMyOfferedRides(req, res, next) {
    try {
      const userId = req.userId;
      const rides = await RideService.getMyOfferedRides(userId);

      res.status(200).json({
        data: rides
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new RideController();