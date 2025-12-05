const express = require('express');
const router = express.Router();

const authRoutes = require('./auth.routes');
const userRoutes = require('./user.routes');
const rideRoutes = require('./ride.routes');
const requestRoutes = require('./request.routes');
const notificationRoutes = require('./notification.routes');
const messageRoutes = require('./message.routes');

router.get('/', (req, res) => {
  res.json({
    message: 'Welcome to TaSafe API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      users: '/api/users',
      rides: '/api/rides',
      requests: '/api/requests',
      notifications: '/api/notifications',
      messages: '/api/messages'
    }
  });
});

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/rides', rideRoutes);
router.use('/requests', requestRoutes);
router.use('/notifications', notificationRoutes);
router.use('/messages', messageRoutes);

module.exports = router;