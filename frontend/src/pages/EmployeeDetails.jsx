import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { API_BASE } from '../config';

const EmployeeDetails = () => {
  const { id } = useParams();
  const [employee, setEmployee] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        // Fetch employee list (until we add /employees/:id)
        const empRes = await axios.get(`${API_BASE}/api/employees`);
        setEmployee(empRes.data.find((e) => e._id === id));

        // Fetch tasks assigned to employee
        const tasksRes = await axios.get(
          `${API_BASE}/api/employees/${id}/tasks`
        );
        setTasks(tasksRes.data);
      } catch (err) {
        console.error("Error loading employee details:", err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  if (loading) return <div className="text-white text-xl">Loading...</div>;

  if (!employee)
    return (
      <div className="text-red-300 text-xl text-center">
        Employee not found.
      </div>
    );

  return (
    <div className="space-y-10">
      {/* Employee Profile */}
      <div className="glass-panel p-8 rounded-2xl flex items-center gap-8 shadow-lg border border-white/10">
        <img
          src={employee.avatar}
          alt={employee.name}
          className="w-32 h-32 rounded-full border border-white/20 shadow-xl"
        />
        <div>
          <h1 className="text-4xl font-bold text-white drop-shadow-md">
            {employee.name}
          </h1>
          <p className="text-blue-300 text-lg">{employee.role}</p>
          <p className="text-gray-300 mt-2">{employee.email}</p>
        </div>
      </div>

      {/* Tasks Section */}
      <h2 className="text-3xl font-bold text-white mb-4 drop-shadow-md">
        Assigned Tasks
      </h2>

      {tasks.length > 0 ? (
        <div className="grid gap-6 animate-[fadeIn_0.6s_ease]">
          {tasks.map((t) => (
            <div
              key={t._id}
              className="glass-panel p-6 rounded-xl text-left border border-white/10 shadow-lg transition hover:shadow-[0_0_25px_rgba(0,0,0,0.4)]"
            >
              <h3 className="text-xl font-bold text-white drop-shadow-md">
                {t.title}
              </h3>

              <p className="text-gray-300 mt-2">{t.description}</p>

              <span
                className={`inline-block px-3 py-1 mt-4 rounded-full text-sm font-medium
                  ${
                    t.status === "Completed"
                      ? "bg-green-500/20 text-green-300"
                      : t.status === "In Progress"
                      ? "bg-blue-500/20 text-blue-300"
                      : "bg-yellow-500/20 text-yellow-300"
                  }
                `}
              >
                {t.status}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div className="glass-panel p-8 rounded-2xl text-center text-gray-400 text-lg">
          No tasks assigned.
        </div>
      )}
    </div>
  );
};

export default EmployeeDetails;
