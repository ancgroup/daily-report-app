import React, { createContext, useState, useEffect, ReactNode } from "react";

export interface Driver {
  id: string;
  name: string;
}

interface DriverContextType {
  drivers: Driver[];
  addDriver: (driver: Driver) => void;
  updateDriver: (driver: Driver) => void;
  deleteDriver: (id: string) => void;
  setDrivers: React.Dispatch<React.SetStateAction<Driver[]>>;
}

export const DriverContext = createContext<DriverContextType | undefined>(
  undefined
);

export const DriverProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [drivers, setDrivers] = useState<Driver[]>([]);

  // 🔹 初回ロード時 localStorage から復元
  useEffect(() => {
    const saved = localStorage.getItem("drivers");
    if (saved) {
      try {
        setDrivers(JSON.parse(saved));
      } catch (e) {
        console.error("運転者データの復元に失敗しました", e);
      }
    }
  }, []);

  // 🔹 drivers が変わるたび localStorage に保存
  useEffect(() => {
    localStorage.setItem("drivers", JSON.stringify(drivers));
  }, [drivers]);

  const addDriver = (driver: Driver) => {
    // id を必ず文字列で保存
    setDrivers((prev) => [...prev, { ...driver, id: String(driver.id) }]);
  };

  const updateDriver = (updated: Driver) => {
    setDrivers((prev) =>
      prev.map((d) => (d.id === updated.id ? { ...updated, id: String(updated.id) } : d))
    );
  };

  const deleteDriver = (id: string) => {
    setDrivers((prev) => prev.filter((d) => d.id !== id));
  };

  return (
    <DriverContext.Provider value={{ drivers, addDriver, updateDriver, deleteDriver, setDrivers }}>
      {children}
    </DriverContext.Provider>
  );
};
