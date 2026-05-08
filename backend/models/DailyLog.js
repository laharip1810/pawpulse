const mongoose = require('mongoose');

const dailyLogSchema = new mongoose.Schema({
  pet: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pet',
    required: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    default: () => new Date().setHours(0, 0, 0, 0)
  },
  food: {
    amount: { type: Number, default: 0 },      // in grams
    unit: { type: String, default: 'grams' },
    meals: { type: Number, default: 0 },
    notes: { type: String }
  },
  water: {
    amount: { type: Number, default: 0 },      // in ml
    unit: { type: String, default: 'ml' }
  },
  activity: {
    type: String,
    enum: ['None', 'Light', 'Moderate', 'High'],
    default: 'Moderate'
  },
  mood: {
    type: String,
    enum: ['Happy', 'Normal', 'Lethargic', 'Anxious'],
    default: 'Normal'
  },
  notes: { type: String },
  createdAt: { type: Date, default: Date.now }
});

// One log per pet per day
dailyLogSchema.index({ pet: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('DailyLog', dailyLogSchema);
