import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE } from '../config';

const EmployeeBackground = () => {
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get(`${API_BASE}/api/employees`);
        setEmployees(response.data);
      } catch (error) {
        console.error('Error fetching employees:', error);
      }
    };
    fetchEmployees();
  }, []);

  // Duplicate employees multiple times for seamless loop
  const duplicatedEmployees = [...employees, ...employees, ...employees, ...employees];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30 blur-md">
      <div className="absolute top-1/2 -translate-y-1/2 flex gap-8 animate-slide-forever">
        {duplicatedEmployees.map((employee, index) => (
          <div
            key={`${employee._id}-${index}`}
            className="flex-shrink-0"
          >
            {employee.avatar ? (
              <img 
                src={employee.avatar} 
                alt={employee.name}
                className="w-32 h-32 rounded-full object-cover shadow-2xl"
              />
            ) : (
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-3xl font-bold shadow-2xl">
                {employee.name?.charAt(0) || 'E'}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmployeeBackground;
