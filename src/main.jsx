import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { PassengerProvider } from "./context/PassengerContext"; // <-- correct import

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <PassengerProvider> {/* <-- wrap your app with PassengerProvider */}
        <App />
      </PassengerProvider>
    </BrowserRouter>
  </React.StrictMode>
);