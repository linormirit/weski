import { Hotel } from "../types";

async function fetchHotelsStream(
  queries: Record<string, unknown>,
  onItem: (item: Hotel) => void,
  onFinished?: () => void,
  onError?: (err: unknown) => void
) {
  const controller = new AbortController();
  const signal = controller.signal;

  try {
    const response = await fetch("http://localhost:3001/hotels/stream", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(queries),
      signal,
    });

    if (!response.ok) {
      throw new Error(
        `Stream request failed: ${response.status} ${response.statusText}`
      );
    }

    const reader = response.body?.getReader();
    if (!reader) throw new Error("Response body is not readable.");

    const decoder = new TextDecoder();
    let buf = ""; 

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buf += decoder.decode(value, { stream: true });
      
      const lines = buf.split("\n");
      buf = lines.pop() ?? ""; 

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed) continue;
        try {
          const obj = JSON.parse(trimmed);
          onItem(obj);
        } catch (err) {
          console.warn("Failed to parse NDJSON line:", trimmed, err);
        }
      }
    }

    if (buf.trim()) {
      try {
        const obj = JSON.parse(buf.trim());
        onItem(obj);
      } catch (err) {
        console.warn("Failed to parse final NDJSON chunk:", buf, err);
      }
    }

    onFinished?.();
  } catch (err) {
    if ((err as { name?: string }).name === "AbortError") {
      onError?.(err);
      return { cancel: () => {} };
    }
    onError?.(err);
    throw err;
  }

  return {
    cancel: () => controller.abort(),
  };
}

export { fetchHotelsStream };
