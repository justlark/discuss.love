import { AutoRouter } from "itty-router";
import { startSession } from "./kv";
import { StartRequestBody } from "./api";

const router = AutoRouter();

router.post("/start", async (request: Request, env: Env) => {
  const { players } = await request.json<StartRequestBody>();

  const sharingCode = await startSession(players, env.KV);

  return { code: sharingCode };
});

export default router satisfies ExportedHandler<Env>;
