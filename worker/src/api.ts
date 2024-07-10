export type SharingCode = string;

export type Player = "sender" | "recipient";

export type Form = unknown;

export type Players = Readonly<{
  sender: string;
  recipient: string;
}>;

export type StartRequestBody = Readonly<{
  players: Players;
}>;
