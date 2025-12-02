// src/App.jsx
import { useState } from "react";
import Login from "./Login";
import Register from "./Register";
import Dashboard from "./Dashboard";
import CourierDashboard from "./CourierDashboard";
import CourierSettings from "./CourierSettings";
import HomeownerSettings from "./HomeownerSettings";
import HomeownerHistory from "./HomeownerHistory";
import { auth, db } from "./firebase";
import { ref, get } from "firebase/database";

function App() {
  const [page, setPage] = useState("login");
  const [role, setRole] = useState(null);

  const handleLoginSuccess = async () => {
    const uid = auth.currentUser?.uid;
    if (!uid) return;

    const snapshot = await get(ref(db, `users/${uid}/role`));
    const userRole = snapshot.val();
    setRole(userRole);

    if (userRole === "courier") setPage("courier");
    else setPage("dashboard");
  };

  const handleLogout = () => {
    setPage("login");
    setRole(null);
  };

  return (
    <>
      {page === "login" && (
        <div className="page">
          <Login
            onLogin={(toPage) => {
              if (toPage === "register") setPage("register");
              else handleLoginSuccess();
            }}
          />
        </div>
      )}

      {page === "register" && (
        <div className="page">
          <Register onRegister={() => setPage("login")} />
        </div>
      )}

      {page === "dashboard" && (
        <div className="page">
          <Dashboard
            onLogout={handleLogout}
            onSettings={() => setPage("homeowner-settings")}
            onHistory={() => setPage("homeowner-history")}
          />
        </div>
      )}

      {page === "homeowner-settings" && (
        <div className="page">
          <HomeownerSettings
            onBack={() => setPage("dashboard")}
            onLogout={handleLogout}
          />
        </div>
      )}

      {page === "homeowner-history" && (
        <div className="page">
          <HomeownerHistory onBack={() => setPage("dashboard")} />
        </div>
      )}

      {page === "courier" && (
        <div className="page">
          <CourierDashboard
            onLogout={handleLogout}
            onSettings={() => setPage("courier-settings")}
          />
        </div>
      )}

      {page === "courier-settings" && (
        <div className="page">
          <CourierSettings
            onBack={() => setPage("courier")}
            onLogout={handleLogout}
          />
        </div>
      )}
    </>
  );
}

export default App;
