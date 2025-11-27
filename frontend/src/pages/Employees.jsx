import axios from 'axios';
import { Link } from "react-router-dom";
import { useEffect, useState } from 'react';
import Tilt from "react-parallax-tilt";
import { API_BASE } from '../config';

const Employees = () => {
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    axios.get(`${API_BASE}/api/employees`)
      .then(res => setEmployees(res.data));
  }, []);

  return (
    <div>
      <h2 className="text-4xl font-bold mb-10 bg-clip-text text-transparent 
      bg-gradient-to-r from-blue-200 to-purple-300 drop-shadow-lg">
        Employee Directory
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {employees.map(emp => (
          <Link 
            to={`/employee/${emp._id}`} 
            key={emp._id}
            className="block"
          >
            <Tilt 
              glareEnable={true} 
              glareMaxOpacity={0.3} 
              scale={1.03}
              className="cursor-pointer transition-transform"
            >
              <div className="glass-panel p-8 rounded-3xl flex flex-col items-center gap-4 
                shadow-[0_0_40px_rgba(0,0,0,0.4)] hover:shadow-[0_0_60px_rgba(0,0,0,0.6)]
                transition-all">
                
                <img 
                  src={emp.avatar}
                  className="w-28 h-28 rounded-full border-2 border-white/20 shadow-xl"
                />

                <h3 className="text-2xl font-bold text-white drop-shadow-lg">
                  {emp.name}
                </h3>

                <p className="text-blue-300">{emp.role}</p>
                <p className="text-gray-400 text-sm">{emp.email}</p>
              </div>
            </Tilt>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Employees;
