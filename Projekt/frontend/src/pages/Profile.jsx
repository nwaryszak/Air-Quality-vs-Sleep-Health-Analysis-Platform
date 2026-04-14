import React, { useEffect, useState } from "react";

function parseJwt(token) {
  if (!token) return null;
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error("Błąd parsowania tokena JWT:", e);
    return null;
  }
}

function Profile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = parseJwt(token);
      if (decoded) {
        setUser({
          email: decoded.email,
        });
      }
    }
  }, []);

  if (!user) return <p>Nie jesteś zalogowany</p>;

  return (
    <div style={{ padding: "1rem" }}>
      <h2>Profil użytkownika</h2>

      <p><strong>Email:</strong> {user.email}</p>
    </div>
  );
}

export default Profile;
