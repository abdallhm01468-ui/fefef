export interface Subject {
  code: string;
  name: string;
  level: number;
  semester: number;
}

export const ALL_SUBJECTS: Subject[] = [
  // Level 1 - Semester 1
  { code: 'BADM 100', name: 'Introduction To Business', level: 1, semester: 1 },
  { code: 'COMP 100', name: 'Introduction to computer', level: 1, semester: 1 },
  { code: 'ACCT 150', name: 'Accounting I', level: 1, semester: 1 },
  { code: 'BASC 122', name: 'Business math 1', level: 1, semester: 1 },
  { code: 'HUMN XXX', name: 'Humanities electives', level: 1, semester: 1 },
  
  // Level 1 - Semester 2
  { code: 'COMP 101', name: 'Computer programing 1', level: 1, semester: 2 },
  { code: 'BASC 123', name: 'Business math 2', level: 1, semester: 2 },
  { code: 'NETW 150', name: 'Internet fundamentals', level: 1, semester: 2 },
  { code: 'INFO 140', name: 'Introduction to information system', level: 1, semester: 2 },
  { code: 'HUMN XX', name: 'Humanities elective', level: 1, semester: 2 },
  
  // Level 2 - Semester 1
  { code: 'ENGL 172', name: 'ENGL 101', level: 2, semester: 1 },
  { code: 'COMP 200', name: 'Operating system 1', level: 2, semester: 1 },
  { code: 'BASC 200', name: 'Introduction To Statistics', level: 2, semester: 1 },
  { code: 'INFO 240', name: 'System analysis and design', level: 2, semester: 1 },
  { code: 'NETW 250', name: 'Introductions to Network', level: 2, semester: 1 },
  { code: 'ACCT 151', name: 'Accounting II', level: 2, semester: 1 },
  
  // Level 2 - Semester 2
  { code: 'MRKT 160', name: 'Introduction To Marketing', level: 2, semester: 2 },
  { code: 'ENGL 173', name: 'ENGL 102', level: 2, semester: 2 },
  { code: 'COMP 201', name: 'Computer programming 2', level: 2, semester: 2 },
  { code: 'BADM 203', name: 'Introduction to public communication', level: 2, semester: 2 },
  { code: 'INFO 241', name: 'Database 1', level: 2, semester: 2 },
  { code: 'NETW 251', name: 'Advanced network manage', level: 2, semester: 2 },
  
  // Level 3 - Semester 1
  { code: 'COMP 301', name: 'Operating system 2', level: 3, semester: 1 },
  { code: 'COMP 302', name: 'Software engineering', level: 3, semester: 1 },
  { code: 'BASC 310', name: 'Operation research', level: 3, semester: 1 },
  { code: 'INFO 341', name: 'Database 2', level: 3, semester: 1 },
  { code: 'ACCT 351', name: 'Managerial accounting', level: 3, semester: 1 },
  { code: 'MRKT 462', name: 'Marketing research 1', level: 3, semester: 1 },
  
  // Level 3 - Semester 2
  { code: 'COMP 300', name: 'Computer programing 3', level: 3, semester: 2 },
  { code: 'INFO 342', name: 'Business strategies in IT', level: 3, semester: 2 },
  { code: 'NETW 350', name: 'Information system security', level: 3, semester: 2 },
  { code: 'NETW 351', name: 'Business network planning and design', level: 3, semester: 2 },
  { code: 'HUMN 330', name: 'Introduction To Human Civilization', level: 3, semester: 2 },
  
  // Level 4 - Semester 1
  { code: 'HUMN 234', name: 'Academic writing', level: 4, semester: 1 },
  { code: 'INFO 440', name: 'E-Commerce technologies', level: 4, semester: 1 },
  { code: 'NETW 450', name: 'Windows Server technologies', level: 4, semester: 1 },
  { code: 'NETW 451', name: 'Advanced TCP/IP', level: 4, semester: 1 },
  { code: 'MAJOR-E1', name: 'Specialized electives 1', level: 4, semester: 1 },
  { code: 'MAJOR-E2', name: 'Specialized electives 2', level: 4, semester: 1 },
  
  // Level 4 - Semester 2
  { code: 'COMP 400', name: 'System implementation project', level: 4, semester: 2 },
  { code: 'INFO 441', name: 'Current issues in IT', level: 4, semester: 2 },
  { code: 'INFO 446', name: 'Quality assurance of software and information systems', level: 4, semester: 2 },
  { code: 'NETW 452', name: 'Infrastructure and cloud computing services', level: 4, semester: 2 },
  { code: 'NETW 453', name: 'Wireless and Mobile Network', level: 4, semester: 2 },
];

export function getSubjectsByLevel(level: number): Subject[] {
  return ALL_SUBJECTS.filter(s => s.level === level);
}

export function getSubjectsBySemester(level: number, semester: number): Subject[] {
  return ALL_SUBJECTS.filter(s => s.level === level && s.semester === semester);
}

export function getAllSubjects(): Subject[] {
  return ALL_SUBJECTS;
}

// Legacy Category Support (for backward compatibility)
export interface Category {
  id: string;
  name: string;
  nameEn: string;
}

export const DEFAULT_CATEGORIES: Category[] = [
  { id: 'principles', name: 'مبادئ المحاسبة', nameEn: 'Accounting Principles' },
  { id: 'financial', name: 'المحاسبة المالية', nameEn: 'Financial Accounting' },
  { id: 'cost', name: 'محاسبة التكاليف', nameEn: 'Cost Accounting' },
  { id: 'tax', name: 'المحاسبة الضريبية', nameEn: 'Tax Accounting' },
];

export function getCategories(): Category[] {
  const stored = localStorage.getItem('categories');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return DEFAULT_CATEGORIES;
    }
  }
  // Save defaults on first load
  localStorage.setItem('categories', JSON.stringify(DEFAULT_CATEGORIES));
  return DEFAULT_CATEGORIES;
}

export function saveCategories(categories: Category[]): void {
  localStorage.setItem('categories', JSON.stringify(categories));
}

export function addCategory(category: Category): void {
  const categories = getCategories();
  categories.push(category);
  saveCategories(categories);
}

export function updateCategory(id: string, updated: Category): void {
  const categories = getCategories();
  const index = categories.findIndex(c => c.id === id);
  if (index >= 0) {
    categories[index] = updated;
    saveCategories(categories);
  }
}

export function deleteCategory(id: string): void {
  const categories = getCategories();
  const filtered = categories.filter(c => c.id !== id);
  saveCategories(filtered);
}