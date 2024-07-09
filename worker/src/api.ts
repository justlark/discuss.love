export type StartRequestBody = Readonly<{
  players: Readonly<{
    me: string;
    you: string;
  }>;
}>;
