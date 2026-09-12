/**
 * Model Papers Data Repository for Pro Test Maker
 * Official Board Examination Model Papers
 */

export const MODEL_PAPERS_CATALOG = [
  {
    id: "grade-12-cs-model-paper-2025-26",
    title: "Computer Science & Entrepreneurship",
    fullTitle: "MODEL PAPER: COMPUTER SCIENCE AND ENTREPRENEURSHIP",
    class: "Intermediate Part-II (Grade 12)",
    classKey: "12th",
    subject: "Computer Science",
    session: "2025 - 2026",
    board: "Federal & Punjab Boards Standard",
    badge: "Official Model Paper",
    totalMarks: 75,
    objectiveMarks: 15,
    subjectiveMarks: 60,
    totalTime: "2 Hours 30 Minutes",
    description: "Official board-standard model paper according to the latest syllabus. Contains complete 15 MCQs (Objective), 27 Short Questions (Section I), and 5 Long Questions (Section II).",

    objective: {
      title: "PART 1: OBJECTIVE",
      marks: 15,
      time: "20 Minutes",
      instructions: "Encircle the correct answer. Four possible answers A, B, C, D are given to each question.",
      questions: [
        {
          qNum: 1,
          question: "Which protocol is mainly used to view web pages?",
          options: ["FTP", "DNS", "TCP", "HTTP"],
          answer: "(d)",
          correctIndex: 3,
          answerKey: "HTTP"
        },
        {
          qNum: 2,
          question: "Which device converts digital signals for internet transmission?",
          options: ["Switch", "Hub", "Modem", "NIC"],
          answer: "(c)",
          correctIndex: 2,
          answerKey: "Modem"
        },
        {
          qNum: 3,
          question: "Which of the following is a compound proposition?",
          options: ["P", "Q", "P AND Q", "True"],
          answer: "(c)",
          correctIndex: 2,
          answerKey: "P AND Q"
        },
        {
          qNum: 4,
          question: "A proposition that is true for at least one case is called:",
          options: ["Unsatisfiable", "Invalid", "Satisfiable", "Equivalent"],
          answer: "(c)",
          correctIndex: 2,
          answerKey: "Satisfiable"
        },
        {
          qNum: 5,
          question: "Which concept hides data inside a class?",
          options: ["Inheritance", "Polymorphism", "Encapsulation", "Abstraction"],
          answer: "(c)",
          correctIndex: 2,
          answerKey: "Encapsulation"
        },
        {
          qNum: 6,
          question: "Which keyword is used to define a class in Python?",
          options: ["def", "class", "function", "object"],
          answer: "(b)",
          correctIndex: 1,
          answerKey: "class"
        },
        {
          qNum: 7,
          question: "Which of the following is Python's built-in GUI toolkit?",
          options: ["wxPython", "Tkinter", "PyQt", "Kivy"],
          answer: "(b)",
          correctIndex: 1,
          answerKey: "Tkinter"
        },
        {
          qNum: 8,
          question: "What widget is used to get user input in Tkinter?",
          options: ["Label", "Button", "Entry", "Listbox"],
          answer: "(c)",
          correctIndex: 2,
          answerKey: "Entry"
        },
        {
          qNum: 9,
          question: "Which Python module is used for unit testing?",
          options: ["numpy", "matplotlib", "unittest", "os"],
          answer: "(c)",
          correctIndex: 2,
          answerKey: "unittest"
        },
        {
          qNum: 10,
          question: "Which Python keyword is used for exception handling?",
          options: ["try-except", "try-finally", "try-catch", "handle-throw"],
          answer: "(a)",
          correctIndex: 0,
          answerKey: "try-except"
        },
        {
          qNum: 11,
          question: "Which metric measures overall correctness of a model?",
          options: ["Precision", "Recall", "Accuracy", "F1-score"],
          answer: "(c)",
          correctIndex: 2,
          answerKey: "Accuracy"
        },
        {
          qNum: 12,
          question: "Machine learning allows systems to:",
          options: [
            "Work without data",
            "Learn from data and improve performance",
            "Only store data",
            "Replace databases"
          ],
          answer: "(b)",
          correctIndex: 1,
          answerKey: "Learn from data and improve performance"
        },
        {
          qNum: 13,
          question: "Which of the following is a test statistic?",
          options: ["Mean", "t-value", "Mode", "Median"],
          answer: "(b)",
          correctIndex: 1,
          answerKey: "t-value"
        },
        {
          qNum: 14,
          question: "Which of the following is an example of Cloud Computing?",
          options: ["AWS", "MS-Word", "Smartwatch", "USB flash drive"],
          answer: "(a)",
          correctIndex: 0,
          answerKey: "AWS"
        },
        {
          qNum: 15,
          question: "What is the main danger of downloading unknown software?",
          options: ["Faster browsing", "Malware infection", "Getting rewards", "Extra storage"],
          answer: "(b)",
          correctIndex: 1,
          answerKey: "Malware infection"
        }
      ]
    },

    subjective: {
      title: "PART 2: SUBJECTIVE",
      marks: 60,
      time: "2 Hours 10 Minutes",

      section1: {
        title: "SECTION I (Short Questions)",
        marks: 36,
        subSections: [
          {
            qNum: "Q #2",
            instruction: "Write short answers of any SIX questions from the following: (6 × 2 = 12 Marks)",
            required: 6,
            marksPerQ: 2,
            totalMarks: 12,
            questions: [
              "What is network architecture?",
              "A network architecture experiences a single cable break, and the entire network goes down. Which topology is being used, and why did this failure happen?",
              "How does DNS (Domain Name System) function like a phonebook for the internet?",
              "Why is propositional logic insufficient for a statement like \"All students love coding,\" making predicate logic necessary instead?",
              "What does it mean when a compound statement is called a tautology?",
              "Formulate a predicate logic statement using variables, a predicate, and a quantifier to represent the sentence: \"Someone in this classroom owns a laptop.\"",
              "Break down the task of \"cleaning a messy bedroom\" into three smaller, manageable sub-tasks (Decomposition).",
              "What is the primary difference between Supervised Learning and Unsupervised Learning?",
              "Why do we split our data into a training set and a testing set instead of using all of it for training?"
            ]
          },
          {
            qNum: "Q #3",
            instruction: "Write short answers of any SIX questions from the following: (6 × 2 = 12 Marks)",
            required: 6,
            marksPerQ: 2,
            totalMarks: 12,
            questions: [
              "How does encapsulation help in keeping data secure and private?",
              "If you have a class called Player for a video game, write a single line of code to add an attribute for the player's health and set it to 100.",
              "You want to clear a text box after a user clicks \"Submit\". Which Tkinter method helps you delete the text inside an Entry widget?",
              "What is the purpose of the .mainloop() function in a Tkinter program?",
              "Write a single line of Tkinter code to create a window named root.",
              "When a user clicks a \"Save\" button, your program crashes with an error saying the database table does not exist. Analyze the problem: what step did the programmer forget to do first?",
              "In debugging, what is a breakpoint?",
              "Explain the difference between a Syntax Error (like a typo in code) and an Exception.",
              "Look at this code: result = 10 / user_input. If the user types 0, what specific type of built-in Python exception will be raised?"
            ]
          },
          {
            qNum: "Q #4",
            instruction: "Write short answers of any SIX questions from the following: (6 × 2 = 12 Marks)",
            required: 6,
            marksPerQ: 2,
            totalMarks: 12,
            questions: [
              "What is the main difference between the Null Hypothesis (H₀) and the Alternative Hypothesis (Hₐ)?",
              "Why is it considered an ethical issue to completely delete \"outliers\" (unusual data points) from your dataset just to make your hypothesis look correct?",
              "If you reject the Null Hypothesis at a 5% significance level (α = 0.05), what is the percentage chance that you might be making a mistake and rejecting a true hypothesis?",
              "Draft a clear Null Hypothesis (H₀) and Alternative Hypothesis (Hₐ) for an experiment testing whether rolling a standard 6-sided die is fair or biased.",
              "Why is the p-value important in hypothesis testing?",
              "How is Artificial Intelligence useful in our daily lives? Give two examples.",
              "How does blockchain ensure security and transparency in transactions?",
              "How does e-waste impact the environment?",
              "How can downloading suspicious software affect a computer?"
            ]
          }
        ]
      },

      section2: {
        title: "SECTION II (Long / Descriptive Questions)",
        instruction: "Note: Attempt any THREE descriptive questions. (3 × 8 = 24 Marks)",
        required: 3,
        marksPerQ: 8,
        totalMarks: 24,
        questions: [
          {
            qNum: "Q #5",
            question: "What is the OSI model? Explain its layers and their functions.",
            marks: 8
          },
          {
            qNum: "Q #6",
            question: "Write a Python program to demonstrate multilevel inheritance using Grandfather, Father, and Son.",
            marks: 8
          },
          {
            qNum: "Q #7",
            question: "Describe model evaluation techniques and explain accuracy, precision, recall, and F1-score.",
            marks: 8
          },
          {
            qNum: "Q #8",
            question: "Discuss the benefits and challenges of Artificial Intelligence (AI) in society. How can ethical principles ensure fair and responsible use of AI?",
            marks: 8
          },
          {
            qNum: "Q #9",
            question: "Describe how privacy and security settings on online platforms can be managed. Explain why reading privacy policies is important for data protection.",
            marks: 8
          }
        ]
      }
    }
  }
];
