export type SharingCode = string;

export type Players = Readonly<{
  sender: string;
  recipient: string;
}>;

export type StartRequestBody = Readonly<{
  players: Players;
}>;
