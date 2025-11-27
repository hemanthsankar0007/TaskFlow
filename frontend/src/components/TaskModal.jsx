import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE } from '../config';

const TaskModal = ({ isOpen, onClose, onTaskAdded, editingTask }) => {
  const [employees, setEmployees] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'Pending',
    assignedTo: ''
  });

  // Load employees and populate form if editing
  useEffect(() => {
    if (isOpen) {
      axios.get(`${API_BASE}/api/employees`)
        .then(res => setEmployees(res.data))
        .catch(err => console.log("Employee fetch error:", err));
    }
  }, [isOpen]);

  // Populate form when editing task changes
  useEffect(() => {
    if (editingTask) {
      setFormData({
        title: editingTask.title || '',
        description: editingTask.description || '',
        status: editingTask.status || 'Pending',
        assignedTo: editingTask.assignedTo?._id || editingTask.assignedTo || ''
      });
    } else if (isOpen) {
      // Reset form if creating new task
      setFormData({
        title: '',
        description: '',
        status: 'Pending',
        assignedTo: ''
      });
    }
  }, [editingTask, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      alert("Task title is required");
      return;
    }

    if (!formData.assignedTo) {
      alert("Please assign the task to an employee");
      return;
    }

    try {
      if (editingTask) {
        // Update existing task
        await axios.put(
          `${API_BASE}/api/tasks/${editingTask._id}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`
            }
          }
        );
      } else {
        // Create new task
        await axios.post(
          `${API_BASE}/api/tasks`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`
            }
          }
        );
      }

      onTaskAdded();
      onClose();

      // Reset modal fields
      setFormData({
        title: '',
        description: '',
        status: 'Pending',
        assignedTo: ''
      });

    } catch (err) {
      console.error("Error saving task:", err);
      alert(`Failed to ${editingTask ? 'update' : 'create'} task. Make sure you are logged in.`);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="glass-panel w-full max-w-lg p-8 rounded-2xl relative shadow-[0_0_50px_rgba(0,0,0,0.5)] animate-modal-pop">
        <h2 className="text-3xl font-bold mb-6 text-white drop-shadow-md">
          {editingTask ? 'Edit Task' : 'Create New Task'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Title */}
          <div>
            <label className="block text-sm text-blue-200 mb-1">Task Title</label>
            <input
              type="text"
              value={formData.title}
              className="w-full glass-input p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              placeholder="e.g. Fix Login Bug"
              onChange={e => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm text-blue-200 mb-1">Description</label>
            <textarea
              value={formData.description}
              className="w-full glass-input p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="3"
              onChange={e => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          {/* Assign + Status */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-blue-200 mb-1">Assign To</label>
              <select
                value={formData.assignedTo}
                className="w-full glass-input p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 [&>option]:bg-gray-800"
                onChange={e => setFormData({ ...formData, assignedTo: e.target.value })}
              >
                <option value="">Select Employee...</option>
                {employees.map(emp => (
                  <option key={emp._id} value={emp._id}>{emp.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm text-blue-200 mb-1">Status</label>
              <select
                value={formData.status}
                className="w-full glass-input p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 [&>option]:bg-gray-800"
                onChange={e => setFormData({ ...formData, status: e.target.value })}
              >
                <option>Pending</option>
                <option>In Progress</option>
                <option>Completed</option>
              </select>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg hover:bg-white/10 text-gray-300"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg shadow-lg shadow-blue-500/30 transition-all transform hover:scale-105"
            >
              {editingTask ? 'Update Task' : 'Create Task'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default TaskModal;
