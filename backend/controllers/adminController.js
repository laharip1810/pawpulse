const User = require('../models/User');
const Pet = require('../models/Pet');
const DailyLog = require('../models/DailyLog');
const HealthCheck = require('../models/HealthCheck');

// @desc    Get dashboard stats
// @route   GET /api/admin/stats
// @access  Admin
const getStats = async (req, res) => {
  try {
    const [totalUsers, totalPets, totalLogs, totalHealthChecks] = await Promise.all([
      User.countDocuments(),
      Pet.countDocuments(),
      DailyLog.countDocuments(),
      HealthCheck.countDocuments()
    ]);

    const recentUsers = await User.find().sort({ createdAt: -1 }).limit(5).select('-password');
    const recentPets = await Pet.find().sort({ createdAt: -1 }).limit(5).populate('owner', 'name email');

    res.json({
      success: true,
      stats: { totalUsers, totalPets, totalLogs, totalHealthChecks },
      recentUsers,
      recentPets
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Admin
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json({ success: true, count: users.length, users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete user and their data
// @route   DELETE /api/admin/users/:id
// @access  Admin
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });

    const pets = await Pet.find({ owner: req.params.id });
    const petIds = pets.map(p => p._id);

    await DailyLog.deleteMany({ owner: req.params.id });
    await HealthCheck.deleteMany({ owner: req.params.id });
    await Pet.deleteMany({ owner: req.params.id });
    await User.findByIdAndDelete(req.params.id);

    res.json({ success: true, message: `User and all associated data deleted.` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all pets
// @route   GET /api/admin/pets
// @access  Admin
const getAllPets = async (req, res) => {
  try {
    const pets = await Pet.find().populate('owner', 'name email').sort({ createdAt: -1 });
    res.json({ success: true, count: pets.length, pets });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a pet
// @route   DELETE /api/admin/pets/:id
// @access  Admin
const deletePet = async (req, res) => {
  try {
    const pet = await Pet.findByIdAndDelete(req.params.id);
    if (!pet) return res.status(404).json({ success: false, message: 'Pet not found.' });
    await DailyLog.deleteMany({ pet: req.params.id });
    await HealthCheck.deleteMany({ pet: req.params.id });
    res.json({ success: true, message: 'Pet deleted.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getStats, getAllUsers, deleteUser, getAllPets, deletePet };
