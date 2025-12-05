const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');

router.use(authMiddleware);

// TODO: Implementar na Sprint 4
router.get('/', (req, res) => {
  res.json({ message: 'Chat/Mensagens - Em desenvolvimento (Sprint 4)' });
});

module.exports = router;