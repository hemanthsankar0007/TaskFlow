import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Employees from './pages/Employees';
import EmployeeDetails from './pages/EmployeeDetails';
import Login from './pages/Login';

// -------------- PROTECTED ROUTE --------------
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isGuest } = useAuth();
  return isAuthenticated || isGuest ? children : <Navigate to="/login" replace />;
};

// -------------- MAIN APP --------------
const AppContent = () => {
  const location = useLocation();
  const hideNavbar = location.pathname === "/login";

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#05060d] via-[#0b1a45] to-[#020614] text-white font-sans selection:bg-blue-500 selection:text-white">

      {/* Hide Navbar on login page */}
      {!hideNavbar && <Navbar />}

      <div className={`${hideNavbar ? "" : "pt-32 md:pt-40 pb-16"} px-4 sm:px-8`}>
        <div className="max-w-7xl mx-auto w-full">
          <Routes>
            <Route path="/login" element={<Login />} />

            <Route 
              path="/" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />

            <Route 
              path="/employees" 
              element={
                <ProtectedRoute>
                  <Employees />
                </ProtectedRoute>
              } 
            />

            <Route 
              path="/employee/:id" 
              element={
                <ProtectedRoute>
                  <EmployeeDetails />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </div>
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
