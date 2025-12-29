import { mcqQuestions, trueFalseQuestions } from '../data/questions';
import type { Question } from '../api/exam';

export function convertMcqQuestions(): Question[] {
  return mcqQuestions.map(q => ({
    id: q.id,
    question: q.question,
    options: q.options.map(opt => opt.text),
    correct: q.options.find(opt => opt.id === q.correct)?.text || '',
    type: 'mcq' as const,
  }));
}

export function convertTrueFalseQuestions(): Question[] {
  return trueFalseQuestions.map(q => ({
    id: q.id,
    question: q.question,
    options: ['True', 'False'],
    correct: q.correct,
    type: 'truefalse' as const,
  }));
}
