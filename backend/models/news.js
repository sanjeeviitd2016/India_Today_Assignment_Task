const mongoose = require("mongoose");

const newsSchema = new mongoose.Schema({
  heading: {
    type: String,
    required: [true, "Please enter description"],
  },

  description: {
    type: String,
    required: [true, "Please enter description"],
  },
  author: {
    type: String,
    default: "Anonymous",
  },
  newsImage: {
    public_id: {
      type: String,
    },
    url: {
      type: String,
    },
  },
  category: {
    type: String,
    required: [true, "Please enter catogary"],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});


module.exports= mongoose.model('news',newsSchema)