import { nostring, serve } from "./deps.ts";
import { onEvent, onReq, onStream } from "./handler.ts";
import { spam } from "./spam.ts";
import { PgRepository } from "./pg_repo.ts";

const dbUrl = Deno.env.get("DB_URL") || "postgres://127.0.0.1:5432/nostring";
const db = new PgRepository(dbUrl);
await db.init();

await spam.start();

export const app = new nostring.Application({
  upgradeWebSocketFn: nostring.upgradeFn,
  db,
  onEvent,
  onReq,
  onStream,
  name: Deno.env.get("RELAY_NAME"),
  contact: Deno.env.get("ADMIN_CONTACT"),
  pubkey: Deno.env.get("ADMIN_PUBKEY"),
  description: Deno.env.get("RELAY_DESC"),
});
const port = parseInt(Deno.env.get("PORT") || "9000");
serve(app.getHandler(), { port });
