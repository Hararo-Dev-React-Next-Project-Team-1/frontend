import type { QuestionType } from '../apis/questions.ts';

export const sortedByLikes = (
  questions: QuestionType[],
  highlightedId?: string | null
) => {
  return [...questions].sort((a, b) => {
    if (highlightedId) {
      if (a.question_id === highlightedId) {
        a.is_answered = true;
      }
      if (a.question_id === highlightedId) return -1;
      if (b.question_id === highlightedId) return 1;
    }
    return parseInt(String(b.likes)) - parseInt(String(a.likes));
  });
};

export const sortedByCreatedAt = (
  questions: QuestionType[],
  highlightedId?: string | null
) => {
  return [...questions].sort((a, b) => {
    if (highlightedId) {
      if (a.question_id === highlightedId) {
        a.is_answered = true;
      }
      if (a.question_id === highlightedId) return -1;
      if (b.question_id === highlightedId) return 1;
    }
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });
};
