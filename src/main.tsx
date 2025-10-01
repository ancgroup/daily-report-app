import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { VehicleProvider } from "./context/VehicleContext";
import { DriverProvider } from "./context/DriverContext";
import { ReportProvider } from "./context/ReportContext";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <VehicleProvider>
      <DriverProvider>
        <ReportProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </ReportProvider>
      </DriverProvider>
    </VehicleProvider>
  </React.StrictMode>
);
