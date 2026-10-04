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
    id: 'p3',
    subject: 'Physics',
    chapter: 'Thermodynamics',
    difficulty: 'Medium',
    type: 'Numerical Problem',
    text: 'A Carnot engine has an efficiency of 50% when its sink temperature is at 27°C. To increase its efficiency to 60%, the temperature of the source must be increased by:',
    options: ['60 K', '150 K', '300 K', '75 K'],
    correctOption: 1,
    explanation: '0.5 = 1 - 300/T1 => T1 = 600 K. For 60%: 0.6 = 1 - 300/T1\' => T1\' = 750 K. Increase = 150 K.',
    imageUrl: null,
    isAiPredicted: true,
    probabilityWeight: '95% Likely in NEET'
  },
  {
    id: 'p4',
    subject: 'Physics',
    chapter: 'Wave Optics',
    difficulty: 'Hard',
    type: 'Conceptual MCQ',
    text: 'In Young\'s double slit experiment, if the distance between slits is halved and distance between screen and slits is doubled, the fringe width will be:',
    options: ['Halved', 'Unchanged', 'Doubled', 'Quadrupled'],
    correctOption: 3,
    explanation: 'β = λD/d. If D -> 2D and d -> d/2, β\' = 4β.',
    imageUrl: null,
    isAiPredicted: true,
    probabilityWeight: '97% Likely in NEET'
  },
  {
    id: 'c1',
    subject: 'Chemistry',
    chapter: 'Organic Chemistry - Hydrocarbons',
    difficulty: 'Medium',
    type: 'Statement I & II',
    text: 'Which of the following compounds undergoes electrophilic aromatic substitution most rapidly?',
    options: ['Benzene', 'Nitrobenzene', 'Toluene', 'Phenol'],
    correctOption: 3,
    explanation: 'Phenol contains a strong activating -OH group which increases electron density most strongly.',
    imageUrl: null,
    isAiPredicted: true,
    probabilityWeight: '98% Likely in NEET'
  },
  {
    id: 'c2',
    subject: 'Chemistry',
    chapter: 'Chemical Kinetics',
    difficulty: 'Hard',
    type: 'Numerical Problem',
    text: 'For a first-order chemical reaction, the time required for 99% completion is related to the half-life period (t1/2) by the relation:',
    options: ['t(99%) = 2 * t1/2', 't(99%) ≈ 6.6 * t1/2', 't(99%) = 10 * t1/2', 't(99%) = 4.3 * t1/2'],
    correctOption: 1,
    explanation: 't(99%) = (2.303/k)*log(100) = 4.606/k. Since t1/2 = 0.693/k, 4.606 / 0.693 ≈ 6.64.',
    imageUrl: null,
    isAiPredicted: true,
    probabilityWeight: '96% Likely in NEET'
  },
  {
    id: 'c3',
    subject: 'Chemistry',
    chapter: 'Electrochemistry',
    difficulty: 'Medium',
    type: 'Conceptual MCQ',
    text: 'The standard reduction potentials for Al³⁺/Al, Fe²⁺/Fe, and Cu²⁺/Cu are -1.66 V, -0.44 V, and +0.34 V. The correct decreasing order of reducing power is:',
    options: ['Cu > Fe > Al', 'Al > Fe > Cu', 'Fe > Al > Cu', 'Al > Cu > Fe'],
    correctOption: 1,
    explanation: 'More negative reduction potential means stronger reducing agent: Al > Fe > Cu.',
    imageUrl: null,
    isAiPredicted: true,
    probabilityWeight: '95% Likely in NEET'
  },
  {
    id: 'b1',
    subject: 'Botany',
    chapter: 'Genetics & Evolution',
    difficulty: 'Hard',
    type: 'Assertion-Reason',
    text: 'In Mendel\'s dihybrid cross between round yellow (RRYY) and wrinkled green (rryy) seeds, what proportion of F2 progeny are recombinant phenotypes?',
    options: ['37.5% (6/16)', '50% (8/16)', '25% (4/16)', '56.25% (9/16)'],
    correctOption: 0,
    explanation: 'Recombinant phenotypes are round green (3) and wrinkled yellow (3) = 6/16 = 37.5%.',
    imageUrl: null,
    isAiPredicted: true,
    probabilityWeight: '99% Likely in NEET'
  },
  {
    id: 'b2',
    subject: 'Botany',
    chapter: 'Photosynthesis in Higher Plants',
    difficulty: 'Medium',
    type: 'Statement I & II',
    text: 'During non-cyclic photophosphorylation in thylakoids, the primary electron acceptor from Photosystem II (P680) is:',
    options: ['Plastoquinone', 'Pheophytin', 'Cytochrome b6f', 'Ferredoxin'],
    correctOption: 1,
    explanation: 'Upon light absorption, P680 passes its excited electron first to pheophytin.',
    imageUrl: null,
    isAiPredicted: true,
    probabilityWeight: '97% Likely in NEET'
  },
  {
    id: 'b3',
    subject: 'Botany',
    chapter: 'Sexual Reproduction in Flowering Plants',
    difficulty: 'Medium',
    type: 'Conceptual MCQ',
    text: 'During double fertilization in angiosperms, the fusion of one male gamete with the diploid secondary nucleus forms:',
    options: ['Zygote (2n)', 'Primary Endosperm Nucleus (3n)', 'Aleurone layer (2n)', 'Embryo (2n)'],
    correctOption: 1,
    explanation: 'Triple fusion creates the triploid (3n) Primary Endosperm Nucleus (PEN).',
    imageUrl: null,
    isAiPredicted: true,
    probabilityWeight: '98% Likely in NEET'
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
    explanation: 'The Na+/K+ pump moves 3 Na+ out for 2 K+ in consuming one ATP.',
    imageUrl: null,
    isAiPredicted: true,
    probabilityWeight: '95% Likely in NEET'
  },
  {
    id: 'z2',
    subject: 'Zoology',
    chapter: 'Body Fluids & Circulation',
    difficulty: 'Hard',
    type: 'Matching Type',
    text: 'In a standard 12-lead Electrocardiogram (ECG) of a healthy adult, the QRS complex represents:',
    options: ['Depolarisation of Atria', 'Repolarisation of Ventricles', 'Depolarisation of Ventricles', 'Repolarisation of Atria'],
    correctOption: 2,
    explanation: 'The QRS complex represents ventricular depolarisation, which initiates ventricular contraction.',
    imageUrl: null,
    isAiPredicted: true,
    probabilityWeight: '97% Likely in NEET'
  },
  {
    id: 'z3',
    subject: 'Zoology',
    chapter: 'Biotechnology: Principles & Processes',
    difficulty: 'Hard',
    type: 'Statement I & II',
    text: 'Which restriction endonuclease enzyme produces blunt ends upon cleavage of double-stranded target DNA?',
    options: ['EcoRI', 'HindIII', 'SmaI', 'BamHI'],
    correctOption: 2,
    explanation: 'SmaI recognizes CCC^GGG and cuts symmetrically producing blunt ends, whereas EcoRI and HindIII produce sticky ends.',
    imageUrl: null,
    isAiPredicted: true,
    probabilityWeight: '96% Likely in NEET'
  }
];

export const mockExams = [
  {
    id: 'exam-full-01',
    title: 'NTA Official NEET UG Grand All-India Mock Test #1',
    category: 'Full-Length',
    code: 'NTA-NEET-MOCK1',
    durationMin: 200,
    totalMarks: 720,
    questionCount: 200,
    markingScheme: '+4 for Correct, -1 for Incorrect',
    sections: ['Physics', 'Chemistry', 'Botany', 'Zoology'],
    proctoringLevel: 'Strict AI',
    visibility: 'Public',
    createdBy: 'Dr. R.K. Sharma',
    questionIds: []
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
    questionIds: []
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
    questionIds: []
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
    questionIds: []
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
    questionIds: []
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
    createdBy: 'Dr. R.K. Sharma',
    questionIds: []
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
    questionIds: []
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
    questionIds: []
  },
  {
    id: 'exam-ai-predicted-01',
    title: 'NEET AI Predicted High-Yield Question Paper',
    category: 'AI-Predicted',
    code: 'AI-PREDICTED-PAPER',
    durationMin: 200,
    totalMarks: 720,
    questionCount: 200,
    markingScheme: '+4 / -1',
    sections: ['Physics', 'Chemistry', 'Botany', 'Zoology'],
    proctoringLevel: 'Strict AI',
    visibility: 'Public',
    createdBy: 'Deep Learning NEET Model v4',
    questionIds: []
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
    createdBy: 'Deep Learning NEET Model v4',
    questionIds: []
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
    name: 'AIIMS Champions Squad',
    membersCount: 18,
    avgScore: 685,
    topRanker: 'Aarav Sharma (715)',
    description: 'High-focus study squad aiming for top 100 AIR in NEET UG.',
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
