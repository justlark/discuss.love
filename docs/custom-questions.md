# Writing Custom Questions

If the default discussion questions don't suit your needs, you can write your
own. This page explains how.

You'll need to write your questions—and any discussion prompts you want to
include—in a JSON file. If you're not familiar with the JSON format, the best
place to start would be to look at the [default
questions](../client/src/assets/questions.json) and make changes from there.

You can upload a `.json` file containing your questions when you start a new
discussion.

Here's an explanation of each of the fields you'll need to fill out for each
question:

- `id`: A unique identifier for the question. This can be anything, except it
  can't contain spaces and each question needs a different identifier. If you
  change the wording of a question, you should keep the `id` the same.
- `title`: The question itself. This should be something short.
- `description`: A longer description of the question.
- `category`: Which category the question belongs to. This determines how
  questions are grouped together.
- `prompts`: A list of more specific questions to prompt discussion if the user
  answers anything but "No".

The order of the questions in the JSON file doesn't matter; the order is
randomized when they're shown to the user.
