import { useState, useEffect } from 'react';
import { ExamSelector } from './components/ExamSelector';
import { ExamInterface } from './components/ExamInterface';
import { AdminDashboard } from './components/AdminDashboard';
import { AdminLogin } from './components/AdminLogin';
import { ResultsPage } from './components/ResultsPage';
import { LandingPage } from './components/LandingPage';
import { SummariesPage } from './components/SummariesPage';
import { VideosPage } from './components/VideosPage';
import { LiveSessionsPage } from './components/LiveSessionsPage';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import ExamViewer from './components/ExamViewer';
import type { ExamTemplate } from './api/exam';
import { acct150MCQQuestions, acct150TrueFalseQuestions } from './data/acct150CompleteExam';

export type Page = 'landing' | 'exams' | 'summaries' | 'videos' | 'lives' | 'exam-interface' | 'admin-login' | 'admin' | 'results' | 'exam-viewer';

export interface StudentInfo {
  name: string;
  id: string;
}

export interface Answer {
  questionId: number;
  answer: string;
}

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('landing');
  const [studentInfo, setStudentInfo] = useState<StudentInfo>({ name: '', id: '' });
  const [examTemplate, setExamTemplate] = useState<ExamTemplate | null>(null);
  const [score, setScore] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

  // Initialize default exams on first load
  useEffect(() => {
    let stored = localStorage.getItem('examTemplates');
    let exams: ExamTemplate[] = [];
    
    if (stored) {
      exams = JSON.parse(stored);
      // Check if ACCT 150 exists but has no questions
      const acct150 = exams.find(e => e.title === 'ACCT 150' || e.subject === 'ACCT 150');
      if (acct150 && (!acct150.mcqQuestions || acct150.mcqQuestions.length === 0)) {
        // Update ACCT 150 with full questions
        acct150.mcqQuestions = acct150MCQQuestions;
        acct150.trueFalseQuestions = acct150TrueFalseQuestions;
        localStorage.setItem('examTemplates', JSON.stringify(exams));
        console.log('✅ Updated ACCT 150 with 50 MCQ + 50 T/F questions');
      }
    } else {
      // Create default ACCT 150 exam with all questions
      const defaultACCT150: ExamTemplate = {
        id: 'acct150-default',
        title: 'ACCT 150',
        subject: 'ACCT 150',
        level: 1,
        duration: 120,
        passingScore: 60,
        mcqQuestions: acct150MCQQuestions,
        trueFalseQuestions: acct150TrueFalseQuestions,
        createdDate: new Date().toISOString(),
      };
      localStorage.setItem('examTemplates', JSON.stringify([defaultACCT150]));
      console.log('✅ Created default ACCT 150 exam with 50 MCQ + 50 T/F questions');
    }
  }, []);

  const handleStartExam = (name: string, id: string, examId: string) => {
    setStudentInfo({ name, id });
    
    // Load exam from localStorage
    const exams = JSON.parse(localStorage.getItem('examTemplates') || '[]');
    const exam = exams.find((e: any) => e.id === examId);
    
    if (exam) {
      setExamTemplate(exam);
      setCurrentPage('exam-interface');
    } else {
      alert('Exam not found');
    }
  };

  const handleExamComplete = (finalScore: number, total: number) => {
    setScore(finalScore);
    setTotalQuestions(total);
    setCurrentPage('results');
  };

  const handleExamSubmit = (answers: Answer[]) => {
    if (!examTemplate) return;
    
    // Calculate score
    let correctAnswers = 0;
    const allQuestions = [
      ...(examTemplate.mcqQuestions || []),
      ...(examTemplate.trueFalseQuestions || [])
    ];
    
    answers.forEach(answer => {
      const question = allQuestions.find(q => q.id === answer.questionId);
      // Check if answer is correct
      if (question) {
        // For T/F questions, compare directly (صحيح vs صحيح)
        // For MCQ, normalize to uppercase (A vs A)
        const isCorrect = question.type === 'truefalse' 
          ? question.correct === answer.answer
          : question.correct.toUpperCase() === answer.answer.toUpperCase();
        
        if (isCorrect) {
          correctAnswers++;
        }
      }
    });
    
    // Pass correct answers count, NOT percentage
    handleExamComplete(correctAnswers, allQuestions.length);
  };

  const handleRetakeExam = () => {
    setCurrentPage('exams');
  };

  const navigateToPage = (page: Page) => {
    if (page === 'admin-login') {
      setIsAdminAuthenticated(false);
    }
    setCurrentPage(page);
  };

  const handleAdminLogin = () => {
    setIsAdminAuthenticated(true);
    setCurrentPage('admin');
  };

  const handleAdminLogout = () => {
    setIsAdminAuthenticated(false);
    setCurrentPage('landing');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Show Navbar only on non-exam pages */}
      {currentPage !== 'exam-interface' && currentPage !== 'results' && currentPage !== 'admin' && currentPage !== 'exam-viewer' && (
        <Navbar currentPage={currentPage} onNavigate={navigateToPage} onLogout={handleAdminLogout} />
      )}

      {/* Main Content */}
      <div className="flex-1">
        {currentPage === 'landing' && (
          <LandingPage onNavigate={navigateToPage} />
        )}
        {currentPage === 'exams' && (
          <ExamSelector onStart={handleStartExam} onBack={() => setCurrentPage('landing')} />
        )}
        {currentPage === 'summaries' && (
          <SummariesPage onBack={() => setCurrentPage('landing')} />
        )}
        {currentPage === 'videos' && (
          <VideosPage onBack={() => setCurrentPage('landing')} />
        )}
        {currentPage === 'lives' && (
          <LiveSessionsPage onBack={() => setCurrentPage('landing')} />
        )}
        {currentPage === 'exam-interface' && examTemplate && (
          <ExamInterface
            studentInfo={studentInfo}
            examTemplate={examTemplate}
            onSubmit={handleExamSubmit}
          />
        )}
        {currentPage === 'admin-login' && (
          <AdminLogin onLogin={handleAdminLogin} onBack={() => setCurrentPage('landing')} />
        )}
        {currentPage === 'admin' && isAdminAuthenticated && (
          <AdminDashboard onBack={handleAdminLogout} />
        )}
        {currentPage === 'exam-viewer' && (
          <ExamViewer onBack={() => setCurrentPage('landing')} />
        )}
        {currentPage === 'results' && (
          <ResultsPage
            studentName={studentInfo.name}
            studentId={studentInfo.id}
            score={score}
            totalQuestions={totalQuestions}
            onRetakeExam={() => setCurrentPage('exams')}
          />
        )}
      </div>

      {/* Show Footer on non-exam pages */}
      {currentPage !== 'exam-interface' && currentPage !== 'results' && currentPage !== 'admin' && currentPage !== 'exam-viewer' && (
        <Footer onAdminClick={() => navigateToPage('admin-login')} />
      )}
    </div>
  );
}

export default App;