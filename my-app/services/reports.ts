import axios from "axios";
import Constants from "expo-constants";

import { createReportFromPayload } from "@/utils/reports";
import type { CreateReportPayload, Report } from "@/types/reports";

export type ReportsServiceResponse<T> = {
  data: T;
  source: "remote" | "local";
  error?: string;
};

const REQUEST_TIMEOUT = 10000;

export async function createReport(
  payload: CreateReportPayload
): Promise<ReportsServiceResponse<Report>> {
  const endpoint = getReportsEndpoint();

  if (!endpoint) {
    return {
      data: createReportFromPayload(payload),
      source: "local",
      error: "Sem endpoint remoto configurado. Registro criado apenas localmente.",
    };
  }

  try {
    const response = await axios.post<Report>(endpoint, payload, {
      timeout: REQUEST_TIMEOUT,
    });

    if (!response.data) {
      return {
        data: createReportFromPayload(payload),
        source: "local",
        error: "Resposta inválida ao criar denúncia. Registro local criado.",
      };
    }

    return {
      data: response.data,
      source: "remote",
    };
  } catch (error) {
    if (__DEV__) {
      console.warn("[Reports] Falha ao criar denúncia:", error);
    }

    return {
      data: createReportFromPayload(payload),
      source: "local",
      error: error instanceof Error ? error.message : "Erro desconhecido",
    };
  }
}

function getReportsEndpoint(): string | null {
  const envValue = process.env.EXPO_PUBLIC_REPORTS_ENDPOINT;
  if (envValue && typeof envValue === "string" && envValue.trim().length > 0) {
    return envValue.trim();
  }

  const extraConfig = Constants.expoConfig?.extra as { reportsEndpoint?: string } | undefined;
  if (extraConfig?.reportsEndpoint) {
    return extraConfig.reportsEndpoint;
  }

  return null;
}
