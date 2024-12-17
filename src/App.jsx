import { useContext, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import { AuthContext } from "./AuthContext"; // Import your AuthContext
import Login from "./components/Login";
import Signup from "./components/Signup";
import AdminDashboard from "./components/AdminDashboard";
import UserDashboard from "./components/UserDashboard";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomeRedirect />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/dashboard" element={<UserDashboard />} />
      </Routes>
    </Router>
  );
}

function HomeRedirect() {
  const { user, loading } = useContext(AuthContext); // Use the user from AuthContext
  const navigate = useNavigate();

  useEffect(() => {
    //due to loading user is null in start and shows login instead of dashboard
    if (!loading) {
      if (!user) {
        navigate("/login");
      } else if (user?.uid === "Mf9uYeC2MoVju4ug5aZl7UqlQFs1") {
        // Replace with the specific UID
        navigate("/admin-dashboard");
      } else {
        navigate("/dashboard");
      }
    }
    if (!user) navigate("/login");
  }, [user, navigate]);

  return null; // This component doesn't render anything
}

export default App;
