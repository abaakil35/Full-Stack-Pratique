import React, { useState } from "react";
import axios from "axios";
import CircularProgress from "@mui/material/CircularProgress";


const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true); // Start loading
    setMessage(""); // Clear any previous message

    try {
      const response = await axios.post("http://localhost:5000/login", {
        email,
        password,
      });
      setMessage(response.data.message); // Set success message
    } catch (error) {
      // Handle errors
      if (error.response) {
        // Server responded with a status code outside 2xx
        setMessage(error.response.data.message || "An error occurred");
      } else if (error.request) {
        // Request was made but no response received
        setMessage("No response from the server. Please try again.");
      } else {
        // Something else went wrong
        setMessage("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form">
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        disabled={loading} // Disable input while loading
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        disabled={loading} // Disable input while loading
      />
      {loading && <CircularProgress className="login-progress" />}
      <button type="submit" className="login-button" disabled={loading}>
        {loading ? "Logging in..." : "Login"}
      </button>
      {message && <p className="message">{message}</p>}
    </form>
  );
};

export default LoginForm;