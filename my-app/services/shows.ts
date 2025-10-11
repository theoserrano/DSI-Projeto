import axios from "axios";
import Constants from "expo-constants";

import { UPCOMING_SHOWS } from "@/constants/shows";
import { ShowEvent } from "@/types/shows";
import { parseShowsPayload } from "@/utils/shows";

export type ShowsFetchSource = "remote" | "fallback";

export type ShowsFetchResult = {
  data: ShowEvent[];
  source: ShowsFetchSource;
  error?: string;
};

const FALLBACK_RESULT: ShowsFetchResult = {
  data: UPCOMING_SHOWS,
  source: "fallback",
};

export async function fetchShows(): Promise<ShowsFetchResult> {
  const endpoint = getShowsEndpoint();

  if (!endpoint) {
    return {
      ...FALLBACK_RESULT,
      error: "Endpoint dos shows não configurado.",
    };
  }

  try {
    const response = await axios.get<unknown>(endpoint, {
      timeout: 10000,
    });

    const parsed = parseShowsPayload(response.data);

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
      console.warn("[Shows] Falha ao buscar eventos remotos:", error);
    }

    return {
      ...FALLBACK_RESULT,
      error: error instanceof Error ? error.message : "Erro desconhecido",
    };
  }
}

function getShowsEndpoint(): string | null {
  const envValue = process.env.EXPO_PUBLIC_SHOWS_ENDPOINT;
  if (envValue && typeof envValue === "string" && envValue.trim().length > 0) {
    return envValue.trim();
  }

  const extraConfig = Constants.expoConfig?.extra as { showsEndpoint?: string } | undefined;
  if (extraConfig?.showsEndpoint) {
    return extraConfig.showsEndpoint;
  }

  return null;
}
