import { StatusError } from "itty-router";
import { SharingCode, Players, Form, Player } from "./api";

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

export const startSession = async (kv: KVNamespace, players: Players): Promise<SharingCode> => {
  const sharingCode = newSharingCode();

  console.log(`Creating new session with sharing code '${sharingCode}'.`);

  await kv.put(`sessions:${sharingCode}`, JSON.stringify(players), { expirationTtl: sessionTtl });

  return sharingCode;
};

export const submitForm = async (
  kv: KVNamespace,
  code: SharingCode,
  player: Player,
  form: Form,
): Promise<void> => {
  if ((await kv.get(`sessions:${code}`)) === null) {
    throw new StatusError(404, `Session with sharing code '${code}' does not exist.`);
  }

  if (player !== "sender" && player !== "recipient") {
    throw new StatusError(400, "Player must be either 'sender' or 'recipient'.");
  }

  kv.put(`submissions:${code}:${player}`, JSON.stringify(form), { expirationTtl: submissionTtl });
};
