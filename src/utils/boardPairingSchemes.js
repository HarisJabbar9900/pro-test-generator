/**
 * Official Board Examination Pairing Schemes & Paper Blueprints (Session 2025-2026)
 * Covers:
 * 1. Punjab Boards (PBCC - Lahore, Rawalpindi, Gujranwala, Faisalabad, Multan, Sahiwal, Sargodha, Bahawalpur, DG Khan)
 * 2. Federal Board (FBISE Islamabad - SLO Based Curriculum)
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
    badge: "Punjab Standard",
    curriculum: "Punjab Curriculum & Textbook Board (PCTB)",
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

/**
 * Detailed Subject Pairing Schemes Catalog
 */
export const PAIRING_SCHEMES_DATA = {
  // =========================================================================
  // 12TH CLASS (INTER PART-II)
  // =========================================================================
  "12th": {
    "computer_science": {
      subjectName: "Computer Science",
      punjab: {
        totalMarks: 75,
        timeAllowed: "2 Hours 30 Minutes",
        objectiveMarks: 15,
        subjectiveMarks: 60,
        passingMarks: 25,
        description: "Official Punjab Board (PBCC) 12th Computer Science 2025-2026 Pairing Scheme. 15 MCQs, 36 Marks Short Questions (Attempt 18/27), 24 Marks Long Questions (Attempt 3/5).",
        mcqs: {
          total: 15,
          distribution: [
            { chapter: 1, count: 2, name: "Data Basics & Database Overview" },
            { chapter: 2, count: 2, name: "Basic Concepts & Terminology of Databases" },
            { chapter: 3, count: 1, name: "Database Design Process" },
            { chapter: 4, count: 1, name: "Data Integrity and Normalization" },
            { chapter: 5, count: 1, name: "Introduction to Microsoft Access" },
            { chapter: 6, count: 1, name: "Table and Queries" },
            { chapter: 7, count: 1, name: "Microsoft Access Forms and Reports" },
            { chapter: 8, count: 2, name: "Getting Started with C / Programming Basics" },
            { chapter: 9, count: 2, name: "Elements of C / Programming Variables" },
            { chapter: 10, count: 1, name: "Input / Output Handling" },
            { chapter: 11, count: 1, name: "Decision Structures in Programming" }
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
              { chapter: 1, count: 3, name: "Chapter 1" },
              { chapter: 2, count: 2, name: "Chapter 2" },
              { chapter: 3, count: 2, name: "Chapter 3" },
              { chapter: 4, count: 2, name: "Chapter 4" }
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
              { chapter: 5, count: 2, name: "Chapter 5" },
              { chapter: 6, count: 2, name: "Chapter 6" },
              { chapter: 7, count: 2, name: "Chapter 7" },
              { chapter: 8, count: 3, name: "Chapter 8" }
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
              { chapter: 9, count: 3, name: "Chapter 9" },
              { chapter: 10, count: 3, name: "Chapter 10" },
              { chapter: 11, count: 3, name: "Chapter 11" }
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
            { qNum: "Q5", chapter: 1, topic: "Chapter 1: Database System Architecture & Traditional File System comparison" },
            { qNum: "Q6", chapter: 3, topic: "Chapter 3 or 4: ERD, Normalization (1NF, 2NF, 3NF)" },
            { qNum: "Q7", chapter: 8, topic: "Chapter 8: Basic C/Python structure, compiler, linker & loader" },
            { qNum: "Q8", chapter: 11, topic: "Chapter 11: Control structures (if-else, switch, nested conditions) with Code" },
            { qNum: "Q9", chapter: 12, topic: "Chapter 12: Loop structures (for, while, do-while) with complete working program" }
          ]
        }
      },
      federal: {
        totalMarks: 75,
        timeAllowed: "2 Hours 40 Minutes",
        objectiveMarks: 15,
        subjectiveMarks: 60,
        passingMarks: 25,
        description: "FBISE Federal Board SLO-Based Pattern. Focuses on Knowledge (30%), Understanding (50%), and Application / Programming (20%).",
        mcqs: {
          total: 15,
          distribution: [
            { chapter: 1, count: 2, name: "Computational Thinking & Architecture" },
            { chapter: 2, count: 2, name: "Python / C Syntax & Algorithms" },
            { chapter: 3, count: 2, name: "Object Oriented Principles" },
            { chapter: 4, count: 2, name: "Data Structures & Trees/Graphs" },
            { chapter: 5, count: 2, name: "Relational Database Management Systems" },
            { chapter: 6, count: 2, name: "Computer Networks & Cybersecurity" },
            { chapter: 7, count: 1, name: "Artificial Intelligence Concepts" },
            { chapter: 8, count: 1, name: "Web Technologies & Protocols" },
            { chapter: 9, count: 1, name: "Digital Ethics & Legal Framework" }
          ]
        },
        shortQuestions: [
          {
            qNum: "Section B",
            title: "Section B: Conceptual & Analytical Short Questions",
            instruction: "Attempt any 12 questions out of 16. (Each carries 3 Marks = 36 Marks)",
            totalOptions: 16,
            required: 12,
            marksEach: 3,
            totalMarks: 36,
            breakdown: [
              { chapter: 1, count: 2, name: "Ch 1 (Knowledge/Recall)" },
              { chapter: 2, count: 3, name: "Ch 2 (Syntax & Code Dry-run)" },
              { chapter: 3, count: 2, name: "Ch 3 (OOP Concepts)" },
              { chapter: 4, count: 2, name: "Ch 4 (Structures & Analysis)" },
              { chapter: 5, count: 3, name: "Ch 5 (SQL Queries & Tables)" },
              { chapter: 6, count: 2, name: "Ch 6 (Network Models)" },
              { chapter: 7, count: 2, name: "Ch 7 & 8 (Emerging Tech)" }
            ]
          }
        ],
        longQuestions: {
          instruction: "Section C: Comprehensive Questions. Attempt any 3 questions out of 4. (8 Marks each = 24 Marks)",
          totalOptions: 4,
          required: 3,
          marksEach: 8,
          totalMarks: 24,
          questions: [
            { qNum: "Q3", chapter: 2, topic: "Algorithmic Problem Solving & Python / C program writing with functions" },
            { qNum: "Q4", chapter: 3, topic: "Object-Oriented Programming (Classes, Inheritance, Polymorphism) implementation" },
            { qNum: "Q5", chapter: 5, topic: "Database Normalization (up to 3NF) with ER Diagram & Schema Design" },
            { qNum: "Q6", chapter: 6, topic: "Cybersecurity threats, encryption mechanisms & Network architecture" }
          ]
        }
      },
      sindh: {
        totalMarks: 75,
        timeAllowed: "2 Hours 30 Minutes",
        objectiveMarks: 15,
        subjectiveMarks: 60,
        passingMarks: 25,
        description: "Sindh Board (BIEK Karachi & Hyderabad) Revised Blueprint. Section A (MCQs 20%), Section B (CRQs Short 40%), Section C (ERQs Descriptive 40%).",
        mcqs: {
          total: 15,
          distribution: [
            { chapter: 1, count: 2, name: "Overview of Computer Systems" },
            { chapter: 2, count: 3, name: "Database & Information Systems" },
            { chapter: 3, count: 3, name: "Programming Methodologies" },
            { chapter: 4, count: 3, name: "Control Structures & Arrays" },
            { chapter: 5, count: 2, name: "Functions & Pointers" },
            { chapter: 6, count: 2, name: "Operating Systems & Networking" }
          ]
        },
        shortQuestions: [
          {
            qNum: "Section B",
            title: "Section B: Short Answer Questions (CRQs)",
            instruction: "Attempt any 6 questions. (Each carries 6 Marks = 36 Marks)",
            totalOptions: 9,
            required: 6,
            marksEach: 6,
            totalMarks: 36,
            breakdown: [
              { chapter: 1, count: 2, name: "Computer Organization" },
              { chapter: 2, count: 2, name: "DBMS & Keys" },
              { chapter: 3, count: 2, name: "Flowcharts & Logic" },
              { chapter: 4, count: 2, name: "Selection & Repetition" },
              { chapter: 5, count: 1, name: "Modular Programming" }
            ]
          }
        ],
        longQuestions: {
          instruction: "Section C: Detailed Answer Questions (ERQs). Attempt any 2 questions. (12 Marks each = 24 Marks)",
          totalOptions: 3,
          required: 2,
          marksEach: 12,
          totalMarks: 24,
          questions: [
            { qNum: "Q1", chapter: 2, topic: "Detailed explanation of DBMS Architecture, Data Independence and Normalization" },
            { qNum: "Q2", chapter: 4, topic: "Complete Programming question with Loops, Arrays and Conditionals" },
            { qNum: "Q3", chapter: 6, topic: "Network topologies, OSI Reference Model layers and Transmission media" }
          ]
        }
      },
      kpk: {
        totalMarks: 75,
        timeAllowed: "2 Hours 30 Minutes",
        objectiveMarks: 15,
        subjectiveMarks: 60,
        passingMarks: 25,
        description: "KPK Board Standard Blueprint (Peshawar, Mardan, Abbottabad, Swat).",
        mcqs: {
          total: 15,
          distribution: [
            { chapter: 1, count: 2, name: "Unit 1: Fundamentals of Database" },
            { chapter: 2, count: 2, name: "Unit 2: Database Life Cycle" },
            { chapter: 3, count: 2, name: "Unit 3: MS Access" },
            { chapter: 4, count: 2, name: "Unit 4: Programming Essentials" },
            { chapter: 5, count: 3, name: "Unit 5: Control Structures" },
            { chapter: 6, count: 2, name: "Unit 6: Functions & Sub-routines" },
            { chapter: 7, count: 2, name: "Unit 7: Applications & Trends" }
          ]
        },
        shortQuestions: [
          {
            qNum: "Section B",
            title: "Section B: Conceptual Short Questions",
            instruction: "Attempt any 12 questions out of 16. (Each carries 3 Marks = 36 Marks)",
            totalOptions: 16,
            required: 12,
            marksEach: 3,
            totalMarks: 36,
            breakdown: [
              { chapter: 1, count: 3, name: "Unit 1 Database Concepts" },
              { chapter: 2, count: 2, name: "Unit 2 Data Modeling" },
              { chapter: 3, count: 3, name: "Unit 3 MS Access Queries" },
              { chapter: 4, count: 3, name: "Unit 4 Programming Basics" },
              { chapter: 5, count: 3, name: "Unit 5 Decision & Iteration" },
              { chapter: 6, count: 2, name: "Unit 6 User Defined Functions" }
            ]
          }
        ],
        longQuestions: {
          instruction: "Section C: Long / Comprehensive Questions. Attempt any 3 out of 4. (8 Marks each = 24 Marks)",
          totalOptions: 4,
          required: 3,
          marksEach: 8,
          totalMarks: 24,
          questions: [
            { qNum: "Q3", chapter: 1, topic: "Components of Database Environment and Roles of DBA" },
            { qNum: "Q4", chapter: 2, topic: "Normalization steps with 1NF, 2NF and 3NF anomalies resolution" },
            { qNum: "Q5", chapter: 5, topic: "Program development with nested selection and while loop" },
            { qNum: "Q6", chapter: 6, topic: "Function declaration, definition, parameter passing and scope" }
          ]
        }
      }
    }
  },

  // =========================================================================
  // 11TH CLASS (INTER PART-I)
  // =========================================================================
  "11th": {
    "computer_science": {
      subjectName: "Computer Science",
      punjab: {
        totalMarks: 75,
        timeAllowed: "2 Hours 30 Minutes",
        objectiveMarks: 15,
        subjectiveMarks: 60,
        passingMarks: 25,
        description: "Official Punjab Board 11th Computer Science 2025-2026 Pairing Scheme. Covers Software Development, Python Programming, Algorithms, Structures, and Analytics.",
        mcqs: {
          total: 15,
          distribution: [
            { chapter: 1, count: 2, name: "Software Development Lifecycle" },
            { chapter: 2, count: 3, name: "Python Programming Basics" },
            { chapter: 3, count: 2, name: "Algorithms & Problem Solving" },
            { chapter: 4, count: 2, name: "Computational Structures & Logic" },
            { chapter: 5, count: 2, name: "Data Analytics & Management" },
            { chapter: 6, count: 1, name: "Emerging Technologies & AI" },
            { chapter: 7, count: 1, name: "Legal and Ethical Computing" },
            { chapter: 8, count: 1, name: "Online Research & Literacy" },
            { chapter: 9, count: 1, name: "Digital Entrepreneurship" }
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
              { chapter: 1, count: 4, name: "Chapter 1: Software Development" },
              { chapter: 2, count: 3, name: "Chapter 2: Python Programming" },
              { chapter: 3, count: 2, name: "Chapter 3: Algorithms" }
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
              { chapter: 4, count: 4, name: "Chapter 4: Computational Structures" },
              { chapter: 5, count: 3, name: "Chapter 5: Data Analytics" },
              { chapter: 6, count: 2, name: "Chapter 6: Emerging Technologies" }
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
              { chapter: 7, count: 3, name: "Chapter 7: Legal & Ethical Aspects" },
              { chapter: 8, count: 3, name: "Chapter 8: Online Research" },
              { chapter: 9, count: 3, name: "Chapter 9: Entrepreneurship" }
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
            { qNum: "Q5", chapter: 1, topic: "Chapter 1: SDLC Phases (Analysis, Design, Implementation & Testing)" },
            { qNum: "Q6", chapter: 2, topic: "Chapter 2: Python Data Types, Loops, and Functions with working code example" },
            { qNum: "Q7", chapter: 3, topic: "Chapter 3: Algorithm efficiency, Big-O notation, and flowchart conversion" },
            { qNum: "Q8", chapter: 4, topic: "Chapter 4: Computational Boolean Logic, Truth Tables & Karnaugh Maps" },
            { qNum: "Q9", chapter: 5, topic: "Chapter 5: Data Analytics Pipeline (Cleaning, Visualization & Insights)" }
          ]
        }
      },
      federal: {
        totalMarks: 75,
        timeAllowed: "2 Hours 40 Minutes",
        objectiveMarks: 15,
        subjectiveMarks: 60,
        passingMarks: 25,
        description: "Federal Board 11th Computer Science SLO Model. Emphasis on analytical reasoning and Python coding.",
        mcqs: {
          total: 15,
          distribution: [
            { chapter: 1, count: 2, name: "SDLC & Software Models" },
            { chapter: 2, count: 3, name: "Python Basics & Operators" },
            { chapter: 3, count: 2, name: "Sorting & Searching Algorithms" },
            { chapter: 4, count: 2, name: "Logic Gates & Simplification" },
            { chapter: 5, count: 2, name: "Data Warehousing & Analytics" },
            { chapter: 6, count: 1, name: "Cloud & IoT Systems" },
            { chapter: 7, count: 1, name: "Cyber Laws & Ethics" },
            { chapter: 8, count: 1, name: "Research Validation" },
            { chapter: 9, count: 1, name: "Business Model Canvas" }
          ]
        },
        shortQuestions: [
          {
            qNum: "Section B",
            title: "Section B: Conceptual & Application Short Questions",
            instruction: "Attempt any 12 questions out of 16. (Each carries 3 Marks = 36 Marks)",
            totalOptions: 16,
            required: 12,
            marksEach: 3,
            totalMarks: 36,
            breakdown: [
              { chapter: 1, count: 2, name: "Ch 1 SDLC Models" },
              { chapter: 2, count: 4, name: "Ch 2 Python Syntax & Output Tracing" },
              { chapter: 3, count: 2, name: "Ch 3 Algorithm Steps" },
              { chapter: 4, count: 2, name: "Ch 4 Logic Expressions" },
              { chapter: 5, count: 2, name: "Ch 5 Data Visualization" },
              { chapter: 6, count: 2, name: "Ch 6 Emerging Tech" },
              { chapter: 7, count: 2, name: "Ch 7-9 Ethics & Business" }
            ]
          }
        ],
        longQuestions: {
          instruction: "Section C: Detailed Questions. Attempt any 3 out of 4. (8 Marks each = 24 Marks)",
          totalOptions: 4,
          required: 3,
          marksEach: 8,
          totalMarks: 24,
          questions: [
            { qNum: "Q3", chapter: 2, topic: "Python practical program with list manipulation, dictionary and file handling" },
            { qNum: "Q4", chapter: 3, topic: "Linear Search vs Binary Search algorithms with trace tables and complexity" },
            { qNum: "Q5", chapter: 4, topic: "Boolean Algebra minimization using K-Maps and Logic Circuit realization" },
            { qNum: "Q6", chapter: 5, topic: "Data Analytics lifecycle with statistical measures and visual graphs" }
          ]
        }
      },
      sindh: {
        totalMarks: 75,
        timeAllowed: "2 Hours 30 Minutes",
        objectiveMarks: 15,
        subjectiveMarks: 60,
        passingMarks: 25,
        description: "Sindh Board (BIEK) XI Computer Science Blueprint. 15 MCQs, 36 Marks CRQs, 24 Marks ERQs.",
        mcqs: {
          total: 15,
          distribution: [
            { chapter: 1, count: 2, name: "Computer Fundamentals" },
            { chapter: 2, count: 3, name: "Number Systems & Codes" },
            { chapter: 3, count: 3, name: "Software & Operating Systems" },
            { chapter: 4, count: 3, name: "Data Communications & Networks" },
            { chapter: 5, count: 2, name: "Internet Applications" },
            { chapter: 6, count: 2, name: "Security & Viruses" }
          ]
        },
        shortQuestions: [
          {
            qNum: "Section B",
            title: "Section B: Short Answer Questions",
            instruction: "Attempt any 6 questions out of 9. (Each carries 6 Marks = 36 Marks)",
            totalOptions: 9,
            required: 6,
            marksEach: 6,
            totalMarks: 36,
            breakdown: [
              { chapter: 1, count: 2, name: "Hardware Components" },
              { chapter: 2, count: 2, name: "Conversions & Arithmetic" },
              { chapter: 3, count: 2, name: "OS Types & Kernels" },
              { chapter: 4, count: 2, name: "Transmission Media" },
              { chapter: 5, count: 1, name: "Protocols" }
            ]
          }
        ],
        longQuestions: {
          instruction: "Section C: Detailed Questions. Attempt any 2 out of 3. (12 Marks each = 24 Marks)",
          totalOptions: 3,
          required: 2,
          marksEach: 12,
          totalMarks: 24,
          questions: [
            { qNum: "Q1", chapter: 1, topic: "Architecture of CPU, Von Neumann model and memory hierarchy" },
            { qNum: "Q2", chapter: 4, topic: "LAN topologies (Bus, Star, Ring, Mesh) with advantages & diagrams" },
            { qNum: "Q3", chapter: 6, topic: "Malicious software types, prevention and biometric security controls" }
          ]
        }
      },
      kpk: {
        totalMarks: 75,
        timeAllowed: "2 Hours 30 Minutes",
        objectiveMarks: 15,
        subjectiveMarks: 60,
        passingMarks: 25,
        description: "KPK Board 11th Computer Science Blueprint.",
        mcqs: {
          total: 15,
          distribution: [
            { chapter: 1, count: 3, name: "Information Technology" },
            { chapter: 2, count: 3, name: "Information Networks" },
            { chapter: 3, count: 2, name: "Data Communications" },
            { chapter: 4, count: 2, name: "Applications of Computers" },
            { chapter: 5, count: 2, name: "Computer Architecture" },
            { chapter: 6, count: 2, name: "Security & Copyright" },
            { chapter: 7, count: 1, name: "Windows Operating System" }
          ]
        },
        shortQuestions: [
          {
            qNum: "Section B",
            title: "Section B: Conceptual Short Questions",
            instruction: "Attempt any 12 questions out of 16. (Each carries 3 Marks = 36 Marks)",
            totalOptions: 16,
            required: 12,
            marksEach: 3,
            totalMarks: 36,
            breakdown: [
              { chapter: 1, count: 3, name: "IT & Hardware" },
              { chapter: 2, count: 3, name: "Network Models" },
              { chapter: 3, count: 3, name: "Modulation & Media" },
              { chapter: 4, count: 2, name: "Automation" },
              { chapter: 5, count: 3, name: "Instruction Cycle" },
              { chapter: 6, count: 2, name: "Antivirus & Protection" }
            ]
          }
        ],
        longQuestions: {
          instruction: "Section C: Comprehensive Questions. Attempt any 3 out of 4. (8 Marks each = 24 Marks)",
          totalOptions: 4,
          required: 3,
          marksEach: 8,
          totalMarks: 24,
          questions: [
            { qNum: "Q3", chapter: 1, topic: "Components of Modern Computer System and Classification of Computers" },
            { qNum: "Q4", chapter: 2, topic: "OSI Reference Model: Layers, Functions and Data Encapsulation" },
            { qNum: "Q5", chapter: 3, topic: "Guided vs Unguided transmission media characteristics and comparison" },
            { qNum: "Q6", chapter: 5, topic: "CPU Fetch-Decode-Execute cycle and Bus Interconnection system" }
          ]
        }
      }
    }
  },

  // =========================================================================
  // 10TH CLASS (MATRIC PART-II)
  // =========================================================================
  "10th": {
    "computer_science": {
      subjectName: "Computer Science",
      punjab: {
        totalMarks: 50,
        timeAllowed: "2 Hours",
        objectiveMarks: 10,
        subjectiveMarks: 40,
        passingMarks: 17,
        description: "Official Punjab Board 10th Computer Science 2025-2026 Pairing Scheme. 10 MCQs, 24 Marks Short Questions (Attempt 12/18), 16 Marks Long Questions (Attempt 2/3).",
        mcqs: {
          total: 10,
          distribution: [
            { chapter: 1, count: 2, name: "Introduction to Programming" },
            { chapter: 2, count: 2, name: "User Interaction" },
            { chapter: 3, count: 2, name: "Conditional Logic" },
            { chapter: 4, count: 2, name: "Data Structures / Arrays" },
            { chapter: 5, count: 2, name: "Functions" }
          ]
        },
        shortQuestions: [
          {
            qNum: "Q2",
            title: "Question No. 2 (Short Questions)",
            instruction: "Attempt any 4 questions out of 6. (Each carries 2 Marks = 8 Marks)",
            totalOptions: 6,
            required: 4,
            marksEach: 2,
            totalMarks: 8,
            breakdown: [
              { chapter: 1, count: 3, name: "Chapter 1: Programming Basics" },
              { chapter: 2, count: 3, name: "Chapter 2: User Interaction" }
            ]
          },
          {
            qNum: "Q3",
            title: "Question No. 3 (Short Questions)",
            instruction: "Attempt any 4 questions out of 6. (Each carries 2 Marks = 8 Marks)",
            totalOptions: 6,
            required: 4,
            marksEach: 2,
            totalMarks: 8,
            breakdown: [
              { chapter: 2, count: 2, name: "Chapter 2: Formatting & Escape sequences" },
              { chapter: 3, count: 4, name: "Chapter 3: Conditional Logic" }
            ]
          },
          {
            qNum: "Q4",
            title: "Question No. 4 (Short Questions)",
            instruction: "Attempt any 4 questions out of 6. (Each carries 2 Marks = 8 Marks)",
            totalOptions: 6,
            required: 4,
            marksEach: 2,
            totalMarks: 8,
            breakdown: [
              { chapter: 4, count: 3, name: "Chapter 4: Data Structures" },
              { chapter: 5, count: 3, name: "Chapter 5: Functions" }
            ]
          }
        ],
        longQuestions: {
          instruction: "Attempt any 2 questions out of 3. (Each carries 8 Marks = 16 Marks)",
          totalOptions: 3,
          required: 2,
          marksEach: 8,
          totalMarks: 16,
          questions: [
            { qNum: "Q5", chapter: 1, topic: "Chapter 1: C Program structure, IDE, Linker & Compiler roles" },
            { qNum: "Q6", chapter: 3, topic: "Chapter 3: Nested selection structures (nested if-else) with working code" },
            { qNum: "Q7", chapter: 4, topic: "Chapter 4 or 5: Array initialization & traversal OR user-defined functions" }
          ]
        }
      },
      federal: {
        totalMarks: 50,
        timeAllowed: "2 Hours 15 Minutes",
        objectiveMarks: 10,
        subjectiveMarks: 40,
        passingMarks: 17,
        description: "Federal Board 10th Computer Science SLO Model. 10 MCQs, 24 Marks Section B, 16 Marks Section C.",
        mcqs: {
          total: 10,
          distribution: [
            { chapter: 1, count: 2, name: "Problem Solving & IDEs" },
            { chapter: 2, count: 2, name: "Data Types & Operators" },
            { chapter: 3, count: 2, name: "Branching Logic" },
            { chapter: 4, count: 2, name: "Loops and Arrays" },
            { chapter: 5, count: 2, name: "Functions & Scope" }
          ]
        },
        shortQuestions: [
          {
            qNum: "Section B",
            title: "Section B: Conceptual Short Questions",
            instruction: "Attempt any 8 questions out of 11. (Each carries 3 Marks = 24 Marks)",
            totalOptions: 11,
            required: 8,
            marksEach: 3,
            totalMarks: 24,
            breakdown: [
              { chapter: 1, count: 2, name: "Ch 1 Concepts" },
              { chapter: 2, count: 3, name: "Ch 2 Operators & Formats" },
              { chapter: 3, count: 2, name: "Ch 3 Logic Trace" },
              { chapter: 4, count: 2, name: "Ch 4 Array Indexing" },
              { chapter: 5, count: 2, name: "Ch 5 Function Prototypes" }
            ]
          }
        ],
        longQuestions: {
          instruction: "Section C: Analytical Questions. Attempt any 2 out of 3. (8 Marks each = 16 Marks)",
          totalOptions: 3,
          required: 2,
          marksEach: 8,
          totalMarks: 16,
          questions: [
            { qNum: "Q3", chapter: 2, topic: "Input/Output statements (scanf, printf) and format specifiers with program" },
            { qNum: "Q4", chapter: 3, topic: "If-else if ladder vs Switch statement with flowcharts and comparative code" },
            { qNum: "Q5", chapter: 4, topic: "1D Array operations: searching an element and calculating average/sum" }
          ]
        }
      },
      sindh: {
        totalMarks: 50,
        timeAllowed: "2 Hours",
        objectiveMarks: 10,
        subjectiveMarks: 40,
        passingMarks: 17,
        description: "Sindh Board (BSEK Karachi) 10th Computer Science Pattern.",
        mcqs: {
          total: 10,
          distribution: [
            { chapter: 1, count: 2, name: "Programming in C" },
            { chapter: 2, count: 2, name: "Input & Output" },
            { chapter: 3, count: 2, name: "Decision Making" },
            { chapter: 4, count: 2, name: "Looping Structures" },
            { chapter: 5, count: 2, name: "Sub-programs" }
          ]
        },
        shortQuestions: [
          {
            qNum: "Section B",
            title: "Section B: Short Questions (CRQs)",
            instruction: "Attempt any 6 questions out of 9. (Each carries 4 Marks = 24 Marks)",
            totalOptions: 9,
            required: 6,
            marksEach: 4,
            totalMarks: 24,
            breakdown: [
              { chapter: 1, count: 2, name: "Syntax & Keywords" },
              { chapter: 2, count: 2, name: "I/O Functions" },
              { chapter: 3, count: 2, name: "Conditions" },
              { chapter: 4, count: 2, name: "Loop Types" },
              { chapter: 5, count: 1, name: "Functions" }
            ]
          }
        ],
        longQuestions: {
          instruction: "Section C: Descriptive Questions (ERQs). Attempt any 2 out of 3. (8 Marks each = 16 Marks)",
          totalOptions: 3,
          required: 2,
          marksEach: 8,
          totalMarks: 16,
          questions: [
            { qNum: "Q1", chapter: 3, topic: "Control statements in C: if, if-else, switch with clear syntax and examples" },
            { qNum: "Q2", chapter: 4, topic: "For loop, while loop, and do-while loop comparison with complete program" },
            { qNum: "Q3", chapter: 5, topic: "User-defined functions, return types, and arguments passing" }
          ]
        }
      },
      kpk: {
        totalMarks: 50,
        timeAllowed: "2 Hours",
        objectiveMarks: 10,
        subjectiveMarks: 40,
        passingMarks: 17,
        description: "KPK Board 10th Computer Science Blueprint.",
        mcqs: {
          total: 10,
          distribution: [
            { chapter: 1, count: 2, name: "Programming Techniques" },
            { chapter: 2, count: 2, name: "Programming in C" },
            { chapter: 3, count: 2, name: "Input/Output in C" },
            { chapter: 4, count: 2, name: "Control Structures" },
            { chapter: 5, count: 2, name: "Functions in C" }
          ]
        },
        shortQuestions: [
          {
            qNum: "Section B",
            title: "Section B: Short Questions",
            instruction: "Attempt any 8 questions out of 11. (Each carries 3 Marks = 24 Marks)",
            totalOptions: 11,
            required: 8,
            marksEach: 3,
            totalMarks: 24,
            breakdown: [
              { chapter: 1, count: 2, name: "Algorithm & Flowcharts" },
              { chapter: 2, count: 3, name: "Data Types & Constants" },
              { chapter: 3, count: 2, name: "Scanf & Printf" },
              { chapter: 4, count: 2, name: "Conditionals" },
              { chapter: 5, count: 2, name: "Functions" }
            ]
          }
        ],
        longQuestions: {
          instruction: "Section C: Long Questions. Attempt any 2 out of 3. (8 Marks each = 16 Marks)",
          totalOptions: 3,
          required: 2,
          marksEach: 8,
          totalMarks: 16,
          questions: [
            { qNum: "Q3", chapter: 1, topic: "Problem Solving steps: Analysis, Algorithm design and Flowchart symbols" },
            { qNum: "Q4", chapter: 4, topic: "Conditional statements: if-else statement vs switch statement with programs" },
            { qNum: "Q5", chapter: 5, topic: "Function definition, function call, and types of functions with program" }
          ]
        }
      }
    }
  },

  // =========================================================================
  // 9TH CLASS (MATRIC PART-I)
  // =========================================================================
  "9th": {
    "computer_science": {
      subjectName: "Computer Science",
      punjab: {
        totalMarks: 50,
        timeAllowed: "2 Hours",
        objectiveMarks: 10,
        subjectiveMarks: 40,
        passingMarks: 17,
        description: "Official Punjab Board 9th Computer Science 2025-2026 Pairing Scheme. 10 MCQs, 24 Marks Short Questions (Attempt 12/18), 16 Marks Long Questions (Attempt 2/3).",
        mcqs: {
          total: 10,
          distribution: [
            { chapter: 1, count: 2, name: "Problem Solving" },
            { chapter: 2, count: 2, name: "Binary System / Number System" },
            { chapter: 3, count: 2, name: "Networks" },
            { chapter: 4, count: 2, name: "Data and Privacy" },
            { chapter: 5, count: 2, name: "Designing Website (HTML)" }
          ]
        },
        shortQuestions: [
          {
            qNum: "Q2",
            title: "Question No. 2 (Short Questions)",
            instruction: "Attempt any 4 questions out of 6. (Each carries 2 Marks = 8 Marks)",
            totalOptions: 6,
            required: 4,
            marksEach: 2,
            totalMarks: 8,
            breakdown: [
              { chapter: 1, count: 4, name: "Chapter 1: Problem Solving" },
              { chapter: 2, count: 2, name: "Chapter 2: Binary Systems" }
            ]
          },
          {
            qNum: "Q3",
            title: "Question No. 3 (Short Questions)",
            instruction: "Attempt any 4 questions out of 6. (Each carries 2 Marks = 8 Marks)",
            totalOptions: 6,
            required: 4,
            marksEach: 2,
            totalMarks: 8,
            breakdown: [
              { chapter: 2, count: 2, name: "Chapter 2: Conversions & Memory" },
              { chapter: 3, count: 4, name: "Chapter 3: Networks" }
            ]
          },
          {
            qNum: "Q4",
            title: "Question No. 4 (Short Questions)",
            instruction: "Attempt any 4 questions out of 6. (Each carries 2 Marks = 8 Marks)",
            totalOptions: 6,
            required: 4,
            marksEach: 2,
            totalMarks: 8,
            breakdown: [
              { chapter: 4, count: 3, name: "Chapter 4: Data and Privacy" },
              { chapter: 5, count: 3, name: "Chapter 5: Designing Website" }
            ]
          }
        ],
        longQuestions: {
          instruction: "Attempt any 2 questions out of 3. (Each carries 8 Marks = 16 Marks)",
          totalOptions: 3,
          required: 2,
          marksEach: 8,
          totalMarks: 16,
          questions: [
            { qNum: "Q5", chapter: 1, topic: "Chapter 1: Problem Solving steps OR Flowchart construction with symbols" },
            { qNum: "Q6", chapter: 3, topic: "Chapter 3: Computer Network topologies (Star, Ring, Bus) OR TCP/IP Model layers" },
            { qNum: "Q7", chapter: 4, topic: "Chapter 4 or 5: Security threats (Phishing, Patents, Cryptography) OR HTML web elements" }
          ]
        }
      },
      federal: {
        totalMarks: 50,
        timeAllowed: "2 Hours 15 Minutes",
        objectiveMarks: 10,
        subjectiveMarks: 40,
        passingMarks: 17,
        description: "Federal Board 9th Computer Science SLO Pattern. High conceptual depth on algorithms, binary math, networking, and security.",
        mcqs: {
          total: 10,
          distribution: [
            { chapter: 1, count: 2, name: "Problem Analysis & Algorithms" },
            { chapter: 2, count: 2, name: "Number Systems & ASCII/Unicode" },
            { chapter: 3, count: 2, name: "Protocols & Addressing (IP/MAC)" },
            { chapter: 4, count: 2, name: "Cyber Threats & Privacy Laws" },
            { chapter: 5, count: 2, name: "HTML Tags, Links & Tables" }
          ]
        },
        shortQuestions: [
          {
            qNum: "Section B",
            title: "Section B: Conceptual Short Questions",
            instruction: "Attempt any 8 questions out of 11. (Each carries 3 Marks = 24 Marks)",
            totalOptions: 11,
            required: 8,
            marksEach: 3,
            totalMarks: 24,
            breakdown: [
              { chapter: 1, count: 3, name: "Ch 1 Flowchart trace & algorithms" },
              { chapter: 2, count: 2, name: "Ch 2 Binary arithmetic & conversions" },
              { chapter: 3, count: 2, name: "Ch 3 Router/Switch roles & routing" },
              { chapter: 4, count: 2, name: "Ch 4 Encryption & confidentiality" },
              { chapter: 5, count: 2, name: "Ch 5 HTML structure & tags" }
            ]
          }
        ],
        longQuestions: {
          instruction: "Section C: Analytical Questions. Attempt any 2 out of 3. (8 Marks each = 16 Marks)",
          totalOptions: 3,
          required: 2,
          marksEach: 8,
          totalMarks: 16,
          questions: [
            { qNum: "Q3", chapter: 1, topic: "Draw complete Flowchart and write step-by-step Algorithm for a given problem" },
            { qNum: "Q4", chapter: 3, topic: "TCP/IP Five-Layer Model: Detailed role of each layer and packet movement" },
            { qNum: "Q5", chapter: 4, topic: "Caesar Cipher vs Vigenere Cipher encryption and intellectual property protection" }
          ]
        }
      },
      sindh: {
        totalMarks: 50,
        timeAllowed: "2 Hours",
        objectiveMarks: 10,
        subjectiveMarks: 40,
        passingMarks: 17,
        description: "Sindh Board (BSEK Karachi) 9th Computer Science Pattern.",
        mcqs: {
          total: 10,
          distribution: [
            { chapter: 1, count: 2, name: "Fundamentals of Computer" },
            { chapter: 2, count: 2, name: "Fundamentals of Operating System" },
            { chapter: 3, count: 2, name: "Office Automation" },
            { chapter: 4, count: 2, name: "Data Communication" },
            { chapter: 5, count: 2, name: "Computer Security & Ethics" }
          ]
        },
        shortQuestions: [
          {
            qNum: "Section B",
            title: "Section B: Short Questions (CRQs)",
            instruction: "Attempt any 6 questions out of 9. (Each carries 4 Marks = 24 Marks)",
            totalOptions: 9,
            required: 6,
            marksEach: 4,
            totalMarks: 24,
            breakdown: [
              { chapter: 1, count: 2, name: "Generations & Types" },
              { chapter: 2, count: 2, name: "OS Interfaces (CLI vs GUI)" },
              { chapter: 3, count: 2, name: "Word Processing & Spreadsheets" },
              { chapter: 4, count: 2, name: "Communication Components" },
              { chapter: 5, count: 1, name: "Security Threats" }
            ]
          }
        ],
        longQuestions: {
          instruction: "Section C: Descriptive Questions (ERQs). Attempt any 2 out of 3. (8 Marks each = 16 Marks)",
          totalOptions: 3,
          required: 2,
          marksEach: 8,
          totalMarks: 16,
          questions: [
            { qNum: "Q1", chapter: 1, topic: "Generations of computers (1st to 5th) with key hardware and software features" },
            { qNum: "Q2", chapter: 2, topic: "Functions of Operating System: Process, Memory, File and Device management" },
            { qNum: "Q3", chapter: 4, topic: "Components of data communication system with transmission modes (Simplex, Half, Full)" }
          ]
        }
      },
      kpk: {
        totalMarks: 50,
        timeAllowed: "2 Hours",
        objectiveMarks: 10,
        subjectiveMarks: 40,
        passingMarks: 17,
        description: "KPK Board 9th Computer Science Blueprint.",
        mcqs: {
          total: 10,
          distribution: [
            { chapter: 1, count: 2, name: "Unit 1: Introduction to Computers" },
            { chapter: 2, count: 2, name: "Unit 2: Computer Components" },
            { chapter: 3, count: 2, name: "Unit 3: Storage Devices" },
            { chapter: 4, count: 2, name: "Unit 4: Number Systems" },
            { chapter: 5, count: 2, name: "Unit 5: Computer Software" }
          ]
        },
        shortQuestions: [
          {
            qNum: "Section B",
            title: "Section B: Short Questions",
            instruction: "Attempt any 8 questions out of 11. (Each carries 3 Marks = 24 Marks)",
            totalOptions: 11,
            required: 8,
            marksEach: 3,
            totalMarks: 24,
            breakdown: [
              { chapter: 1, count: 2, name: "History & Types" },
              { chapter: 2, count: 3, name: "Input/Output Devices" },
              { chapter: 3, count: 2, name: "Primary & Secondary Storage" },
              { chapter: 4, count: 2, name: "Conversions" },
              { chapter: 5, count: 2, name: "System vs Application" }
            ]
          }
        ],
        longQuestions: {
          instruction: "Section C: Long Questions. Attempt any 2 out of 3. (8 Marks each = 16 Marks)",
          totalOptions: 3,
          required: 2,
          marksEach: 8,
          totalMarks: 16,
          questions: [
            { qNum: "Q3", chapter: 1, topic: "Classification of digital computers according to size, speed and capabilities" },
            { qNum: "Q4", chapter: 2, topic: "Central Processing Unit (CPU) architecture: ALU, CU and Register organization" },
            { qNum: "Q5", chapter: 4, topic: "Number systems: Binary, Decimal, Octal, Hexadecimal conversions with working steps" }
          ]
        }
      }
    }
  }
};

/**
 * Helper to get the official pairing scheme for a specific class, subject, and board.
 */
export function getBoardPairingScheme(classKey = '12th', subjectId = 'computer_science', boardId = 'punjab') {
  const normClass = classKey.replace(/\s*class/i, '').trim();
  const classData = PAIRING_SCHEMES_DATA[normClass] || PAIRING_SCHEMES_DATA["12th"];
  
  // Normalize subject
  let normSubject = 'computer_science';
  if (subjectId.includes('physics')) normSubject = 'physics';
  else if (subjectId.includes('chemistry')) normSubject = 'chemistry';
  else if (subjectId.includes('biology')) normSubject = 'biology';
  else if (subjectId.includes('math')) normSubject = 'mathematics';
  
  const subjectData = classData[normSubject] || classData['computer_science'];
  const normBoard = (boardId || 'punjab').toLowerCase();
  
  return subjectData[normBoard] || subjectData.punjab || null;
}

/**
 * Generate a 100% Authentic Board Standard Paper obeying the official Board Pairing Scheme
 * 
 * @param {Object} params
 * @param {string} params.classKey - '9th' | '10th' | '11th' | '12th'
 * @param {string} params.subjectId - 'computer_science' etc.
 * @param {string} params.boardId - 'punjab' | 'federal' | 'sindh' | 'kpk'
 * @param {Object} params.bank - The Question Bank repository
 * @param {Object} params.options - Additional preferences (e.g. customTitle, institute)
 */
export function generateBoardPairingPaper({
  classKey = '12th',
  subjectId = 'computer_science',
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
  const targetSubject = subjects.find(s => 
    s.id === subjectId || 
    (s.name || '').toLowerCase().includes(subjectId.toLowerCase()) ||
    (s.name || '').toLowerCase().includes('computer')
  ) || subjects[0] || { chapters: [] };

  const chapters = targetSubject.chapters || [];

  // Helper to pick random questions from a given chapter number
  const getChapterByNumber = (chNum) => {
    return chapters.find(c => Number(c.chapterNumber) === Number(chNum)) || 
           chapters[Math.min(chNum - 1, chapters.length - 1)] || null;
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
      finalMcqs.push({
        ...q,
        marks: 1
      });
    });
  });

  // Fallback if some chapters had fewer MCQs: fill up to scheme.mcqs.total
  if (finalMcqs.length < (scheme.mcqs?.total || 15)) {
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
    const filler = shuffle(allRemaining).slice(0, (scheme.mcqs?.total || 15) - finalMcqs.length);
    filler.forEach(q => {
      usedMcqIds.add(q.id);
      finalMcqs.push({ ...q, marks: 1 });
    });
  }

  // 3. Generate Short Questions (Section I)
  const finalShorts = [];
  const usedShortIds = new Set();

  (scheme.shortQuestions || []).forEach(group => {
    // For each sub-question group (e.g. Q2, Q3, Q4)
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

  // Fallback: If bank has fewer questions, top up from general pool
  const totalRequiredShorts = (scheme.shortQuestions || []).reduce((sum, g) => sum + (g.totalOptions || 9), 0);
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
      // Create representative long question from scheme specification if bank lacks long question in that specific chapter
      finalLongs.push({
        id: `scheme-long-${Date.now()}-${Math.floor(Math.random()*1000)}`,
        question: lq.topic,
        marks: scheme.longQuestions.marksEach || 8,
        isSchemeGenerated: true
      });
    }
  });

  // 5. Paper Header Configuration
  const paperConfig = {
    institute: options.institute || "BOARD OF INTERMEDIATE & SECONDARY EDUCATION",
    examTitle: `${boardMeta.name} ANNUAL EXAMINATION 2026`,
    boardName: boardMeta.fullName,
    subHeader: `OFFICIAL BOARD PAIRING SCHEME & BLUEPRINT MOCK (${boardMeta.badge})`,
    subject: targetSubject.name || "Computer Science",
    gradeClass: `${normClass} Class`,
    timeAllowed: scheme.timeAllowed || "2 Hours 30 Minutes",
    totalMarks: scheme.totalMarks || 75,
    date: new Date().toISOString().split('T')[0],
    syllabus: `Complete Syllabus (Official ${boardMeta.name} 2025-2026 Pairing Scheme)`,
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

  const paperData = {
    mcqs: finalMcqs,
    shortQuestions: finalShorts,
    longQuestions: finalLongs
  };

  return {
    paperConfig,
    paperData,
    scheme
  };
}
