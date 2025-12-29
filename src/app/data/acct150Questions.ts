export interface ACCT150Question {
  id: number;
  question: string;
  options: { id: string; text: string }[];
  correct: string;
}

export const acct150McqQuestions: ACCT150Question[] = [
  {
    id: 1,
    question: "Accounting is best defined as:",
    options: [
      { id: "A", text: "Recording only cash transactions" },
      { id: "B", text: "A systematic process of identifying, recording, and communicating financial information" },
      { id: "C", text: "Preparing tax returns only" },
      { id: "D", text: "Measuring profits only" }
    ],
    correct: "B"
  },
  {
    id: 2,
    question: "Which of the following is an internal user of accounting information?",
    options: [
      { id: "A", text: "Shareholders" },
      { id: "B", text: "Banks" },
      { id: "C", text: "Managers" },
      { id: "D", text: "Government" }
    ],
    correct: "C"
  },
  {
    id: 3,
    question: "Financial accounting mainly provides information to:",
    options: [
      { id: "A", text: "Managers" },
      { id: "B", text: "Employees" },
      { id: "C", text: "External users" },
      { id: "D", text: "Internal auditors" }
    ],
    correct: "C"
  },
  {
    id: 4,
    question: "Which type of accounting focuses on decision making?",
    options: [
      { id: "A", text: "Financial accounting" },
      { id: "B", text: "Cost accounting" },
      { id: "C", text: "Managerial accounting" },
      { id: "D", text: "Tax accounting" }
    ],
    correct: "C"
  },
  {
    id: 5,
    question: "GAAP stands for:",
    options: [
      { id: "A", text: "General Accounting Applied Principles" },
      { id: "B", text: "Generally Accepted Accounting Principles" },
      { id: "C", text: "Government Accounting Applied Policies" },
      { id: "D", text: "Global Accounting and Auditing Practices" }
    ],
    correct: "B"
  },
  {
    id: 6,
    question: "Which organization issues IFRS?",
    options: [
      { id: "A", text: "FASB" },
      { id: "B", text: "SEC" },
      { id: "C", text: "IASB" },
      { id: "D", text: "AICPA" }
    ],
    correct: "C"
  },
  {
    id: 7,
    question: "The accounting assumption that treats the business separate from its owner is:",
    options: [
      { id: "A", text: "Going concern" },
      { id: "B", text: "Monetary unit" },
      { id: "C", text: "Economic entity" },
      { id: "D", text: "Periodicity" }
    ],
    correct: "C"
  },
  {
    id: 8,
    question: "The assumption that a business will continue operating is:",
    options: [
      { id: "A", text: "Matching" },
      { id: "B", text: "Going concern" },
      { id: "C", text: "Conservatism" },
      { id: "D", text: "Consistency" }
    ],
    correct: "B"
  },
  {
    id: 9,
    question: "Revenue is recognized when:",
    options: [
      { id: "A", text: "Cash is received" },
      { id: "B", text: "Expenses are paid" },
      { id: "C", text: "It is earned" },
      { id: "D", text: "It is planned" }
    ],
    correct: "C"
  },
  {
    id: 10,
    question: "The matching principle means:",
    options: [
      { id: "A", text: "Match assets with liabilities" },
      { id: "B", text: "Match revenues with expenses" },
      { id: "C", text: "Match cash with profit" },
      { id: "D", text: "Match owners with equity" }
    ],
    correct: "B"
  },
  {
    id: 11,
    question: "Which is NOT an asset?",
    options: [
      { id: "A", text: "Cash" },
      { id: "B", text: "Accounts payable" },
      { id: "C", text: "Equipment" },
      { id: "D", text: "Inventory" }
    ],
    correct: "B"
  },
  {
    id: 12,
    question: "Liabilities are:",
    options: [
      { id: "A", text: "Owner's claims" },
      { id: "B", text: "Business resources" },
      { id: "C", text: "Debts owed by the business" },
      { id: "D", text: "Revenues earned" }
    ],
    correct: "C"
  },
  {
    id: 13,
    question: "Owner's equity represents:",
    options: [
      { id: "A", text: "Total assets" },
      { id: "B", text: "Liabilities only" },
      { id: "C", text: "Assets minus liabilities" },
      { id: "D", text: "Revenues minus expenses" }
    ],
    correct: "C"
  },
  {
    id: 14,
    question: "The basic accounting equation is:",
    options: [
      { id: "A", text: "Assets = Equity – Liabilities" },
      { id: "B", text: "Assets = Liabilities + Equity" },
      { id: "C", text: "Equity = Assets + Liabilities" },
      { id: "D", text: "Assets = Revenue – Expenses" }
    ],
    correct: "B"
  },
  {
    id: 15,
    question: "Which account normally has a debit balance?",
    options: [
      { id: "A", text: "Revenue" },
      { id: "B", text: "Liabilities" },
      { id: "C", text: "Assets" },
      { id: "D", text: "Capital" }
    ],
    correct: "C"
  },
  {
    id: 16,
    question: "Expenses normally increase with:",
    options: [
      { id: "A", text: "Credit" },
      { id: "B", text: "Debit" },
      { id: "C", text: "Both" },
      { id: "D", text: "Neither" }
    ],
    correct: "B"
  },
  {
    id: 17,
    question: "Which account is a liability?",
    options: [
      { id: "A", text: "Supplies" },
      { id: "B", text: "Cash" },
      { id: "C", text: "Accounts payable" },
      { id: "D", text: "Revenue" }
    ],
    correct: "C"
  },
  {
    id: 18,
    question: "A journal is used to:",
    options: [
      { id: "A", text: "Summarize accounts" },
      { id: "B", text: "Analyze transactions" },
      { id: "C", text: "Record transactions chronologically" },
      { id: "D", text: "Prepare financial statements" }
    ],
    correct: "C"
  },
  {
    id: 19,
    question: "Posting means:",
    options: [
      { id: "A", text: "Recording in journal" },
      { id: "B", text: "Transferring to ledger" },
      { id: "C", text: "Preparing trial balance" },
      { id: "D", text: "Closing accounts" }
    ],
    correct: "B"
  },
  {
    id: 20,
    question: "A ledger is:",
    options: [
      { id: "A", text: "A book of original entry" },
      { id: "B", text: "A list of transactions" },
      { id: "C", text: "A collection of accounts" },
      { id: "D", text: "A financial statement" }
    ],
    correct: "C"
  },
  {
    id: 21,
    question: "Trial balance is prepared to:",
    options: [
      { id: "A", text: "Find profit" },
      { id: "B", text: "Check arithmetic accuracy" },
      { id: "C", text: "Prepare cash flow" },
      { id: "D", text: "Record transactions" }
    ],
    correct: "B"
  },
  {
    id: 22,
    question: "If total debits ≠ total credits, it means:",
    options: [
      { id: "A", text: "Profit exists" },
      { id: "B", text: "Cash is incorrect" },
      { id: "C", text: "Errors may exist" },
      { id: "D", text: "Statements are complete" }
    ],
    correct: "C"
  },
  {
    id: 23,
    question: "Which is a temporary account?",
    options: [
      { id: "A", text: "Cash" },
      { id: "B", text: "Capital" },
      { id: "C", text: "Revenue" },
      { id: "D", text: "Equipment" }
    ],
    correct: "C"
  },
  {
    id: 24,
    question: "Closing entries are made to:",
    options: [
      { id: "A", text: "Adjust accounts" },
      { id: "B", text: "Correct errors" },
      { id: "C", text: "Close temporary accounts" },
      { id: "D", text: "Prepare trial balance" }
    ],
    correct: "C"
  },
  {
    id: 25,
    question: "Income summary account is used to:",
    options: [
      { id: "A", text: "Record cash" },
      { id: "B", text: "Record assets" },
      { id: "C", text: "Summarize revenues and expenses" },
      { id: "D", text: "Show liabilities" }
    ],
    correct: "C"
  },
  {
    id: 26,
    question: "Which financial statement shows financial position?",
    options: [
      { id: "A", text: "Income statement" },
      { id: "B", text: "Cash flow statement" },
      { id: "C", text: "Balance sheet" },
      { id: "D", text: "Owner's equity statement" }
    ],
    correct: "C"
  },
  {
    id: 27,
    question: "Net income is calculated as:",
    options: [
      { id: "A", text: "Assets – Liabilities" },
      { id: "B", text: "Revenues – Expenses" },
      { id: "C", text: "Cash inflow – outflow" },
      { id: "D", text: "Equity – Withdrawals" }
    ],
    correct: "B"
  },
  {
    id: 28,
    question: "Which is an operating activity?",
    options: [
      { id: "A", text: "Owner investment" },
      { id: "B", text: "Buying equipment" },
      { id: "C", text: "Paying salaries" },
      { id: "D", text: "Issuing shares" }
    ],
    correct: "C"
  },
  {
    id: 29,
    question: "Accrual accounting recognizes revenue when:",
    options: [
      { id: "A", text: "Cash is received" },
      { id: "B", text: "Earned" },
      { id: "C", text: "Expenses are paid" },
      { id: "D", text: "Invoice issued" }
    ],
    correct: "B"
  },
  {
    id: 30,
    question: "Prepaid insurance is classified as:",
    options: [
      { id: "A", text: "Liability" },
      { id: "B", text: "Expense" },
      { id: "C", text: "Asset" },
      { id: "D", text: "Revenue" }
    ],
    correct: "C"
  },
  {
    id: 31,
    question: "Depreciation is:",
    options: [
      { id: "A", text: "Cash payment" },
      { id: "B", text: "Asset valuation" },
      { id: "C", text: "Allocation of cost" },
      { id: "D", text: "Market adjustment" }
    ],
    correct: "C"
  },
  {
    id: 32,
    question: "Accumulated depreciation is:",
    options: [
      { id: "A", text: "Asset" },
      { id: "B", text: "Liability" },
      { id: "C", text: "Contra asset" },
      { id: "D", text: "Expense" }
    ],
    correct: "C"
  },
  {
    id: 33,
    question: "Unearned revenue is:",
    options: [
      { id: "A", text: "Revenue earned" },
      { id: "B", text: "Expense" },
      { id: "C", text: "Liability" },
      { id: "D", text: "Asset" }
    ],
    correct: "C"
  },
  {
    id: 34,
    question: "Accrued expenses are:",
    options: [
      { id: "A", text: "Paid and recorded" },
      { id: "B", text: "Unpaid but recorded" },
      { id: "C", text: "Paid but unrecorded" },
      { id: "D", text: "Earned and paid" }
    ],
    correct: "B"
  },
  {
    id: 35,
    question: "Accrued revenues are:",
    options: [
      { id: "A", text: "Earned but not received" },
      { id: "B", text: "Received but not earned" },
      { id: "C", text: "Paid expenses" },
      { id: "D", text: "Unearned income" }
    ],
    correct: "A"
  },
  {
    id: 36,
    question: "Merchandising companies earn revenue from:",
    options: [
      { id: "A", text: "Services" },
      { id: "B", text: "Selling products" },
      { id: "C", text: "Investments" },
      { id: "D", text: "Rent" }
    ],
    correct: "B"
  },
  {
    id: 37,
    question: "Cost of goods sold represents:",
    options: [
      { id: "A", text: "Selling price" },
      { id: "B", text: "Inventory purchased" },
      { id: "C", text: "Cost of items sold" },
      { id: "D", text: "Gross profit" }
    ],
    correct: "C"
  },
  {
    id: 38,
    question: "Perpetual inventory system:",
    options: [
      { id: "A", text: "Updates inventory continuously" },
      { id: "B", text: "Updates yearly" },
      { id: "C", text: "Uses no records" },
      { id: "D", text: "Uses cash basis" }
    ],
    correct: "A"
  },
  {
    id: 39,
    question: "Purchase discount encourages:",
    options: [
      { id: "A", text: "Late payment" },
      { id: "B", text: "Early payment" },
      { id: "C", text: "Higher price" },
      { id: "D", text: "Cash sales" }
    ],
    correct: "B"
  },
  {
    id: 40,
    question: "FOB shipping point means:",
    options: [
      { id: "A", text: "Seller pays shipping" },
      { id: "B", text: "Buyer pays shipping" },
      { id: "C", text: "Free shipping" },
      { id: "D", text: "No ownership transfer" }
    ],
    correct: "B"
  },
  {
    id: 41,
    question: "Sales discount reduces:",
    options: [
      { id: "A", text: "Cost of goods sold" },
      { id: "B", text: "Accounts receivable" },
      { id: "C", text: "Assets" },
      { id: "D", text: "Liabilities" }
    ],
    correct: "B"
  },
  {
    id: 42,
    question: "Sales returns decrease:",
    options: [
      { id: "A", text: "Revenue" },
      { id: "B", text: "Expenses" },
      { id: "C", text: "Assets" },
      { id: "D", text: "Liabilities" }
    ],
    correct: "A"
  },
  {
    id: 43,
    question: "Gross margin equals:",
    options: [
      { id: "A", text: "Net sales – expenses" },
      { id: "B", text: "Net sales – COGS" },
      { id: "C", text: "Revenue – liabilities" },
      { id: "D", text: "Assets – equity" }
    ],
    correct: "B"
  },
  {
    id: 44,
    question: "Current assets are expected to be used within:",
    options: [
      { id: "A", text: "5 years" },
      { id: "B", text: "Operating cycle or one year" },
      { id: "C", text: "10 years" },
      { id: "D", text: "Life of company" }
    ],
    correct: "B"
  },
  {
    id: 45,
    question: "Long-term liabilities are due:",
    options: [
      { id: "A", text: "Within one year" },
      { id: "B", text: "Immediately" },
      { id: "C", text: "After one year" },
      { id: "D", text: "Monthly" }
    ],
    correct: "C"
  },
  {
    id: 46,
    question: "Blockchain is best described as:",
    options: [
      { id: "A", text: "Centralized database" },
      { id: "B", text: "Manual ledger" },
      { id: "C", text: "Decentralized digital ledger" },
      { id: "D", text: "Accounting software" }
    ],
    correct: "C"
  },
  {
    id: 47,
    question: "Blockchain records are:",
    options: [
      { id: "A", text: "Editable" },
      { id: "B", text: "Temporary" },
      { id: "C", text: "Immutable" },
      { id: "D", text: "Private only" }
    ],
    correct: "C"
  },
  {
    id: 48,
    question: "Triple-entry bookkeeping adds:",
    options: [
      { id: "A", text: "Extra debit" },
      { id: "B", text: "Extra credit" },
      { id: "C", text: "Cryptographic third entry" },
      { id: "D", text: "Extra expense" }
    ],
    correct: "C"
  },
  {
    id: 49,
    question: "One advantage of blockchain in accounting is:",
    options: [
      { id: "A", text: "Slower reporting" },
      { id: "B", text: "More errors" },
      { id: "C", text: "Real-time transactions" },
      { id: "D", text: "Higher costs" }
    ],
    correct: "C"
  },
  {
    id: 50,
    question: "Smart contracts are:",
    options: [
      { id: "A", text: "Manual agreements" },
      { id: "B", text: "Paper contracts" },
      { id: "C", text: "Self-executing programs" },
      { id: "D", text: "Accounting standards" }
    ],
    correct: "C"
  }
];

export interface ACCT150TrueFalseQuestion {
  id: number;
  question: string;
  correct: string;
}

export const acct150TrueFalseQuestions: ACCT150TrueFalseQuestion[] = [
  { id: 1, question: "Accounting helps users make economic decisions.", correct: "True" },
  { id: 2, question: "Managers are external users.", correct: "False" },
  { id: 3, question: "Financial accounting serves internal users only.", correct: "False" },
  { id: 4, question: "GAAP improves comparability of information.", correct: "True" },
  { id: 5, question: "IASB issues IFRS standards.", correct: "True" },
  { id: 6, question: "Economic entity assumption separates owner and business.", correct: "True" },
  { id: 7, question: "Going concern assumes liquidation.", correct: "False" },
  { id: 8, question: "Monetary unit uses money as measurement.", correct: "True" },
  { id: 9, question: "Revenue is recognized when cash is received only.", correct: "False" },
  { id: 10, question: "Matching principle links expenses with revenues.", correct: "True" },
  { id: 11, question: "Assets are business obligations.", correct: "False" },
  { id: 12, question: "Liabilities represent creditors' claims.", correct: "True" },
  { id: 13, question: "Equity is owner's residual interest.", correct: "True" },
  { id: 14, question: "The accounting equation must always balance.", correct: "True" },
  { id: 15, question: "Expenses decrease equity.", correct: "True" },
  { id: 16, question: "Revenue has a normal debit balance.", correct: "False" },
  { id: 17, question: "Journal entries follow double-entry system.", correct: "True" },
  { id: 18, question: "Ledger comes before journal.", correct: "False" },
  { id: 19, question: "Trial balance proves no errors exist.", correct: "False" },
  { id: 20, question: "Trial balance lists all ledger accounts.", correct: "True" },
  { id: 21, question: "Temporary accounts are closed each period.", correct: "True" },
  { id: 22, question: "Assets are temporary accounts.", correct: "False" },
  { id: 23, question: "Income statement shows profit or loss.", correct: "True" },
  { id: 24, question: "Balance sheet is prepared for a period of time.", correct: "False" },
  { id: 25, question: "Cash flow statement shows cash activities.", correct: "True" },
  { id: 26, question: "Accrual accounting follows GAAP.", correct: "True" },
  { id: 27, question: "Prepaid expenses are liabilities.", correct: "False" },
  { id: 28, question: "Depreciation allocates asset cost.", correct: "True" },
  { id: 29, question: "Accumulated depreciation reduces asset value.", correct: "True" },
  { id: 30, question: "Unearned revenue is an asset.", correct: "False" },
  { id: 31, question: "Accrued expenses are liabilities.", correct: "True" },
  { id: 32, question: "Accrued revenues are assets.", correct: "True" },
  { id: 33, question: "Merchandising companies sell services.", correct: "False" },
  { id: 34, question: "Inventory is a current asset.", correct: "True" },
  { id: 35, question: "Cost of goods sold is an expense.", correct: "True" },
  { id: 36, question: "Perpetual inventory updates continuously.", correct: "True" },
  { id: 37, question: "Purchase returns reduce inventory cost.", correct: "True" },
  { id: 38, question: "Sales discounts increase revenue.", correct: "False" },
  { id: 39, question: "Gross profit equals sales minus COGS.", correct: "True" },
  { id: 40, question: "Current liabilities are due within one year.", correct: "True" },
  { id: 41, question: "Plant assets are long-term assets.", correct: "True" },
  { id: 42, question: "Intangible assets have physical form.", correct: "False" },
  { id: 43, question: "Blockchain improves transparency.", correct: "True" },
  { id: 44, question: "Blockchain records can be easily altered.", correct: "False" },
  { id: 45, question: "Triple-entry bookkeeping increases trust.", correct: "True" },
  { id: 46, question: "Smart contracts require manual execution.", correct: "False" },
  { id: 47, question: "Blockchain reduces fraud risk.", correct: "True" },
  { id: 48, question: "Accounting technology eliminates accountants.", correct: "False" },
  { id: 49, question: "Blockchain enables real-time financial reporting.", correct: "True" },
  { id: 50, question: "Accounting information must be reliable and relevant.", correct: "True" }
];
