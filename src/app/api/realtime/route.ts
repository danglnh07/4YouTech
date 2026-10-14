import { NextRequest } from "next/server";
import { realtimeBus, RealtimeEventPayload } from "@/lib/realtime-bus";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  let isClosed = false;

  const stream = new ReadableStream({
    start(controller) {
      const encoder = new TextEncoder();

      const send = (eventType: string, data: any) => {
        if (isClosed) return;
        try {
          const chunk = `event: ${eventType}\ndata: ${JSON.stringify(data)}\n\n`;
          controller.enqueue(encoder.encode(chunk));
        } catch {
          isClosed = true;
        }
      };

      // Heartbeat ping every 20s to keep connection alive
      const heartbeatInterval = setInterval(() => {
        if (isClosed) {
          clearInterval(heartbeatInterval);
          return;
        }
        send("ping", { time: Date.now() });
      }, 20000);

      // Event listener for DB changes triggered by API routes
      const onDataChanged = (payload: RealtimeEventPayload) => {
        send("data_changed", payload);
      };

      realtimeBus.on("data_changed", onDataChanged);

      // Initial connection greeting
      send("connected", { status: "ready", timestamp: Date.now() });

      request.signal.addEventListener("abort", () => {
        isClosed = true;
        clearInterval(heartbeatInterval);
        realtimeBus.off("data_changed", onDataChanged);
        try {
          controller.close();
        } catch {}
      });
    },
    cancel() {
      isClosed = true;
    }
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      "Connection": "keep-alive"
    }
  });
}
