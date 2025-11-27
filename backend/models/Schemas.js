const mongoose = require('mongoose');

// --------------------
// Employee Schema
// --------------------
const EmployeeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    role: { type: String, required: true },
    email: { type: String, required: true, unique: true, trim: true },
    avatar: { type: String }
  },
  { timestamps: true }
);

// --------------------
// Task Schema
// --------------------
const TaskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: "" },
    status: { 
      type: String, 
      enum: ["Pending", "In Progress", "Completed"], 
      default: "Pending" 
    },
    assignedTo: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Employee",
      default: null
    }
  },
  { timestamps: true }
);

module.exports = {
  Employee: mongoose.model("Employee", EmployeeSchema),
  Task: mongoose.model("Task", TaskSchema),
};
