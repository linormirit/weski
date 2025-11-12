import express, { Request, Response } from "express";
import cors from "cors";
import { adapters } from "./providers";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(
  cors({
    origin: process.env.FRONTEND_ORIGIN || true,
  })
);

app.post("/hotels/stream", async (req: Request, res: Response) => {
  console.log("POST /hotels/stream received");
  
  res.setHeader("Content-Type", "application/x-ndjson; charset=utf-8");
  res.setHeader("Transfer-Encoding", "chunked");

  const onClose = () => {
    console.log("Client disconnected from stream");
  };

  req.on("close", onClose);

  try {
    console.log(req.body);
    if (!req.body) {
      console.log("ERROR: Missing request body");
      res.status(400).send("Bad Request: Missing query in request body");
      return;
    }

    console.log("POST /hotels/stream - body keys:", Object.keys(req.body));

    const queries = req.body;
    console.log("queries:", JSON.stringify(queries, null, 2));
    
    // validate adapters exist for requested providers
    for (const provider of Object.keys(queries)) {
      if (!adapters[provider as any]) {
        console.log(`ERROR: Provider '${provider}' not found`);
        res.write(
          JSON.stringify({
            error: `Provider '${provider}' not found`,
            provider,
          }) + "\n"
        );
      }
    }

    const promises = Object.entries(queries).map(async ([provider, query]) => {
      try {
        if (!adapters[provider as any]) {
          console.log(`SKIP: Provider '${provider}' not available`);
          return;
        }
        
        console.log(
          `Calling adapter ${provider} with query keys:`,
          Object.keys(query || {})
        );
        const hotels = await adapters[provider as any].fetchHotels(query);
        console.log(`Adapter ${provider} returned ${hotels?.length ?? 0} hotels`);
        
        if (Array.isArray(hotels)) {
          for (const hotel of hotels) {
            console.log(
              `Streaming hotel from ${provider}:`,
              hotel.id || hotel.name
            );
            res.write(JSON.stringify(hotel) + "\n");
          }
        }
      } catch (err: any) {
        console.error(`ERROR in adapter ${provider}:`, err);
        res.write(
          JSON.stringify({
            error: err?.message || String(err),
            provider: provider,
          }) + "\n"
        );
      }
    });

    await Promise.allSettled(promises);
    console.log("All promises settled, ending response");
    res.end();
  } catch (err: any) {
    console.error("ERROR in /hotels/stream handler:", err);
    try {
      res.write(
        JSON.stringify({ error: err?.message || String(err) }) + "\n"
      );
    } catch (e) {
      console.error("Failed to write error to response:", e);
    }
    res.end();
  }
});

app.get("/", (_req: Request, res: Response) => {
  res.send("Weski API");
});

app.listen(PORT, () => console.log(`weski-api listening on ${PORT}`));
