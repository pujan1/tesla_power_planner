const express = require('express');
const userController = require('./user.controller');

const router = express.Router();

// Define user routes
router.get('/users', userController.getAllUsers);
router.post('/users', userController.createUser);
router.get('/users/:username', userController.getUser);
router.put('/users/:username', userController.updateUser);

// Keeping login inside user routes for now as requested by previous schema
router.post('/login', userController.login);

module.exports = router;
