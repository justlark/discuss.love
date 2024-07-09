import { AutoRouter, StatusError } from "itty-router";

const router = AutoRouter();

router.post("/start", async (request: Request, env: Env) => {
  const { players } = await request.json<StartRequestBody>();

  console.log(players);

  return players;
});

export default router satisfies ExportedHandler<Env>;
