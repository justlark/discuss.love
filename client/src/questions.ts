import rawQuestions from "@/assets/questions.json";
import type { QuestionDefinition } from "@/types";
import seedrandom from "seedrandom";

export const questions: Array<QuestionDefinition> = rawQuestions;

export const randomizedQuestions = (sharingCode: string) => {
  // Shuffle the questions in a way that's deterministic by the sharing code.
  // This way both players see the same order of questions and the order won't
  // shuffle between page reloads.
  const rng = seedrandom(sharingCode);
  return [...questions].sort(() => rng() - 0.5);
};

export const questionMap = new Map(
  questions.map((q) => [q.id, { title: q.title, description: q.description }]),
);
