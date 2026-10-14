import { EventEmitter } from "events";

export type RealtimeEntity = "orders" | "transactions" | "reviews" | "users" | "services" | "projects";

export interface RealtimeEventPayload {
  entity: RealtimeEntity;
  action?: "create" | "update" | "delete";
  id?: string;
  timestamp: number;
}

const globalForRealtime = globalThis as unknown as {
  realtimeBus?: EventEmitter;
};

export const realtimeBus: EventEmitter = globalForRealtime.realtimeBus || new EventEmitter();
realtimeBus.setMaxListeners(200);

if (!globalForRealtime.realtimeBus) {
  globalForRealtime.realtimeBus = realtimeBus;
}

export function notifyDataChange(
  entity: RealtimeEntity,
  action: "create" | "update" | "delete" = "update",
  id?: string
) {
  try {
    const payload: RealtimeEventPayload = {
      entity,
      action,
      id,
      timestamp: Date.now()
    };
    realtimeBus.emit("data_changed", payload);
  } catch (err) {
    console.warn("Failed to emit realtime data change:", err);
  }
}
