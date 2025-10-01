import React, { createContext, useState, useEffect, ReactNode } from "react";

export interface Report {
  id: string;
  vehicleId: string;
  driverId: string;  // ← ここを変更（名前ではなくIDを保存）
  date: string;
  site: string;
  destination: string;
  mileage: number;
  condition: string;
  notes: string;
}

interface ReportContextType {
  reports: Report[];
  addReport: (report: Report) => void;
  updateReport: (report: Report) => void;
  deleteReport: (id: string) => void;
  setReports: React.Dispatch<React.SetStateAction<Report[]>>;
  editingReport: Report | null;
  setEditingReport: (report: Report | null) => void;
}

export const ReportContext = createContext<ReportContextType | undefined>(
  undefined
);

export const ReportProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [reports, setReports] = useState<Report[]>([]);
  const [editingReport, setEditingReport] = useState<Report | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("reports");
    if (saved) {
      try {
        setReports(JSON.parse(saved));
      } catch (e) {
        console.error("日報データの復元に失敗しました", e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("reports", JSON.stringify(reports));
  }, [reports]);

  const addReport = (report: Report) => {
    setReports((prev) => [...prev, report]);
  };

  const updateReport = (updated: Report) => {
    setReports((prev) =>
      prev.map((r) => (r.id === updated.id ? updated : r))
    );
  };

  const deleteReport = (id: string) => {
    setReports((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <ReportContext.Provider
      value={{
        reports,
        addReport,
        updateReport,
        deleteReport,
        setReports,
        editingReport,
        setEditingReport,
      }}
    >
      {children}
    </ReportContext.Provider>
  );
};
