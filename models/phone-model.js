const mongoose = require("mongoose");

const Schema = mongoose.Schema;


const phoneSchema = new Schema({
  // document structure & rules defined here
  brand: { type: String, required: true },
  model: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  specs: [
    { type: String, minlength: 3 },
  ],
}, {
  // additional settings for the Schema class
  timestamps: true,
});

const Phone = mongoose.model("Phone", phoneSchema);


module.exports = Phone;
