import { AutoRouter, IRequestStrict, error, json, status } from "itty-router";
import { getAnswers, startSession, getSessionInfo, submitForm } from "./kv";
import { FormSubmission, Player, SharingCode, SessionInfo } from "./api";

const corsMiddleware = (response: Response) => {
  response.headers.set("Access-Control-Allow-Origin", "https://discuss.love");
  response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type");

  return response;
};

const router = AutoRouter({
  finally: [corsMiddleware],
});

type SessionPostRequest = IRequestStrict;

router.options("*", () => {
  return status(200);
});

router.post("/sessions", async (request: SessionPostRequest, env: Env) => {
  const info = await request.json<SessionInfo>();

  const sharingCode = await startSession(env.KV, info);

  return json({ code: sharingCode }, { status: 201 });
});

type SessionGetRequest = {
  code: SharingCode;
} & IRequestStrict;

router.get("/sessions/:code", async (request: SessionGetRequest, env: Env) => {
  return await getSessionInfo(env.KV, request.code);
});

type SubmissionPutRequest = {
  code: SharingCode;
  player: Player;
} & IRequestStrict;

router.put("/submissions/:code/:player", async (request: SubmissionPutRequest, env: Env) => {
  const form = await request.json<FormSubmission>();

  await submitForm(env.KV, request.code, request.player, form);

  return status(201);
});

type SubmissionGetRequest = {
  code: SharingCode;
} & IRequestStrict;

router.get("/submissions/:code", async (request: SubmissionGetRequest, env: Env) => {
  const answers = await getAnswers(env.KV, request.code);

  if (answers === undefined) {
    return error(404, "Not all players have submitted their answers yet.");
  }

  return answers;
});

export default router satisfies ExportedHandler<Env>;
