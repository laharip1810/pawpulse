const express = require('express');
const router = express.Router();
const { getStats, getAllUsers, deleteUser, getAllPets, deletePet } = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/auth');

router.use(protect, adminOnly); // All admin routes require admin role

router.get('/stats', getStats);
router.get('/users', getAllUsers);
router.delete('/users/:id', deleteUser);
router.get('/pets', getAllPets);
router.delete('/pets/:id', deletePet);

module.exports = router;
