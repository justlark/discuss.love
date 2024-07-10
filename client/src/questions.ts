import rawQuestions from "@/assets/questions.json";
import type { QuestionDefinition } from "@/types";

export const questions: Array<QuestionDefinition> = rawQuestions;

export const questionMap = new Map(
  questions.map((q) => [q.id, { title: q.title, description: q.description }]),
);
