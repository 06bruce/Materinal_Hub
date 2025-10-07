/**
 * Get health centers
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getHealthCenters = (req, res) => {
  const centers = [
    {
      id: 1,
      name: "Kigali Central Hospital",
      location: "Kigali, Rwanda",
      phone: "+250 782 749 660",
      hours: "24/7 Emergency Services",
      rating: 4.5,
    },
    {
      id: 2,
      name: "King Faisal Hospital",
      location: "Kigali, Rwanda",
      phone: "3939",
      hours: "Mon-Fri: 8AM-6PM",
      rating: 4.8,
    },
    {
      id: 3,
      name: "Rwanda Military Hospital",
      location: "Kigali, Rwanda",
      phone: "4060",
      hours: "24/7 Emergency Services",
      rating: 4.3,
    },
  ];
  res.json(centers);
};

/**
 * Get emergency contacts
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getEmergencyContacts = (req, res) => {
  const contacts = [
    {
      name: "Emergency Hotline",
      phone: "112",
      description: "24/7 emergency medical assistance",
    },
    {
      name: "Maternal Health Support",
      phone: "116",
      description: "Specialized maternal health support",
    },
    {
      name: "Mental Health Crisis",
      phone: "114",
      description: "Mental health crisis intervention",
    },
  ];

  res.json(contacts);
};

module.exports = {
  getHealthCenters,
  getEmergencyContacts,
};
