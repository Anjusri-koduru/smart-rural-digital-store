const addressService =
  require("../services/addressService");

// Add
const createAddress = async (
  req,
  res
) => {
  try {
    const address =
      await addressService.createAddress(
        req.user.id,
        req.body
      );

    res.status(201).json({
      success: true,
      message: "Address added successfully",
      address,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Get all
const getAddresses = async (
  req,
  res
) => {
  try {
    const addresses =
      await addressService.getAddresses(
        req.user.id
      );

    res.status(200).json({
      success: true,
      count: addresses.length,
      addresses,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch addresses",
      error: error.message,
    });
  }
};

// Get one
const getAddressById = async (
  req,
  res
) => {
  try {
    const address =
      await addressService.getAddressById(
        req.params.id,
        req.user.id
      );

    res.status(200).json({
      success: true,
      address,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

// Update
const updateAddress = async (
  req,
  res
) => {
  try {
    const address =
      await addressService.updateAddress(
        req.params.id,
        req.user.id,
        req.body
      );

    res.status(200).json({
      success: true,
      message:
        "Address updated successfully",
      address,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete
const deleteAddress = async (
  req,
  res
) => {
  try {
    await addressService.deleteAddress(
      req.params.id,
      req.user.id
    );

    res.status(200).json({
      success: true,
      message:
        "Address deleted successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Set default
const setDefaultAddress = async (
  req,
  res
) => {
  try {
    const address =
      await addressService.setDefaultAddress(
        req.params.id,
        req.user.id
      );

    res.status(200).json({
      success: true,
      message:
        "Default address updated successfully",
      address,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createAddress,
  getAddresses,
  getAddressById,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
};