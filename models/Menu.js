const mongoose = require("mongoose");

const menuItemsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  taste: {
    type: String,
    enum: ["Sweet", "Spicy", "Sour", "Salty"],
    required: true,
  },
  is_drink: {
    type: Boolean,
    default: false,
  },
  ingredients: {
    type: [String],
    default: [],
    required: true,
  },
  num_sales: {
    type: Number,
    default: 0,
  },
});

// Create Menu Model
const MenuItem = mongoose.model("MenuItem", menuItemsSchema);

module.exports = MenuItem;
