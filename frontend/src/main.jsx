import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

import { Toaster } from "react-hot-toast";

import "./styles/global.css";
import "./styles/account.css";
import "./styles/profile.css";
import "./styles/favorites.css";
import "./styles/navbar.css";
import "./styles/home.css";

ReactDOM.createRoot(
  document.getElementById("root")
).render(
  <React.StrictMode>
    <App />

    <Toaster
      position="top-right"
      toastOptions={{
        duration: 3000,
      }}
    />
  </React.StrictMode>
);