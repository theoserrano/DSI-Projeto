import axios from "axios";
import Constants from "expo-constants";

import { getReportsSeed, parseReport, parseReports, createReportFromPayload } from "@/utils/reports";
import type {
  CreateReportPayload,
  Report,
  ReportStatus,
  UpdateReportStatusPayload,
} from "@/types/reports";

export type ReportsFetchSource = "remote" | "fallback" | "local";

export type ReportsServiceResponse<T> = {
  data: T;
  source: ReportsFetchSource;
  error?: string;
};

const REQUEST_TIMEOUT = 10000;

const FALLBACK_RESULT: ReportsServiceResponse<Report[]> = {
  data: getReportsSeed(),
  source: "fallback",
};

export async function fetchReports(): Promise<ReportsServiceResponse<Report[]>> {
  const endpoint = getReportsEndpoint();

  if (!endpoint) {
    return {
      ...FALLBACK_RESULT,
      error: "Endpoint de denúncias não configurado.",
    };
  }

  try {
    const response = await axios.get<unknown>(endpoint, {
      timeout: REQUEST_TIMEOUT,
    });

    const parsed = parseReports(response.data);

    if (parsed.length === 0) {
      return {
        ...FALLBACK_RESULT,
        error: "Resposta do servidor vazia ou inválida.",
      };
    }

    return {
      data: parsed,
      source: "remote",
    };
  } catch (error) {
    if (__DEV__) {
      console.warn("[Reports] Falha ao buscar denúncias:", error);
    }

    return {
      ...FALLBACK_RESULT,
      error: error instanceof Error ? error.message : "Erro desconhecido",
    };
  }
}

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
    const response = await axios.post<unknown>(endpoint, payload, {
      timeout: REQUEST_TIMEOUT,
    });

    const parsed = parseReport(response.data);

    if (!parsed) {
      return {
        data: createReportFromPayload(payload),
        source: "local",
        error: "Resposta inválida ao criar denúncia. Registro local criado.",
      };
    }

    return {
      data: parsed,
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

export async function updateReportStatus(
  input: UpdateReportStatusPayload
): Promise<ReportsServiceResponse<UpdateReportStatusPayload>> {
  const endpoint = getReportsEndpoint();

  if (!endpoint) {
    return {
      data: input,
      source: "local",
      error: "Sem endpoint remoto configurado. Atualização aplicada apenas localmente.",
    };
  }

  try {
    await axios.patch(
      `${endpoint}/${input.id}`,
      { status: input.status, resolutionNotes: input.resolutionNotes },
      { timeout: REQUEST_TIMEOUT }
    );

    return {
      data: input,
      source: "remote",
    };
  } catch (error) {
    if (__DEV__) {
      console.warn("[Reports] Falha ao atualizar status:", error);
    }

    return {
      data: input,
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
