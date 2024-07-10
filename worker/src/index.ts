import { AutoRouter, IRequestStrict, status } from "itty-router";
import { startSession, submitForm } from "./kv";
import { Form, Player, SharingCode, StartRequestBody } from "./api";

const router = AutoRouter();

type SessionPostRequest = IRequestStrict;

router.post("/sessions", async (request: SessionPostRequest, env: Env) => {
  const { players } = await request.json<StartRequestBody>();

  const sharingCode = await startSession(env.KV, players);

  return { code: sharingCode };
});

type SubmissionPutRequest = {
  code: SharingCode;
  player: Player;
} & IRequestStrict;

router.put("/submissions/:code/:player", async (request: SubmissionPutRequest, env: Env) => {
  const form = await request.json<Form>();

  await submitForm(env.KV, request.code, request.player, form);

  return status(201);
});

type SubmissionGetRequest = {
  code: SharingCode;
} & IRequestStrict;

router.get("/submissions/:code", async (request: SubmissionGetRequest, env: Env) => {
  // TODO
});

export default router satisfies ExportedHandler<Env>;
