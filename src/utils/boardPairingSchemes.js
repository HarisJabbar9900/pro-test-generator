/**
 * Official Board Examination Pairing Schemes & Paper Blueprints (Session 2025-2026)
 * New Curriculum & Updated Textbooks Edition
 * Covers:
 * 1. Punjab Boards (PBCC - Lahore, Rawalpindi, Gujranwala, Faisalabad, Multan, Sahiwal, Sargodha, Bahawalpur, DG Khan)
 * 2. Federal Board (FBISE Islamabad - SLO Based Assessment Framework)
 * 3. Sindh Boards (BIEK / BSEK Karachi, Hyderabad, Sukkur, Larkana, Mirpurkhas)
 * 4. KPK Boards (Peshawar, Mardan, Abbottabad, Swat, Kohat, Bannu, Malakand)
 */

export const BOARD_AUTHORITIES = {
  PUNJAB: {
    id: "punjab",
    name: "Punjab Boards (PBCC)",
    fullName: "Punjab Boards Committee of Chairmen (PBCC)",
    boardsList: ["BISE Lahore", "BISE Rawalpindi", "BISE Gujranwala", "BISE Faisalabad", "BISE Multan", "BISE Sahiwal", "BISE Sargodha", "BISE Bahawalpur", "BISE DG Khan"],
    color: "emerald",
    badge: "Punjab PBCC Standard",
    curriculum: "Punjab Curriculum & Textbook Board (PCTB - New Books)",
    session: "2025 - 2026"
  },
  FEDERAL: {
    id: "federal",
    name: "Federal Board (FBISE)",
    fullName: "Federal Board of Intermediate & Secondary Education (Islamabad)",
    boardsList: ["FBISE Islamabad (National & Overseas Centers)"],
    color: "blue",
    badge: "FBISE SLO Based",
    curriculum: "National Curriculum of Pakistan (SLO Cognitive Framework)",
    session: "2025 - 2026"
  },
  SINDH: {
    id: "sindh",
    name: "Sindh Boards (BIEK / BSEK)",
    fullName: "Boards of Intermediate & Secondary Education, Sindh",
    boardsList: ["BSEK Karachi", "BIEK Karachi", "BISE Hyderabad", "BISE Sukkur", "BISE Larkana", "BISE Mirpurkhas"],
    color: "amber",
    badge: "Sindh Board Pattern",
    curriculum: "Sindh Textbook Board (STBB Jamshoro)",
    session: "2025 - 2026"
  },
  KPK: {
    id: "kpk",
    name: "KPK Boards",
    fullName: "Khyber Pakhtunkhwa Boards of Intermediate & Secondary Education",
    boardsList: ["BISE Peshawar", "BISE Mardan", "BISE Abbottabad", "BISE Swat", "BISE Kohat", "BISE Bannu", "BISE Malakand", "BISE DI Khan"],
    color: "rose",
    badge: "KPK Board Standard",
    curriculum: "KPK Textbook Board (KP-TBB Peshawar)",
    session: "2025 - 2026"
  }
};

export const AVAILABLE_SCHEME_SUBJECTS = [
  { id: 'physics', name: 'Physics', urdu: 'طبیعیات (فزکس)', icon: 'Atom', marksMatric: 60, marksInter: 85 },
  { id: 'chemistry', name: 'Chemistry', urdu: 'کیمیاء (کیمسٹری)', icon: 'FlaskConical', marksMatric: 60, marksInter: 85 },
  { id: 'biology', name: 'Biology', urdu: 'حیاتیات (بائیولوجی)', icon: 'Dna', marksMatric: 60, marksInter: 85 },
  { id: 'mathematics', name: 'Mathematics', urdu: 'ریاضی (سائنس گروپ)', icon: 'Calculator', marksMatric: 75, marksInter: 100 },
  { id: 'computer_science', name: 'Computer Science', urdu: 'کمپیوٹر سائنس', icon: 'Laptop', marksMatric: 50, marksInter: 75 },
  { id: 'english', name: 'English Compulsory', urdu: 'انگریزی لازمی', icon: 'BookOpen', marksMatric: 75, marksInter: 100 },
  { id: 'urdu', name: 'Urdu Compulsory', urdu: 'اردو لازمی', icon: 'Feather', marksMatric: 75, marksInter: 100 },
  { id: 'islamiat', name: 'Islamiat Compulsory', urdu: 'اسلامیات لازمی (50 نمبر)', icon: 'Moon', marksMatric: 50, marksInter: 50 },
  { id: 'tarjuma_tul_quran', name: 'Tarjuma-tul-Quran', urdu: 'ترجمۃ القرآن المجید (نیا لازمی مضمون)', icon: 'BookMarked', marksMatric: 50, marksInter: 50 },
  { id: 'pak_studies', name: 'Pakistan Studies', urdu: 'مطالعہ پاکستان (50 نمبر)', icon: 'Flag', marksMatric: 50, marksInter: 50 }
];

/**
 * Detailed Subject Pairing Schemes Catalog (New Curriculum 2025 - 2026)
 */
export const PAIRING_SCHEMES_DATA = {
  // =========================================================================
  // 10TH CLASS (MATRIC PART-II) - NEW SYLLABUS
  // =========================================================================
  "10th": {
    "physics": {
      subjectName: "Physics",
      punjab: {
        totalMarks: 60,
        timeAllowed: "2 Hours",
        objectiveMarks: 12,
        subjectiveMarks: 48,
        description: "Official Punjab Board 10th Physics 2025-2026 Pairing Scheme. 12 MCQs, 30 Marks Short Questions (Attempt 15/24), 18 Marks Long Questions (Attempt 2/3 with a+b parts).",
        mcqs: {
          total: 12,
          distribution: [
            { chapter: 10, count: 1, name: "Unit 10: Simple Harmonic Motion and Waves" },
            { chapter: 11, count: 1, name: "Unit 11: Sound" },
            { chapter: 12, count: 2, name: "Unit 12: Geometrical Optics" },
            { chapter: 13, count: 1, name: "Unit 13: Electrostatics" },
            { chapter: 14, count: 2, name: "Unit 14: Current Electricity" },
            { chapter: 15, count: 1, name: "Unit 15: Electromagnetism" },
            { chapter: 16, count: 2, name: "Unit 16: Basic Electronics" },
            { chapter: 17, count: 1, name: "Unit 17: Information & Communication Technology" },
            { chapter: 18, count: 1, name: "Unit 18: Atomic and Nuclear Physics" }
          ]
        },
        shortQuestions: [
          {
            qNum: "Q2",
            title: "Question No. 2 (Short Questions)",
            instruction: "Attempt any 5 questions out of 8. (Each carries 2 Marks = 10 Marks)",
            totalOptions: 8,
            required: 5,
            marksEach: 2,
            totalMarks: 10,
            breakdown: [
              { chapter: 10, count: 3, name: "Unit 10: SHM & Waves" },
              { chapter: 11, count: 2, name: "Unit 11: Sound" },
              { chapter: 15, count: 3, name: "Unit 15: Electromagnetism" }
            ]
          },
          {
            qNum: "Q3",
            title: "Question No. 3 (Short Questions)",
            instruction: "Attempt any 5 questions out of 8. (Each carries 2 Marks = 10 Marks)",
            totalOptions: 8,
            required: 5,
            marksEach: 2,
            totalMarks: 10,
            breakdown: [
              { chapter: 13, count: 3, name: "Unit 13: Electrostatics" },
              { chapter: 14, count: 3, name: "Unit 14: Current Electricity" },
              { chapter: 16, count: 2, name: "Unit 16: Basic Electronics" }
            ]
          },
          {
            qNum: "Q4",
            title: "Question No. 4 (Short Questions)",
            instruction: "Attempt any 5 questions out of 8. (Each carries 2 Marks = 10 Marks)",
            totalOptions: 8,
            required: 5,
            marksEach: 2,
            totalMarks: 10,
            breakdown: [
              { chapter: 12, count: 3, name: "Unit 12: Geometrical Optics" },
              { chapter: 17, count: 2, name: "Unit 17: ICT" },
              { chapter: 18, count: 3, name: "Unit 18: Atomic & Nuclear Physics" }
            ]
          }
        ],
        longQuestions: {
          instruction: "Attempt any 2 questions out of 3. (Each carries 9 Marks = (a) 5 Marks Theory + (b) 4 Marks Numerical = 18 Marks)",
          totalOptions: 3,
          required: 2,
          marksEach: 9,
          totalMarks: 18,
          questions: [
            { qNum: "Q5", chapter: 10, topic: "(a) Theory from Unit 10/11 (SHM/Sound) & (b) Numerical from Unit 10/12" },
            { qNum: "Q6", chapter: 13, topic: "(a) Theory from Unit 13/14 (Electrostatics/Current) & (b) Numerical from Unit 13/14" },
            { qNum: "Q7", chapter: 16, topic: "(a) Theory from Unit 16/18 (Electronics/Nuclear) & (b) Numerical from Unit 18" }
          ]
        }
      },
      federal: {
        totalMarks: 60,
        timeAllowed: "2 Hours 15 Minutes",
        objectiveMarks: 12,
        subjectiveMarks: 48,
        description: "Federal Board (FBISE) 10th Physics SLO Model Paper Blueprint.",
        mcqs: { total: 12, distribution: [{ chapter: 10, count: 1 }, { chapter: 11, count: 1 }, { chapter: 12, count: 2 }, { chapter: 13, count: 2 }, { chapter: 14, count: 2 }, { chapter: 15, count: 1 }, { chapter: 16, count: 1 }, { chapter: 17, count: 1 }, { chapter: 18, count: 1 }] },
        shortQuestions: [{ qNum: "Section B", title: "Section B: Conceptual Short Questions", instruction: "Attempt any 10 questions out of 14. (3 Marks each = 30 Marks)", totalOptions: 14, required: 10, marksEach: 3, totalMarks: 30, breakdown: [{ chapter: 10, count: 2 }, { chapter: 11, count: 1 }, { chapter: 12, count: 2 }, { chapter: 13, count: 2 }, { chapter: 14, count: 2 }, { chapter: 15, count: 1 }, { chapter: 16, count: 1 }, { chapter: 17, count: 1 }, { chapter: 18, count: 2 }] }],
        longQuestions: { instruction: "Section C: Comprehensive Questions. Attempt any 2 out of 3. (9 Marks each = 18 Marks)", totalOptions: 3, required: 2, marksEach: 9, totalMarks: 18, questions: [{ qNum: "Q3", chapter: 10, topic: "Wave motion derivation and numerical application" }, { qNum: "Q4", chapter: 13, topic: "Coulomb's Law, Electric Potential and Capacitance circuit analysis" }, { qNum: "Q5", chapter: 18, topic: "Radioactivity, Half-life decay and nuclear fission calculations" }] }
      }
    },
    "chemistry": {
      subjectName: "Chemistry",
      punjab: {
        totalMarks: 60,
        timeAllowed: "2 Hours",
        objectiveMarks: 12,
        subjectiveMarks: 48,
        description: "Official Punjab Board 10th Chemistry 2025-2026 Pairing Scheme. 12 MCQs, 30 Marks Shorts, 18 Marks Longs.",
        mcqs: {
          total: 12,
          distribution: [
            { chapter: 9, count: 2, name: "Unit 9: Chemical Equilibrium" },
            { chapter: 10, count: 2, name: "Unit 10: Acids, Bases and Salts" },
            { chapter: 11, count: 1, name: "Unit 11: Organic Chemistry" },
            { chapter: 12, count: 1, name: "Unit 12: Hydrocarbons" },
            { chapter: 13, count: 2, name: "Unit 13: Biochemistry" },
            { chapter: 14, count: 1, name: "Unit 14: Environmental Chemistry I (Atmosphere)" },
            { chapter: 15, count: 2, name: "Unit 15: Environmental Chemistry II (Water)" },
            { chapter: 16, count: 1, name: "Unit 16: Chemical Industries" }
          ]
        },
        shortQuestions: [
          {
            qNum: "Q2",
            title: "Question No. 2 (Short Questions)",
            instruction: "Attempt any 5 questions out of 8. (Each carries 2 Marks = 10 Marks)",
            totalOptions: 8,
            required: 5,
            marksEach: 2,
            totalMarks: 10,
            breakdown: [
              { chapter: 9, count: 2, name: "Unit 9: Chemical Equilibrium" },
              { chapter: 11, count: 4, name: "Unit 11: Organic Chemistry" },
              { chapter: 12, count: 2, name: "Unit 12: Hydrocarbons" }
            ]
          },
          {
            qNum: "Q3",
            title: "Question No. 3 (Short Questions)",
            instruction: "Attempt any 5 questions out of 8. (Each carries 2 Marks = 10 Marks)",
            totalOptions: 8,
            required: 5,
            marksEach: 2,
            totalMarks: 10,
            breakdown: [
              { chapter: 10, count: 3, name: "Unit 10: Acids, Bases and Salts" },
              { chapter: 13, count: 2, name: "Unit 13: Biochemistry" },
              { chapter: 15, count: 3, name: "Unit 15: Environmental Chemistry II (Water)" }
            ]
          },
          {
            qNum: "Q4",
            title: "Question No. 4 (Short Questions)",
            instruction: "Attempt any 5 questions out of 8. (Each carries 2 Marks = 10 Marks)",
            totalOptions: 8,
            required: 5,
            marksEach: 2,
            totalMarks: 10,
            breakdown: [
              { chapter: 14, count: 4, name: "Unit 14: Atmosphere" },
              { chapter: 16, count: 4, name: "Unit 16: Chemical Industries" }
            ]
          }
        ],
        longQuestions: {
          instruction: "Attempt any 2 questions out of 3. (Each carries 9 Marks = (a) 5 Marks + (b) 4 Marks = 18 Marks)",
          totalOptions: 3,
          required: 2,
          marksEach: 9,
          totalMarks: 18,
          questions: [
            { qNum: "Q5", chapter: 9, topic: "(a) Unit 9: Law of Mass Action / Kc & (b) Unit 10: Lewis Acid-Base theory / pH" },
            { qNum: "Q6", chapter: 11, topic: "(a) Unit 11: Functional Groups / Homologous series & (b) Unit 12: Alkanes/Alkenes preparation & reactions" },
            { qNum: "Q7", chapter: 15, topic: "(a) Unit 15: Water hardness removal & (b) Unit 16: Solvay's process / Fractional distillation of petroleum" }
          ]
        }
      }
    },
    "biology": {
      subjectName: "Biology",
      punjab: {
        totalMarks: 60,
        timeAllowed: "2 Hours",
        objectiveMarks: 12,
        subjectiveMarks: 48,
        description: "Official Punjab Board 10th Biology 2025-2026 Pairing Scheme.",
        mcqs: {
          total: 12,
          distribution: [
            { chapter: 10, count: 1, name: "Unit 10: Gaseous Exchange" },
            { chapter: 11, count: 1, name: "Unit 11: Homeostasis" },
            { chapter: 12, count: 2, name: "Unit 12: Coordination and Control" },
            { chapter: 13, count: 1, name: "Unit 13: Support and Movement" },
            { chapter: 14, count: 2, name: "Unit 14: Reproduction" },
            { chapter: 15, count: 2, name: "Unit 15: Inheritance" },
            { chapter: 16, count: 2, name: "Unit 16: Man and His Environment" },
            { chapter: 17, count: 1, name: "Unit 17: Biotechnology" }
          ]
        },
        shortQuestions: [
          {
            qNum: "Q2",
            title: "Question No. 2 (Short Questions)",
            instruction: "Attempt any 5 questions out of 8. (Each carries 2 Marks = 10 Marks)",
            totalOptions: 8,
            required: 5,
            marksEach: 2,
            totalMarks: 10,
            breakdown: [
              { chapter: 10, count: 3, name: "Unit 10: Gaseous Exchange" },
              { chapter: 11, count: 2, name: "Unit 11: Homeostasis" },
              { chapter: 12, count: 3, name: "Unit 12: Coordination & Control" }
            ]
          },
          {
            qNum: "Q3",
            title: "Question No. 3 (Short Questions)",
            instruction: "Attempt any 5 questions out of 8. (Each carries 2 Marks = 10 Marks)",
            totalOptions: 8,
            required: 5,
            marksEach: 2,
            totalMarks: 10,
            breakdown: [
              { chapter: 13, count: 2, name: "Unit 13: Support & Movement" },
              { chapter: 14, count: 4, name: "Unit 14: Reproduction" },
              { chapter: 15, count: 2, name: "Unit 15: Inheritance" }
            ]
          },
          {
            qNum: "Q4",
            title: "Question No. 4 (Short Questions)",
            instruction: "Attempt any 5 questions out of 8. (Each carries 2 Marks = 10 Marks)",
            totalOptions: 8,
            required: 5,
            marksEach: 2,
            totalMarks: 10,
            breakdown: [
              { chapter: 16, count: 4, name: "Unit 16: Man & Environment" },
              { chapter: 17, count: 2, name: "Unit 17: Biotechnology" },
              { chapter: 18, count: 2, name: "Unit 18: Pharmacology" }
            ]
          }
        ],
        longQuestions: {
          instruction: "Attempt any 2 questions out of 3. (Each carries 9 Marks = (a) 5 Marks + (b) 4 Marks = 18 Marks)",
          totalOptions: 3,
          required: 2,
          marksEach: 9,
          totalMarks: 18,
          questions: [
            { qNum: "Q5", chapter: 11, topic: "(a) Unit 11: Nephron structure & functioning & (b) Unit 13: Joint types and human skeleton" },
            { qNum: "Q6", chapter: 12, topic: "(a) Unit 12: Endocrine glands / Neuron reflex arc & (b) Unit 14: Spermatogenesis / Asexual reproduction in plants" },
            { qNum: "Q7", chapter: 16, topic: "(a) Unit 16: Nitrogen Cycle / Acid rain impacts & (b) Unit 17: Fermentation and Genetic Engineering applications" }
          ]
        }
      }
    },
    "mathematics": {
      subjectName: "Mathematics (Science Group)",
      punjab: {
        totalMarks: 75,
        timeAllowed: "2 Hours 30 Minutes",
        objectiveMarks: 15,
        subjectiveMarks: 60,
        description: "Official Punjab Board 10th Math (Science Group) 2025-2026 Pairing Scheme. Question 9 (Theorems) is Compulsory!",
        mcqs: {
          total: 15,
          distribution: [
            { chapter: 1, count: 1, name: "Quadratic Equations" },
            { chapter: 2, count: 2, name: "Theory of Quadratic Equations" },
            { chapter: 3, count: 2, name: "Variations" },
            { chapter: 4, count: 1, name: "Partial Fractions" },
            { chapter: 5, count: 2, name: "Sets and Functions" },
            { chapter: 6, count: 1, name: "Basic Statistics" },
            { chapter: 7, count: 2, name: "Introduction to Trigonometry" },
            { chapter: 8, count: 1, name: "Projection of a Side of Triangle" },
            { chapter: 9, count: 1, name: "Chords of a Circle" },
            { chapter: 10, count: 1, name: "Tangent to a Circle" },
            { chapter: 13, count: 1, name: "Practical Geometry (Circles)" }
          ]
        },
        shortQuestions: [
          {
            qNum: "Q2",
            title: "Question No. 2 (Short Questions)",
            instruction: "Attempt any 6 questions out of 9. (Each carries 2 Marks = 12 Marks)",
            totalOptions: 9,
            required: 6,
            marksEach: 2,
            totalMarks: 12,
            breakdown: [
              { chapter: 1, count: 3, name: "Unit 1: Quadratic Equations" },
              { chapter: 2, count: 3, name: "Unit 2: Theory of Quadratic Equations" },
              { chapter: 3, count: 3, name: "Unit 3: Variations" }
            ]
          },
          {
            qNum: "Q3",
            title: "Question No. 3 (Short Questions)",
            instruction: "Attempt any 6 questions out of 9. (Each carries 2 Marks = 12 Marks)",
            totalOptions: 9,
            required: 6,
            marksEach: 2,
            totalMarks: 12,
            breakdown: [
              { chapter: 4, count: 2, name: "Unit 4: Partial Fractions" },
              { chapter: 5, count: 4, name: "Unit 5: Sets and Functions" },
              { chapter: 6, count: 3, name: "Unit 6: Basic Statistics" }
            ]
          },
          {
            qNum: "Q4",
            title: "Question No. 4 (Short Questions)",
            instruction: "Attempt any 6 questions out of 9. (Each carries 2 Marks = 12 Marks)",
            totalOptions: 9,
            required: 6,
            marksEach: 2,
            totalMarks: 12,
            breakdown: [
              { chapter: 7, count: 4, name: "Unit 7: Introduction to Trigonometry" },
              { chapter: 8, count: 1, name: "Unit 8: Geometry Projections" },
              { chapter: 9, count: 1, name: "Unit 9: Circle Chords" },
              { chapter: 10, count: 1, name: "Unit 10: Circle Tangents" },
              { chapter: 13, count: 2, name: "Unit 13: Practical Geometry" }
            ]
          }
        ],
        longQuestions: {
          instruction: "Attempt any 3 questions out of 5. Question 9 (Theorems) is COMPULSORY! (8 Marks each = 24 Marks)",
          totalOptions: 5,
          required: 3,
          marksEach: 8,
          totalMarks: 24,
          questions: [
            { qNum: "Q5", chapter: 1, topic: "(a) Unit 1 (Ex 1.1 - 1.4) & (b) Unit 2 (Ex 2.1 - 2.8)" },
            { qNum: "Q6", chapter: 3, topic: "(a) Unit 3 (Ex 3.4 / 3.6 theorem on proportions) & (b) Unit 4 (Partial fractions)" },
            { qNum: "Q7", chapter: 5, topic: "(a) Unit 5 (De Morgan's Laws / Cartesian Product) & (b) Unit 6 (Standard Deviation / Mean)" },
            { qNum: "Q8", chapter: 7, topic: "(a) Unit 7 (Ex 7.4 Trigonometric Identities) & (b) Unit 13 (Inscribed / Circumscribed Circle)" },
            { qNum: "Q9 (COMPULSORY THEOREM)", chapter: 9, topic: "Prove Theorem from Chapter 9 OR Chapter 12 (8 Marks Compulsory)" }
          ]
        }
      }
    },
    "tarjuma_tul_quran": {
      subjectName: "Tarjuma-tul-Quran-ul-Majeed",
      punjab: {
        totalMarks: 50,
        timeAllowed: "2 Hours",
        objectiveMarks: 10,
        subjectiveMarks: 40,
        description: "Official Punjab Board 10th Tarjuma-tul-Quran (New Compulsory Subject 2025-2026). Surah Maryam, Surah Taha, Surah Anbiya, Surah Hajj, Surah Furqan, Surah Shu'ara, Surah Naml, Surah Qasas, Surah Ankabut.",
        mcqs: {
          total: 10,
          distribution: [
            { chapter: 1, count: 2, name: "سورۃ مریم اور سورۃ طہٰ" },
            { chapter: 2, count: 2, name: "سورۃ الانبیاء اور سورۃ الحج" },
            { chapter: 3, count: 2, name: "سورۃ الفرقان اور سورۃ الشعراء" },
            { chapter: 4, count: 2, name: "سورۃ النمل اور سورۃ القصص" },
            { chapter: 5, count: 2, name: "سورۃ العنکبوت اور دیگر مقررہ سورتیں" }
          ]
        },
        shortQuestions: [
          {
            qNum: "Q2",
            title: "سوال نمبر 2: قرآنی الفاظ و کلمات کے معانی",
            instruction: "کوئی سے 5 قرآنی الفاظ کے معانی تحریر کریں۔ (کل 8 الفاظ = 5 نمبر)",
            totalOptions: 8,
            required: 5,
            marksEach: 1,
            totalMarks: 5,
            breakdown: [{ chapter: 1, count: 8, name: "مقررہ سورتوں کے اہم قرآنی کلمات" }]
          },
          {
            qNum: "Q3",
            title: "سوال نمبر 3: سورتوں کے تعارف و مضامین پر مختصر سوالات",
            instruction: "کوئی سے 5 سوالات کے مختصر جوابات لکھیں۔ (8 میں سے 5 سوالات = 10 نمبر)",
            totalOptions: 8,
            required: 5,
            marksEach: 2,
            totalMarks: 10,
            breakdown: [{ chapter: 1, count: 8, name: "سورتوں کا پس منظر، مرکزی خیال، اور اہم احکامات" }]
          },
          {
            qNum: "Q4",
            title: "سوال نمبر 4: قرآنی آیات کا با محاورہ سلیس اردو ترجمہ",
            instruction: "دی گئی 5 قرآنی آیات میں سے کوئی سی 3 آیات کا ترجمہ کریں۔ (5 x 3 = 15 نمبر)",
            totalOptions: 5,
            required: 3,
            marksEach: 5,
            totalMarks: 15,
            breakdown: [{ chapter: 1, count: 5, name: "منتخب قرآنی آیات کا ترجمہ" }]
          }
        ],
        longQuestions: {
          instruction: "کسی ایک سورت کے تعارف، مرکزی مضمون اور اہم علمی و عملی نکات پر جامع نوٹ لکھیں۔ (10 نمبر)",
          totalOptions: 2,
          required: 1,
          marksEach: 10,
          totalMarks: 10,
          questions: [
            { qNum: "Q5", chapter: 1, topic: "الف) سورۃ الانبیاء یا سورۃ مریم کا تعارف، مرکزی مضمون اور سبق آموز نکات" },
            { qNum: "Q5 متبادل", chapter: 2, topic: "ب) سورۃ الفرقان یا سورۃ الحج کا جامع تعارف اور تفصیلی اہم نکات" }
          ]
        }
      }
    },
    "islamiat": {
      subjectName: "Islamiat Compulsory (50 Marks)",
      punjab: {
        totalMarks: 50,
        timeAllowed: "2 Hours",
        objectiveMarks: 10,
        subjectiveMarks: 40,
        description: "Official Punjab Board 10th Islamiat Compulsory 2025-2026 (50 Marks Revised Pattern).",
        mcqs: { total: 10, distribution: [{ chapter: 1, count: 3, name: "قرآن و حدیث" }, { chapter: 2, count: 3, name: "ایمانیات و عبادات" }, { chapter: 3, count: 2, name: "سیرت النبی ﷺ" }, { chapter: 4, count: 2, name: "اخلاق و آداب اور حسن معاملات" }] },
        shortQuestions: [
          { qNum: "Q2", title: "سوال نمبر 2 (مختصر سوالات)", instruction: "کوئی سے 6 سوالات کے جوابات دیں۔ (9 میں سے 6 = 12 نمبر)", totalOptions: 9, required: 6, marksEach: 2, totalMarks: 12, breakdown: [{ chapter: 1, count: 5, name: "باب اول و دوم" }, { chapter: 2, count: 4, name: "باب سوم" }] },
          { qNum: "Q3", title: "سوال نمبر 3 (مختصر سوالات)", instruction: "کوئی سے 6 سوالات کے جوابات دیں۔ (9 میں سے 6 = 12 نمبر)", totalOptions: 9, required: 6, marksEach: 2, totalMarks: 12, breakdown: [{ chapter: 3, count: 5, name: "باب چہارم (سیرت طیبہ)" }, { chapter: 4, count: 4, name: "باب پنجم (اخلاق و آداب)" }] }
        ],
        longQuestions: {
          instruction: "آیات کا ترجمہ، حدیث کا ترجمہ و تشریح، اور سیرت النبی ﷺ پر تفصیلی سوال۔",
          totalOptions: 3,
          required: 3,
          marksEach: 8,
          totalMarks: 16,
          questions: [
            { qNum: "Q4", chapter: 1, topic: "قرآنی آیات کا ترجمہ (3 میں سے 2 آیات = 8 نمبر)" },
            { qNum: "Q5", chapter: 2, topic: "حدیث مبارکہ کا ترجمہ و تشریح (3 نمبر)" },
            { qNum: "Q6", chapter: 3, topic: "سیرت النبی ﷺ یا اخلاقی موضوع پر جامع تفصیلی نوٹ (5 نمبر)" }
          ]
        }
      }
    },
    "pak_studies": {
      subjectName: "Pakistan Studies",
      punjab: {
        totalMarks: 50,
        timeAllowed: "2 Hours",
        objectiveMarks: 10,
        subjectiveMarks: 40,
        description: "Official Punjab Board 10th Pak Studies (مطالعہ پاکستان) 2025-2026 Pairing Scheme.",
        mcqs: { total: 10, distribution: [{ chapter: 5, count: 2, name: "باب 5: تاریخِ پاکستان حصہ دوم" }, { chapter: 6, count: 3, name: "باب 6: پاکستان اور بین الاقوامی امور" }, { chapter: 7, count: 3, name: "باب 7: پاکستان کی معاشی ترقی" }, { chapter: 8, count: 2, name: "باب 8: آبادی، معاشرہ اور ثقافت" }] },
        shortQuestions: [
          { qNum: "Q2", title: "سوال نمبر 2 (مختصر سوالات)", instruction: "کوئی سے 6 سوالات کے جوابات دیں۔ (9 میں سے 6 = 12 نمبر)", totalOptions: 9, required: 6, marksEach: 2, totalMarks: 12, breakdown: [{ chapter: 5, count: 4, name: "باب 5: تاریخِ پاکستان" }, { chapter: 6, count: 5, name: "باب 6: پاکستان کے خارجہ تعلقات" }] },
          { qNum: "Q3", title: "سوال نمبر 3 (مختصر سوالات)", instruction: "کوئی سے 6 سوالات کے جوابات دیں۔ (9 میں سے 6 = 12 نمبر)", totalOptions: 9, required: 6, marksEach: 2, totalMarks: 12, breakdown: [{ chapter: 7, count: 5, name: "باب 7: معاشی ترقی" }, { chapter: 8, count: 4, name: "باب 8: آبادی و ثقافت" }] }
        ],
        longQuestions: {
          instruction: "کوئی سے 2 تفصیلی سوالات کے جوابات تحریر کریں۔ (3 میں سے 2 = 16 نمبر)",
          totalOptions: 3,
          required: 2,
          marksEach: 8,
          totalMarks: 16,
          questions: [
            { qNum: "Q4", chapter: 5, topic: "باب 5: ذوالفقار علی بھٹو / نواز شریف / جنرل ضیاء الحق دور کے اصلاحات پر تفصیلی نوٹ" },
            { qNum: "Q5", chapter: 6, topic: "باب 6: مسئلہ کشمیر اور پاک چین تعلقات / پاکستان کے ہمسایہ ممالک سے تعلقات" },
            { qNum: "Q6", chapter: 7, topic: "باب 7 یا 8: پاکستان کی زراعت کے اہم مسائل و حل یا پاکستان کی اہم صنعتیں / سیاحت" }
          ]
        }
      }
    }
  },

  // =========================================================================
  // 9TH CLASS (MATRIC PART-I) - NEW SYLLABUS
  // =========================================================================
  "9th": {
    "physics": {
      subjectName: "Physics",
      punjab: {
        totalMarks: 60,
        timeAllowed: "2 Hours",
        objectiveMarks: 12,
        subjectiveMarks: 48,
        description: "Official Punjab Board 9th Physics 2025-2026 Pairing Scheme (New Book Pattern).",
        mcqs: {
          total: 12,
          distribution: [
            { chapter: 1, count: 2, name: "Unit 1: Physical Quantities and Measurement" },
            { chapter: 2, count: 1, name: "Unit 2: Kinematics" },
            { chapter: 3, count: 2, name: "Unit 3: Dynamics" },
            { chapter: 4, count: 1, name: "Unit 4: Turning Effect of Forces" },
            { chapter: 5, count: 1, name: "Unit 5: Gravitation" },
            { chapter: 6, count: 1, name: "Unit 6: Work and Energy" },
            { chapter: 7, count: 1, name: "Unit 7: Properties of Matter" },
            { chapter: 8, count: 2, name: "Unit 8: Thermal Properties of Matter" },
            { chapter: 9, count: 1, name: "Unit 9: Transfer of Heat" }
          ]
        },
        shortQuestions: [
          {
            qNum: "Q2",
            title: "Question No. 2 (Short Questions)",
            instruction: "Attempt any 5 questions out of 8. (Each carries 2 Marks = 10 Marks)",
            totalOptions: 8,
            required: 5,
            marksEach: 2,
            totalMarks: 10,
            breakdown: [
              { chapter: 1, count: 3, name: "Unit 1: Physical Quantities" },
              { chapter: 2, count: 3, name: "Unit 2: Kinematics" },
              { chapter: 4, count: 2, name: "Unit 4: Turning Effect of Forces" }
            ]
          },
          {
            qNum: "Q3",
            title: "Question No. 3 (Short Questions)",
            instruction: "Attempt any 5 questions out of 8. (Each carries 2 Marks = 10 Marks)",
            totalOptions: 8,
            required: 5,
            marksEach: 2,
            totalMarks: 10,
            breakdown: [
              { chapter: 3, count: 3, name: "Unit 3: Dynamics" },
              { chapter: 5, count: 2, name: "Unit 5: Gravitation" },
              { chapter: 6, count: 3, name: "Unit 6: Work and Energy" }
            ]
          },
          {
            qNum: "Q4",
            title: "Question No. 4 (Short Questions)",
            instruction: "Attempt any 5 questions out of 8. (Each carries 2 Marks = 10 Marks)",
            totalOptions: 8,
            required: 5,
            marksEach: 2,
            totalMarks: 10,
            breakdown: [
              { chapter: 7, count: 3, name: "Unit 7: Properties of Matter" },
              { chapter: 8, count: 3, name: "Unit 8: Thermal Properties" },
              { chapter: 9, count: 2, name: "Unit 9: Transfer of Heat" }
            ]
          }
        ],
        longQuestions: {
          instruction: "Attempt any 2 questions out of 3. (Each carries 9 Marks = Theory (a) 5M + Numerical (b) 4M = 18 Marks)",
          totalOptions: 3,
          required: 2,
          marksEach: 9,
          totalMarks: 18,
          questions: [
            { qNum: "Q5", chapter: 2, topic: "(a) Theory from Unit 2/3 (Equations of motion / Newton's 2nd Law) & (b) Numerical from Unit 2/3" },
            { qNum: "Q6", chapter: 4, topic: "(a) Theory from Unit 4/6 (Torque / Kinetic & Potential Energy) & (b) Numerical from Unit 4/6" },
            { qNum: "Q7", chapter: 7, topic: "(a) Theory from Unit 7/8 (Archimedes principle / Specific heat capacity) & (b) Numerical from Unit 7/8" }
          ]
        }
      }
    },
    "chemistry": {
      subjectName: "Chemistry",
      punjab: {
        totalMarks: 60,
        timeAllowed: "2 Hours",
        objectiveMarks: 12,
        subjectiveMarks: 48,
        description: "Official Punjab Board 9th Chemistry 2025-2026 Pairing Scheme.",
        mcqs: {
          total: 12,
          distribution: [
            { chapter: 1, count: 2, name: "Unit 1: Fundamentals of Chemistry" },
            { chapter: 2, count: 1, name: "Unit 2: Structure of Atoms" },
            { chapter: 3, count: 2, name: "Unit 3: Periodic Table & Periodicity" },
            { chapter: 4, count: 2, name: "Unit 4: Structure of Molecules" },
            { chapter: 5, count: 1, name: "Unit 5: Physical States of Matter" },
            { chapter: 6, count: 2, name: "Unit 6: Solutions" },
            { chapter: 7, count: 1, name: "Unit 7: Electrochemistry" },
            { chapter: 8, count: 1, name: "Unit 8: Chemical Reactivity" }
          ]
        },
        shortQuestions: [
          { qNum: "Q2", title: "Question No. 2", instruction: "Attempt any 5/8 (10 Marks)", totalOptions: 8, required: 5, marksEach: 2, totalMarks: 10, breakdown: [{ chapter: 1, count: 3 }, { chapter: 2, count: 2 }, { chapter: 3, count: 3 }] },
          { qNum: "Q3", title: "Question No. 3", instruction: "Attempt any 5/8 (10 Marks)", totalOptions: 8, required: 5, marksEach: 2, totalMarks: 10, breakdown: [{ chapter: 4, count: 3 }, { chapter: 5, count: 2 }, { chapter: 8, count: 3 }] },
          { qNum: "Q4", title: "Question No. 4", instruction: "Attempt any 5/8 (10 Marks)", totalOptions: 8, required: 5, marksEach: 2, totalMarks: 10, breakdown: [{ chapter: 6, count: 4 }, { chapter: 7, count: 4 }] }
        ],
        longQuestions: {
          instruction: "Attempt any 2 out of 3. (9 Marks each = 18 Marks)",
          totalOptions: 3,
          required: 2,
          marksEach: 9,
          totalMarks: 18,
          questions: [
            { qNum: "Q5", chapter: 1, topic: "(a) Unit 1: Empirical & Molecular formula / Mole & (b) Unit 2: Rutherford vs Bohr atomic model / isotopes" },
            { qNum: "Q6", chapter: 4, topic: "(a) Unit 4: Ionic & Covalent bond / Hydrogen bonding & (b) Unit 5: Boyle's Law / Charles's Law / Evaporation" },
            { qNum: "Q7", chapter: 6, topic: "(a) Unit 6: Molarity / Saturated vs Unsaturated solutions & (b) Unit 7: Rusting of Iron / Electrolytic cell" }
          ]
        }
      }
    },
    "mathematics": {
      subjectName: "Mathematics",
      punjab: {
        totalMarks: 75,
        timeAllowed: "2 Hours 30 Minutes",
        objectiveMarks: 15,
        subjectiveMarks: 60,
        description: "Official Punjab Board 9th Math (Science Group) 2025-2026 Pairing Scheme. Q9 Theorem Compulsory.",
        mcqs: { total: 15, distribution: [{ chapter: 1, count: 1 }, { chapter: 2, count: 1 }, { chapter: 3, count: 1 }, { chapter: 4, count: 1 }, { chapter: 5, count: 1 }, { chapter: 6, count: 1 }, { chapter: 7, count: 1 }, { chapter: 8, count: 1 }, { chapter: 9, count: 1 }, { chapter: 10, count: 1 }, { chapter: 11, count: 1 }, { chapter: 12, count: 1 }, { chapter: 13, count: 1 }, { chapter: 14, count: 1 }, { chapter: 17, count: 1 }] },
        shortQuestions: [
          { qNum: "Q2", title: "Question No. 2", instruction: "Attempt any 6/9 (12 Marks)", totalOptions: 9, required: 6, marksEach: 2, totalMarks: 12, breakdown: [{ chapter: 1, count: 2 }, { chapter: 2, count: 2 }, { chapter: 3, count: 2 }, { chapter: 4, count: 2 }, { chapter: 5, count: 1 }] },
          { qNum: "Q3", title: "Question No. 3", instruction: "Attempt any 6/9 (12 Marks)", totalOptions: 9, required: 6, marksEach: 2, totalMarks: 12, breakdown: [{ chapter: 6, count: 1 }, { chapter: 7, count: 2 }, { chapter: 8, count: 2 }, { chapter: 9, count: 2 }, { chapter: 10, count: 2 }] },
          { qNum: "Q4", title: "Question No. 4", instruction: "Attempt any 6/9 (12 Marks)", totalOptions: 9, required: 6, marksEach: 2, totalMarks: 12, breakdown: [{ chapter: 11, count: 1 }, { chapter: 12, count: 1 }, { chapter: 13, count: 1 }, { chapter: 14, count: 1 }, { chapter: 15, count: 1 }, { chapter: 16, count: 1 }, { chapter: 17, count: 3 }] }
        ],
        longQuestions: {
          instruction: "Attempt any 3 questions. Question 9 (Theorems) is COMPULSORY! (24 Marks)",
          totalOptions: 5,
          required: 3,
          marksEach: 8,
          totalMarks: 24,
          questions: [
            { qNum: "Q5", chapter: 1, topic: "(a) Unit 1 (Ex 1.6 Cramer's rule / Matrix inversion) & (b) Unit 2 (Ex 2.4 Laws of Exponents / Ex 2.6)" },
            { qNum: "Q6", chapter: 3, topic: "(a) Unit 3 (Ex 3.4 Logarithm calculations) & (b) Unit 4 (Ex 4.2 / 4.4 Algebraic formulas)" },
            { qNum: "Q7", chapter: 5, topic: "(a) Unit 5 (Ex 5.2 Factorization) & (b) Unit 6 (Ex 6.1 / 6.2 HCF and LCM)" },
            { qNum: "Q8", chapter: 7, topic: "(a) Unit 7 (Ex 7.1 Linear Equations) & (b) Unit 17 (Practical Geometry - Triangles)" },
            { qNum: "Q9 (COMPULSORY THEOREM)", chapter: 12, topic: "Prove Theorem from Chapter 12 OR Chapter 16 (8 Marks Compulsory)" }
          ]
        }
      }
    },
    "tarjuma_tul_quran": {
      subjectName: "Tarjuma-tul-Quran-ul-Majeed",
      punjab: {
        totalMarks: 50,
        timeAllowed: "2 Hours",
        objectiveMarks: 10,
        subjectiveMarks: 40,
        description: "Official Punjab Board 9th Tarjuma-tul-Quran 2025-2026 (Surah Anfal, Yunus, Hud, Yusuf, Ra'd, Ibrahim, Hijr, Nahl).",
        mcqs: { total: 10, distribution: [{ chapter: 1, count: 3, name: "سورۃ الانفال اور سورۃ یونس" }, { chapter: 2, count: 3, name: "سورۃ ہود اور سورۃ یوسف" }, { chapter: 3, count: 2, name: "سورۃ الرعد اور سورۃ ابراہیم" }, { chapter: 4, count: 2, name: "سورۃ الحجر اور سورۃ النحل" }] },
        shortQuestions: [
          { qNum: "Q2", title: "سوال نمبر 2: قرآنی الفاظ کے معانی", instruction: "8 میں سے 5 الفاظ کے معانی لکھیں۔ (5 نمبر)", totalOptions: 8, required: 5, marksEach: 1, totalMarks: 5, breakdown: [{ chapter: 1, count: 8, name: "قرآنی الفاظ" }] },
          { qNum: "Q3", title: "سوال نمبر 3: سورتوں کے مضامین پر مختصر سوالات", instruction: "8 میں سے 5 سوالات کے مختصر جوابات لکھیں۔ (10 نمبر)", totalOptions: 8, required: 5, marksEach: 2, totalMarks: 10, breakdown: [{ chapter: 1, count: 8, name: "سورتوں کا تعارف و اسباق" }] },
          { qNum: "Q4", title: "سوال نمبر 4: آیات کا سلیس ترجمہ", instruction: "5 میں سے 3 آیات کا ترجمہ تحریر کریں۔ (15 نمبر)", totalOptions: 5, required: 3, marksEach: 5, totalMarks: 15, breakdown: [{ chapter: 1, count: 5, name: "قرآنی آیات" }] }
        ],
        longQuestions: {
          instruction: "کسی ایک سورت کا تعارف، مرکزی مضمون اور تفصیلی اہم نکات تحریر کریں۔ (10 نمبر)",
          totalOptions: 2,
          required: 1,
          marksEach: 10,
          totalMarks: 10,
          questions: [
            { qNum: "Q5", chapter: 1, topic: "الف) سورۃ الانفال یا سورۃ یوسف کا جامع تعارف اور تفصیلی اہم نکات" },
            { qNum: "Q5 متبادل", chapter: 2, topic: "ب) سورۃ ہود یا سورۃ النحل کا تعارف اور عملی اسباق" }
          ]
        }
      }
    }
  },

  // =========================================================================
  // 12TH CLASS (INTER PART-II) & 11TH CLASS (INTER PART-I)
  // =========================================================================
  "12th": {
    "physics": {
      subjectName: "Physics",
      punjab: {
        totalMarks: 85,
        timeAllowed: "3 Hours",
        objectiveMarks: 17,
        subjectiveMarks: 68,
        description: "Official Punjab Board 12th Physics 2025-2026 Pairing Scheme. 17 MCQs, 44 Marks Short Questions (Attempt 22/33), 24 Marks Long Questions (Attempt 3/5 with a+b).",
        mcqs: { total: 17, distribution: [{ chapter: 12, count: 2 }, { chapter: 13, count: 1 }, { chapter: 14, count: 2 }, { chapter: 15, count: 2 }, { chapter: 16, count: 2 }, { chapter: 17, count: 1 }, { chapter: 18, count: 2 }, { chapter: 19, count: 2 }, { chapter: 20, count: 1 }, { chapter: 21, count: 2 }] },
        shortQuestions: [
          { qNum: "Q2", title: "Question No. 2", instruction: "Attempt any 8 out of 12 (16 Marks)", totalOptions: 12, required: 8, marksEach: 2, totalMarks: 16, breakdown: [{ chapter: 12, count: 4 }, { chapter: 14, count: 4 }, { chapter: 21, count: 4 }] },
          { qNum: "Q3", title: "Question No. 3", instruction: "Attempt any 8 out of 12 (16 Marks)", totalOptions: 12, required: 8, marksEach: 2, totalMarks: 16, breakdown: [{ chapter: 13, count: 3 }, { chapter: 16, count: 3 }, { chapter: 17, count: 3 }, { chapter: 18, count: 3 }] },
          { qNum: "Q4", title: "Question No. 4", instruction: "Attempt any 6 out of 9 (12 Marks)", totalOptions: 9, required: 6, marksEach: 2, totalMarks: 12, breakdown: [{ chapter: 15, count: 4 }, { chapter: 19, count: 3 }, { chapter: 20, count: 2 }] }
        ],
        longQuestions: {
          instruction: "Attempt any 3 questions out of 5. (Each carries 8 Marks = (a) 5M Theory + (b) 3M Numerical = 24 Marks)",
          totalOptions: 5,
          required: 3,
          marksEach: 8,
          totalMarks: 24,
          questions: [
            { qNum: "Q5", chapter: 12, topic: "(a) Chapter 12 Theory & (b) Chapter 13 Numerical" },
            { qNum: "Q6", chapter: 14, topic: "(a) Chapter 14 Theory & (b) Chapter 15 Numerical" },
            { qNum: "Q7", chapter: 16, topic: "(a) Chapter 16 Theory & (b) Chapter 18 Numerical" },
            { qNum: "Q8", chapter: 17, topic: "(a) Chapter 17 Theory & (b) Chapter 19 Numerical" },
            { qNum: "Q9", chapter: 20, topic: "(a) Chapter 20 Theory & (b) Chapter 21 Numerical" }
          ]
        }
      }
    },
    "chemistry": {
      subjectName: "Chemistry",
      punjab: {
        totalMarks: 85,
        timeAllowed: "3 Hours",
        objectiveMarks: 17,
        subjectiveMarks: 68,
        description: "Official Punjab Board 12th Chemistry 2025-2026 Pairing Scheme.",
        mcqs: { total: 17, distribution: [{ chapter: 1, count: 1 }, { chapter: 2, count: 1 }, { chapter: 4, count: 1 }, { chapter: 5, count: 1 }, { chapter: 7, count: 2 }, { chapter: 8, count: 2 }, { chapter: 9, count: 2 }, { chapter: 10, count: 2 }, { chapter: 11, count: 1 }, { chapter: 12, count: 2 }, { chapter: 14, count: 1 }, { chapter: 16, count: 1 }] },
        shortQuestions: [
          { qNum: "Q2", title: "Question No. 2", instruction: "Attempt any 8/12 (16 Marks)", totalOptions: 12, required: 8, marksEach: 2, totalMarks: 16, breakdown: [{ chapter: 1, count: 2 }, { chapter: 2, count: 3 }, { chapter: 4, count: 3 }, { chapter: 5, count: 4 }] },
          { qNum: "Q3", title: "Question No. 3", instruction: "Attempt any 8/12 (16 Marks)", totalOptions: 12, required: 8, marksEach: 2, totalMarks: 16, breakdown: [{ chapter: 7, count: 4 }, { chapter: 8, count: 3 }, { chapter: 9, count: 3 }, { chapter: 11, count: 2 }] },
          { qNum: "Q4", title: "Question No. 4", instruction: "Attempt any 6/9 (12 Marks)", totalOptions: 9, required: 6, marksEach: 2, totalMarks: 12, breakdown: [{ chapter: 10, count: 3 }, { chapter: 12, count: 3 }, { chapter: 16, count: 3 }] }
        ],
        longQuestions: {
          instruction: "Attempt any 3 questions out of 5. (Each carries 8 Marks = (a) 4M + (b) 4M = 24 Marks)",
          totalOptions: 5,
          required: 3,
          marksEach: 8,
          totalMarks: 24,
          questions: [
            { qNum: "Q5", chapter: 1, topic: "(a) Chapter 1 & (b) Chapter 2" },
            { qNum: "Q6", chapter: 4, topic: "(a) Chapter 4 & (b) Chapter 5" },
            { qNum: "Q7", chapter: 7, topic: "(a) Chapter 7 & (b) Chapter 8" },
            { qNum: "Q8", chapter: 9, topic: "(a) Chapter 9 & (b) Chapter 11" },
            { qNum: "Q9", chapter: 10, topic: "(a) Chapter 10 & (b) Chapter 12" }
          ]
        }
      }
    },
    "biology": {
      subjectName: "Biology",
      punjab: {
        totalMarks: 85,
        timeAllowed: "3 Hours",
        objectiveMarks: 17,
        subjectiveMarks: 68,
        description: "Official Punjab Board 12th Biology 2025-2026 Pairing Scheme.",
        mcqs: { total: 17, distribution: [{ chapter: 15, count: 1 }, { chapter: 16, count: 2 }, { chapter: 17, count: 2 }, { chapter: 18, count: 1 }, { chapter: 19, count: 1 }, { chapter: 20, count: 2 }, { chapter: 21, count: 1 }, { chapter: 22, count: 1 }, { chapter: 23, count: 2 }, { chapter: 24, count: 1 }, { chapter: 25, count: 1 }, { chapter: 26, count: 1 }, { chapter: 27, count: 1 }] },
        shortQuestions: [
          { qNum: "Q2", title: "Question No. 2", instruction: "Attempt any 8/12 (16 Marks)", totalOptions: 12, required: 8, marksEach: 2, totalMarks: 16, breakdown: [{ chapter: 15, count: 3 }, { chapter: 16, count: 3 }, { chapter: 18, count: 2 }, { chapter: 26, count: 2 }, { chapter: 27, count: 2 }] },
          { qNum: "Q3", title: "Question No. 3", instruction: "Attempt any 8/12 (16 Marks)", totalOptions: 12, required: 8, marksEach: 2, totalMarks: 16, breakdown: [{ chapter: 17, count: 3 }, { chapter: 22, count: 3 }, { chapter: 23, count: 3 }, { chapter: 25, count: 3 }] },
          { qNum: "Q4", title: "Question No. 4", instruction: "Attempt any 6/9 (12 Marks)", totalOptions: 9, required: 6, marksEach: 2, totalMarks: 12, breakdown: [{ chapter: 19, count: 2 }, { chapter: 20, count: 3 }, { chapter: 21, count: 2 }, { chapter: 24, count: 2 }] }
        ],
        longQuestions: {
          instruction: "Attempt any 3 questions out of 5. (8 Marks each = 24 Marks)",
          totalOptions: 5,
          required: 3,
          marksEach: 8,
          totalMarks: 24,
          questions: [
            { qNum: "Q5", chapter: 15, topic: "(a) Chapter 15 & (b) Chapter 21" },
            { qNum: "Q6", chapter: 16, topic: "(a) Chapter 16 & (b) Chapter 25" },
            { qNum: "Q7", chapter: 17, topic: "(a) Chapter 17 & (b) Chapter 27" },
            { qNum: "Q8", chapter: 18, topic: "(a) Chapter 18 & (b) Chapter 22" },
            { qNum: "Q9", chapter: 19, topic: "(a) Chapter 19 & (b) Chapter 24" }
          ]
        }
      }
    },
    "computer_science": {
      subjectName: "Computer Science",
      punjab: {
        totalMarks: 75,
        timeAllowed: "3 Hours",
        objectiveMarks: 15,
        subjectiveMarks: 60,
        description: "Official Punjab Board (PBCC) 12th Computer Science 2025-2026 Pairing Scheme. New Textbook Edition — Exactly 9 Modern Units (Networks, Algorithms, OOP in Python, Python Applications, Testing/Debugging, Data Science & ML, Hypothesis, Applied CS, Cybersecurity).",
        mcqs: {
          total: 15,
          distribution: [
            { chapter: 1, count: 2, name: "Unit 1: Computer Networks" },
            { chapter: 2, count: 2, name: "Unit 2: Computational Thinking & Algorithms" },
            { chapter: 3, count: 2, name: "Unit 3: Object Oriented Programming Using Python" },
            { chapter: 4, count: 2, name: "Unit 4: Applications of Python" },
            { chapter: 5, count: 1, name: "Unit 5: Code Testing and Debugging" },
            { chapter: 6, count: 2, name: "Unit 6: Data Science and Machine Learning" },
            { chapter: 7, count: 1, name: "Unit 7: Hypothesis Testing" },
            { chapter: 8, count: 1, name: "Unit 8: Applications of Computer Science" },
            { chapter: 9, count: 2, name: "Unit 9: Cybersecurity and Safe Digital Collaboration" }
          ]
        },
        shortQuestions: [
          {
            qNum: "Q2",
            title: "Question No. 2 (Short Questions)",
            instruction: "Attempt any 6 questions out of 9. (Each carries 2 Marks = 12 Marks)",
            totalOptions: 9,
            required: 6,
            marksEach: 2,
            totalMarks: 12,
            breakdown: [
              { chapter: 1, count: 3, name: "Unit 1: Computer Networks" },
              { chapter: 2, count: 3, name: "Unit 2: Computational Thinking & Algorithms" },
              { chapter: 3, count: 3, name: "Unit 3: OOP Using Python" }
            ]
          },
          {
            qNum: "Q3",
            title: "Question No. 3 (Short Questions)",
            instruction: "Attempt any 6 questions out of 9. (Each carries 2 Marks = 12 Marks)",
            totalOptions: 9,
            required: 6,
            marksEach: 2,
            totalMarks: 12,
            breakdown: [
              { chapter: 4, count: 3, name: "Unit 4: Applications of Python" },
              { chapter: 5, count: 3, name: "Unit 5: Code Testing & Debugging" },
              { chapter: 6, count: 3, name: "Unit 6: Data Science & Machine Learning" }
            ]
          },
          {
            qNum: "Q4",
            title: "Question No. 4 (Short Questions)",
            instruction: "Attempt any 6 questions out of 9. (Each carries 2 Marks = 12 Marks)",
            totalOptions: 9,
            required: 6,
            marksEach: 2,
            totalMarks: 12,
            breakdown: [
              { chapter: 7, count: 3, name: "Unit 7: Hypothesis Testing" },
              { chapter: 8, count: 3, name: "Unit 8: Applications of Computer Science" },
              { chapter: 9, count: 3, name: "Unit 9: Cybersecurity & Digital Collaboration" }
            ]
          }
        ],
        longQuestions: {
          instruction: "Attempt any 3 questions out of 5. (Each carries 8 Marks = 24 Marks)",
          totalOptions: 5,
          required: 3,
          marksEach: 8,
          totalMarks: 24,
          questions: [
            { qNum: "Q5", chapter: 1, topic: "Unit 1: Computer Networks (Network Topologies, OSI & TCP/IP Model Layers, Guided/Unguided Media)" },
            { qNum: "Q6", chapter: 3, topic: "Unit 3: Object Oriented Programming (Classes, Objects, Inheritance, Polymorphism & Encapsulation in Python)" },
            { qNum: "Q7", chapter: 4, topic: "Unit 4: Applications of Python (GUI Design with Tkinter, File Handling, Exception Handling & SQLite DB)" },
            { qNum: "Q8", chapter: 6, topic: "Unit 6: Data Science & ML (Supervised vs Unsupervised Learning, Regression, Neural Networks & Ethics)" },
            { qNum: "Q9", chapter: 9, topic: "Unit 9: Cybersecurity (Cyber Threats, Public/Private Key Cryptography, Firewalls & Digital Forensics)" }
          ]
        }
      },
      federal: {
        totalMarks: 75,
        timeAllowed: "3 Hours",
        objectiveMarks: 15,
        subjectiveMarks: 60,
        description: "Federal Board (FBISE Islamabad) 12th Computer Science 2025-2026 SLO Assessment Blueprint. All 9 Units evaluated under Knowledge (30%), Understanding (50%), and Application (20%) framework.",
        mcqs: {
          total: 15,
          distribution: [
            { chapter: 1, count: 2, name: "Unit 1: Computer Networks" },
            { chapter: 2, count: 2, name: "Unit 2: Computational Thinking & Algorithms" },
            { chapter: 3, count: 2, name: "Unit 3: OOP Using Python" },
            { chapter: 4, count: 2, name: "Unit 4: Applications of Python" },
            { chapter: 5, count: 1, name: "Unit 5: Code Testing & Debugging" },
            { chapter: 6, count: 2, name: "Unit 6: Data Science & ML" },
            { chapter: 7, count: 1, name: "Unit 7: Hypothesis Testing" },
            { chapter: 8, count: 1, name: "Unit 8: Applications of CS" },
            { chapter: 9, count: 2, name: "Unit 9: Cybersecurity" }
          ]
        },
        shortQuestions: [
          {
            qNum: "Section B",
            title: "Section-B: Short Response Questions (SLO Based)",
            instruction: "Attempt any 12 questions out of 16. (12 x 3 Marks = 36 Marks)",
            totalOptions: 16,
            required: 12,
            marksEach: 3,
            totalMarks: 36,
            breakdown: [
              { chapter: 1, count: 2, name: "Unit 1: Computer Networks" },
              { chapter: 2, count: 2, name: "Unit 2: Algorithms" },
              { chapter: 3, count: 2, name: "Unit 3: OOP" },
              { chapter: 4, count: 2, name: "Unit 4: Python Apps" },
              { chapter: 5, count: 2, name: "Unit 5: Debugging" },
              { chapter: 6, count: 2, name: "Unit 6: Data Science" },
              { chapter: 7, count: 1, name: "Unit 7: Hypothesis" },
              { chapter: 8, count: 1, name: "Unit 8: Applied CS" },
              { chapter: 9, count: 2, name: "Unit 9: Cybersecurity" }
            ]
          }
        ],
        longQuestions: {
          instruction: "Attempt any 3 questions out of 4. (3 x 8 Marks = 24 Marks)",
          totalOptions: 4,
          required: 3,
          marksEach: 8,
          totalMarks: 24,
          questions: [
            { qNum: "Q3", chapter: 1, topic: "Computer Networks: OSI/TCP-IP protocols and network architecture analysis" },
            { qNum: "Q4", chapter: 3, topic: "OOP in Python: Designing classes with inheritance, encapsulation & polymorphism" },
            { qNum: "Q5", chapter: 6, topic: "Data Science & AI: Supervised learning models, training vs testing data & overfitting" },
            { qNum: "Q6", chapter: 9, topic: "Cybersecurity & Cryptography: Asymmetric vs Symmetric encryption, SSL/TLS, and security policies" }
          ]
        }
      }
    }
  },

  "11th": {
    "physics": {
      subjectName: "Physics",
      punjab: {
        totalMarks: 85,
        timeAllowed: "3 Hours",
        objectiveMarks: 17,
        subjectiveMarks: 68,
        description: "Official Punjab Board 11th Physics 2025-2026 Pairing Scheme.",
        mcqs: { total: 17, distribution: [{ chapter: 1, count: 2 }, { chapter: 2, count: 2 }, { chapter: 3, count: 2 }, { chapter: 4, count: 1 }, { chapter: 5, count: 2 }, { chapter: 6, count: 1 }, { chapter: 7, count: 1 }, { chapter: 8, count: 2 }, { chapter: 9, count: 1 }, { chapter: 10, count: 1 }, { chapter: 11, count: 2 }] },
        shortQuestions: [
          { qNum: "Q2", title: "Question No. 2", instruction: "Attempt any 8/12 (16 Marks)", totalOptions: 12, required: 8, marksEach: 2, totalMarks: 16, breakdown: [{ chapter: 1, count: 4 }, { chapter: 2, count: 3 }, { chapter: 3, count: 3 }, { chapter: 6, count: 2 }] },
          { qNum: "Q3", title: "Question No. 3", instruction: "Attempt any 8/12 (16 Marks)", totalOptions: 12, required: 8, marksEach: 2, totalMarks: 16, breakdown: [{ chapter: 4, count: 3 }, { chapter: 5, count: 4 }, { chapter: 7, count: 3 }, { chapter: 8, count: 2 }] },
          { qNum: "Q4", title: "Question No. 4", instruction: "Attempt any 6/9 (12 Marks)", totalOptions: 9, required: 6, marksEach: 2, totalMarks: 12, breakdown: [{ chapter: 9, count: 3 }, { chapter: 10, count: 3 }, { chapter: 11, count: 3 }] }
        ],
        longQuestions: {
          instruction: "Attempt any 3 questions out of 5. (8 Marks each = 24 Marks)",
          totalOptions: 5,
          required: 3,
          marksEach: 8,
          totalMarks: 24,
          questions: [
            { qNum: "Q5", chapter: 2, topic: "(a) Chapter 2 Theory & (b) Chapter 3 Numerical" },
            { qNum: "Q6", chapter: 4, topic: "(a) Chapter 4 Theory & (b) Chapter 5 Numerical" },
            { qNum: "Q7", chapter: 6, topic: "(a) Chapter 6 Theory & (b) Chapter 7 Numerical" },
            { qNum: "Q8", chapter: 8, topic: "(a) Chapter 8 Theory & (b) Chapter 9 Numerical" },
            { qNum: "Q9", chapter: 10, topic: "(a) Chapter 10 Theory & (b) Chapter 11 Numerical" }
          ]
        }
      }
    },
    "chemistry": {
      subjectName: "Chemistry",
      punjab: {
        totalMarks: 85,
        timeAllowed: "3 Hours",
        objectiveMarks: 17,
        subjectiveMarks: 68,
        description: "Official Punjab Board 11th Chemistry 2025-2026 Pairing Scheme.",
        mcqs: { total: 17, distribution: [{ chapter: 1, count: 2 }, { chapter: 3, count: 2 }, { chapter: 4, count: 2 }, { chapter: 5, count: 2 }, { chapter: 6, count: 2 }, { chapter: 7, count: 1 }, { chapter: 8, count: 2 }, { chapter: 9, count: 1 }, { chapter: 10, count: 2 }, { chapter: 11, count: 1 }] },
        shortQuestions: [
          { qNum: "Q2", title: "Question No. 2", instruction: "Attempt any 8/12 (16 Marks)", totalOptions: 12, required: 8, marksEach: 2, totalMarks: 16, breakdown: [{ chapter: 1, count: 3 }, { chapter: 3, count: 4 }, { chapter: 8, count: 3 }, { chapter: 9, count: 2 }] },
          { qNum: "Q3", title: "Question No. 3", instruction: "Attempt any 8/12 (16 Marks)", totalOptions: 12, required: 8, marksEach: 2, totalMarks: 16, breakdown: [{ chapter: 4, count: 4 }, { chapter: 5, count: 4 }, { chapter: 11, count: 4 }] },
          { qNum: "Q4", title: "Question No. 4", instruction: "Attempt any 6/9 (12 Marks)", totalOptions: 9, required: 6, marksEach: 2, totalMarks: 12, breakdown: [{ chapter: 6, count: 4 }, { chapter: 7, count: 3 }, { chapter: 10, count: 2 }] }
        ],
        longQuestions: {
          instruction: "Attempt any 3 questions out of 5. (8 Marks each = 24 Marks)",
          totalOptions: 5,
          required: 3,
          marksEach: 8,
          totalMarks: 24,
          questions: [
            { qNum: "Q5", chapter: 1, topic: "(a) Chapter 1 & (b) Chapter 3" },
            { qNum: "Q6", chapter: 4, topic: "(a) Chapter 4 & (b) Chapter 5" },
            { qNum: "Q7", chapter: 6, topic: "(a) Chapter 6 & (b) Chapter 7" },
            { qNum: "Q8", chapter: 8, topic: "(a) Chapter 8 & (b) Chapter 9" },
            { qNum: "Q9", chapter: 10, topic: "(a) Chapter 10 & (b) Chapter 11" }
          ]
        }
      }
    },
    "computer_science": {
      subjectName: "Computer Science",
      punjab: {
        totalMarks: 75,
        timeAllowed: "3 Hours",
        objectiveMarks: 15,
        subjectiveMarks: 60,
        description: "Official Punjab Board (PBCC) 11th Computer Science 2025-2026 Pairing Scheme. New Textbook Edition — Exactly 9 Units (Software Dev, Python Basics, Algorithms & Flowcharts, Computational Structures, Data Analytics, Emerging Tech, Computing Ethics, Digital Literacy, Digital Entrepreneurship).",
        mcqs: {
          total: 15,
          distribution: [
            { chapter: 1, count: 2, name: "Unit 1: Software Development" },
            { chapter: 2, count: 2, name: "Unit 2: Python Programming" },
            { chapter: 3, count: 2, name: "Unit 3: Algorithms & Problem Solving" },
            { chapter: 4, count: 2, name: "Unit 4: Computational Structures" },
            { chapter: 5, count: 2, name: "Unit 5: Data Analytics" },
            { chapter: 6, count: 1, name: "Unit 6: Emerging Technologies" },
            { chapter: 7, count: 1, name: "Unit 7: Legal and Ethical Aspects of Computing" },
            { chapter: 8, count: 1, name: "Unit 8: Online Research and Digital Literacy" },
            { chapter: 9, count: 2, name: "Unit 9: Entrepreneurship in Digital Age" }
          ]
        },
        shortQuestions: [
          {
            qNum: "Q2",
            title: "Question No. 2 (Short Questions)",
            instruction: "Attempt any 6 questions out of 9. (Each carries 2 Marks = 12 Marks)",
            totalOptions: 9,
            required: 6,
            marksEach: 2,
            totalMarks: 12,
            breakdown: [
              { chapter: 1, count: 3, name: "Unit 1: Software Development" },
              { chapter: 2, count: 4, name: "Unit 2: Python Programming" },
              { chapter: 3, count: 2, name: "Unit 3: Algorithms & Problem Solving" }
            ]
          },
          {
            qNum: "Q3",
            title: "Question No. 3 (Short Questions)",
            instruction: "Attempt any 6 questions out of 9. (Each carries 2 Marks = 12 Marks)",
            totalOptions: 9,
            required: 6,
            marksEach: 2,
            totalMarks: 12,
            breakdown: [
              { chapter: 4, count: 4, name: "Unit 4: Computational Structures" },
              { chapter: 5, count: 3, name: "Unit 5: Data Analytics" },
              { chapter: 6, count: 2, name: "Unit 6: Emerging Technologies" }
            ]
          },
          {
            qNum: "Q4",
            title: "Question No. 4 (Short Questions)",
            instruction: "Attempt any 6 questions out of 9. (Each carries 2 Marks = 12 Marks)",
            totalOptions: 9,
            required: 6,
            marksEach: 2,
            totalMarks: 12,
            breakdown: [
              { chapter: 7, count: 3, name: "Unit 7: Legal & Ethical Aspects" },
              { chapter: 8, count: 3, name: "Unit 8: Online Research & Literacy" },
              { chapter: 9, count: 3, name: "Unit 9: Entrepreneurship in Digital Age" }
            ]
          }
        ],
        longQuestions: {
          instruction: "Attempt any 3 questions out of 5. (Each carries 8 Marks = 24 Marks)",
          totalOptions: 5,
          required: 3,
          marksEach: 8,
          totalMarks: 24,
          questions: [
            { qNum: "Q5", chapter: 1, topic: "Unit 1: Software Development (SDLC Phases, Waterfall vs Agile methodologies, Feasibility study)" },
            { qNum: "Q6", chapter: 2, topic: "Unit 2: Python Programming (Control Flow: If-else, While/For loops, Nested Loops & Functions)" },
            { qNum: "Q7", chapter: 3, topic: "Unit 3: Algorithms & Problem Solving (Algorithm Design, Flowcharts, Computational Complexity & Sorting Algorithms)" },
            { qNum: "Q8", chapter: 5, topic: "Unit 5: Data Analytics (Data Gathering, Cleaning, Analysis with Python, Matplotlib & Descriptive Statistics)" },
            { qNum: "Q9", chapter: 9, topic: "Unit 9: Entrepreneurship in Digital Age (Digital Business Models, Startup Lifecycle, Pitch Decks & E-commerce)" }
          ]
        }
      },
      federal: {
        totalMarks: 75,
        timeAllowed: "3 Hours",
        objectiveMarks: 15,
        subjectiveMarks: 60,
        description: "Federal Board (FBISE Islamabad) 11th Computer Science 2025-2026 SLO Assessment Framework. All 9 Units tested on Conceptual Knowledge (30%), Understanding (50%), and Problem Solving / Programming (20%).",
        mcqs: {
          total: 15,
          distribution: [
            { chapter: 1, count: 2, name: "Unit 1: Software Development" },
            { chapter: 2, count: 2, name: "Unit 2: Python Programming" },
            { chapter: 3, count: 2, name: "Unit 3: Algorithms & Problem Solving" },
            { chapter: 4, count: 2, name: "Unit 4: Computational Structures" },
            { chapter: 5, count: 2, name: "Unit 5: Data Analytics" },
            { chapter: 6, count: 1, name: "Unit 6: Emerging Technologies" },
            { chapter: 7, count: 1, name: "Unit 7: Legal and Ethical Aspects" },
            { chapter: 8, count: 1, name: "Unit 8: Online Research & Literacy" },
            { chapter: 9, count: 2, name: "Unit 9: Entrepreneurship in Digital Age" }
          ]
        },
        shortQuestions: [
          {
            qNum: "Section B",
            title: "Section-B: Short Response Questions (SLO Based)",
            instruction: "Attempt any 12 questions out of 16. (12 x 3 Marks = 36 Marks)",
            totalOptions: 16,
            required: 12,
            marksEach: 3,
            totalMarks: 36,
            breakdown: [
              { chapter: 1, count: 2, name: "Unit 1: Software Dev" },
              { chapter: 2, count: 2, name: "Unit 2: Python" },
              { chapter: 3, count: 2, name: "Unit 3: Algorithms" },
              { chapter: 4, count: 2, name: "Unit 4: Computational Structures" },
              { chapter: 5, count: 2, name: "Unit 5: Data Analytics" },
              { chapter: 6, count: 2, name: "Unit 6: Emerging Tech" },
              { chapter: 7, count: 1, name: "Unit 7: Ethics" },
              { chapter: 8, count: 1, name: "Unit 8: Digital Literacy" },
              { chapter: 9, count: 2, name: "Unit 9: Digital Entrepreneurship" }
            ]
          }
        ],
        longQuestions: {
          instruction: "Attempt any 3 questions out of 4. (3 x 8 Marks = 24 Marks)",
          totalOptions: 4,
          required: 3,
          marksEach: 8,
          totalMarks: 24,
          questions: [
            { qNum: "Q3", chapter: 1, topic: "Software Development: Comparative analysis of SDLC models and requirement gathering techniques" },
            { qNum: "Q4", chapter: 2, topic: "Python Programming: Designing modular algorithms with nested functions and error handling" },
            { qNum: "Q5", chapter: 5, topic: "Data Analytics: Practical workflow of data manipulation, cleaning, and visualization with Python" },
            { qNum: "Q6", chapter: 9, topic: "Digital Entrepreneurship: Building a digital startup value proposition, MVP, and revenue model" }
          ]
        }
      }
    }
  }
};

/**
 * Normalizes subject ID to match available schemes
 */
export function normalizeSubjectKey(rawSubj = '') {
  const s = rawSubj.toLowerCase().replace(/[\s-_]/g, '');
  if (s.includes('physic')) return 'physics';
  if (s.includes('chem')) return 'chemistry';
  if (s.includes('bio')) return 'biology';
  if (s.includes('math')) return 'mathematics';
  if (s.includes('quran') || s.includes('tarjuma')) return 'tarjuma_tul_quran';
  if (s.includes('islam') || s.includes('islamiat')) return 'islamiat';
  if (s.includes('pak') || s.includes('mutalia')) return 'pak_studies';
  if (s.includes('eng')) return 'english';
  if (s.includes('urdu')) return 'urdu';
  return 'computer_science';
}

/**
 * Helper to get the official pairing scheme for a specific class, subject, and board.
 */
export function getBoardPairingScheme(classKey = '10th', subjectId = 'physics', boardId = 'punjab') {
  const normClass = classKey.replace(/\s*class/i, '').trim();
  const classData = PAIRING_SCHEMES_DATA[normClass] || PAIRING_SCHEMES_DATA["10th"];
  
  const normSubject = normalizeSubjectKey(subjectId);
  const subjectData = classData[normSubject] || PAIRING_SCHEMES_DATA["10th"]?.[normSubject] || classData['physics'] || Object.values(classData)[0];
  
  const normBoard = (boardId || 'punjab').toLowerCase();
  
  return subjectData?.[normBoard] || subjectData?.punjab || null;
}

/**
 * Generate a 100% Authentic Board Standard Paper obeying the official Board Pairing Scheme
 */
export function generateBoardPairingPaper({
  classKey = '10th',
  subjectId = 'physics',
  boardId = 'punjab',
  bank = {},
  options = {}
}) {
  const normClass = classKey.replace(/\s*class/i, '').trim();
  const scheme = getBoardPairingScheme(normClass, subjectId, boardId);
  const boardMeta = BOARD_AUTHORITIES[boardId.toUpperCase()] || BOARD_AUTHORITIES.PUNJAB;

  if (!scheme) {
    throw new Error(`Pairing scheme not found for ${normClass} ${subjectId} (${boardId})`);
  }

  // 1. Locate Subject and Chapters in Bank
  const classObj = bank[normClass] || {};
  const subjects = classObj.subjects || [];
  const normSubKey = normalizeSubjectKey(subjectId);
  
  const targetSubject = subjects.find(s => {
    const sNorm = normalizeSubjectKey(s.id || s.name || '');
    return sNorm === normSubKey;
  }) || subjects[0] || { chapters: [] };

  const chapters = targetSubject.chapters || [];

  const getChapterByNumber = (chNum) => {
    return chapters.find(c => Number(c.chapterNumber) === Number(chNum)) || 
           chapters[Math.min(Math.max(0, chNum - 1), chapters.length - 1)] || null;
  };

  const getQuestionsFromChapter = (chNum, type) => {
    const ch = getChapterByNumber(chNum);
    if (!ch || !ch.topics) return [];
    const collected = [];
    ch.topics.forEach(t => {
      if (Array.isArray(t[type])) {
        t[type].forEach(q => {
          collected.push({ ...q, chapterNumber: ch.chapterNumber, chapterName: ch.name });
        });
      }
    });
    return collected;
  };

  const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);

  // 2. Generate MCQs obeying Scheme Breakdown
  const finalMcqs = [];
  const usedMcqIds = new Set();

  (scheme.mcqs?.distribution || []).forEach(dist => {
    const pool = shuffle(getQuestionsFromChapter(dist.chapter, 'mcqs')).filter(q => !usedMcqIds.has(q.id));
    const countToPick = dist.count || 1;
    const picked = pool.slice(0, countToPick);
    
    picked.forEach(q => {
      usedMcqIds.add(q.id);
      finalMcqs.push({ ...q, marks: 1 });
    });
  });

  // Fallback if some chapters had fewer MCQs: fill up to scheme.mcqs.total
  if (finalMcqs.length < (scheme.mcqs?.total || 12)) {
    const allRemaining = [];
    chapters.forEach(ch => {
      (ch.topics || []).forEach(t => {
        (t.mcqs || []).forEach(m => {
          if (!usedMcqIds.has(m.id)) {
            allRemaining.push({ ...m, chapterNumber: ch.chapterNumber });
          }
        });
      });
    });
    const filler = shuffle(allRemaining).slice(0, (scheme.mcqs?.total || 12) - finalMcqs.length);
    filler.forEach(q => {
      usedMcqIds.add(q.id);
      finalMcqs.push({ ...q, marks: 1 });
    });
  }

  // 3. Generate Short Questions (Section I)
  const finalShorts = [];
  const usedShortIds = new Set();

  (scheme.shortQuestions || []).forEach(group => {
    (group.breakdown || []).forEach(bd => {
      const pool = shuffle(getQuestionsFromChapter(bd.chapter, 'shortQuestions')).filter(q => !usedShortIds.has(q.id));
      const picked = pool.slice(0, bd.count || 2);
      picked.forEach(q => {
        usedShortIds.add(q.id);
        finalShorts.push({
          ...q,
          marks: group.marksEach || 2,
          groupLabel: group.qNum,
          instruction: group.instruction
        });
      });
    });
  });

  // Fallback if fewer questions
  const totalRequiredShorts = (scheme.shortQuestions || []).reduce((sum, g) => sum + (g.totalOptions || 8), 0);
  if (finalShorts.length < totalRequiredShorts) {
    const allRemaining = [];
    chapters.forEach(ch => {
      (ch.topics || []).forEach(t => {
        (t.shortQuestions || []).forEach(s => {
          if (!usedShortIds.has(s.id)) {
            allRemaining.push({ ...s, chapterNumber: ch.chapterNumber });
          }
        });
      });
    });
    const filler = shuffle(allRemaining).slice(0, totalRequiredShorts - finalShorts.length);
    filler.forEach(q => {
      usedShortIds.add(q.id);
      finalShorts.push({ ...q, marks: 2 });
    });
  }

  // 4. Generate Long Questions (Section II)
  const finalLongs = [];
  const usedLongIds = new Set();

  (scheme.longQuestions?.questions || []).forEach(lq => {
    const pool = shuffle(getQuestionsFromChapter(lq.chapter, 'longQuestions')).filter(q => !usedLongIds.has(q.id));
    let picked = pool[0];
    if (picked) {
      usedLongIds.add(picked.id);
      finalLongs.push({
        ...picked,
        marks: scheme.longQuestions.marksEach || 8,
        question: picked.question || lq.topic
      });
    } else {
      finalLongs.push({
        id: `scheme-long-${Date.now()}-${Math.floor(Math.random()*1000)}`,
        question: lq.topic,
        marks: scheme.longQuestions.marksEach || 8,
        isSchemeGenerated: true
      });
    }
  });

  const paperConfig = {
    institute: options.institute || "BOARD OF INTERMEDIATE & SECONDARY EDUCATION",
    examTitle: `${boardMeta.name} ANNUAL EXAMINATION 2026`,
    boardName: boardMeta.fullName,
    subHeader: `OFFICIAL BOARD PAIRING SCHEME & BLUEPRINT MOCK (${boardMeta.badge})`,
    subject: targetSubject.name || scheme.subjectName || "Subject",
    gradeClass: `${normClass} Class`,
    timeAllowed: scheme.timeAllowed || "2 Hours",
    totalMarks: scheme.totalMarks || 60,
    date: new Date().toISOString().split('T')[0],
    syllabus: `Complete Syllabus (Official ${boardMeta.name} 2025-2026 Pairing Scheme - New Books)`,
    language: options.language || "bilingual",
    showWatermark: true,
    watermarkText: `${boardMeta.name} 2026`,
    showQrCode: true,
    pairingMeta: {
      boardId,
      boardName: boardMeta.name,
      classKey: normClass,
      session: "2025 - 2026",
      objectiveMarks: scheme.objectiveMarks,
      subjectiveMarks: scheme.subjectiveMarks
    }
  };

  return {
    paperConfig,
    paperData: {
      mcqs: finalMcqs,
      shortQuestions: finalShorts,
      longQuestions: finalLongs
    },
    scheme
  };
}
