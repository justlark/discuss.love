import { StatusError } from "itty-router";
import { SharingCode, PlayerNames, FormSubmission, Player, FormAnswers, SessionInfo } from "./api";

// No ambiguous characters: 0, o, l, 1
const sharingCodePool = "abcdefghijkmnpqrstuvwxyz23456789";
const sharingCodeLength = 6;

const newSharingCode = (): string => {
  let sharingCode = "";

  for (let i = 0; i < sharingCodeLength; i++) {
    const randomNum = Math.floor(Math.random() * sharingCodePool.length);
    sharingCode += sharingCodePool[randomNum];
  }

  return sharingCode;
};

const sessionTtl = 60 * 60 * 24 * 30;
const submissionTtl = 60 * 60 * 24 * 30;

const sessionKey = (code: SharingCode): string => `sessions:${code}`;

export const startSession = async (kv: KVNamespace, info: SessionInfo): Promise<SharingCode> => {
  const sharingCode = newSharingCode();

  console.log(`Creating new session with sharing code '${sharingCode}'.`);

  await kv.put(sessionKey(sharingCode), JSON.stringify(info), { expirationTtl: sessionTtl });

  return sharingCode;
};

export const getSessionInfo = async (kv: KVNamespace, code: SharingCode): Promise<SessionInfo> => {
  const info = await kv.get(sessionKey(code));

  if (info === null) {
    throw new StatusError(404, `Session with sharing code '${code}' does not exist.`);
  }

  return JSON.parse(info);
};

const submissionKey = (code: SharingCode, player: Player): string =>
  `submissions:${code}:${player}`;

export const submitForm = async (
  kv: KVNamespace,
  code: SharingCode,
  player: Player,
  form: FormSubmission,
): Promise<void> => {
  if ((await kv.get(sessionKey(code))) === null) {
    throw new StatusError(404, `Session with sharing code '${code}' does not exist.`);
  }

  if (player !== "sender" && player !== "recipient") {
    throw new StatusError(400, "Player must be either 'sender' or 'recipient'.");
  }

  kv.put(submissionKey(code, player), JSON.stringify(form), { expirationTtl: submissionTtl });
};

const coalesceAnswers = (sender: FormSubmission, recipient: FormSubmission): FormAnswers => {
  // TODO
  return [];
};

export const getAnswers = async (kv: KVNamespace, code: SharingCode): Promise<FormAnswers> => {
  const senderSubmission = await kv.get(submissionKey(code, "sender"));
  const recipientSubmission = await kv.get(submissionKey(code, "recipient"));

  if (senderSubmission === null || recipientSubmission === null) {
    throw new StatusError(404, `Not all users have submitted their answers.`);
  }

  return coalesceAnswers(JSON.parse(senderSubmission), JSON.parse(recipientSubmission));
};
