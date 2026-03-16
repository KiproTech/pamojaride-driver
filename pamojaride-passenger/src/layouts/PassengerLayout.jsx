import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import "./PassengerLayout.css";

const PassengerLayout = () => {
  return (
    <div className="passenger-layout">
      <Navbar />
      <main className="layout-content">
        <Outlet />
      </main>
    </div>
  );
};

export default PassengerLayout;