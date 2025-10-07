/**
 * Pregnancy calculation utilities
 * Centralized logic for pregnancy-related calculations
 */

/**
 * Calculate pregnancy due date from start date
 * @param {Date|string} startDate - Pregnancy start date
 * @returns {Date} Due date (40 weeks from start date)
 */
function calculateDueDate(startDate) {
  const start = new Date(startDate);
  const dueDate = new Date(start);
  dueDate.setDate(dueDate.getDate() + 280); // 40 weeks = 280 days
  return dueDate;
}

/**
 * Calculate current pregnancy week
 * @param {Date|string} startDate - Pregnancy start date
 * @returns {number} Current week (0-40)
 */
function calculateCurrentWeek(startDate) {
  const start = new Date(startDate);
  const today = new Date();
  const weeksDiff = Math.floor((today - start) / (1000 * 60 * 60 * 24 * 7));
  return Math.max(0, Math.min(40, weeksDiff));
}

/**
 * Calculate days until due date
 * @param {Date|string} dueDate - Due date
 * @returns {number} Days until due date
 */
function calculateDaysUntilDue(dueDate) {
  const today = new Date();
  const due = new Date(dueDate);
  const diffTime = due - today;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Get pregnancy stage based on current week
 * @param {number} currentWeek - Current pregnancy week
 * @returns {string} Pregnancy stage
 */
function getPregnancyStage(currentWeek) {
  if (currentWeek < 12) return 'first-trimester';
  if (currentWeek < 28) return 'second-trimester';
  return 'third-trimester';
}

/**
 * Validate pregnancy data
 * @param {Object} pregnancyData - Pregnancy data to validate
 * @returns {Object} Validation result
 */
function validatePregnancyData(pregnancyData) {
  const { isPregnant, pregnancyStartDate, dueDate, currentWeek } = pregnancyData;
  
  if (!isPregnant) {
    return { isValid: true, data: { isPregnant: false } };
  }

  if (!pregnancyStartDate) {
    return { isValid: false, error: 'Pregnancy start date is required when pregnant' };
  }

  const startDate = new Date(pregnancyStartDate);
  const today = new Date();
  
  if (startDate > today) {
    return { isValid: false, error: 'Pregnancy start date cannot be in the future' };
  }

  const calculatedDueDate = calculateDueDate(startDate);
  const calculatedWeek = calculateCurrentWeek(startDate);

  return {
    isValid: true,
    data: {
      isPregnant: true,
      pregnancyStartDate: startDate,
      dueDate: calculatedDueDate,
      currentWeek: calculatedWeek
    }
  };
}

module.exports = {
  calculateDueDate,
  calculateCurrentWeek,
  calculateDaysUntilDue,
  getPregnancyStage,
  validatePregnancyData
};
