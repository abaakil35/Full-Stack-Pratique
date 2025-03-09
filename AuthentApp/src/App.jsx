import React, { useState } from "react";
import LoginForm from "./assets/components/LoginForm";
import RegisterForm from "./assets/components/RegisterForm";
import "./index.css";

const App = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="app">
      <h1>{isLogin ? "Login" : "Register"}</h1>
      {isLogin ? <LoginForm /> : <RegisterForm />}
      <button onClick={() => setIsLogin(!isLogin)}>
        {isLogin ? "Need an account? Register" : "Already have an account? Login"}
      </button>
    </div>
  );
};

export default App;