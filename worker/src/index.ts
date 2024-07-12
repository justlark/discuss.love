import { AutoRouter, IRequestStrict, error, json, status } from "itty-router";
import { getAnswers, startSession, getSessionInfo, submitForm, deleteSubmission } from "./kv";
import { FormSubmission, Player, SharingCode, SessionInfo } from "./api";

// This should be plenty large enough for any reasonable-length form submission.
// The intent is to prevent users from pasting the complete works of Shakespeare
// into the text field.
const FORM_SIZE_LIMIT = 1000 * 100; // 100 KB

// We don't want to be overly restrictive with what people call themselves; we
// just need to prevent abuse and discourage names that will break the UI.
const NAME_SIZE_LIMIT = 50;

const corsMiddleware = (response: Response) => {
  response.headers.set("Access-Control-Allow-Origin", "https://discuss.love");
  response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
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

  if (
    info.players.sender.length > NAME_SIZE_LIMIT ||
    info.players.recipient.length > NAME_SIZE_LIMIT
  ) {
    return error(413, "One of the provided names is too long.");
  }

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

  const currentAnswers = await getAnswers(env.KV, request.code);

  if (currentAnswers !== undefined) {
    return error(409, "All players have already submitted their answers.");
  }

  // We limit the size of the form submission to prevent abuse.
  if (JSON.stringify(form).length > FORM_SIZE_LIMIT) {
    return error(413, "Form submission is too large.");
  }

  await submitForm(env.KV, request.code, request.player, form);

  return status(201);
});

type SubmissionDeleteRequest = {
  code: SharingCode;
} & IRequestStrict;

router.delete("/submissions/:code", async (request: SubmissionDeleteRequest, env: Env) => {
  await deleteSubmission(env.KV, request.code);

  return status(204);
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
