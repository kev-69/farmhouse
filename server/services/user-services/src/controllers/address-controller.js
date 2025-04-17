const Address = require('../models/address-model');

// Function to create a new address
const createAddress = async (req, res) => {
  const { street, city, state, zipCode, country } = req.body;
  const userId = req.user.id; // Assuming user ID is passed in the request object
  // console.log('Request body:', req.body);
  // console.log('User ID:', req.user.id);

  try {
    const newAddress = await Address.create({
      userId,
      street,
      city,
      state,
      zipCode,
      country,
    });
    console.log('New Address:', newAddress); // Debug log

    res.status(201).json({ message: "Address added successfully", newAddress });
  } catch (error) {
    console.error('Error creating address:', error); // Debug log

    res.status(500).json({ message: 'Error creating address', error });
  }
};

// Function to get all addresses for a user
const getAddresses = async (req, res) => {
  const userId = req.user.id; // Assuming user ID is passed in the request object

  try {
    const addresses = await Address.findAll({ where: { userId } });
    res.status(200).json(addresses);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching addresses', error });
  }
};

// Function to update an address
const updateAddress = async (req, res) => {
  const { id } = req.params;
  const { street, city, state, zipCode, country } = req.body;

  try {
    const address = await Address.findByPk(id);
    if (!address) {
      return res.status(404).json({ message: 'Address not found' });
    }

    await address.update({ street, city, state, zipCode, country });
    res.status(200).json(address);
  } catch (error) {
    res.status(500).json({ message: 'Error updating address', error });
  }
};

// Function to delete an address
const deleteAddress = async (req, res) => {
  const { id } = req.params;

  try {
    const address = await Address.findByPk(id);
    if (!address) {
      return res.status(404).json({ message: 'Address not found' });
    }

    await address.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Error deleting address', error });
  }
};

// Export the functions
module.exports = {
  createAddress,
  getAddresses,
  updateAddress,
  deleteAddress,
};