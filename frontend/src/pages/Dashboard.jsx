import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { useAuth } from '../context/AuthContext';
import { API_BASE } from '../config';
import TaskCard from '../components/TaskCard';
import TaskModal from '../components/TaskModal';

const StatCard = ({ title, value }) => (
  <div className="glass-panel p-6 rounded-2xl flex flex-col gap-3 transition-shadow duration-300 hover:shadow-[0_15px_35px_rgba(15,15,45,0.45)]">
    <p className="text-slate-300 text-xs uppercase tracking-[0.3em]">{title}</p>
    <p className="text-4xl font-semibold text-white drop-shadow-sm">{value}</p>
  </div>
);

const Dashboard = () => {
  const { isAuthenticated, isGuest } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({ total: 0, completed: 0, pending: 0, inProgress: 0, rate: 0 });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  
  const fetchData = useCallback(async () => {
    try {
      const [tasksRes, statsRes] = await Promise.all([
        axios.get(`${API_BASE}/api/tasks`),
        axios.get(`${API_BASE}/api/dashboard`)
      ]);
      setTasks(tasksRes.data);
      setStats(statsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchData();
    }, 0);
    return () => clearTimeout(timer);
  }, [fetchData]);

  const handleDeleteTask = async (taskId) => {
    if (isGuest) {
      alert("Please log in to delete tasks.");
      return;
    }

    const previousTasks = [...tasks];
    setTasks(tasks.filter(t => t._id !== taskId));

    try {
      await axios.delete(
        `${API_BASE}/api/tasks/${taskId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );
      fetchData();
    } catch (error) {
      console.error("Error deleting task:", error);
      alert("Failed to delete task.");
      setTasks(previousTasks);
    }
  };

  const handleEditTask = (task) => {
    if (isGuest) {
      alert("Please log in to edit tasks.");
      return;
    }
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTask(null);
  };

  const onDragEnd = async (result) => {
  // Block drag for guest users
  if (isGuest) {
    alert("Please log in to update tasks.");
    return;
  }

  if (!result.destination) return;

  const { draggableId, destination } = result;

  // Optimistic UI Update
  const previousTasks = [...tasks];
  const newTasks = tasks.map((t) =>
    t._id === draggableId ? { ...t, status: destination.droppableId } : t
  );
  setTasks(newTasks);

  try {
    await axios.put(
      `${API_BASE}/api/tasks/${draggableId}`,
      { status: destination.droppableId },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      }
    );

    fetchData(); // refresh stats after successful drag
  } catch (error) {
    console.error("Error updating task:", error);

    alert("You must be logged in to update tasks.");

    // Revert UI if request fails
    setTasks(previousTasks);
  }
};


  return (
    <div className="space-y-12">
      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatCard title="Total Tasks" value={stats.total} />
        <StatCard title="Completion Rate" value={`${stats.rate}%`} />
        <StatCard title="Pending" value={stats.pending} />
        <StatCard title="In Progress" value={stats.inProgress} />
      </div>

      {/* Header & Add Button */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div>
          <p className="text-blue-200 uppercase tracking-[0.4em] text-xs">Overview</p>
          <h2 className="text-4xl font-semibold text-white mt-2 drop-shadow-sm">Task Board</h2>
        </div>
        {isAuthenticated && !isGuest && (
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 px-7 py-3 rounded-full font-semibold text-lg shadow-[0_10px_30px_rgba(16,134,255,0.45)] transition-shadow duration-300"
          >
            + Add New Task
          </button>
        )}
        {isGuest && (
          <div className="text-sm text-slate-400 bg-white/5 px-5 py-2 rounded-full border border-white/10">
            <span className="text-blue-300">👁️</span> View-only mode · Log in to edit
          </div>
        )}
      </div>

      {/* Kanban Board */}
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {["Pending", "In Progress", "Completed"].map((status) => (
            <Droppable droppableId={status} key={status}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="glass-panel rounded-[30px] p-6 min-h-[520px] text-left relative border border-white/5"
                >
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <p className="text-blue-200 text-xs uppercase tracking-[0.3em]">{status}</p>
                      <h3 className="text-2xl font-semibold text-white mt-1">{status}</h3>
                    </div>
                    <span className="text-sm text-white/70 bg-white/10 rounded-full px-3 py-1">
                      {tasks.filter((t) => t.status === status).length} tasks
                    </span>
                  </div>

                  <div className="flex flex-col gap-6">
                    {tasks
                      .filter((t) => t.status === status)
                      .map((task, index) => (
                        <Draggable draggableId={task._id} index={index} key={task._id}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              style={{
                                ...provided.draggableProps.style,
                                cursor: snapshot.isDragging ? 'grabbing' : 'grab'
                              }}
                            >
                              <TaskCard 
                                task={task} 
                                isDragging={snapshot.isDragging}
                                onDelete={isAuthenticated && !isGuest ? handleDeleteTask : null}
                                onEdit={isAuthenticated && !isGuest ? handleEditTask : null}
                              />
                            </div>
                          )}
                        </Draggable>
                      ))}
                  </div>

                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>

      {/* Footer Note */}
      <div className="mt-12 text-center space-y-4 pb-8">
        <p className="text-slate-400 text-sm">
          💡 <span className="text-blue-300">Tip:</span> Drag and drop tasks between columns to change their status
        </p>
        <p className="text-slate-300 text-base font-medium">
          Developed by{' '}
          <a 
            href="https://github.com/hemanthsankar0007" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300 underline hover:no-underline transition-all duration-200 font-semibold text-lg hover:scale-105 inline-block"
          >
            Hemanth Sankar
          </a>
        </p>
      </div>

      <TaskModal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        onTaskAdded={fetchData}
        editingTask={editingTask}
      />
    </div>
  );
};

export default Dashboard;