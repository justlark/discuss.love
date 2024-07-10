import { AutoRouter, IRequestStrict, error, json, status } from "itty-router";
import { getAnswers, startSession, getSessionInfo, submitForm } from "./kv";
import { FormSubmission, Player, SharingCode, SessionInfo } from "./api";

// Support localhost for local development.
const corsAllowedOrigins = ["https://discuss.love", "http://localhost:5173"];

const getCorsHeaders = (req: Request): Record<string, string> => {
  const reqOrigin = req.headers.get("Origin");

  if (reqOrigin !== null && corsAllowedOrigins.includes(reqOrigin)) {
    return {
      "Access-Control-Allow-Origin": reqOrigin,
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Methods": "GET, POST, PUT, OPTIONS",
    };
  }

  return {};
};

const router = AutoRouter();

type SessionPostRequest = IRequestStrict;

router.options("*", (request: IRequestStrict) => {
  return status(200, { headers: { ...getCorsHeaders(request) } });
});

router.post("/sessions", async (request: SessionPostRequest, env: Env) => {
  const info = await request.json<SessionInfo>();

  const sharingCode = await startSession(env.KV, info);

  return json({ code: sharingCode }, { status: 201, headers: { ...getCorsHeaders(request) } });
});

type SessionGetRequest = {
  code: SharingCode;
} & IRequestStrict;

router.get("/sessions/:code", async (request: SessionGetRequest, env: Env) => {
  return json(await getSessionInfo(env.KV, request.code), {
    status: 200,
    headers: { ...getCorsHeaders(request) },
  });
});

type SubmissionPutRequest = {
  code: SharingCode;
  player: Player;
} & IRequestStrict;

router.put("/submissions/:code/:player", async (request: SubmissionPutRequest, env: Env) => {
  const form = await request.json<FormSubmission>();

  await submitForm(env.KV, request.code, request.player, form);

  return status(201, { headers: { ...getCorsHeaders(request) } });
});

type SubmissionGetRequest = {
  code: SharingCode;
} & IRequestStrict;

router.get("/submissions/:code", async (request: SubmissionGetRequest, env: Env) => {
  const answers = await getAnswers(env.KV, request.code);

  if (answers === undefined) {
    return error(404, "Not all players have submitted their answers yet.");
  }

  return json(answers, {
    status: 200,
    headers: { ...getCorsHeaders(request) },
  });
});

export default router satisfies ExportedHandler<Env>;
