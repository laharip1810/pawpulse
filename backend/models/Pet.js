const mongoose = require('mongoose');

const vaccinationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  dueDate: { type: Date, required: true },
  completed: { type: Boolean, default: false },
  completedDate: { type: Date }
});

const petSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Pet name is required'],
    trim: true
  },
  species: {
    type: String,
    required: [true, 'Species is required'],
    enum: ['Dog', 'Cat', 'Bird', 'Rabbit', 'Fish', 'Hamster', 'Other']
  },
  breed: {
    type: String,
    trim: true,
    default: 'Mixed/Unknown'
  },
  age: {
    type: Number,
    required: [true, 'Age is required'],
    min: [0, 'Age cannot be negative']
  },
  ageUnit: {
    type: String,
    enum: ['months', 'years'],
    default: 'years'
  },
  gender: {
    type: String,
    enum: ['Male', 'Female'],
    required: [true, 'Gender is required']
  },
  weight: {
    type: Number,
    min: 0
  },
  color: { type: String, trim: true },
  photo: { type: String, default: '' },
  vaccinations: [vaccinationSchema],
  healthStatus: {
    type: String,
    enum: ['Excellent', 'Good', 'Fair', 'Poor'],
    default: 'Good'
  },
  notes: { type: String },
  createdAt: { type: Date, default: Date.now }
});

// Auto-generate vaccination schedule based on species and age
petSchema.methods.generateVaccineSchedule = function () {
  const vaccines = [];
  const now = new Date();

  const schedules = {
    Dog: [
      { name: 'Rabies', monthsFromNow: 1 },
      { name: 'DHPP (Distemper, Hepatitis, Parvovirus, Parainfluenza)', monthsFromNow: 2 },
      { name: 'Bordetella (Kennel Cough)', monthsFromNow: 3 },
      { name: 'Leptospirosis', monthsFromNow: 4 },
      { name: 'Annual Booster', monthsFromNow: 12 }
    ],
    Cat: [
      { name: 'Rabies', monthsFromNow: 1 },
      { name: 'FVRCP (Feline Viral Rhinotracheitis, Calicivirus, Panleukopenia)', monthsFromNow: 2 },
      { name: 'Feline Leukemia (FeLV)', monthsFromNow: 3 },
      { name: 'Annual Booster', monthsFromNow: 12 }
    ],
    default: [
      { name: 'General Health Vaccination', monthsFromNow: 3 },
      { name: 'Annual Booster', monthsFromNow: 12 }
    ]
  };

  const schedule = schedules[this.species] || schedules.default;
  schedule.forEach(v => {
    const dueDate = new Date(now);
    dueDate.setMonth(dueDate.getMonth() + v.monthsFromNow);
    vaccines.push({ name: v.name, dueDate, completed: false });
  });

  return vaccines;
};

module.exports = mongoose.model('Pet', petSchema);
