require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// Models
const { Employee, Task } = require("./models/Schemas");

// Auth
const auth = require("./middleware/auth");
const authRoutes = require("./routes/authRoutes");

const app = express();

// -----------------------------
// CORS SETUP
// -----------------------------
app.use(
  cors({
    origin: ["http://localhost:5173", process.env.FRONTEND_URL],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);


app.use(express.json());

// -----------------------------
// AUTH ROUTES
// -----------------------------
app.use("/api/auth", authRoutes);

// -----------------------------
// DATABASE CONNECT
// -----------------------------
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) =>
    console.log("MongoDB connection failed:", err.message)
  );

if (!process.env.JWT_SECRET) {
  console.log("⚠️ WARNING: Missing JWT_SECRET in .env!");
}

// -----------------------------
// PUBLIC ENDPOINTS
// -----------------------------

// Dashboard Stats (PUBLIC)
app.get("/api/dashboard", async (req, res) => {
  try {
    const total = await Task.countDocuments();
    const completed = await Task.countDocuments({ status: "Completed" });
    const pending = await Task.countDocuments({ status: "Pending" });
    const inProgress = await Task.countDocuments({ status: "In Progress" });

    res.json({
      total,
      completed,
      pending,
      inProgress,
      rate: total ? Math.round((completed / total) * 100) : 0
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get All Tasks (PUBLIC)
app.get("/api/tasks", async (req, res) => {
  const tasks = await Task.find().populate("assignedTo");
  res.json(tasks);
});

// Get Employees (PUBLIC)
app.get("/api/employees", async (req, res) => {
  const employees = await Employee.find();
  res.json(employees);
});

// Get tasks for an employee (PUBLIC)
app.get("/api/employees/:id/tasks", async (req, res) => {
  try {
    const tasks = await Task.find({ assignedTo: req.params.id });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// -----------------------------
// PROTECTED TASK ROUTES
// Only logged-in user can create/update tasks
// -----------------------------

// Create Task (PROTECTED)
app.post("/api/tasks", auth, async (req, res) => {
  const newTask = new Task(req.body);
  await newTask.save();
  res.json(newTask);
});

// Update Task (PROTECTED)
app.put("/api/tasks/:id", auth, async (req, res) => {
  const updated = await Task.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(updated);
});

// Delete Task (PROTECTED)
app.delete("/api/tasks/:id", auth, async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: "Task deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// -----------------------------
// SEED DATA (OPTIONAL)
// -----------------------------
app.post("/api/seed", async (req, res) => {
  await Employee.deleteMany({});
  await Task.deleteMany({});

  const emp1 = await Employee.create({
    name: "Alice Johnson",
    role: "Frontend Dev",
    email: "alice@prou.com",
    avatar: "https://i.pravatar.cc/150?u=a"
  });

  const emp2 = await Employee.create({
    name: "Bob Smith",
    role: "Backend Dev",
    email: "bob@prou.com",
    avatar: "https://i.pravatar.cc/150?u=b"
  });

  await Task.create([
    { title: "Build Login", status: "Completed", assignedTo: emp1._id },
    { title: "API Setup", status: "In Progress", assignedTo: emp2._id },
    { title: "Design DB", status: "Pending", assignedTo: emp2._id }
  ]);

  res.json({ message: "Database Seeded" });
});

// -----------------------------
app.listen(process.env.PORT || 5000, () =>
  console.log(`Server running on port ${process.env.PORT || 5000}`)
);
