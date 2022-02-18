const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const dataSchema = new Schema({
  text: {
    type: String,
  },
  access: [
    {
      ip: String,
      date: Date,
    },
  ],
  createdAt: { type: Date, expires: '1d', default: Date.now },
});

module.exports = mongoose.model('Data', dataSchema);
