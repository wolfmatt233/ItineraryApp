import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function Nav() {
  const { user, logout } = useAuth();

  return (
    <nav>
      {user ? (
        <>
          <button>Itineraries</button>
          <button>Log Out</button>
        </>
      ) : (
        <>
          <button>Log In</button>
          <button>Sign Up</button>
        </>
      )}
    </nav>
  );
}
