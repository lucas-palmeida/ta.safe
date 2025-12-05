const AuthService = require('../services/auth.service');

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        error: {
          message: 'Token não fornecido',
          status: 401
        }
      });
    }

    const parts = authHeader.split(' ');

    if (parts.length !== 2) {
      return res.status(401).json({
        error: {
          message: 'Token mal formatado',
          status: 401
        }
      });
    }

    const [scheme, token] = parts;

    if (!/^Bearer$/i.test(scheme)) {
      return res.status(401).json({
        error: {
          message: 'Token mal formatado',
          status: 401
        }
      });
    }

    const decoded = AuthService.verifyToken(token);
    req.userId = decoded.id;
    req.userEmail = decoded.email;
    req.userRole = decoded.role;

    return next();
  } catch (error) {
    return res.status(401).json({
      error: {
        message: 'Token inválido',
        status: 401
      }
    });
  }
};

module.exports = authMiddleware;