export type SharingCode = string;

export type Players = Readonly<{
  me: string;
  you: string;
}>;

export type StartRequestBody = Readonly<{
  players: Players;
}>;
