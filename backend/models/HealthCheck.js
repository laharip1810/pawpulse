const mongoose = require('mongoose');

const healthCheckSchema = new mongoose.Schema({
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
  symptoms: [{
    type: String,
    trim: true
  }],
  symptomText: { type: String },
  diagnosis: {
    possibleIssue: { type: String },
    severity: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Emergency'],
      default: 'Low'
    },
    recommendation: {
      type: String,
      enum: ['Home Care', 'Monitor & Watch', 'Visit Vet Soon', 'Emergency Vet'],
      default: 'Monitor & Watch'
    },
    homeCareSteps: [{ type: String }],
    vetAdvice: { type: String }
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('HealthCheck', healthCheckSchema);
