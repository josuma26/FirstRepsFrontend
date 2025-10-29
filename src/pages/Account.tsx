import { useEffect, useState } from "react";
import { getMe } from "../api/api";
import React from "react";

export default function Account({ token, onLogout }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await getMe(token);
        setUser(data);
      } catch (err) {
        console.error(err);
        onLogout();
      }
    };
    fetchUser();
  }, [token]);

  if (!user) return <p>Loading...</p>;

  return (
    <div style={{ maxWidth: 400, margin: "100px auto" }}>
      <h2>Account</h2>
      <p><strong>Name:</strong> {user.name}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <button onClick={onLogout}>Logout</button>
    </div>
  );
}
