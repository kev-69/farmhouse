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
  const { id } = req.params; // Address ID from the route parameter
  const userId = req.user.id; // Extract user ID from the token
  const updates = req.body; // Fields to update from the request body

  try {
    // Find the address by its ID and ensure it belongs to the authenticated user
    const address = await Address.findOne({ where: { id, userId } });
    if (!address) {
      return res.status(404).json({ message: 'Address not found or does not belong to the user' });
    }

    // Update only the fields provided in the request body
    await address.update(updates);

    res.status(200).json({ message: 'Address updated successfully', address });
  } catch (error) {
    console.error('Error updating address:', error);
    res.status(500).json({ message: 'Error updating address', error });
  }
};

// Function to delete an address
const deleteAddress = async (req, res) => {
  const { id } = req.params; // Address ID from the route parameter
  const userId = req.user.id; // Extract user ID from the token
  const updates = req.body; // Fields to update from the request body

  try {
    // Find the address by its ID and ensure it belongs to the authenticated user
    const address = await Address.findOne({ where: { id, userId } });
    if (!address) {
      return res.status(404).json({ message: 'Address not found or does not belong to the user' });
    }

    // Update only the fields provided in the request body
    await address.destroy();

    res.status(200).json({ message: 'Address deleted successfully' });
  } catch (error) {
    console.error('Error updating address:', error);
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