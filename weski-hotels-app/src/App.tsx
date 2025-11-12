import React, { useRef, useState } from "react";
import NavBar from "./components/navbar/nav-bar";
import { Hotel } from "./types";
import { fetchHotelsStream } from "./hooks/fetchHotelsStream";
import { useSearchFilters } from "./contexts/searchFiltersContext";
import { Loader } from "@mantine/core";
import { isEmpty } from "lodash";

const App: React.FC = () => {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const streamRef = useRef<{ cancel?: () => void } | null>(null);
  const { filters } = useSearchFilters();

  const startStream = async () => {
    setHotels([]);
    setError(null);
    setIsLoading(true);

    const queries = {
      amazon: {
        query: {
          ski_site: filters.skiSiteId,
          from_date: filters.startDate
            ? filters.startDate.toISOString().split("T")[0]
            : null,
          to_date: filters.endDate
            ? filters.endDate.toISOString().split("T")[0]
            : null,
          group_size: filters.groupSize,
        },
      },
    };

    streamRef.current = await fetchHotelsStream(
      queries,
      (item) => {
        console.log(item);
        setHotels((prev) => [...prev, item]);
      },
      () => {
        console.log("Stream finished");
        setIsLoading(false);
      },
      (err) => {
        console.error("Stream error", err);
        setError((err as Error)?.message || "Unknown error");
        setIsLoading(false);
      }
    );
  };

  return (
    <>
      <div className="app">
        <NavBar onSearch={startStream} />
      </div>
      <div className="hotels">
        <div>
          {isLoading && (
            <div className="loader">
              <Loader size={"xl"} />
            </div>
          )}

          {error && (
            <div className="error">
              <p style={{ color: "red" }}>Error: {error}</p>
              <button onClick={startStream}>Try Again</button>
            </div>
          )}

          {!isEmpty(hotels) && (
            <ul>
              {hotels.map((h, i) => (
                <li key={i}>
                  {
                    <span>
                      {h.name} — {h.provider} — ${h.priceInfo?.amountAfterTax}
                    </span>
                  }
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
};

export default App;
