import { acct150McqQuestions, acct150TrueFalseQuestions } from '../data/acct150Questions';
import type { Question } from '../api/exam';

export function convertACCT150McqQuestions(): Question[] {
  return acct150McqQuestions.map(q => ({
    id: q.id,
    question: q.question,
    options: q.options.map(opt => opt.text),
    correct: q.options.find(opt => opt.id === q.correct)?.text || '',
    type: 'mcq' as const,
  }));
}

export function convertACCT150TrueFalseQuestions(): Question[] {
  return acct150TrueFalseQuestions.map(q => ({
    id: q.id,
    question: q.question,
    correct: q.correct,
    type: 'truefalse' as const,
  }));
}
