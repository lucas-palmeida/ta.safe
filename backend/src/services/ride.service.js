const RideRepository = require('../repositories/ride.repository');

class RideService {
  async listRides(filters = {}) {
    return await RideRepository.findAll(filters);
  }

  async getRideById(id) {
    const ride = await RideRepository.findById(id);
    
    if (!ride) {
      const error = new Error('Carona não encontrada');
      error.status = 404;
      throw error;
    }

    return ride;
  }

  async createRide(driverId, rideData) {
    // Validação: tipo GROUP não deve ter availableSeats
    if (rideData.type === 'GROUP' && rideData.availableSeats) {
      const error = new Error('Caronas do tipo GROUP não devem ter limite de vagas');
      error.status = 400;
      throw error;
    }

    // Validação: outros tipos devem ter availableSeats
    if (rideData.type !== 'GROUP' && !rideData.availableSeats) {
      const error = new Error('Número de vagas disponíveis é obrigatório para este tipo de carona');
      error.status = 400;
      throw error;
    }

    // Validação: data no futuro
    const departureTime = new Date(rideData.departureTime);
    if (departureTime <= new Date()) {
      const error = new Error('A data de partida deve ser no futuro');
      error.status = 400;
      throw error;
    }

    return await RideRepository.create({
      driverId,
      ...rideData
    });
  }

  async updateRide(id, userId, updateData) {
    const ride = await RideRepository.findById(id);
    
    if (!ride) {
      const error = new Error('Carona não encontrada');
      error.status = 404;
      throw error;
    }

    // Verificar se o usuário é o dono da carona
    if (ride.driverId !== userId) {
      const error = new Error('Você não tem permissão para editar esta carona');
      error.status = 403;
      throw error;
    }

    return await RideRepository.update(id, updateData);
  }

  async deleteRide(id, userId) {
    const ride = await RideRepository.findById(id);
    
    if (!ride) {
      const error = new Error('Carona não encontrada');
      error.status = 404;
      throw error;
    }

    // Verificar se o usuário é o dono da carona
    if (ride.driverId !== userId) {
      const error = new Error('Você não tem permissão para deletar esta carona');
      error.status = 403;
      throw error;
    }

    return await RideRepository.delete(id);
  }

  async getMyOfferedRides(userId) {
    return await RideRepository.findByDriverId(userId);
  }
}

module.exports = new RideService();