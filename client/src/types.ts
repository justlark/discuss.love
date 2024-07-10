export interface QuestionDefinition {
  id: string;
  title: string;
  description: string;
}

export type AnswerType = "yes" | "no" | "later";

export const humanReadableAnswer = (answer: AnswerType): string => {
  switch (answer) {
    case "yes":
      return "Yes";
    case "no":
      return "No";
    case "later":
      return "Not right now, but maybe later";
  }
};

export interface QuestionAnswer {
  answer: AnswerType;
  notes: string;
}

export interface QuestionResponse {
  id: string;
  sender: QuestionAnswer;
  recipient: QuestionAnswer;
}
