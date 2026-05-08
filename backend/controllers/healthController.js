const HealthCheck = require('../models/HealthCheck');
const Pet = require('../models/Pet');

// Symptom knowledge base
const symptomDatabase = {
  // Emergency conditions
  emergency: {
    keywords: ['not breathing', 'seizure', 'collapse', 'unconscious', 'bleeding heavily', 'poisoned', 'hit by car', 'choking', 'blue gums', 'can\'t stand'],
    issue: 'Possible Life-Threatening Emergency',
    severity: 'Emergency',
    recommendation: 'Emergency Vet',
    homeCareSteps: ['Do NOT delay — go to emergency vet immediately', 'Keep pet calm and warm during transport', 'Do not give food/water'],
    vetAdvice: 'This is a medical emergency. Visit the nearest emergency veterinary clinic IMMEDIATELY. Call ahead so they can prepare.'
  },
  // High severity
  vomitingBlood: {
    keywords: ['vomiting blood', 'blood in vomit', 'bloody vomit', 'blood vomit'],
    issue: 'Gastrointestinal Bleeding',
    severity: 'High',
    recommendation: 'Visit Vet Soon',
    homeCareSteps: ['Withhold food for 12-24 hours', 'Ensure fresh water is available', 'Monitor closely'],
    vetAdvice: 'Blood in vomit requires urgent veterinary attention within 24 hours.'
  },
  // Medium severity
  vomiting: {
    keywords: ['vomiting', 'vomit', 'throwing up', 'nausea', 'sick stomach'],
    issue: 'Gastrointestinal Upset / Vomiting',
    severity: 'Medium',
    recommendation: 'Monitor & Watch',
    homeCareSteps: [
      'Withhold food for 4-6 hours, keep water available',
      'After fasting, offer small bland meals (boiled chicken + rice)',
      'Monitor for worsening symptoms'
    ],
    vetAdvice: 'If vomiting persists more than 24 hours, or pet becomes lethargic, visit the vet.'
  },
  diarrhea: {
    keywords: ['diarrhea', 'loose stool', 'watery stool', 'runny poop', 'loose poop'],
    issue: 'Diarrhea / Digestive Upset',
    severity: 'Medium',
    recommendation: 'Monitor & Watch',
    homeCareSteps: [
      'Switch to bland diet: boiled chicken and white rice',
      'Ensure proper hydration',
      'Add probiotics if available',
      'Monitor stool consistency over 24-48 hours'
    ],
    vetAdvice: 'If diarrhea lasts more than 2 days or contains blood, visit vet.'
  },
  lethargy: {
    keywords: ['lethargic', 'tired', 'lazy', 'no energy', 'weak', 'sluggish', 'not active'],
    issue: 'Lethargy / Low Energy',
    severity: 'Medium',
    recommendation: 'Monitor & Watch',
    homeCareSteps: [
      'Ensure pet is eating and drinking normally',
      'Check for fever (warm nose/ears)',
      'Keep pet comfortable and rested',
      'Monitor for 24-48 hours'
    ],
    vetAdvice: 'If lethargy persists over 48 hours, or is accompanied by other symptoms, see a vet.'
  },
  itching: {
    keywords: ['itching', 'scratching', 'itchy', 'skin rash', 'hives', 'allergies', 'red skin'],
    issue: 'Skin Irritation / Allergic Reaction',
    severity: 'Low',
    recommendation: 'Home Care',
    homeCareSteps: [
      'Check for fleas or ticks',
      'Bathe pet with mild hypoallergenic shampoo',
      'Avoid potential allergens (new food, plants)',
      'Apply pet-safe aloe vera on irritated areas'
    ],
    vetAdvice: 'If itching is severe or skin is broken/infected, consult a vet for antihistamines or other treatment.'
  },
  limping: {
    keywords: ['limping', 'lame', 'not walking', 'hurt leg', 'hurt paw', 'paw injury', 'leg pain'],
    issue: 'Limb Injury / Pain',
    severity: 'Medium',
    recommendation: 'Monitor & Watch',
    homeCareSteps: [
      'Rest the pet — restrict movement',
      'Check paw for cuts, splinters, or swelling',
      'Apply cold compress for swelling (15 min)',
      'Do not give human pain medication'
    ],
    vetAdvice: 'If limping persists over 24 hours or pet refuses to bear weight, visit vet.'
  },
  notEating: {
    keywords: ['not eating', 'won\'t eat', 'loss of appetite', 'refusing food', 'no appetite'],
    issue: 'Loss of Appetite',
    severity: 'Medium',
    recommendation: 'Monitor & Watch',
    homeCareSteps: [
      'Try warming food slightly',
      'Offer favorite treats',
      'Check for dental pain (swollen gums)',
      'Ensure fresh water is available',
      'Monitor for 24-48 hours'
    ],
    vetAdvice: 'If pet hasn\'t eaten for more than 48 hours, contact your vet.'
  },
  coughing: {
    keywords: ['coughing', 'cough', 'sneezing', 'runny nose', 'nasal discharge', 'wheezing'],
    issue: 'Respiratory Issue / Cold-like Symptoms',
    severity: 'Medium',
    recommendation: 'Monitor & Watch',
    homeCareSteps: [
      'Keep pet warm and dry',
      'Use a humidifier nearby',
      'Ensure pet is drinking water',
      'Avoid cold drafts'
    ],
    vetAdvice: 'If coughing is severe, breathing is labored, or symptoms worsen, visit vet.'
  },
  eyeIssue: {
    keywords: ['eye discharge', 'red eye', 'eye infection', 'watery eyes', 'eye swollen', 'cloudy eye'],
    issue: 'Eye Irritation / Infection',
    severity: 'Low',
    recommendation: 'Home Care',
    homeCareSteps: [
      'Gently clean around eye with warm damp cloth',
      'Keep area clean and dry',
      'Check for foreign objects',
      'Do not use human eye drops'
    ],
    vetAdvice: 'If eye is swollen, cloudy, or discharge is thick/colored, see a vet promptly.'
  },
  default: {
    issue: 'General Health Concern',
    severity: 'Low',
    recommendation: 'Monitor & Watch',
    homeCareSteps: [
      'Monitor your pet closely for 24-48 hours',
      'Ensure adequate food and water intake',
      'Keep pet comfortable and calm',
      'Note any changes in behavior'
    ],
    vetAdvice: 'If symptoms persist or worsen, schedule a vet visit for a proper diagnosis.'
  }
};

// Analyze symptoms and return diagnosis
const analyzeSymptoms = (symptomText) => {
  const text = symptomText.toLowerCase();

  for (const [key, data] of Object.entries(symptomDatabase)) {
    if (key === 'default') continue;
    if (data.keywords && data.keywords.some(keyword => text.includes(keyword))) {
      return {
        possibleIssue: data.issue,
        severity: data.severity,
        recommendation: data.recommendation,
        homeCareSteps: data.homeCareSteps,
        vetAdvice: data.vetAdvice
      };
    }
  }

  return {
    possibleIssue: symptomDatabase.default.issue,
    severity: symptomDatabase.default.severity,
    recommendation: symptomDatabase.default.recommendation,
    homeCareSteps: symptomDatabase.default.homeCareSteps,
    vetAdvice: symptomDatabase.default.vetAdvice
  };
};

// @desc    Check health symptoms
// @route   POST /api/health/check
// @access  Private
const checkSymptoms = async (req, res) => {
  try {
    const { petId, symptomText, symptoms } = req.body;

    if (!petId || !symptomText) {
      return res.status(400).json({ success: false, message: 'Pet ID and symptoms are required.' });
    }

    const pet = await Pet.findOne({ _id: petId, owner: req.user._id });
    if (!pet) return res.status(404).json({ success: false, message: 'Pet not found.' });

    const diagnosis = analyzeSymptoms(symptomText);

    const healthCheck = await HealthCheck.create({
      pet: petId,
      owner: req.user._id,
      symptoms: symptoms || [symptomText],
      symptomText,
      diagnosis
    });

    // Update pet health status based on severity
    const statusMap = { Low: 'Good', Medium: 'Fair', High: 'Poor', Emergency: 'Poor' };
    pet.healthStatus = statusMap[diagnosis.severity] || 'Good';
    await pet.save();

    res.json({
      success: true,
      diagnosis,
      healthCheckId: healthCheck._id,
      petName: pet.name
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get health history for a pet
// @route   GET /api/health/:petId
// @access  Private
const getHealthHistory = async (req, res) => {
  try {
    const records = await HealthCheck.find({ pet: req.params.petId, owner: req.user._id })
      .sort({ createdAt: -1 })
      .limit(10);
    res.json({ success: true, records });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { checkSymptoms, getHealthHistory };
