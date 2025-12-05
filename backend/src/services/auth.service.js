const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UserRepository = require('../repositories/user.repository');

class AuthService {
  async register(userData) {
    // Verificar se usuário já existe
    const existingUser = await UserRepository.findByEmail(userData.email);
    if (existingUser) {
      const error = new Error('Email já cadastrado');
      error.status = 400;
      throw error;
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    // Criar usuário
    const user = await UserRepository.create({
      ...userData,
      password: hashedPassword
    });

    // Gerar token
    const token = this.generateToken(user);

    // Retornar usuário sem senha
    const { password, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      token
    };
  }

  async login(email, password) {
    // Buscar usuário
    const user = await UserRepository.findByEmail(email);
    if (!user) {
      const error = new Error('Credenciais inválidas');
      error.status = 401;
      throw error;
    }

    // Verificar senha
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      const error = new Error('Credenciais inválidas');
      error.status = 401;
      throw error;
    }

    // Gerar token
    const token = this.generateToken(user);

    // Retornar usuário sem senha
    const { password: _, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      token
    };
  }

  generateToken(user) {
    return jwt.sign(
      { 
        id: user.id, 
        email: user.email,
        role: user.role 
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
  }

  verifyToken(token) {
    try {
      return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      const err = new Error('Token inválido');
      err.status = 401;
      throw err;
    }
  }
}

module.exports = new AuthService();