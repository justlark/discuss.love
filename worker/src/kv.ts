import { base16 } from "rfc4648";
import { SharingCode, Players } from "./api";

// No ambiguous characters: 0, o, l, 1, s, 5, 2, z,
const sharingCodePool = "abcdefghijkmnpqrtuvwxy346789";
const sharingCodeLength = 6;

const newSharingCode = (): string => {
  let sharingCode = "";

  for (let i = 0; i < sharingCodeLength; i++) {
    const randomNum = Math.floor(Math.random() * sharingCodePool.length);
    sharingCode += sharingCodePool[randomNum];
  }

  return sharingCode;
};

export const startSession = async (players: Players, kv: KVNamespace): Promise<SharingCode> => {
  const sharingCode = newSharingCode();

  console.log(`Creating new session with sharing code '${sharingCode}'.`);

  await kv.put(`sessions:${sharingCode}`, JSON.stringify(players));

  return sharingCode;
};
