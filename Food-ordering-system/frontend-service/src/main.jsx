import React from "react";
import ReactDOM from "react-dom/client";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
//import './index.css'
import App from "./App.jsx";
import { AuthProvider } from "./contexts/AuthContext.jsx";

// ReactDOM.createRoot(document.getElementById("root")).render(
//   <React.StrictMode>

//       <App />

//   </React.StrictMode>

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>
);
