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
    title: 'IDEA ARENA',
    category: 'technical',
    badge: 'Paper & Project Pitch',
    icon: 'lightbulb',
    tagline: 'Pitch Breakthrough Ideas. Define Tomorrow’s Tech.',
    description: 'Showcase your novel technical research papers, innovative startup concepts, or engineering capstone prototypes in AI/ML, Cloud, Cyber Security, IoT, and Data Science.',
    teamSize: '1 - 3 Members',
    maxTeam: 3,
    timing: '10:30 AM - 01:00 PM',
    venue: 'IJCE Seminar Hall (Auditorium Block)',
    coordinators: [
      { name: 'Vigneshwaran P. (Final Year CSE)', phone: '+91 99441 55667' },
      { name: 'Dr. G. Maria (HOD / CSE & AIDS)', phone: '+91 94862 33445' }
    ],
    rounds: [
      {
        title: 'Phase 1: Abstract & Slide Screening',
        desc: 'Submit your IEEE-format 1-page abstract and presentation slide deck covering problem statement, methodology, architecture, and expected impact.'
      },
      {
        title: 'Phase 2: Live Defense & Stage Pitch',
        desc: '7 minutes live pitch on stage followed by 3 minutes rigorous Q&A with the expert faculty & industry panel.'
      }
    ],
    rules: [
      'Domains: Artificial Intelligence, Cyber Security, Cloud Computing, IoT & Robotics, Data Analytics, Green Energy Tech.',
      'Slide deck must adhere to the 10-12 slide limit.',
      'Working prototypes, hardware demos, or simulation results carry bonus evaluation points.',
      'Decision of the jury panel is final and indisputable.'
    ]
  },
  {
    id: 'debugging',
    title: 'DEBUGGING',
    category: 'technical',
    badge: 'Code & Bug Hunt',
    icon: 'terminal',
    tagline: 'Trace the Logic. Defuse the Bugs. Restore the System.',
    description: 'Tackle obfuscated code snippets, syntax traps, memory leaks, concurrency race conditions, and logic errors across C, C++, Java, and Python under strict time limits.',
    teamSize: '1 - 2 Members',
    maxTeam: 2,
    timing: '10:45 AM - 12:30 PM',
    venue: 'Software Systems Lab (Lab 1)',
    coordinators: [
      { name: 'Karthik S. (Final Year CSE)', phone: '+91 94881 23456' },
      { name: 'Dr. R. David (Faculty Coordinator)', phone: '+91 98421 67890' }
    ],
    rounds: [
      {
        title: 'Round 1: Rapid Syntax & Compiler Sprint',
        desc: '20 minutes to find and fix tricky syntax, typecasting, and pointer errors in short multi-language code snippets.'
      },
      {
        title: 'Round 2: Logic Bomb & Algorithm Defusal',
        desc: 'Reverse engineer corrupted algorithm flows, patch runtime exceptions, and optimize the corrected code for performance.'
      }
    ],
    rules: [
      'Supported languages: C, C++, Java, and Python.',
      'No internet access, external documentation, or AI copilot extensions permitted during the contest.',
      'Evaluation criteria: Accuracy of output, number of test cases passed, and fastest completion time.'
    ]
  },
  {
    id: 'ai-prompt-athon',
    title: 'AI PROMPT-ATHON',
    category: 'technical',
    badge: 'GenAI & Prompt Eng.',
    icon: 'sparkles',
    tagline: 'Master the Art of Human-AI Orchestration.',
    description: 'Compete in crafting high-precision prompts for Large Language Models (LLMs) and Diffusion Image Generators to solve complex logic challenges and synthesize target artwork.',
    teamSize: '1 Member',
    maxTeam: 1,
    timing: '01:45 PM - 03:15 PM',
    venue: 'AI & Data Science Lab (Lab 4)',
    coordinators: [
      { name: 'Sanjay V. (3rd Year AIDS)', phone: '+91 93601 44332' },
      { name: 'Prof. T. Nancy (Faculty Coordinator)', phone: '+91 98402 77889' }
    ],
    rounds: [
      {
        title: 'Round 1: Few-Shot Logic Engineering',
        desc: 'Construct structured chain-of-thought system prompts to force the LLM to solve intricate reasoning puzzles with zero hallucinations.'
      },
      {
        title: 'Round 2: High-Fidelity Reverse Image Synthesis',
        desc: 'Analyze a hidden target image and craft the exact style, lighting, camera angle, and negative prompt parameters to regenerate it.'
      }
    ],
    rules: [
      'Standard AI model sandboxes will be provided to all contestants on campus systems.',
      'Evaluation criteria: Token economy, prompt clarity, reasoning accuracy, and image fidelity percentage.'
    ]
  },

  // =========================================================================
  // --- NON-TECHNICAL EVENTS (4 EVENTS) ---
  // =========================================================================
  {
    id: 'hidden-quest',
    title: 'HIDDEN QUEST',
    category: 'non-technical',
    badge: 'Campus Treasure Hunt',
    icon: 'compass',
    tagline: 'Decode Cryptic Clues. Conquer the Campus Mystery.',
    description: 'An adrenaline-fueled campus-wide treasure hunt combining cipher decryption, spatial riddles, secret checkpoint hunting, and mystery unlocking across IJCE.',
    teamSize: '2 - 4 Members',
    maxTeam: 4,
    timing: '01:30 PM - 03:45 PM',
    venue: 'Campus Central Quadrangle',
    coordinators: [
      { name: 'Dinesh Kumar (Final Year CSE)', phone: '+91 94899 66778' },
      { name: 'Prof. R. Jebaraj (Faculty Coordinator)', phone: '+91 98411 22334' }
    ],
    rounds: [
      {
        title: 'Phase 1: Binary & Cipher Grid',
        desc: 'Solve cryptic Caesar, Hex, and visual riddles to locate your team’s starting campus checkpoint.'
      },
      {
        title: 'Phase 2: Checkpoint Clue Trail',
        desc: 'Follow physical and encrypted clue markers scattered across laboratories, libraries, and campus gardens.'
      },
      {
        title: 'Phase 3: The Final Mystery Unlock',
        desc: 'Assemble all collected key fragments to discover and unlock the grand mystery vault.'
      }
    ],
    rules: [
      'All registered participants must stay together throughout the entire hunt.',
      'Tampering with clues or entering unauthorized staff areas leads to immediate disqualification.',
      'The first team to unlock the mystery vault with verified clues wins.'
    ]
  },
  {
    id: 'game-way',
    title: 'GAME WAY',
    category: 'non-technical',
    badge: 'Esports Showdown',
    icon: 'gamepad-2',
    tagline: 'Unleash Pure Gaming Reflexes & Squad Tactics.',
    description: 'Engage in intense tactical warfare in Battlegrounds Mobile India (BGMI) and fast-paced mobile gaming showdowns for ultimate campus esports supremacy.',
    teamSize: 'Squad (4 Members) or Solo',
    maxTeam: 4,
    timing: '11:00 AM - 03:30 PM',
    venue: 'Indoor Esports Arena (Room 204)',
    coordinators: [
      { name: 'Mohamed Ashik (3rd Year CSE)', phone: '+91 91590 12345' },
      { name: 'Prof. S. Jackson (Faculty Coordinator)', phone: '+91 94421 98765' }
    ],
    rounds: [
      {
        title: 'Round 1: Qualifier Custom Lobby',
        desc: 'Battle royale qualifier match where top placement points and kill points qualify for the finals.'
      },
      {
        title: 'Round 2: The Championship Showdown',
        desc: 'Final high-stakes matches across custom tournament lobbies to crown the champion squad.'
      }
    ],
    rules: [
      'Participants must bring their own smartphones with updated game versions installed.',
      'Emulators, iPads, triggers, hacks, or modified game APKs are strictly prohibited.',
      'High-speed campus Wi-Fi network will be provided.'
    ]
  },
  {
    id: 'farm-fresh-finder',
    title: 'FARM FRESH FINDER',
    category: 'non-technical',
    badge: 'Agri-Market Scavenger',
    icon: 'sprout',
    tagline: 'Identify, Trade & Win the Fresh Market Strategy.',
    description: 'A fun, interactive, and fast-paced game of identifying botanical produce, deciphering market pricing clues, and trading fresh goods through smart budget negotiations.',
    teamSize: '2 - 3 Members',
    maxTeam: 3,
    timing: '11:30 AM - 01:15 PM',
    venue: 'Open Green Lawn & Seminar Annex',
    coordinators: [
      { name: 'Praveen Kumar (3rd Year CSE)', phone: '+91 97892 34567' },
      { name: 'Prof. P. Stella (Faculty Coordinator)', phone: '+91 98425 44332' }
    ],
    rounds: [
      {
        title: 'Round 1: The Produce & Seed Identifier',
        desc: 'Fast-paced identification round of rare medicinal herbs, organic produce, indigenous seed varieties, and traditional tools.'
      },
      {
        title: 'Round 2: Fresh Market Auction & Trade',
        desc: 'Use a virtual currency purse to bid, trade, and assemble the most optimal and valuable market produce basket.'
      }
    ],
    rules: [
      'Discussion is allowed only among registered participants.',
      'No use of smartphone image search during the identification challenge.',
      'Winner is decided based on total identification accuracy score plus net trading profit.'
    ]
  },
  {
    id: 'art-30-min',
    title: '30 MIN ART',
    category: 'non-technical',
    badge: 'Speed Creative Art',
    icon: 'palette',
    tagline: '30 Minutes. Infinite Imagination. Pure Artistry.',
    description: 'Unleash your creative flair in a 30-minute speed art challenge. Craft conceptual drawings, digital artwork, or poster illustrations on an on-the-spot theme.',
    teamSize: '1 - 2 Members',
    maxTeam: 2,
    timing: '01:45 PM - 02:45 PM',
    venue: 'Multimedia & Design Lab (Lab 5)',
    coordinators: [
      { name: 'Rahul Dev (2nd Year AIDS)', phone: '+91 96550 33221' },
      { name: 'Prof. A. Beulah (Faculty Coordinator)', phone: '+91 94435 66778' }
    ],
    rounds: [
      {
        title: 'Phase 1: Theme Announcement',
        desc: 'Surprise creative theme revealed on the spot (e.g., Nature Meets Cyberpunk, or Technology for Humanity).'
      },
      {
        title: 'Phase 2: 30-Minute Drawing Sprint',
        desc: 'Exactly 30 minutes on the clock to sketch, paint, or digitally illustrate your artwork.'
      }
    ],
    rules: [
      'Drawing sheets will be provided. Participants may bring their own colors, markers, or digital drawing tablets.',
      'All artwork must be original and completed strictly within the 30-minute timer.',
      'Evaluation criteria: Concept originality, composition aesthetics, visual impact, and completion within the time limit.'
    ]
  }
];
