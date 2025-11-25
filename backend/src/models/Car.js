const mongoose = require('mongoose');

const carSchema = new mongoose.Schema(
  {
    brand: {
      type: String,
      required: true,
      trim: true,
    },
    model: {
      type: String,
      required: true,
      trim: true,
    },
    year: {
      type: Number,
      required: true,
      min: 1980,
    },
    segment: {
      type: String,
      enum: ['economy', 'compact', 'standard', 'premium', 'suv', 'van'],
      required: true,
    },
    dailyRate: {
      type: Number,
      required: true,
      min: 0,
    },
    registrationNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true, // createdAt, updatedAt
  }
);

module.exports = mongoose.model('Car', carSchema);
