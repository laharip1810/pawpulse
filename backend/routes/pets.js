const express = require('express');
const router = express.Router();
const {
  addPet, getUserPets, getPet, updatePet, deletePet,
  markVaccination, addDailyLog, getDailyLogs, updateDailyLog, deleteDailyLog
} = require('../controllers/petController');
const { protect } = require('../middleware/auth');

router.use(protect); // All pet routes require auth

router.route('/')
  .get(getUserPets)
  .post(addPet);

router.route('/:id')
  .get(getPet)
  .put(updatePet)
  .delete(deletePet);

router.put('/:id/vaccinations/:vacId', markVaccination);

router.route('/:id/logs')
  .get(getDailyLogs)
  .post(addDailyLog);

router.route('/:id/logs/:logId')
  .put(updateDailyLog)
  .delete(deleteDailyLog);

module.exports = router;
