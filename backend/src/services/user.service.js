const UserRepository = require('../repositories/user.repository');

class UserService {
  async getUserById(id) {
    const user = await UserRepository.findById(id);
    
    if (!user) {
      const error = new Error('Usuário não encontrado');
      error.status = 404;
      throw error;
    }

    return user;
  }

  async updateUser(id, data) {
    const user = await UserRepository.findById(id);
    
    if (!user) {
      const error = new Error('Usuário não encontrado');
      error.status = 404;
      throw error;
    }

    return await UserRepository.update(id, data);
  }
}

module.exports = new UserService();