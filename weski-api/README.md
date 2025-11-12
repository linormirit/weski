# Weski API (example)


This is a minimal Node.js Express example (converted to TypeScript) showing a generic adapter pattern for multiple hotel providers and a streaming endpoint that returns hotels as they arrive.

Endpoints:

- GET /hotels/stream — streams hotels as NDJSON (one JSON object per line). Each provider's results are written as soon as the provider returns them; consumer can process items incrementally.
- GET /hotels — returns aggregated JSON after all providers finish (array of hotels + errors).

How the adapters work:

- Each adapter exports { name, fetchHotels } where fetchHotels returns a Promise resolving to an array of normalized Hotel objects.
- Normalized Hotel shape: { id, name, city, rating, price, provider }

Why NDJSON for streaming?

- NDJSON (newline-delimited JSON) is easy for servers to stream with chunked responses and for clients to parse incrementally.
- Alternatively you can use Server-Sent Events (SSE) if you prefer event semantics.

Run locally (recommended):

```bash
cd weski-api
npm install
npm run dev    # for development with auto-reload (requires dev deps)
npm run build  # to compile to JS
npm start      # runs dist/index.js
```

Try streaming with curl:

```bash
curl http://localhost:3001/hotels/stream
```

Or in a browser using fetch stream reader to parse NDJSON.
