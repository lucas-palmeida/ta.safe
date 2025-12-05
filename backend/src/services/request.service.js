const RequestRepository = require('../repositories/request.repository');
const RideRepository = require('../repositories/ride.repository');

class RequestService {
  async createRequest(userId, rideId, message) {
    const ride = await RideRepository.findById(rideId);
    
    if (!ride) {
      const error = new Error('Carona não encontrada');
      error.status = 404;
      throw error;
    }

    if (ride.driverId === userId) {
      const error = new Error('Você não pode solicitar sua própria carona');
      error.status = 400;
      throw error;
    }

    if (ride.status !== 'ACTIVE') {
      const error = new Error('Esta carona não está mais disponível');
      error.status = 400;
      throw error;
    }

    // Verificar se já existe solicitação
    const existingRequest = await RequestRepository.findByUserAndRide(userId, rideId);
    if (existingRequest) {
      const error = new Error('Você já solicitou esta carona');
      error.status = 400;
      throw error;
    }

    return await RequestRepository.create({
      userId,
      rideId,
      message
    });
  }

  async getMyRequests(userId) {
    return await RequestRepository.findByUserId(userId);
  }

  async acceptRequest(requestId, driverId) {
    const request = await RequestRepository.findById(requestId);
    
    if (!request) {
      const error = new Error('Solicitação não encontrada');
      error.status = 404;
      throw error;
    }

    if (request.ride.driverId !== driverId) {
      const error = new Error('Você não tem permissão para aceitar esta solicitação');
      error.status = 403;
      throw error;
    }

    if (request.status !== 'PENDING') {
      const error = new Error('Esta solicitação já foi processada');
      error.status = 400;
      throw error;
    }

    return await RequestRepository.updateStatus(requestId, 'ACCEPTED');
  }

  async rejectRequest(requestId, driverId) {
    const request = await RequestRepository.findById(requestId);
    
    if (!request) {
      const error = new Error('Solicitação não encontrada');
      error.status = 404;
      throw error;
    }

    if (request.ride.driverId !== driverId) {
      const error = new Error('Você não tem permissão para rejeitar esta solicitação');
      error.status = 403;
      throw error;
    }

    return await RequestRepository.updateStatus(requestId, 'REJECTED');
  }

  async cancelRequest(requestId, userId) {
    const request = await RequestRepository.findById(requestId);
    
    if (!request) {
      const error = new Error('Solicitação não encontrada');
      error.status = 404;
      throw error;
    }

    if (request.userId !== userId) {
      const error = new Error('Você não tem permissão para cancelar esta solicitação');
      error.status = 403;
      throw error;
    }

    return await RequestRepository.delete(requestId);
  }
}

module.exports = new RequestService();