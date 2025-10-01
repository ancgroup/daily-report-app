import React, { createContext, useState, useEffect, ReactNode } from "react";

export interface Vehicle {
  id: string;
  name: string;
  oilChangeOdometer: number;
  elementChanged: boolean;
}

interface VehicleContextType {
  vehicles: Vehicle[];
  addVehicle: (vehicle: Vehicle) => void;
  updateVehicle: (vehicle: Vehicle) => void;
  deleteVehicle: (id: string) => void;
  setVehicles: React.Dispatch<React.SetStateAction<Vehicle[]>>;
}

export const VehicleContext = createContext<VehicleContextType | undefined>(
  undefined
);

export const VehicleProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);

  // 🔹 初回ロード時 localStorage から復元
  useEffect(() => {
    const saved = localStorage.getItem("vehicles");
    if (saved) {
      try {
        setVehicles(JSON.parse(saved));
      } catch (e) {
        console.error("車両データの復元に失敗しました", e);
      }
    }
  }, []);

  // 🔹 vehicles が変わるたび localStorage に保存
  useEffect(() => {
    localStorage.setItem("vehicles", JSON.stringify(vehicles));
  }, [vehicles]);

  const addVehicle = (vehicle: Vehicle) => {
    // id を必ず文字列で保存
    setVehicles((prev) => [...prev, { ...vehicle, id: String(vehicle.id) }]);
  };

  const updateVehicle = (updated: Vehicle) => {
    setVehicles((prev) =>
      prev.map((v) => (v.id === updated.id ? { ...updated, id: String(updated.id) } : v))
    );
  };

  const deleteVehicle = (id: string) => {
    setVehicles((prev) => prev.filter((v) => v.id !== id));
  };

  return (
    <VehicleContext.Provider value={{ vehicles, addVehicle, updateVehicle, deleteVehicle, setVehicles }}>
      {children}
    </VehicleContext.Provider>
  );
};
