import React, { createContext, useState } from "react";

interface Report {
  id: string;
  vehicleId: string;
  date: string;
  site: string;
  destination: string;
  mileage: number;
  dailyDistance: number;
  driver: string;
  condition: string;
  notes: string;
}

interface ReportContextType {
  reports: Report[];
  addReport: (report: Report) => void;
  updateReport: (report: Report) => void;
  editingReport: Report | null;
  setEditingReport: (report: Report | null) => void;
}

export const ReportContext = createContext<ReportContextType | null>(null);

export const ReportProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [reports, setReports] = useState<Report[]>([]);
  const [editingReport, setEditingReport] = useState<Report | null>(null);

  const addReport = (report: Report) => {
    setReports([...reports, report]);
  };

  const updateReport = (updated: Report) => {
    setReports(reports.map((r) => (r.id === updated.id ? updated : r)));
  };

  return (
    <ReportContext.Provider value={{ reports, addReport, updateReport, editingReport, setEditingReport }}>
      {children}
    </ReportContext.Provider>
  );
};
