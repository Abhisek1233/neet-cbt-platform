// Mock Data Store for NEET CBT Platform

export const mockQuestions = [
  {
    id: 'p1',
    subject: 'Physics',
    chapter: 'Electrodynamics & Current Electricity',
    difficulty: 'Medium',
    type: 'Numerical Problem',
    text: 'A wire of resistance R is stretched to twice its original length. Assuming its density remains constant, what is its new resistance?',
    options: ['2 R', '4 R', 'R / 2', 'R / 4'],
    correctOption: 1,
    explanation: 'When stretched to length L\' = 2L, area becomes A\' = A/2. Resistance R\' = 4R.',
    imageUrl: null,
    isAiPredicted: true,
    probabilityWeight: '94% Likely in NEET'
  },
  {
    id: 'p2',
    subject: 'Physics',
    chapter: 'Ray Optics',
    difficulty: 'Hard',
    type: 'Matching Type',
    text: 'A convex lens of focal length 20 cm is placed in contact with a concave lens of focal length 25 cm. What is the power of the combination in dioptres?',
    options: ['+1.0 D', '+5.0 D', '-1.0 D', '+9.0 D'],
    correctOption: 0,
    explanation: 'P1 = +5D, P2 = -4D. Net power P = +1.0 D.',
    imageUrl: null,
    isAiPredicted: true,
    probabilityWeight: '96% Likely in NEET'
  },
  {
    id: 'c1',
    subject: 'Chemistry',
    chapter: 'Organic Chemistry - Hydrocarbons',
    difficulty: 'Medium',
    type: 'Statement I & II',
    text: 'Which of the following compounds undergoes electrophilic aromatic substitution most rapidly?',
    options: ['Benzene', 'Nitrobenzene', 'Toluene', 'Chlorobenzene'],
    correctOption: 2,
    explanation: 'Toluene contains a methyl (-CH3) group which activates the benzene ring.',
    imageUrl: null,
    isAiPredicted: true,
    probabilityWeight: '98% Likely in NEET'
  },
  {
    id: 'b1',
    subject: 'Botany',
    chapter: 'Genetics & Evolution',
    difficulty: 'Hard',
    type: 'Assertion-Reason',
    text: 'In Mendel\'s dihybrid cross between round yellow (RRYY) and wrinkled green (rryy) seeds, what is the proportion of homozygous plants for both traits in F2 generation?',
    options: ['4/16', '2/16', '1/16', '9/16'],
    correctOption: 0,
    explanation: 'Homozygous for both traits: RRYY (1), RRyy (1), rrYY (1), rryy (1). Total = 4/16.',
    imageUrl: null,
    isAiPredicted: true,
    probabilityWeight: '99% Likely in NEET'
  },
  {
    id: 'z1',
    subject: 'Zoology',
    chapter: 'Human Physiology - Neural Control',
    difficulty: 'Medium',
    type: 'Conceptual MCQ',
    text: 'During resting membrane potential in a nerve axon, the ionic gradients are maintained by active transport of ions by the Na+/K+ pump which pumps:',
    options: ['3 Na+ outwards for 2 K+ inwards', '2 Na+ outwards for 3 K+ inwards', '3 Na+ inwards for 2 K+ outwards', '2 Na+ inwards for 3 K+ outwards'],
    correctOption: 0,
    explanation: 'The Na+/K+ pump moves 3 Na+ out for 2 K+ in.',
    imageUrl: null,
    isAiPredicted: true,
    probabilityWeight: '95% Likely in NEET'
  }
];

export const mockExams = [
  {
    id: 'exam-full-01',
    title: 'NTA Official NEET UG 2026 Grand All-India Mock Test #1',
    category: 'Full-Length',
    code: 'NTA-NEET-2026-MOCK1',
    durationMin: 200,
    totalMarks: 720,
    questionCount: 200,
    markingScheme: '+4 for Correct, -1 for Incorrect',
    sections: ['Physics', 'Chemistry', 'Botany', 'Zoology'],
    proctoringLevel: 'Strict AI',
    visibility: 'Public',
    createdBy: 'Dr. R.K. Sharma',
    questionIds: ['p1', 'p2', 'c1', 'b1', 'z1']
  },
  {
    id: 'exam-full-02',
    title: 'All-India National Level NEET Grand Test #2 (200Q Pattern)',
    category: 'Full-Length',
    code: 'NTA-NEET-GRAND-02',
    durationMin: 200,
    totalMarks: 720,
    questionCount: 200,
    markingScheme: '+4 / -1',
    sections: ['Physics', 'Chemistry', 'Botany', 'Zoology'],
    proctoringLevel: 'Strict AI',
    visibility: 'Public',
    createdBy: 'NTA National Board (Simulated)',
    questionIds: ['p1', 'p2', 'c1', 'b1', 'z1']
  },
  {
    id: 'exam-sub-physics',
    title: 'NEET Physics Special: Electrodynamics & Ray Optics',
    category: 'Subject-Wise',
    code: 'SUB-PHY-50Q',
    durationMin: 50,
    totalMarks: 180,
    questionCount: 50,
    markingScheme: '+4 / -1',
    sections: ['Physics'],
    proctoringLevel: 'Strict AI',
    visibility: 'Public',
    createdBy: 'Prof. V. K. Mehta',
    questionIds: ['p1', 'p2']
  },
  {
    id: 'exam-sub-chemistry',
    title: 'NEET Chemistry Master Mock: Organic & Physical Equilibrium',
    category: 'Subject-Wise',
    code: 'SUB-CHEM-50Q',
    durationMin: 50,
    totalMarks: 180,
    questionCount: 50,
    markingScheme: '+4 / -1',
    sections: ['Chemistry'],
    proctoringLevel: 'Moderate',
    visibility: 'Public',
    createdBy: 'Dr. S. K. Roy',
    questionIds: ['c1']
  },
  {
    id: 'exam-sub-botany',
    title: 'NEET Botany & Genetics Special Mock Test',
    category: 'Subject-Wise',
    code: 'SUB-BOTANY-50Q',
    durationMin: 50,
    totalMarks: 180,
    questionCount: 50,
    markingScheme: '+4 / -1',
    sections: ['Botany'],
    proctoringLevel: 'Basic',
    visibility: 'Public',
    createdBy: 'Dr. Ananya Verma',
    questionIds: ['b1']
  },
  {
    id: 'exam-sub-zoology',
    title: 'NEET Zoology Human Physiology & Biotechnology Special',
    category: 'Subject-Wise',
    code: 'SUB-ZOO-50Q',
    durationMin: 50,
    totalMarks: 180,
    questionCount: 50,
    markingScheme: '+4 / -1',
    sections: ['Zoology'],
    proctoringLevel: 'Strict AI',
    visibility: 'Public',
    createdBy: 'Dr. R.K. Sharma',
    questionIds: ['z1']
  },
  {
    id: 'exam-topic-optics',
    title: 'Ray Optics & Optical Instruments Chapter Speed Test',
    category: 'Topic-Wise',
    code: 'TOPIC-OPTICS-20Q',
    durationMin: 25,
    totalMarks: 80,
    questionCount: 20,
    markingScheme: '+4 / -1',
    sections: ['Physics'],
    proctoringLevel: 'Standard',
    visibility: 'Public',
    createdBy: 'AI Speed Test Engine',
    questionIds: ['p2']
  },
  {
    id: 'exam-topic-genetics',
    title: 'Mendelian Genetics & Molecular Inheritance Speed Quiz',
    category: 'Topic-Wise',
    code: 'TOPIC-GEN-20Q',
    durationMin: 25,
    totalMarks: 80,
    questionCount: 20,
    markingScheme: '+4 / -1',
    sections: ['Botany'],
    proctoringLevel: 'Standard',
    visibility: 'Public',
    createdBy: 'Botany Department',
    questionIds: ['b1']
  },
  {
    id: 'exam-ai-predicted-01',
    title: 'NEET 2026 AI Predicted High-Yield Question Paper',
    category: 'AI-Predicted',
    code: 'AI-PREDICTED-2026',
    durationMin: 200,
    totalMarks: 720,
    questionCount: 200,
    markingScheme: '+4 / -1',
    sections: ['Physics', 'Chemistry', 'Botany', 'Zoology'],
    proctoringLevel: 'Strict AI',
    visibility: 'Public',
    createdBy: 'Deep Learning NEET Model v4',
    questionIds: ['p1', 'p2', 'c1', 'b1', 'z1']
  },
  {
    id: 'exam-ai-predicted-02',
    title: 'AI Weightage Engine: Top 100 Most Likely NEET Questions',
    category: 'AI-Predicted',
    code: 'AI-TOP100-SERIES',
    durationMin: 100,
    totalMarks: 400,
    questionCount: 100,
    markingScheme: '+4 / -1',
    sections: ['Physics', 'Chemistry', 'Botany', 'Zoology'],
    proctoringLevel: 'Strict AI',
    visibility: 'Public',
    createdBy: 'AI Prediction Algorithm',
    questionIds: ['p1', 'p2', 'c1', 'b1', 'z1']
  }
];

export const mockColleges = [
  {
    id: 'aiims-delhi',
    name: 'All India Institute of Medical Sciences (AIIMS)',
    city: 'New Delhi',
    state: 'Delhi',
    type: 'Govt / National Importance',
    nirfRank: 1,
    established: 1956,
    totalSeats: 125,
    annualFee: '₹1,628',
    hospitalBeds: 2478,
    cutoffs: [
      { year: 2025, quota: 'AIQ', category: 'General', closingRank: 57, closingScore: 715 },
      { year: 2025, quota: 'AIQ', category: 'OBC', closingRank: 220, closingScore: 705 },
      { year: 2025, quota: 'AIQ', category: 'SC', closingRank: 980, closingScore: 685 },
      { year: 2025, quota: 'AIQ', category: 'ST', closingRank: 1850, closingScore: 670 }
    ]
  },
  {
    id: 'mamc-delhi',
    name: 'Maulana Azad Medical College (MAMC)',
    city: 'New Delhi',
    state: 'Delhi',
    type: 'Govt (DU)',
    nirfRank: 3,
    established: 1958,
    totalSeats: 250,
    annualFee: '₹4,445',
    hospitalBeds: 2800,
    cutoffs: [
      { year: 2025, quota: 'AIQ', category: 'General', closingRank: 95, closingScore: 710 },
      { year: 2025, quota: 'AIQ', category: 'OBC', closingRank: 380, closingScore: 698 },
      { year: 2025, quota: 'AIQ', category: 'SC', closingRank: 1540, closingScore: 675 }
    ]
  },
  {
    id: 'jipmer-puducherry',
    name: 'JIPMER Jawaharlal Institute of Postgraduate Medical Education',
    city: 'Puducherry',
    state: 'Puducherry',
    type: 'Govt / National Importance',
    nirfRank: 5,
    established: 1964,
    totalSeats: 200,
    annualFee: '₹14,910',
    hospitalBeds: 2130,
    cutoffs: [
      { year: 2025, quota: 'AIQ', category: 'General', closingRank: 270, closingScore: 702 },
      { year: 2025, quota: 'AIQ', category: 'OBC', closingRank: 620, closingScore: 690 }
    ]
  },
  {
    id: 'kgmu-lucknow',
    name: 'King George\'s Medical University (KGMU)',
    city: 'Lucknow',
    state: 'Uttar Pradesh',
    type: 'Govt State University',
    nirfRank: 7,
    established: 1911,
    totalSeats: 250,
    annualFee: '₹54,000',
    hospitalBeds: 4500,
    cutoffs: [
      { year: 2025, quota: 'AIQ', category: 'General', closingRank: 1450, closingScore: 680 },
      { year: 2025, quota: 'AIQ', category: 'OBC', closingRank: 2400, closingScore: 670 }
    ]
  },
  {
    id: 'vmmc-delhi',
    name: 'Vardhman Mahavir Medical College & Safdarjung Hospital (VMMC)',
    city: 'New Delhi',
    state: 'Delhi',
    type: 'Govt (IPU)',
    nirfRank: 8,
    established: 2001,
    totalSeats: 170,
    annualFee: '₹50,000',
    hospitalBeds: 2900,
    cutoffs: [
      { year: 2025, quota: 'AIQ', category: 'General', closingRank: 140, closingScore: 708 },
      { year: 2025, quota: 'AIQ', category: 'OBC', closingRank: 480, closingScore: 694 }
    ]
  },
  {
    id: 'afmc-pune',
    name: 'Armed Forces Medical College (AFMC)',
    city: 'Pune',
    state: 'Maharashtra',
    type: 'Govt Defense Services',
    nirfRank: 4,
    established: 1948,
    totalSeats: 150,
    annualFee: '₹0 (Service Bond)',
    hospitalBeds: 1200,
    cutoffs: [
      { year: 2025, quota: 'AIQ', category: 'General', closingRank: 1800, closingScore: 675 }
    ]
  },
  {
    id: 'sms-jaipur',
    name: 'Sawai Man Singh Medical College (SMS)',
    city: 'Jaipur',
    state: 'Rajasthan',
    type: 'Govt State',
    nirfRank: 11,
    established: 1947,
    totalSeats: 250,
    annualFee: '₹43,500',
    hospitalBeds: 3000,
    cutoffs: [
      { year: 2025, quota: 'AIQ', category: 'General', closingRank: 1950, closingScore: 674 }
    ]
  },
  {
    id: 'seth-gs-mumbai',
    name: 'Seth GS Medical College & KEM Hospital',
    city: 'Mumbai',
    state: 'Maharashtra',
    type: 'Govt Municipal',
    nirfRank: 12,
    established: 1926,
    totalSeats: 250,
    annualFee: '₹1,15,000',
    hospitalBeds: 1800,
    cutoffs: [
      { year: 2025, quota: 'AIQ', category: 'General', closingRank: 1100, closingScore: 685 }
    ]
  }
];

export const mockLeaderboard = [
  { rank: 1, name: 'Aarav Sharma', score: 715, accuracy: '98.5%', timeTaken: '2h 45m', state: 'Delhi', squad: 'AIIMS Champions' },
  { rank: 2, name: 'Diya Patel', score: 705, accuracy: '97.2%', timeTaken: '3h 05m', state: 'Gujarat', squad: 'Botany Ninjas' }
];

export const mockTeams = [
  {
    id: 'team-1',
    name: 'AIIMS Champions 2026',
    membersCount: 18,
    avgScore: 685,
    topRanker: 'Aarav Sharma (715)',
    description: 'High-focus study squad aiming for top 100 AIR in NEET 2026.',
    isMember: true,
    chat: [
      { sender: 'Aarav Sharma', text: 'Hey team! Anyone solved Physics Q2 from Mock 1?', time: '18:30' },
      { sender: 'Sneha Reddy', text: 'Yes! Remember to convert focal length into meters.', time: '18:32' }
    ]
  }
];

export const mockDoubts = [
  {
    id: 'd1',
    author: 'Priya Sundaram',
    subject: 'Physics',
    topic: 'Ray Optics',
    question: 'Why do we add powers algebraically P = P1 + P2 when lenses are placed in contact?',
    upvotes: 14,
    replies: [
      { author: 'Prof. V. K. Mehta (Teacher)', role: 'Teacher', text: 'Because image formed by 1st lens acts as virtual object for 2nd lens.', time: '2 hours ago' }
    ]
  }
];
