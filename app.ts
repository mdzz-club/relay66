import { nostring, serve } from "./deps.ts";
import { onEvent, onReq, onStream } from "./handler.ts";
import { spam } from "./spam.ts";

const dbUrl = Deno.env.get("DB_URL") || "postgres://127.0.0.1:5432/nostring";
const db = new nostring.PgRepository(dbUrl);
await db.init();

await spam.start();

export const app = new nostring.Application({
  upgradeWebSocketFn: nostring.upgradeFn,
  db,
  onEvent,
  onReq,
  onStream,
});
const port = parseInt(Deno.env.get("PORT") || "9000");
serve(app.getHandler(), { port });
