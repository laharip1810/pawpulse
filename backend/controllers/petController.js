const Pet = require('../models/Pet');
const DailyLog = require('../models/DailyLog');

// @desc    Add a new pet
// @route   POST /api/pets
// @access  Private
const addPet = async (req, res) => {
  try {
    const { name, species, breed, age, ageUnit, gender, weight, color, notes } = req.body;

    const pet = new Pet({
      owner: req.user._id,
      name, species, breed, age, ageUnit, gender, weight, color, notes
    });

    // Auto-generate vaccination schedule
    pet.vaccinations = pet.generateVaccineSchedule();
    await pet.save();

    res.status(201).json({ success: true, message: 'Pet added successfully!', pet });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all pets for logged-in user
// @route   GET /api/pets
// @access  Private
const getUserPets = async (req, res) => {
  try {
    const pets = await Pet.find({ owner: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, count: pets.length, pets });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single pet
// @route   GET /api/pets/:id
// @access  Private
const getPet = async (req, res) => {
  try {
    const pet = await Pet.findOne({ _id: req.params.id, owner: req.user._id });
    if (!pet) return res.status(404).json({ success: false, message: 'Pet not found.' });
    res.json({ success: true, pet });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update pet
// @route   PUT /api/pets/:id
// @access  Private
const updatePet = async (req, res) => {
  try {
    const pet = await Pet.findOneAndUpdate(
      { _id: req.params.id, owner: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!pet) return res.status(404).json({ success: false, message: 'Pet not found.' });
    res.json({ success: true, message: 'Pet updated!', pet });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete pet
// @route   DELETE /api/pets/:id
// @access  Private
const deletePet = async (req, res) => {
  try {
    const pet = await Pet.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
    if (!pet) return res.status(404).json({ success: false, message: 'Pet not found.' });
    await DailyLog.deleteMany({ pet: req.params.id });
    res.json({ success: true, message: 'Pet deleted.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Mark vaccination as complete
// @route   PUT /api/pets/:id/vaccinations/:vacId
// @access  Private
const markVaccination = async (req, res) => {
  try {
    const pet = await Pet.findOne({ _id: req.params.id, owner: req.user._id });
    if (!pet) return res.status(404).json({ success: false, message: 'Pet not found.' });

    const vac = pet.vaccinations.id(req.params.vacId);
    if (!vac) return res.status(404).json({ success: false, message: 'Vaccination not found.' });

    vac.completed = true;
    vac.completedDate = new Date();
    await pet.save();

    res.json({ success: true, message: 'Vaccination marked as completed!', pet });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add/Update daily log
// @route   POST /api/pets/:id/logs
// @access  Private
const addDailyLog = async (req, res) => {
  try {
    const pet = await Pet.findOne({ _id: req.params.id, owner: req.user._id });
    if (!pet) return res.status(404).json({ success: false, message: 'Pet not found.' });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let log = await DailyLog.findOne({ pet: req.params.id, date: today });

    if (log) {
      Object.assign(log, req.body);
      await log.save();
    } else {
      log = await DailyLog.create({
        pet: req.params.id,
        owner: req.user._id,
        date: today,
        ...req.body
      });
    }

    res.json({ success: true, message: 'Daily log saved!', log });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get daily logs for a pet
// @route   GET /api/pets/:id/logs
// @access  Private
const getDailyLogs = async (req, res) => {
  try {
    const logs = await DailyLog.find({ pet: req.params.id, owner: req.user._id })
      .sort({ date: -1 })
      .limit(30);
    res.json({ success: true, logs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update daily log
// @route   PUT /api/pets/:id/logs/:logId
// @access  Private
const updateDailyLog = async (req, res) => {
  try {
    const log = await DailyLog.findOneAndUpdate(
      { _id: req.params.logId, pet: req.params.id, owner: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!log) return res.status(404).json({ success: false, message: 'Log not found.' });
    res.json({ success: true, message: 'Log updated!', log });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete daily log
// @route   DELETE /api/pets/:id/logs/:logId
// @access  Private
const deleteDailyLog = async (req, res) => {
  try {
    const log = await DailyLog.findOneAndDelete({
      _id: req.params.logId,
      pet: req.params.id,
      owner: req.user._id
    });
    if (!log) return res.status(404).json({ success: false, message: 'Log not found.' });
    res.json({ success: true, message: 'Log deleted.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { addPet, getUserPets, getPet, updatePet, deletePet, markVaccination, addDailyLog, getDailyLogs, updateDailyLog, deleteDailyLog };
