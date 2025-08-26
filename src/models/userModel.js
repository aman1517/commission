const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: [true, "Please add a username"],
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, "Please add a password"]
  },
  name: {
    type: String,
    required: [true, "Please add a full name"]
  },
  address: {
    type: String,
    default: ""
  },
  email: {
    type: String,
    required: [true, "Please add an email"],
    unique: true
  },
  phone: {
    type: String,
    required: [true, "Please add a phone number"]
  },
  gst: {
    type: String,
    default: ""
  },
  bankName: {
    type: String,
    default: ""
  },
  accountNumber: {
    type: String,
    default: ""
  },
  ifsc: {
    type: String,
    default: ""
  },
  status: {
    type: String,
    enum: ["Active", "Inactive","Deactivated"],
    default: "Active"
  },
  tdsRate: {
    type: Number,
    default: 0
  },
  gstRate: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);

