/**
 * Response utility functions for generating consistent API responses
 */

/**
 * Calculate confidence score for category detection
 * @param {string} message - User message
 * @param {string} category - Detected category
 * @returns {number} Confidence score (0-1)
 */
function calculateConfidence(message, category) {
  const lowerMessage = message.toLowerCase();
  const categoryKeywords = {
    pregnancy: [
      "pregnancy", "ubuzima", "ubw'abana", "pregnant", "baby", "umwana",
      "antenatal", "prenatal", "checkup", "muganga", "doctor", "vitamin",
      "week", "month", "due date", "birth", "delivery", "labor"
    ],
    emergency: [
      "emergency", "ingenzi", "amaraso", "bleeding", "pain", "ububabare",
      "urgent", "critical", "danger", "risk", "complication", "problem",
      "symptom", "fever", "headache", "dizziness", "fainting"
    ],
    nutrition: [
      "nutrition", "ibiryo", "food", "diet", "eating", "meal", "vitamin",
      "protein", "vegetable", "fruit", "water", "drink", "healthy",
      "supplement", "iron", "calcium", "folic acid"
    ],
    mental_health: [
      "mental", "depression", "anxiety", "stress", "mood", "feeling",
      "sad", "happy", "worried", "fear", "support", "counseling"
    ],
    exercise: [
      "exercise", "workout", "activity", "movement", "walking", "yoga",
      "fitness", "physical", "strength", "flexibility"
    ]
  };

  const keywords = categoryKeywords[category] || [];
  const matchedKeywords = keywords.filter((keyword) =>
    lowerMessage.includes(keyword.toLowerCase())
  );

  return Math.min(matchedKeywords.length / keywords.length, 1.0);
}

/**
 * Get personalized advice based on category
 * @param {string} category - Health category
 * @param {string} language - Language code
 * @returns {string} Personalized advice
 */
function getPersonalizedAdvice(category, language) {
  const advice = {
    rw: {
      pregnancy: "Reba ko ujya kwa muganga buri munsi kandi ufata intungamubiri zawe.",
      emergency: "Niba ufite ibibazo by'ingenzi, ijya kwa muganga vuba.",
      nutrition: "Fata ibiryo byuzuye kandi unywa amazi menshi.",
      mental_health: "Vuga ibibazo byawe kwa muganga cyangwa umufasha.",
      exercise: "Gukora sport yoroshye bizagufasha.",
      default: "Reba ko ujya kwa muganga buri munsi.",
    },
    en: {
      pregnancy: "Make sure to attend regular checkups and take your vitamins.",
      emergency: "If you have emergency symptoms, seek medical help immediately.",
      nutrition: "Eat a balanced diet and drink plenty of water.",
      mental_health: "Talk to your doctor or counselor about your concerns.",
      exercise: "Gentle exercise will help you stay healthy.",
      default: "Make sure to attend regular checkups.",
    },
  };

  return advice[language][category] || advice[language].default;
}

/**
 * Get helpful suggestions for follow-up questions
 * @param {string} category - Health category
 * @param {string} language - Language code
 * @returns {Array} Array of suggestions
 */
function getSuggestions(category, language) {
  const suggestions = {
    rw: {
      pregnancy: [
        "Maze amezi 2 ntwite?",
        "Ese niki nafata mugihe ntwinte?",
        "Ushaka kumenya ibyerekeye urubyaro ?",
      ],
      emergency: [
        "Ufite amaraso make?",
        "Ufite ububabare?",
        "Ushaka kumenya ibyerekeye ingenzi?",
      ],
      nutrition: [
        "Nshaka kumenya ibigize indyo yuzuye?",
        "Nshaka kumenya intungamubiri nafata mugihe mfite imbaraga nke?",
        "Ushaka kumenya ibindi byamfasha mukubona intungamubiri?",
      ],
      mental_health: [
        "Ndumva mfite umubabaro?",
        "Ndikumva mfite depression?",
        "Nshaka kumenya ibyerekeye ubuzima bwo mumutwe?",
      ],
      exercise: [
        "Niyihe myitozo ngororamubiri nakora?",
        "Nigute nakora imyitozo ngororamubiri?",
      ],
      default: [
        "Ushaka kumenya iki?",
        "Ufite ibibazo?",
        "Ushaka kumenya ibyerekeye ubuzima?",
      ],
    },
    en: {
      pregnancy: [
        "Do you have concerns?",
        "What would you like to know?",
        "Want to know about vitamins?",
      ],
      emergency: [
        "Are you bleeding?",
        "Are you in pain?",
        "Want to know about emergencies?",
      ],
      nutrition: [
        "Want to know about healthy foods?",
        "Want to know about vitamins?",
        "Want to know about water?",
      ],
      mental_health: [
        "Are you worried?",
        "Are you feeling sad?",
        "Want to know about mental health?",
      ],
      exercise: [
        "Want to know about exercise?",
        "Want to know about physical activity?",
        "Want to know about walking?",
      ],
      default: [
        "What would you like to know?",
        "Do you have concerns?",
        "Want to know about health?",
      ],
    },
  };

  return suggestions[language][category] || suggestions[language].default;
}

module.exports = {
  calculateConfidence,
  getPersonalizedAdvice,
  getSuggestions,
};
