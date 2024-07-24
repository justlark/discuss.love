import QuestionAnswer from "./components/QuestionAnswer.vue";

export type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;

export interface QuestionDefinition {
  id: string;
  title: string;
  description: string;
  category: string;
  prompts: Array<string>;
}

export interface QuestionCategory {
  name: string;
  questions: Array<QuestionDefinition>;
}

export type AnswerType = "yes" | "no" | "later";

export interface QuestionAnswer {
  answer: AnswerType;
  notes: string;
}

export type WithQuestionId<T> = { id: string } & T;

export type ByPlayer<T> = {
  sender: T;
  recipient: T;
};

export type Player = keyof ByPlayer<never>;

export type AttributedAnswer = { playerName: string } & QuestionAnswer;

export type AnswerPair = WithQuestionId<ByPlayer<AttributedAnswer>>;

export type FormAnswer = WithQuestionId<ByPlayer<QuestionAnswer | undefined>>;

export type FormAnswers = Array<FormAnswer>;

export type SessionInfo = {
  players: ByPlayer<string>;
};

export type ResponseStatus<T extends Array<string>> =
  | { status: "error"; error: string }
  | { [P in T[number]]: { status: P } }[T[number]];
