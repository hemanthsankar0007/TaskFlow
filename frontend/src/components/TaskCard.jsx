import Tilt from "react-parallax-tilt";

const TaskCard = ({ task, isDragging = false, onDelete, onEdit }) => {
  const statusColor = {
    Completed: "from-green-400/40 to-green-600/20 border-green-300/30 text-green-200",
    "In Progress": "from-blue-400/40 to-blue-600/20 border-blue-300/30 text-blue-200",
    Pending: "from-yellow-400/40 to-yellow-600/20 border-yellow-300/30 text-yellow-200",
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if (window.confirm(`Delete "${task.title}"?`)) {
      onDelete(task._id);
    }
  };

  const handleCardClick = () => {
    if (onEdit && !isDragging) {
      onEdit(task);
    }
  };

  const content = (
    <div
      onClick={handleCardClick}
      className={`glass-panel p-6 rounded-2xl flex flex-col gap-4 overflow-hidden relative
        ${
          isDragging
            ? "shadow-[0_0_20px_rgba(0,0,0,0.6)] scale-[1.02] opacity-90 cursor-grabbing"
            : "hover:shadow-[0_10px_30px_rgba(0,0,0,0.4)] transition-all duration-300 " + (onEdit ? "cursor-pointer" : "cursor-grab")
        }
        animate-[cardPop_0.4s_ease]
      `}
    >
      {/* Delete Button */}
      {onDelete && (
        <button
          onClick={handleDelete}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-red-500/20 hover:bg-red-500/40 border border-red-400/30 flex items-center justify-center transition-all duration-200 hover:scale-110 group z-10"
          title="Delete task"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24" 
            strokeWidth={2} 
            stroke="currentColor" 
            className="w-4 h-4 text-red-300 group-hover:text-red-200"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
          </svg>
        </button>
      )}

      {/* Title */}
      <h3 className="text-xl font-semibold text-white drop-shadow-md pr-8">
        {task.title}
      </h3>

      {/* Description */}
      <p className="text-gray-300 text-sm leading-relaxed opacity-80">
        {task.description}
      </p>

      {/* Status + Avatar */}
      <div className="flex justify-between items-center mt-2">
        <span
          className={`px-3 py-1 text-xs rounded-full border bg-gradient-to-r ${statusColor[task.status]}`}
        >
          {task.status}
        </span>

        {task.assignedTo && (
          <img
            src={task.assignedTo.avatar}
            alt="avatar"
            className="w-10 h-10 rounded-full border border-white/20 shadow-md"
          />
        )}
      </div>
    </div>
  );

  // Disable tilt 100% while dragging
  if (isDragging) return content;

  return (
    <Tilt
      tiltEnable={true}
      glareEnable={true}
      scale={1.03}
      glareMaxOpacity={0.35}
      transitionSpeed={1500}
      tiltMaxAngleX={8}
      tiltMaxAngleY={8}
    >
      {content}
    </Tilt>
  );
};

export default TaskCard;
