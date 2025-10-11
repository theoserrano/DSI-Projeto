import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

import { UPCOMING_SHOWS } from "@/constants/shows";
import { ShowsFetchResult, fetchShows } from "@/services/shows";
import { ShowEvent } from "@/types/shows";

type ShowsStatus = "idle" | "loading" | "ready";

type ShowsContextValue = {
  shows: ShowEvent[];
  status: ShowsStatus;
  source: ShowsFetchResult["source"];
  error: string | null;
  refresh: () => Promise<void>;
};

const ShowsContext = createContext<ShowsContextValue | undefined>(undefined);

export function ShowsProvider({ children }: { children: React.ReactNode }) {
  const [shows, setShows] = useState<ShowEvent[]>(UPCOMING_SHOWS);
  const [status, setStatus] = useState<ShowsStatus>(UPCOMING_SHOWS.length ? "ready" : "idle");
  const [source, setSource] = useState<ShowsFetchResult["source"]>("fallback");
  const [error, setError] = useState<string | null>(null);

  const applyResult = useCallback((result: ShowsFetchResult) => {
    setShows(result.data);
    setSource(result.source);
    setStatus("ready");
    setError(result.error ?? null);
  }, []);

  const loadShows = useCallback(async () => {
    setStatus("loading");
    const result = await fetchShows();
    applyResult(result);
  }, [applyResult]);

  useEffect(() => {
    let isMounted = true;

    (async () => {
      const result = await fetchShows();

      if (!isMounted) {
        return;
      }

      applyResult(result);
    })();

    return () => {
      isMounted = false;
    };
  }, [applyResult]);

  const value = useMemo<ShowsContextValue>(
    () => ({
      shows,
      status,
      source,
      error,
      refresh: loadShows,
    }),
    [shows, status, source, error, loadShows]
  );

  return <ShowsContext.Provider value={value}>{children}</ShowsContext.Provider>;
}

export function useShows() {
  const context = useContext(ShowsContext);

  if (!context) {
    throw new Error("useShows precisa ser utilizado dentro de ShowsProvider");
  }

  return context;
}
