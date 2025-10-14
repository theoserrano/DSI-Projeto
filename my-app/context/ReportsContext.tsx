import React, { createContext, useCallback, useContext } from "react";

import { createReport as createReportService } from "@/services/reports";
import type { CreateReportPayload, Report } from "@/types/reports";

export type ReportsContextValue = {
  createReport: (payload: CreateReportPayload) => Promise<Report>;
};

const ReportsContext = createContext<ReportsContextValue | undefined>(undefined);

export const ReportsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const createReport = useCallback(async (payload: CreateReportPayload) => {
    const result = await createReportService(payload);

    if (result.error && __DEV__) {
      console.warn("[ReportsContext] Falha ao enviar denúncia:", result.error);
    }

    return result.data;
  }, []);

  return (
    <ReportsContext.Provider
      value={{
        createReport,
      }}
    >
      {children}
    </ReportsContext.Provider>
  );
};

export function useReports(): ReportsContextValue {
  const context = useContext(ReportsContext);
  if (!context) {
    throw new Error("useReports deve ser usado dentro de ReportsProvider");
  }

  return context;
}
