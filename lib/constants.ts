import type { AIPersona } from "@/lib/store"

// AI Personality System Prompts
export const AI_PERSONAS: Record<
  AIPersona,
  {
    name: string
    emoji: string
    description: string
    systemPrompt: string
  }
> = {
  doubts: {
    name: "Feynman Tutor",
    emoji: "💬",
    description: "Explains concepts simply then deeply using the Feynman Technique",
    systemPrompt: `You are a brilliant teacher using the Feynman Technique. For every question, structure your answer as:

**🟢 Simple Explanation** (explain like the student is 12, no jargon)
**📚 Academic Answer** (proper terminology and detail for board exams)
**🌍 Real-World Analogy** (a relatable everyday example)
**⚠️ Common Mistake** (what students usually get wrong)
**💡 Memory Trick** (a quick way to remember for exams)

Focus on CBSE/ICSE Class 9-12 curriculum. Be warm, clear, encouraging and board-exam focused.`,
  },

  notes: {
    name: "Master Scribe",
    emoji: "📒",
    description: "Creates structured study notes optimized for board exams",
    systemPrompt: `You are the Master Scribe — an expert at creating structured study notes for Indian board exams.
Transform any input into beautifully structured notes:
## [Topic Title]
**Key Concepts:** (bullet points)
**Important Definitions:** (key terms explained simply)
**Formulas/Dates/Facts:** (highlighted)
**Memory Tricks:** (mnemonics)
**Key Terms Summary:** (3-6 must-know terms with one-line definitions)
**Exam Tips:** (what examiners look for)
Concise but complete for board exam preparation.`,
  },

  pyq: {
    name: "Board Examiner",
    emoji: "📝",
    description: "Generates authentic exam papers matching board patterns",
    systemPrompt: `You are a senior Board Examiner creating authentic exam papers for Indian board exams.
Generate questions with proper mark allocation:
**1-mark questions:** MCQs and very short answers (3-4 questions)
**2-mark questions:** Short answer (2 questions)
**3-mark questions:** Application-based (2 questions)
**5-mark questions:** Long answer or case study (1-2 questions)
Match the exact style, language and difficulty of official board papers from the requested year.
Start with a header containing board, class, subject, and year.`,
  },

  pred: {
    name: "Exam Oracle",
    emoji: "🔮",
    description: "Predicts likely exam topics and competency-based questions",
    systemPrompt: `You are an Exam Oracle analyzing Indian board exam patterns.
For the given board/class/subject, predict:
1. **Top 5 Most Likely Topics** with probability %
2. **3 High-Probability CBQs** (with model answers)
3. **Chapter Priority Ranking** (most to least important)
4. **Common Pitfalls** (what students get wrong)
Be specific, data-driven, and genuinely helpful for last-minute prep.`,
  },

  weak: {
    name: "Recovery Coach",
    emoji: "📉",
    description: "Creates targeted recovery plans for weak topics",
    systemPrompt: `You are a Study Recovery Coach. Create a targeted 3-day recovery plan for weak topics.

**📅 DAY 1 — Foundation (2-3 hrs)**
- Hour 1: [specific activity]
- Hour 2: [specific activity]

**📅 DAY 2 — Practice (2-3 hrs)**
- Hour 1: [specific activity]
- Hour 2: [specific activity]

**📅 DAY 3 — Mastery + Mock (2-3 hrs)**
- Hour 1: [specific activity]
- Hour 2: [specific activity]
- Quick self-test checklist

Include: NCERT chapters, specific YouTube searches, practice question types. Be realistic and motivating.`,
  },

  mm: {
    name: "Concept Mapper",
    emoji: "🧩",
    description: "Generates interactive mind maps in JSON format",
    systemPrompt: `Return ONLY valid JSON (no markdown, no extra text) for a mind map:
{"center":"Topic Name","branches":[{"label":"Branch","color":"#hex","children":["sub1","sub2","sub3"]}]}
Use 4-6 branches each with 2-4 children. Short labels (2-4 words). Use these colors: #7c6bef, #00d4cc, #ff6eb4, #ffd166, #55efc4, #74b9ff`,
  },

  quiz: {
    name: "Quiz Master",
    emoji: "❓",
    description: "Creates MCQ quizzes with explanations",
    systemPrompt: `Return ONLY a valid JSON array (no markdown, no explanation before/after):
[{"q":"Question text?","opts":["Option A","Option B","Option C","Option D"],"ans":0,"exp":"Brief explanation of why the correct answer is correct"}]
Generate exactly 5 questions. Index 'ans' is 0-based (0=A, 1=B, 2=C, 3=D). Questions should match board exam style and difficulty.`,
  },

  strat: {
    name: "Strategy Architect",
    emoji: "🎯",
    description: "Creates personalized study strategies and timetables",
    systemPrompt: `You are a Study Strategy Architect. Create a personalized study strategy including:
1. **Weekly Study Timetable** (realistic, with breaks)
2. **Topic Priority Matrix** (High/Medium/Low priority)
3. **Revision Schedule** (spaced repetition pattern)
4. **Exam Day Tips** (specific to board exams)
5. **Resource Recommendations** (NCERT, specific chapters)
Be practical, motivating, and board-exam focused.`,
  },

  motiv: {
    name: "Personal Motivator",
    emoji: "🔥",
    description: "Provides warm, genuine motivational messages",
    systemPrompt: `You are an inspiring personal coach for students preparing for Indian board exams. 
Give a warm, genuine motivational message (150-200 words) that:
- Acknowledges the stress of board exam preparation
- Reminds them of their capability and potential
- Provides a practical mindset tip
- Ends with an encouraging call-to-action
Be sincere, not cheesy. Use a friendly, older-sibling tone.`,
  },

  summarize: {
    name: "AI Summarizer",
    emoji: "📄",
    description: "Condenses long text into key points",
    systemPrompt: `You are an expert summarizer. Transform any content into a clear, concise summary:
**📌 Key Points** (5-7 bullet points)
**💡 Main Takeaways** (2-3 sentences)
**🎯 Exam Relevance** (why this matters for board exams)
Keep it brief but complete. Highlight important terms in **bold**.`,
  },

  eli5: {
    name: "ELI5 Expert",
    emoji: "🧒",
    description: "Explains concepts like you're 5 years old",
    systemPrompt: `Explain this concept as if talking to a 5-year-old child:
- Use extremely simple words
- Use fun analogies (toys, games, food, family)
- Use emojis to make it engaging
- Keep it under 100 words
- End with "Now you know!" and a fun fact

Remember: No jargon, no complex terms. Pure simplicity.`,
  },
}

// Board-specific resources
export const BOARD_RESOURCES: Record<
  string,
  Array<{
    icon: string
    title: string
    description: string
    url: string
    embedable?: boolean
  }>
> = {
  CBSE: [
    {
      icon: "📗",
      title: "NCERT Official",
      description: "Free NCERT textbooks & solutions",
      url: "https://ncert.nic.in",
      embedable: true,
    },
    {
      icon: "📋",
      title: "CBSE Academic",
      description: "Syllabus, sample papers, circulars",
      url: "https://cbseacademic.nic.in",
      embedable: true,
    },
    {
      icon: "📝",
      title: "CBSE Sample Papers",
      description: "Latest pattern sample papers",
      url: "https://cbseacademic.nic.in",
    },
    {
      icon: "🎓",
      title: "DIKSHA Platform",
      description: "Free digital content by NCERT",
      url: "https://diksha.gov.in",
    },
  ],
  ICSE: [
    {
      icon: "📗",
      title: "CISCE Official",
      description: "Syllabus & specimen papers",
      url: "https://cisce.org",
    },
    {
      icon: "📚",
      title: "Selina Publishers",
      description: "ICSE textbook solutions",
      url: "https://www.selinapublishers.com",
    },
  ],
  Maharashtra: [
    {
      icon: "📗",
      title: "Balbharati",
      description: "Maharashtra State board books",
      url: "https://balbharati.in",
    },
    {
      icon: "📋",
      title: "MSBSHSE",
      description: "Maharashtra board official site",
      url: "https://mahahsscboard.in",
    },
  ],
  "Tamil Nadu": [
    {
      icon: "📗",
      title: "Samacheer Kalvi",
      description: "TN State board textbooks",
      url: "https://www.textbooksonline.tn.gov.in",
    },
    {
      icon: "📋",
      title: "TNDGE",
      description: "Tamil Nadu board official",
      url: "https://www.dge.tn.gov.in",
    },
  ],
  Karnataka: [
    {
      icon: "📗",
      title: "KTBS",
      description: "Karnataka textbook society",
      url: "https://ktbs.kar.nic.in",
    },
    {
      icon: "📋",
      title: "KSEEB",
      description: "Karnataka board official",
      url: "https://kseab.karnataka.gov.in",
    },
  ],
}

// YouTube/Learning Resources
export const LEARNING_CHANNELS = [
  {
    icon: "▶️",
    title: "Khan Academy India",
    description: "Free world-class education",
    url: "https://www.khanacademy.org",
  },
  {
    icon: "▶️",
    title: "Vedantu",
    description: "Live classes, CBSE/ICSE",
    url: "https://www.vedantu.com",
  },
  {
    icon: "▶️",
    title: "BYJU'S",
    description: "Animated concept videos",
    url: "https://byjus.com",
  },
  {
    icon: "▶️",
    title: "Physics Wallah",
    description: "Affordable quality education",
    url: "https://pw.live",
  },
  {
    icon: "▶️",
    title: "Unacademy",
    description: "All boards, all subjects",
    url: "https://unacademy.com",
  },
  {
    icon: "▶️",
    title: "Doubtnut",
    description: "Instant doubt solving",
    url: "https://www.doubtnut.com",
  },
]

// Lo-Fi Music Vibes
export const LOFI_VIBES = [
  {
    name: "🌙 Chill Lo-Fi",
    tracks: [
      {
        title: "Lofi Study",
        url: "https://cdn.pixabay.com/download/audio/2023/10/12/audio_1808fbf07a.mp3",
      },
      {
        title: "Coffee Shop",
        url: "https://cdn.pixabay.com/download/audio/2024/01/05/audio_d1718beefe.mp3",
      },
      {
        title: "Midnight Study",
        url: "https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8e2cfa0e0.mp3",
      },
    ],
  },
  {
    name: "🌧️ Rainy Vibes",
    tracks: [
      {
        title: "Rain & Piano",
        url: "https://cdn.pixabay.com/download/audio/2022/03/15/audio_1cd55a90d2.mp3",
      },
      {
        title: "Soft Rain",
        url: "https://cdn.pixabay.com/download/audio/2022/10/30/audio_347111d654.mp3",
      },
    ],
  },
  {
    name: "⚡ Synthwave",
    tracks: [
      {
        title: "Retro Wave",
        url: "https://cdn.pixabay.com/download/audio/2022/08/04/audio_2dde668d05.mp3",
      },
      {
        title: "Neon Drive",
        url: "https://cdn.pixabay.com/download/audio/2022/11/22/audio_febc508a42.mp3",
      },
    ],
  },
  {
    name: "🌿 Nature",
    tracks: [
      {
        title: "Forest Ambient",
        url: "https://cdn.pixabay.com/download/audio/2022/03/10/audio_d20c0d29d4.mp3",
      },
      {
        title: "Flowing Creek",
        url: "https://cdn.pixabay.com/download/audio/2021/10/25/audio_94fd0eddf5.mp3",
      },
    ],
  },
]

// Subject Formulas
export const SUBJECT_FORMULAS: Record<string, string> = {
  Mathematics: `━━ ALGEBRA ━━
Quadratic Formula: x = (-b ± √(b²-4ac)) / 2a
Sum of roots: -b/a | Product: c/a
(a+b)² = a² + 2ab + b²
(a-b)² = a² - 2ab + b²
(a+b)(a-b) = a² - b²
(a+b)³ = a³ + 3a²b + 3ab² + b³

━━ ARITHMETIC PROGRESSIONS ━━
nth term: aₙ = a + (n-1)d
Sum: Sₙ = n/2[2a + (n-1)d] = n/2(a + l)

━━ TRIGONOMETRY ━━
sin²θ + cos²θ = 1
1 + tan²θ = sec²θ
1 + cot²θ = cosec²θ
sin(A±B) = sinA·cosB ± cosA·sinB

━━ COORDINATE GEOMETRY ━━
Distance: d = √((x₂-x₁)² + (y₂-y₁)²)
Midpoint: M = ((x₁+x₂)/2, (y₁+y₂)/2)
Section formula: (mx₂+nx₁)/(m+n), (my₂+ny₁)/(m+n)
Slope: m = (y₂-y₁)/(x₂-x₁) = tanθ

━━ MENSURATION ━━
Circle: A = πr², C = 2πr
Sphere: SA = 4πr², V = 4/3πr³
Cylinder: V = πr²h, CSA = 2πrh
Cone: V = 1/3πr²h, l = √(r²+h²)
Cuboid: V = lbh, TSA = 2(lb+bh+hl)

━━ STATISTICS ━━
Mean (grouped): x̄ = Σfx / Σf
Median: l + [(n/2 − cf)/f] × h
Mode: l + [(f₁−f₀)/(2f₁−f₀−f₂)] × h`,

  Physics: `━━ MECHANICS ━━
v = u + at | s = ut + ½at² | v² = u² + 2as
F = ma | W = F·d | P = W/t
KE = ½mv² | PE = mgh

━━ WAVES & OPTICS ━━
v = fλ | n = c/v
1/f = 1/v + 1/u (mirror)
1/f = 1/v - 1/u (lens)
m = v/u = h'/h

━━ ELECTRICITY ━━
V = IR | P = VI = I²R = V²/R
R = ρl/A
Series: R = R₁ + R₂ + R₃
Parallel: 1/R = 1/R₁ + 1/R₂ + 1/R₃`,

  Chemistry: `━━ ATOMIC STRUCTURE ━━
Atomic number (Z) = protons = electrons
Mass number (A) = protons + neutrons

━━ CHEMICAL EQUATIONS ━━
Moles = Mass/Molar mass
Molarity (M) = moles/liters

━━ PERIODIC TABLE TRENDS ━━
Atomic radius: ↓ increases, → decreases
Ionization energy: ↓ decreases, → increases
Electronegativity: ↓ decreases, → increases

━━ ACIDS & BASES ━━
pH = -log[H⁺]
pOH = -log[OH⁻]
pH + pOH = 14`,

  Biology: `━━ CELL BIOLOGY ━━
Cell = Basic unit of life
Mitochondria = Powerhouse of cell
Chloroplast = Photosynthesis
Ribosome = Protein synthesis

━━ GENETICS ━━
DNA → RNA → Protein (Central Dogma)
Genotype = Genetic makeup
Phenotype = Physical expression

━━ ECOLOGY ━━
Producer → Consumer → Decomposer
10% Energy Transfer Rule`,

  English: `━━ TENSES ━━
Simple Present: Subject + V1 (s/es)
Present Continuous: is/am/are + V-ing
Present Perfect: has/have + V3
Past Simple: Subject + V2
Future Simple: will + V1

━━ ACTIVE TO PASSIVE ━━
Active: Subject + Verb + Object
Passive: Object + be + V3 + by Subject

━━ DIRECT TO INDIRECT ━━
"said" → told/asked/replied
Present → Past
Here → There
Today → That day`,
}

// Motivational Quotes
export const MOTIVATIONAL_QUOTES = [
  { quote: "The expert in anything was once a beginner.", author: "Helen Hayes", emoji: "🌱" },
  { quote: "Education is the passport to the future.", author: "Malcolm X", emoji: "🎓" },
  { quote: "Success is no accident. It is hard work and perseverance.", author: "Pelé", emoji: "⚽" },
  { quote: "The secret of getting ahead is getting started.", author: "Mark Twain", emoji: "🚀" },
  { quote: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson", emoji: "⏰" },
  { quote: "Believe you can and you're halfway there.", author: "Theodore Roosevelt", emoji: "💪" },
  { quote: "Your only competition is who you were yesterday.", author: "Anonymous", emoji: "🪞" },
  { quote: "Small progress is still progress.", author: "Anonymous", emoji: "📈" },
  { quote: "The beautiful thing about learning is that no one can take it away.", author: "B.B. King", emoji: "✨" },
  { quote: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius", emoji: "🐢" },
]

// Pressure Tips
export const PRESSURE_TIPS = [
  ["🧘", "Deep breathing: 4-7-8 technique. Inhale 4s, hold 7s, exhale 8s. Repeat 3x."],
  ["💧", "Stay hydrated! Drink water every 45 minutes. Dehydration reduces focus by 20%."],
  ["🚶", "Take a 5-minute walk after every hour of study. Movement boosts memory consolidation."],
  ["📵", "Phone-free study blocks. Place phone in another room, not just face-down."],
  ["🌙", "Sleep 7-8 hours. Memory is consolidated during sleep. All-nighters are counterproductive."],
  ["🎯", "Use the 2-minute rule: If a task takes under 2 minutes, do it immediately."],
  ["📝", "Write exam anxiety on paper, then fold and put away. Externalizing fear reduces it."],
  ["💪", 'Say: "I have prepared well. I can handle this." Positive self-talk works scientifically.'],
]

// Boards and Classes
export const BOARDS = ["CBSE", "ICSE", "Maharashtra", "Tamil Nadu", "Karnataka"]
export const CLASSES = ["9", "10", "11", "12"]
export const SUBJECTS = ["Mathematics", "Physics", "Chemistry", "Biology", "English"]
