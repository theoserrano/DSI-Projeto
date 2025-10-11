import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  createReport as createReportService,
  fetchReports,
  updateReportStatus as updateReportStatusService,
  type ReportsFetchSource,
} from "@/services/reports";
import type {
  CreateReportPayload,
  Report,
  ReportStatus,
  UpdateReportStatusPayload,
} from "@/types/reports";
import {
  applyReportStatusUpdate,
  getReportsSeed,
  sortReportsByDate,
} from "@/utils/reports";

export type ReportsContextValue = {
  reports: Report[];
  totalsByStatus: Record<ReportStatus, number>;
  isLoading: boolean;
  source: ReportsFetchSource;
  lastError: string | null;
  refresh: () => Promise<void>;
  createReport: (payload: CreateReportPayload) => Promise<Report>;
  changeStatus: (input: UpdateReportStatusPayload) => Promise<Report | null>;
  getReportById: (id: string) => Report | undefined;
};

const ReportsContext = createContext<ReportsContextValue | undefined>(undefined);

export const ReportsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [reports, setReports] = useState<Report[]>(() => getReportsSeed());
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [lastError, setLastError] = useState<string | null>(null);
  const [source, setSource] = useState<ReportsFetchSource>("fallback");

  const refresh = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await fetchReports();
      setReports(sortReportsByDate(result.data));
      setSource(result.source);
      setLastError(result.error ?? null);
    } catch (error) {
      if (__DEV__) {
        console.warn("[ReportsContext] Falha ao atualizar denúncias:", error);
      }
      setLastError(error instanceof Error ? error.message : "Erro desconhecido");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const createReport = useCallback(async (payload: CreateReportPayload) => {
    const result = await createReportService(payload);

    setReports((prev) => {
      const next = [result.data, ...prev.filter((report) => report.id !== result.data.id)];
      return sortReportsByDate(next);
    });
    setSource(result.source);
    setLastError(result.error ?? null);

    return result.data;
  }, []);

  const changeStatus = useCallback(async (input: UpdateReportStatusPayload) => {
    const result = await updateReportStatusService(input);

    setSource(result.source);
    setLastError(result.error ?? null);

    let updatedReport: Report | null = null;

    setReports((prev) =>
      prev.map((report) => {
        if (report.id !== input.id) {
          return report;
        }

        updatedReport = applyReportStatusUpdate(report, {
          id: input.id,
          status: input.status,
          resolutionNotes: input.resolutionNotes,
        });

        return updatedReport;
      })
    );

    return updatedReport;
  }, []);

  const getReportById = useCallback(
    (id: string) => reports.find((report) => report.id === id),
    [reports]
  );

  const totalsByStatus = useMemo(() => {
    return reports.reduce(
      (acc, report) => {
        acc[report.status] = (acc[report.status] ?? 0) + 1;
        return acc;
      },
      {
        open: 0,
        in_review: 0,
        resolved: 0,
        dismissed: 0,
      } as Record<ReportStatus, number>
    );
  }, [reports]);

  const value = useMemo<ReportsContextValue>(
    () => ({
      reports,
      totalsByStatus,
      isLoading,
      source,
      lastError,
      refresh,
      createReport,
      changeStatus,
      getReportById,
    }),
    [reports, totalsByStatus, isLoading, source, lastError, refresh, createReport, changeStatus, getReportById]
  );

  return <ReportsContext.Provider value={value}>{children}</ReportsContext.Provider>;
};

export function useReports(): ReportsContextValue {
  const context = useContext(ReportsContext);
  if (!context) {
    throw new Error("useReports deve ser usado dentro de ReportsProvider");
  }

  return context;
}
