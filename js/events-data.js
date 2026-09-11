/**
 * Nexorithm 2026 - Event Catalog Data
 * Infant Jesus College of Engineering (IJCE) - Department of CSE & AIDS
 */

const EVENTS_DATA = [
  // =========================================================================
  // --- TECHNICAL EVENTS (3 EVENTS) ---
  // =========================================================================
  {
    id: 'idea-arena',
    title: 'IDEA ARENA – PROJECT PRESENTATION',
    category: 'technical',
    badge: 'Paper & Project Pitch',
    icon: 'lightbulb',
    tagline: 'Pitch Breakthrough Ideas. Define Tomorrow’s Tech.',
    description: 'Showcase your novel technical research papers, innovative startup concepts, or engineering capstone prototypes in AI/ML, Cloud, Cyber Security, IoT, and Data Science.',
    teamSize: '1 - 5 Members',
    maxTeam: 3,
    timing: '10:30 AM - 01:00 PM',
    venue: 'IJCE Seminar Hall (Auditorium Block)',
    coordinators: [
      { name: 'Simiyon (Final Year CSE)', phone: '+91 9087575137' },
      { name: 'Mrs.Deborah sarah (Professor - CSE & AIDS)' }
    ],
    rounds: [
      {
        title: 'Phase 1: Registration & Abstract Submission',
        desc: 'Register for the event, then submit your project abstract to the organizers.'
      },
      {
        title: 'Phase 2: Live Project Presentation',
        desc: 'Present your project on stage within the given time limit.'
      }
    ],
    rules: [
      'Participants must register before submitting the abstract.',
      'After registration, the abstract must be sent to the organizers.',
      'The idea should be original and innovative.',
      'Participants must present their project within the given time limit.',
      'Judges’ decision will be final.'
    ]
  },
  {
    id: 'debugging',
    title: 'DEBUGGING',
    category: 'technical',
    badge: 'Code & Bug Hunt',
    icon: 'terminal',
    tagline: 'Trace the Logic. Defuse the Bugs. Restore the System.',
    description: 'Tackle syntax, logical, and runtime errors in given programs under strict time limits.',
    teamSize: '1 Member',
    maxTeam: 1,
    timing: '10:45 AM - 12:30 PM',
    venue: 'Software Systems Lab (Lab 1)',
    coordinators: [
      { name: 'Kaviyarsan (Final Year CSE)', phone: '+91 7845127211' },
      { name: 'Mrs.Ramachandrika  (Faculty Coordinator)' }
    ],
    rounds: [
      {
        title: 'Round 1: Error Identification',
        desc: 'Identify the errors present in the given programs.'
      },
      {
        title: 'Round 2: Correction & Submission',
        desc: 'Correct the identified errors and submit the working program within the time limit.'
      }
    ],
    rules: [
      'Participants should identify and correct the errors in the given programs.',
      'Programs may contain syntax, logical, or runtime errors.',
      'Participants must complete the task within the given time limit.',
      'No unfair means or external assistance is allowed.',
      'The participant completing the task accurately in less time will be preferred.',
      'Judges’ decision will be final.'
    ]
  },
  {
    id: 'ai-prompt-athon',
    title: 'AI PROMPTATHON',
    category: 'technical',
    badge: 'GenAI & Prompt Eng.',
    icon: 'sparkles',
    tagline: 'Master the Art of Human-AI Orchestration.',
    description: 'Craft an effective prompt on a surprise theme and submit the prompt along with its generated output within the time limit.',
    teamSize: '1 Member',
    maxTeam: 1,
    timing: '01:45 PM - 03:15 PM',
    venue: 'AI & Data Science Lab (Lab 4)',
    coordinators: [
      { name: 'Anitha (4th Year CSE)', phone: '+91 9360435045' },
      { name: 'Mrs.Mahalakshmi (Faculty Coordinator)' }
    ],
    rounds: [
      {
        title: 'Round 1: Theme Reveal',
        desc: 'The theme for the prompt will be given on the spot.'
      },
      {
        title: 'Round 2: Prompt Creation & Submission',
        desc: 'Create an effective prompt based on the theme and submit the prompt with its generated output within 15 minutes.'
      }
    ],
    rules: [
      'The theme will be given on the spot.',
      'Participants must create an effective prompt based on the given theme.',
      'Time limit: 15 minutes for prompt creation and submission.',
      'Prompts will be evaluated based on creativity, relevance, and output quality.',
      'Participants must submit their prompt and generated output within the time limit.',
      'Judges’ decision will be final.'
    ]
  },

  // =========================================================================
  // --- NON-TECHNICAL EVENTS (4 EVENTS) ---
  // =========================================================================
  {
    id: 'word-hunt',
    title: 'WORD HUNT',
    category: 'non-technical',
    badge: 'Tamil Word Search',
    icon: 'search',
    tagline: 'Clue It. Hunt It. Find It.',
    description: 'A team challenge where one member gives clues while the other two race to find the hidden Tamil words.',
    teamSize: '3 Members',
    maxTeam: 3,
    timing: 'To Be Announced',
    venue: 'To Be Announced',
    coordinators: [
      { name: 'Jaimalini (4th Year CSE)', phone: '+91 9361657711' },
      { name: 'Mrs. paulselvi (Faculty Coordinator)' }
    ],
    rounds: [
      {
        title: 'Round 1: Clue Giving',
        desc: 'One team member gives clues without directly revealing the words.'
      },
      {
        title: 'Round 2: Word Hunting',
        desc: 'The other two members find the hidden Tamil words within the given time limit.'
      }
    ],
    rules: [
      'Each team must consist of 3 members.',
      '1 member will be given the clue, while the other 2 members must find the words.',
      'The clue-giver can only give clues and cannot directly find the words.',
      'The two participants must find the hidden Tamil words within the given time limit.',
      'The team finding the maximum number of correct words will be the winner.',
      'Judges’ decision will be final.'
    ]
  },
  {
    id: 'game-war-free-fire',
    title: 'GAME WAR – FREE FIRE',
    category: 'non-technical',
    badge: 'Esports Showdown',
    icon: 'gamepad-2',
    tagline: 'Squad Up. Drop In. Claim the Battleground.',
    description: 'Squad up and battle it out in Free Fire for ultimate campus esports supremacy, following the organizers’ match instructions.',
    teamSize: '4 Members',
    maxTeam: 4,
    timing: 'To Be Announced',
    venue: 'To Be Announced',
    coordinators: [
      { name: 'Vasanthakumar(4th Year CSE)', phone: '+91 8072254953' },
      { name: 'Mrs.Sangeetha (Faculty Coordinator)' }
    ],
    rounds: [
      {
        title: 'Round 1: Match Briefing',
        desc: 'Teams receive match instructions from the organizers.'
      },
      {
        title: 'Round 2: The Match',
        desc: 'Teams compete within the given time limit, judged on game performance and scores.'
      }
    ],
    rules: [
      'Each team must consist of 4 members.',
      'Participants will play Free Fire as per the organizers’ instructions.',
      'The match will be conducted within the given time limit.',
      'Hacks, cheats, or unfair practices are strictly prohibited.',
      'Players must follow the match rules.',
      'Winners will be decided based on game performance and scores.',
      'Judges’ decision will be final.'
    ]
  },
  {
    id: 'blind-fold',
    title: 'BLIND FOLD',
    category: 'non-technical',
    badge: 'Sensory Challenge',
    icon: 'eye-off',
    tagline: 'Trust Your Instincts. Complete the Challenge Blind.',
    description: 'Complete a given task while blindfolded, following the organizers’ instructions carefully.',
    teamSize: 'To Be Announced',
    maxTeam: 5,
    timing: 'To Be Announced',
    venue: 'To Be Announced',
    coordinators: [
      { name: 'Aarthi (Final Year CSE)', phone: '+91 9342202985' },
      { name: 'Mrs.Ebi Jebamalar (Faculty Coordinator)' }
    ],
    rounds: [
      {
        title: 'Round 1: Blindfolded Task',
        desc: 'Participants complete the assigned task blindfolded, following organizer instructions.'
      }
    ],
    rules: [
      'Participants must complete the given task while blindfolded.',
      'Instructions given by the organizers must be followed carefully.',
      'The task should be completed within the given time limit.',
      'Participants must not remove the blindfold during the challenge.',
      'Any unsafe or unfair activity will lead to disqualification.',
      'The fastest successful completion will be preferred.'
    ]
  },
  {
    id: 'junk-sculpting',
    title: 'JUNK SCULPTING',
    category: 'non-technical',
    badge: 'Waste-to-Art Challenge',
    icon: 'palette',
    tagline: 'Turn Trash Into Treasure.',
    description: 'Create a creative model using provided waste and junk materials, built entirely during the event.',
    teamSize: 'To Be Announced',
    maxTeam: 3,
    timing: 'To Be Announced',
    venue: 'To Be Announced',
    coordinators: [
      { name: 'Madhumitha (4th year CSE)', phone: '+91 9677830490' },
      { name: 'Mrs.Mohammed Ashiga (CSE HOD)' }
    ],
    rounds: [
      {
        title: 'Round 1: Materials Distribution',
        desc: 'Organizers provide and specify the waste/junk materials to be used.'
      },
      {
        title: 'Round 2: Sculpting',
        desc: 'Participants build their original sculpture within the given time limit.'
      }
    ],
    rules: [
      'Participants should create a creative model using the provided waste/junk materials.',
      'Materials will be provided and specified by the organizers.',
      'The sculpture must be completed within the given time limit.',
      'The model should be original and made during the event.',
      'Evaluation will be based on creativity, innovation, and presentation.',
      'Judges’ decision will be final.'
    ]
  }
];
