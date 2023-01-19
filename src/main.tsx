import React from "react";
import ReactDOM from "react-dom/client";
import { Route, Routes } from "react-router";
import { HashRouter, Link } from "react-router-dom";
import About from "./About";
import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <HashRouter>
      <div className="max-w-lg mx-auto">
        <div className="flex justify-between">
          <Link to="/" className="text-xl">
            App
          </Link>
          <Link to="/about" className="text-xl">
            About
          </Link>
        </div>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </div>
    </HashRouter>
  </React.StrictMode>
);
