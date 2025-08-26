const mongoose = require("mongoose");

const commissionSchema = new mongoose.Schema({
  pospId: {
    type: String,
    default: ""
  },
  pospName: {
    type: String,
    required: [true, "POSP name is required"]
  },
  status: {
    type: String,
    required: [true, "Status is required"],
    enum: ["Pending", "Approved", "Rejected", "Invoice Submitted", "Hold", "Paid"],
    default: "Pending"
  },
  totalCommission: {
    type: Number,
    required: [true, "Total commission is required"]
  },
  invoiceMonth: {
    type: String,
    required: [true, "Invoice month is required"]
  },
  invoiceFile: {
    type: String, // store file path or URL
    default: null
  },
  reason: {
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
 id: {
    type: String,
    default: ""
  },
  amount: {
    type: String,
    default: ""
  }

}, { timestamps: true });

module.exports = mongoose.model("Commission", commissionSchema);
