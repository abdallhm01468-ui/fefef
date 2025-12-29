import { useState, useEffect } from 'react';
import { StudentInfo, Answer } from '../App';
import { ChevronLeft, ChevronRight, CheckCircle, Clock, User, Sparkles, FileText } from 'lucide-react';
import type { ExamTemplate } from '../api/exam';
import { acct150MCQQuestions, acct150TrueFalseQuestions } from '../data/acct150CompleteExam';

interface ExamInterfaceProps {
  studentInfo: StudentInfo;
  examTemplate: ExamTemplate;
  onSubmit: (answers: Answer[]) => void;
}

const motivationalMessages = [
  "🌟 You're doing great!",
  "💪 Keep going, champion!",
  "🎯 Focus and succeed!",
  "⭐ Excellent progress!",
  "🚀 You've got this!",
  "🔥 On fire!",
  "💯 Amazing work!",
  "✨ Brilliant!",
  "🎓 Smart choice!",
  "👏 Well done!",
  "🌈 Keep shining!",
  "💎 You're a star!",
  "🏆 Future success!",
  "🎊 Great job!",
  "⚡ Unstoppable!",
];

export function ExamInterface({ studentInfo, examTemplate, onSubmit }: ExamInterfaceProps) {
  // Auto-load ACCT150 questions if exam title matches
  const enrichedTemplate = { ...examTemplate };
  
  if (examTemplate.title === 'ACCT 150' && (!examTemplate.mcqQuestions || examTemplate.mcqQuestions.length === 0)) {
    // Load complete ACCT 150 exam with 50 MCQ + 50 T/F questions
    enrichedTemplate.mcqQuestions = acct150MCQQuestions;
    enrichedTemplate.trueFalseQuestions = acct150TrueFalseQuestions;
    console.log('✅ Loaded complete ACCT 150 exam: 50 MCQ + 50 T/F questions');
  }
  
  console.log('ExamInterface loaded with template:', enrichedTemplate);
  
  const mcqQuestions = enrichedTemplate.mcqQuestions || [];
  const trueFalseQuestions = enrichedTemplate.trueFalseQuestions || [];
  
  const [currentSection, setCurrentSection] = useState<'mcq' | 'tf'>(mcqQuestions.length > 0 ? 'mcq' : 'tf');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showMotivation, setShowMotivation] = useState(false);
  const [motivationMessage, setMotivationMessage] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);

  const allQuestions = currentSection === 'mcq' ? mcqQuestions : trueFalseQuestions;
  const totalQuestions = mcqQuestions.length + trueFalseQuestions.length;

  const handleAnswer = (questionId: number, answer: string, optionIndex: number) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
    
    // Show random motivational message
    const randomMessage = motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)];
    setMotivationMessage(randomMessage);
    setShowMotivation(true);
    setTimeout(() => setShowMotivation(false), 2000);
  };

  const handleNext = () => {
    if (currentSection === 'mcq' && currentQuestion < mcqQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else if (currentSection === 'mcq' && currentQuestion === mcqQuestions.length - 1 && trueFalseQuestions.length > 0) {
      setCurrentSection('tf');
      setCurrentQuestion(0);
    } else if (currentQuestion < trueFalseQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    } else if (currentSection === 'tf' && mcqQuestions.length > 0) {
      setCurrentSection('mcq');
      setCurrentQuestion(mcqQuestions.length - 1);
    }
  };

  const handleSubmit = () => {
    const unanswered = totalQuestions - answeredCount;
    
    if (unanswered > 0) {
      const confirmSubmit = window.confirm(
        `لديك ${unanswered} سؤال لم يتم الإجابة عليه!\n\nهل أنت متأكد من إنهاء الامتحان؟\n\nYou have ${unanswered} unanswered question(s)!\n\nAre you sure you want to submit the exam?`
      );
      
      if (!confirmSubmit) {
        return;
      }
    }
    
    setShowConfetti(true);
    setTimeout(() => {
      const answersArray: Answer[] = Object.entries(answers).map(([id, answer]) => ({
        questionId: parseInt(id),
        answer
      }));
      onSubmit(answersArray);
    }, 1500);
  };

  const currentQuestionData = allQuestions[currentQuestion];
  const answeredCount = Object.keys(answers).length;
  const progress = totalQuestions > 0 ? (answeredCount / totalQuestions) * 100 : 0;

  const getCurrentQuestionNumber = () => {
    if (currentSection === 'mcq') {
      return currentQuestion + 1;
    }
    return mcqQuestions.length + currentQuestion + 1;
  };

  const isLastQuestion = (currentSection === 'tf' && currentQuestion === trueFalseQuestions.length - 1) || 
                        (currentSection === 'mcq' && mcqQuestions.length > 0 && trueFalseQuestions.length === 0 && currentQuestion === mcqQuestions.length - 1);

  if (totalQuestions === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center bg-white rounded-2xl shadow-2xl p-8 max-w-md mx-auto border-2 border-slate-200">
          <FileText className="w-16 h-16 text-slate-400 mx-auto mb-4" />
          <h2 className="text-slate-900 text-xl font-bold mb-3">📝 {enrichedTemplate.title || 'Exam'}</h2>
          <p className="text-slate-700 text-lg font-bold mb-2">لا توجد أسئلة في هذا الامتحان</p>
          <p className="text-slate-600 text-sm mb-4">No questions available in this exam</p>
          <p className="text-slate-500 text-xs">يرجى التواصل مع المسؤول / Please contact the administrator.</p>
          
          {enrichedTemplate.title === 'ACCT 150' && (
            <div className="mt-6 p-4 bg-blue-50 border border-blue-300 rounded-lg">
              <p className="text-sm text-blue-700 font-semibold">
                ✅ تم تحميل أسئلة ACCT 150 تلقائياً عند الدخول للامتحان
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (!currentQuestionData) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center bg-white rounded-2xl shadow-2xl p-8">
          <p className="text-gray-600 text-lg">Loading question...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-3 md:p-4 py-6 md:py-8">
      <div className="max-w-4xl mx-auto space-y-4 md:space-y-6">
        {/* Motivational Message */}
        {showMotivation && (
          <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 animate-bounce">
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              <span className="font-bold text-lg">{motivationMessage}</span>
            </div>
          </div>
        )}

        {/* Confetti Effect */}
        {showConfetti && (
          <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
            <div className="text-6xl animate-pulse">
              🎉 🎊 ✨ 🌟 💫
            </div>
          </div>
        )}

        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl shadow-lg p-4 md:p-6 text-white">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-4">
            <div className="text-center md:text-left">
              <h1 className="text-xl md:text-2xl font-bold mb-1">{examTemplate.title}</h1>
              {examTemplate.description && (
                <p className="text-blue-100 text-xs md:text-sm">{examTemplate.description}</p>
              )}
              <p className="text-blue-100 text-xs md:text-sm mt-1">{studentInfo.name} - ID: {studentInfo.id}</p>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 md:w-5 md:h-5" />
              <span className="text-sm md:text-base font-medium">Unlimited Time</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs md:text-sm">
              <span>Progress: {answeredCount} / {totalQuestions} answered</span>
              <span className="font-semibold">{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-2 md:h-3">
              <div 
                className="bg-white h-2 md:h-3 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Section Indicator */}
        {mcqQuestions.length > 0 && trueFalseQuestions.length > 0 && (
          <div className="flex gap-2 md:gap-4">
            <div className={`flex-1 p-3 md:p-4 rounded-lg text-center text-sm md:text-base font-semibold transition-all ${
              currentSection === 'mcq' 
                ? 'bg-indigo-600 text-white shadow-lg transform scale-105' 
                : 'bg-white text-gray-600'
            }`}>
              MCQ ({mcqQuestions.length} Q)
            </div>
            <div className={`flex-1 p-3 md:p-4 rounded-lg text-center text-sm md:text-base font-semibold transition-all ${
              currentSection === 'tf' 
                ? 'bg-indigo-600 text-white shadow-lg transform scale-105' 
                : 'bg-white text-gray-600'
            }`}>
              T/F ({trueFalseQuestions.length} Q)
            </div>
          </div>
        )}

        {/* Question Card */}
        <div className="bg-white rounded-xl shadow-lg p-4 md:p-8 animate-fadeIn">
          <div className="mb-4 md:mb-6">
            <span className="bg-indigo-100 text-indigo-700 px-3 md:px-4 py-2 rounded-full text-sm md:text-base font-semibold">
              Question {getCurrentQuestionNumber()} of {totalQuestions}
            </span>
          </div>

          <h2 className="text-base md:text-xl font-semibold text-gray-800 mb-4 md:mb-6 leading-relaxed">
            {currentQuestionData.question}
          </h2>

          <div className="space-y-2 md:space-y-3">
            {currentQuestionData.options?.map((option, optionIndex) => {
              const uniqueOptionId = `${currentQuestionData.id}-${optionIndex}`;
              const isChecked = answers[currentQuestionData.id] === option;
              
              return (
                <label
                  key={uniqueOptionId}
                  className={`flex items-start gap-3 md:gap-4 p-3 md:p-4 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md active:scale-98 ${
                    isChecked
                      ? 'border-indigo-500 bg-indigo-50 shadow-md transform scale-105'
                      : 'border-gray-200 hover:border-indigo-200'
                  }`}
                >
                  <input
                    type="radio"
                    name={`question-${currentQuestionData.id}`}
                    value={option}
                    checked={isChecked}
                    onChange={() => handleAnswer(currentQuestionData.id, option, optionIndex)}
                    className="mt-0.5 md:mt-1 w-4 h-4 md:w-5 md:h-5 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-sm md:text-base text-gray-700 flex-1">{option}</span>
                </label>
              );
            })}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex gap-2 md:gap-4 pb-4">
          <button
            onClick={handlePrevious}
            disabled={currentSection === 'mcq' && currentQuestion === 0}
            className="flex items-center justify-center gap-2 px-4 md:px-6 py-3 bg-white text-gray-700 rounded-lg text-sm md:text-base font-semibold hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed shadow-md transition-all active:scale-95"
          >
            <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" />
            <span className="hidden sm:inline">Previous</span>
          </button>

          {!isLastQuestion ? (
            <button
              onClick={handleNext}
              className="flex-1 flex items-center justify-center gap-2 px-4 md:px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg text-sm md:text-base font-semibold hover:from-blue-600 hover:to-indigo-700 shadow-lg transition-all active:scale-95"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="flex-1 flex items-center justify-center gap-2 px-4 md:px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg text-sm md:text-base font-semibold hover:from-green-600 hover:to-emerald-700 shadow-lg transition-all active:scale-95"
            >
              <CheckCircle className="w-4 h-4 md:w-5 md:h-5" />
              <span>Submit Exam</span>
            </button>
          )}
          
          <button
            onClick={handleSubmit}
            className="flex items-center justify-center gap-2 px-4 md:px-6 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-lg text-sm md:text-base font-semibold hover:from-orange-600 hover:to-red-700 shadow-lg transition-all active:scale-95"
            title="Submit exam now"
          >
            <CheckCircle className="w-4 h-4 md:w-5 md:h-5" />
            <span className="hidden md:inline">إنهاء الامتحان</span>
            <span className="md:hidden">إنهاء</span>
          </button>
        </div>
      </div>
    </div>
  );
}