export type SharingCode = string;

export type ByPlayer<T> = Readonly<{
  sender: T;
  recipient: T;
}>;

export type Player = keyof ByPlayer<unknown>;

export type AnswerType = "yes" | "no" | "open" | "later" | "unsure";

export type WithQuestionId<T> = Readonly<{ id: string }> & T;

export type QuestionAnswer = Readonly<{
  answer: AnswerType;
  notes: string;
}>;

export type FormSubmission = ReadonlyArray<WithQuestionId<QuestionAnswer>>;

export type FormAnswer = WithQuestionId<ByPlayer<QuestionAnswer | undefined>>;

export type FormAnswers = Array<FormAnswer>;

export type PlayerNames = ByPlayer<string>;

export type SessionInfo = Readonly<{
  players: PlayerNames;
}>;
