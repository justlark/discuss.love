import rawQuestions from "@/assets/questions.json";
import type { QuestionDefinition } from "@/types";
import seedrandom from "seedrandom";

export const defaultQuestions: Array<QuestionDefinition> = rawQuestions;

export const getRandomizedQuestionCategories = (
  questions: Array<QuestionDefinition>,
  sharingCode: string,
) => {
  // Shuffle the questions and categories in a way that's deterministic by the
  // sharing code. This way both players see the same order of questions and the
  // order won't shuffle between page reloads.
  const rng = seedrandom(sharingCode);

  // Maps in JS remember their insertion order, so this function is still
  // deterministic.
  const byCategory = new Map<string, Array<QuestionDefinition>>();

  for (const q of questions) {
    const category = byCategory.get(q.category) ?? [];
    category.push(q);
    byCategory.set(q.category, category);
  }

  const categories = Array.from(byCategory.entries(), ([category, questions]) => ({
    name: category,
    questions,
  }));

  categories.sort(() => rng() - 0.5);

  for (const category of categories) {
    category.questions.sort(() => rng() - 0.5);
  }

  return categories;
};

export const getQuestionMap = (questions: Array<QuestionDefinition>) =>
  new Map(
    questions.map((q) => [
      q.id,
      {
        title: q.title,
        description: q.description,
        category: q.category,
        prompts: q.prompts,
      },
    ]),
  );
