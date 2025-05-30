const mongoose = require("mongoose");

const vegetableSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    default: "Vegetable",
  },
  image: {
    type: String,
  },
  price: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    default: 0,
  },
});

const Vegetable = mongoose.model("Vegetable", vegetableSchema);

module.exports = Vegetable;
