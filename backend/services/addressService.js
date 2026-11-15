const Address = require("../models/Address");

// ==========================================
// Add Address
// ==========================================

const createAddress = async (
  userId,
  data
) => {
  const existingAddress =
    await Address.countDocuments({
      user: userId,
    });

  let isDefault = data.isDefault === true;

  // First address automatically becomes default
  if (existingAddress === 0) {
    isDefault = true;
  }

  // If new address is default,
  // remove default from old addresses
  if (isDefault) {
    await Address.updateMany(
      { user: userId },
      { $set: { isDefault: false } }
    );
  }

  const address = await Address.create({
    ...data,
    user: userId,
    isDefault,
  });

  return address;
};

// ==========================================
// Get Addresses
// ==========================================

const getAddresses = async (userId) => {
  return await Address.find({
    user: userId,
  }).sort({
    isDefault: -1,
    createdAt: -1,
  });
};

// ==========================================
// Get Single Address
// ==========================================

const getAddressById = async (
  addressId,
  userId
) => {
  const address = await Address.findOne({
    _id: addressId,
    user: userId,
  });

  if (!address) {
    throw new Error("Address not found");
  }

  return address;
};

// ==========================================
// Update Address
// ==========================================

const updateAddress = async (
  addressId,
  userId,
  data
) => {
  const address = await Address.findOne({
    _id: addressId,
    user: userId,
  });

  if (!address) {
    throw new Error("Address not found");
  }

  if (data.isDefault === true) {
    await Address.updateMany(
      { user: userId },
      { $set: { isDefault: false } }
    );
  }

  const allowedFields = [
    "name",
    "phone",
    "addressLine",
    "village",
    "city",
    "district",
    "state",
    "pincode",
    "landmark",
    "isDefault",
  ];

  allowedFields.forEach((field) => {
    if (data[field] !== undefined) {
      address[field] = data[field];
    }
  });

  await address.save();

  return address;
};

// ==========================================
// Delete Address
// ==========================================

const deleteAddress = async (
  addressId,
  userId
) => {
  const address = await Address.findOne({
    _id: addressId,
    user: userId,
  });

  if (!address) {
    throw new Error("Address not found");
  }

  await Address.deleteOne({
    _id: addressId,
  });

  // If deleted address was default,
  // make another address default
  if (address.isDefault) {
    const nextAddress =
      await Address.findOne({
        user: userId,
      }).sort({
        createdAt: -1,
      });

    if (nextAddress) {
      nextAddress.isDefault = true;
      await nextAddress.save();
    }
  }

  return address;
};

// ==========================================
// Set Default Address
// ==========================================

const setDefaultAddress = async (
  addressId,
  userId
) => {
  const address = await Address.findOne({
    _id: addressId,
    user: userId,
  });

  if (!address) {
    throw new Error("Address not found");
  }

  await Address.updateMany(
    { user: userId },
    { $set: { isDefault: false } }
  );

  address.isDefault = true;

  await address.save();

  return address;
};

module.exports = {
  createAddress,
  getAddresses,
  getAddressById,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
};