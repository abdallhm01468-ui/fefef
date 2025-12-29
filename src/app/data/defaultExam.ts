import type { Question } from '../api/exam';

export const defaultMcqQuestions: Question[] = [
  {
    id: 1,
    question: "Accounting is best defined as:",
    options: [
      "Recording only cash transactions",
      "A systematic process of identifying, recording, and communicating financial information",
      "Preparing tax returns only",
      "Measuring profits only"
    ],
    correct: "A systematic process of identifying, recording, and communicating financial information",
    type: 'mcq'
  },
  {
    id: 2,
    question: "Which of the following is an internal user of accounting information?",
    options: ["Shareholders", "Banks", "Managers", "Government"],
    correct: "Managers",
    type: 'mcq'
  },
  {
    id: 3,
    question: "The accounting equation is:",
    options: [
      "Assets = Liabilities - Equity",
      "Assets = Liabilities + Equity",
      "Assets + Liabilities = Equity",
      "Assets - Equity = Liabilities"
    ],
    correct: "Assets = Liabilities + Equity",
    type: 'mcq'
  },
  {
    id: 4,
    question: "A debit balance in which account indicates an error?",
    options: ["Asset", "Expense", "Revenue", "Drawing"],
    correct: "Revenue",
    type: 'mcq'
  },
  {
    id: 5,
    question: "Which financial statement reports revenues and expenses?",
    options: ["Balance Sheet", "Income Statement", "Cash Flow Statement", "Statement of Changes in Equity"],
    correct: "Income Statement",
    type: 'mcq'
  },
  {
    id: 6,
    question: "The normal balance of an asset account is:",
    options: ["Credit", "Debit", "Zero", "Either debit or credit"],
    correct: "Debit",
    type: 'mcq'
  },
  {
    id: 7,
    question: "Depreciation is:",
    options: [
      "The decrease in market value",
      "The allocation of cost over useful life",
      "The sale of an asset",
      "The replacement cost"
    ],
    correct: "The allocation of cost over useful life",
    type: 'mcq'
  },
  {
    id: 8,
    question: "Which account is closed at the end of the accounting period?",
    options: ["Accounts Receivable", "Equipment", "Revenue", "Accounts Payable"],
    correct: "Revenue",
    type: 'mcq'
  },
  {
    id: 9,
    question: "The purchase of office supplies on account is recorded as:",
    options: [
      "Debit Supplies, Credit Cash",
      "Debit Supplies, Credit Accounts Payable",
      "Debit Accounts Payable, Credit Supplies",
      "Debit Cash, Credit Supplies"
    ],
    correct: "Debit Supplies, Credit Accounts Payable",
    type: 'mcq'
  },
  {
    id: 10,
    question: "Working capital is calculated as:",
    options: [
      "Total Assets - Total Liabilities",
      "Current Assets - Current Liabilities",
      "Total Assets / Total Liabilities",
      "Current Assets + Current Liabilities"
    ],
    correct: "Current Assets - Current Liabilities",
    type: 'mcq'
  },
];

export const defaultTrueFalseQuestions: Question[] = [
  {
    id: 51,
    question: "The accounting equation must always be in balance.",
    correct: "True",
    type: 'truefalse'
  },
  {
    id: 52,
    question: "Revenue is recorded when cash is received.",
    correct: "False",
    type: 'truefalse'
  },
  {
    id: 53,
    question: "Liabilities are obligations to pay cash or provide services.",
    correct: "True",
    type: 'truefalse'
  },
  {
    id: 54,
    question: "An expense is recorded with a credit entry.",
    correct: "False",
    type: 'truefalse'
  },
  {
    id: 55,
    question: "The balance sheet shows the financial position at a specific point in time.",
    correct: "True",
    type: 'truefalse'
  },
  {
    id: 56,
    question: "Dividends are expenses of a corporation.",
    correct: "False",
    type: 'truefalse'
  },
  {
    id: 57,
    question: "The trial balance proves that debits equal credits.",
    correct: "True",
    type: 'truefalse'
  },
  {
    id: 58,
    question: "Withdrawals increase owner's equity.",
    correct: "False",
    type: 'truefalse'
  },
  {
    id: 59,
    question: "Accrual accounting recognizes revenues when earned.",
    correct: "True",
    type: 'truefalse'
  },
  {
    id: 60,
    question: "All permanent accounts are closed at year-end.",
    correct: "False",
    type: 'truefalse'
  },
];
