const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    username: { 
      type: String, 
      required: true, 
      unique: true,          // prevent duplicates
      trim: true 
    },
    password: { 
      type: String, 
      required: true 
    }
  },
  { timestamps: true }       // adds createdAt, updatedAt
);

module.exports = mongoose.model("User", UserSchema);
