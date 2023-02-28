import { app } from "./app.ts";
import { nostring } from "./deps.ts";
import { spam } from "./spam.ts";

const channel = typeof BroadcastChannel !== "undefined"
  ? new BroadcastChannel("nostr_events")
  : null;

if (channel) {
  channel.addEventListener("message", (e) => {
    app.broadcast(e.data);
  });
}

export function onReq(id: string, filters: nostring.ReqParams[]) {
  console.debug("REQ", id, filters);
  if (
    filters.every((f) =>
      Object.keys(f).filter((i) => i[0] !== "limit").length === 0
    )
  ) {
    throw new Error(`Can not REQ with empty filters: '${id}'`);
  }
}

export function onStream(e: nostring.NostrEvent) {
  return spam.filter(e);
}

export function onEvent(e: nostring.NostrEvent) {
  console.debug(e);
  if (!spam.filter(e)) throw new Error("Spam event");

  if (channel) channel.postMessage(e);
}
