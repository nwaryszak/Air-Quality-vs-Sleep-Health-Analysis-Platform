import React from "react";
import { NavLink, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const linkStyle = {
    color: "white",
    textDecoration: "none",
    fontWeight: "500",
  };

  const activeStyle = {
    textDecoration: "underline",
  };

  return (
    <nav
      style={{
        padding: "1rem 2rem",
        backgroundColor: "#333",
        display: "flex",
        alignItems: "center",
        gap: "1.5rem",
      }}
    >
      {token ? (
        <>
          <NavLink
            to="/dashboard"
            style={({ isActive }) => (isActive ? { ...linkStyle, ...activeStyle } : linkStyle)}
          >
            Strona główna
          </NavLink>
          <NavLink
            to="/patients"
            style={({ isActive }) => (isActive ? { ...linkStyle, ...activeStyle } : linkStyle)}
          >
            Pacjenci
          </NavLink>
          <NavLink
            to="/profile"
            style={({ isActive }) => (isActive ? { ...linkStyle, ...activeStyle } : linkStyle)}
          >
            Profil
          </NavLink>
          <NavLink
            to="/charts"
            style={({ isActive }) => (isActive ? { ...linkStyle, ...activeStyle } : linkStyle)}
          >
            Wykresy
          </NavLink>
          <NavLink
            to="/air-quality"
            style={({ isActive }) => (isActive ? { ...linkStyle, ...activeStyle } : linkStyle)}
          >
            Jakość powietrza
          </NavLink>

          <button
            onClick={handleLogout}
            style={{
              marginLeft: "auto",
              backgroundColor: "#ff4d4d",
              border: "none",
              padding: "0.4rem 1rem",
              borderRadius: "4px",
              color: "white",
              cursor: "pointer",
              fontWeight: "600",
            }}
          >
            Wyloguj
          </button>
        </>
      ) : (
        <>
          <NavLink
            to="/login"
            style={({ isActive }) => (isActive ? { ...linkStyle, ...activeStyle } : linkStyle)}
          >
            Logowanie
          </NavLink>
          <NavLink
            to="/register"
            style={({ isActive }) => (isActive ? { ...linkStyle, ...activeStyle } : linkStyle)}
          >
            Rejestracja
          </NavLink>
        </>
      )}
    </nav>
  );
}

export default Navbar;
