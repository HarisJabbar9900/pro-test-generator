/**
 * Chapter 5: Code Testing and Debugging (12th Class Computer Science)
 * Official Exercise Questions (MCQs & Short Questions)
 * Topics: 5.1, 5.2, 5.3 (no sub-topics like 5.2.1)
 */

export const CHAPTER_5_NEW_TOPICS = [
  {
    id: "cs-ch5-topic-5.1",
    topicNumber: "5.1",
    name: "Introduction to Testing and Debugging",
    mcqs: [
      {
        id: "ch5-t5.1-ex-m1",
        topicNumber: "5.1",
        question: "Testing is essential for reliable applications because it helps to:",
        options: [
          "Optimise code performance",
          "Identify and fix bugs",
          "Reduce the program size",
          "Make code run faster"
        ],
        answer: "(b)",
        correctIndex: 1,
        answerKey: "Identify and fix bugs",
        category: "exercise",
        isExercise: true,
        marks: 1
      },
      {
        id: "ch5-t5.1-ex-m2",
        topicNumber: "5.1",
        question: "Common types of programming errors include:",
        options: [
          "Syntax error",
          "Logic error",
          "Runtime error",
          "All of the above"
        ],
        answer: "(d)",
        correctIndex: 3,
        answerKey: "All of the above",
        category: "exercise",
        isExercise: true,
        marks: 1
      }
    ],
    shortQuestions: [
      {
        id: "ch5-t5.1-ex-s1",
        topicNumber: "5.1",
        question: "Why is testing essential for ensuring reliable applications?",
        marks: 2,
        category: "exercise",
        isExercise: true
      },
      {
        id: "ch5-t5.1-ex-s2",
        topicNumber: "5.1",
        question: "What are some common types of programming errors and bugs?",
        marks: 2,
        category: "exercise",
        isExercise: true
      }
    ],
    longQuestions: []
  },
  {
    id: "cs-ch5-topic-5.2",
    topicNumber: "5.2",
    name: "Testing, Debugging and Exception Handling",
    mcqs: [
      {
        id: "ch5-t5.2-ex-m1",
        topicNumber: "5.2",
        question: "Unit testing focuses on:",
        options: [
          "Testing the entire application",
          "Testing individual components or functions",
          "Testing the user interface",
          "Testing database connections"
        ],
        answer: "(b)",
        correctIndex: 1,
        answerKey: "Testing individual components or functions",
        category: "exercise",
        isExercise: true,
        marks: 1
      },
      {
        id: "ch5-t5.2-ex-m2",
        topicNumber: "5.2",
        question: "The Python module used for unit testing is:",
        options: [
          "numpy",
          "matplotlib",
          "unittest",
          "os"
        ],
        answer: "(c)",
        correctIndex: 2,
        answerKey: "unittest",
        category: "exercise",
        isExercise: true,
        marks: 1
      },
      {
        id: "ch5-t5.2-ex-m3",
        topicNumber: "5.2",
        question: "The main purpose of using testing tools like unittest and pytest is:",
        options: [
          "To increase program size",
          "To verify code works correctly",
          "To design layouts",
          "To compile programs"
        ],
        answer: "(b)",
        correctIndex: 1,
        answerKey: "To verify code works correctly",
        category: "exercise",
        isExercise: true,
        marks: 1
      },
      {
        id: "ch5-t5.2-ex-m4",
        topicNumber: "5.2",
        question: "Breakpoints in debugging are used to:",
        options: [
          "Run the program faster",
          "Pause the program at specific points and inspect its state",
          "Skip certain code sections",
          "Optimise the code"
        ],
        answer: "(b)",
        correctIndex: 1,
        answerKey: "Pause the program at specific points and inspect its state",
        category: "exercise",
        isExercise: true,
        marks: 1
      },
      {
        id: "ch5-t5.2-ex-m5",
        topicNumber: "5.2",
        question: "Watch expressions in debugging are used to:",
        options: [
          "Change variable values",
          "Monitor variable values during program execution",
          "Pause the program",
          "Display output messages"
        ],
        answer: "(b)",
        correctIndex: 1,
        answerKey: "Monitor variable values during program execution",
        category: "exercise",
        isExercise: true,
        marks: 1
      },
      {
        id: "ch5-t5.2-ex-m6",
        topicNumber: "5.2",
        question: "Step-by-step debugging is used to:",
        options: [
          "Run the program faster",
          "Execute code one line at a time for easier error identification",
          "Increase the program's performance",
          "Compile the code"
        ],
        answer: "(b)",
        correctIndex: 1,
        answerKey: "Execute code one line at a time for easier error identification",
        category: "exercise",
        isExercise: true,
        marks: 1
      },
      {
        id: "ch5-t5.2-ex-m7",
        topicNumber: "5.2",
        question: "The Python keyword pair used for exception handling is:",
        options: [
          "try-except",
          "try-finally",
          "try-catch",
          "handle-throw"
        ],
        answer: "(a)",
        correctIndex: 0,
        answerKey: "try-except",
        category: "exercise",
        isExercise: true,
        marks: 1
      }
    ],
    shortQuestions: [
      {
        id: "ch5-t5.2-ex-s1",
        topicNumber: "5.2",
        question: "What is unit testing, and why is it important in programming?",
        marks: 2,
        category: "exercise",
        isExercise: true
      },
      {
        id: "ch5-t5.2-ex-s2",
        topicNumber: "5.2",
        question: "How do Python's unittest and pytest modules help in unit testing?",
        marks: 2,
        category: "exercise",
        isExercise: true
      },
      {
        id: "ch5-t5.2-ex-s3",
        topicNumber: "5.2",
        question: "What is the purpose of writing and executing test cases?",
        marks: 2,
        category: "exercise",
        isExercise: true
      },
      {
        id: "ch5-t5.2-ex-s4",
        topicNumber: "5.2",
        question: "How do you set breakpoints in IDEs like PyCharm or VS Code?",
        marks: 2,
        category: "exercise",
        isExercise: true
      },
      {
        id: "ch5-t5.2-ex-s5",
        topicNumber: "5.2",
        question: "What is the role of monitoring variable values with watch expressions during debugging?",
        marks: 2,
        category: "exercise",
        isExercise: true
      },
      {
        id: "ch5-t5.2-ex-s6",
        topicNumber: "5.2",
        question: "What is the step-by-step debugging process in IDEs?",
        marks: 2,
        category: "exercise",
        isExercise: true
      },
      {
        id: "ch5-t5.2-ex-s7",
        topicNumber: "5.2",
        question: "How does exception handling help in managing multiple exception types effectively?",
        marks: 2,
        category: "exercise",
        isExercise: true
      }
    ],
    longQuestions: []
  },
  {
    id: "cs-ch5-topic-5.3",
    topicNumber: "5.3",
    name: "Profiling and Optimization",
    mcqs: [
      {
        id: "ch5-t5.3-ex-m1",
        topicNumber: "5.3",
        question: "Profiling in programming is used to:",
        options: [
          "Improve the user interface design",
          "Measure performance and identify bottlenecks",
          "Optimise memory usage only",
          "Test for security vulnerabilities"
        ],
        answer: "(b)",
        correctIndex: 1,
        answerKey: "Measure performance and identify bottlenecks",
        category: "exercise",
        isExercise: true,
        marks: 1
      }
    ],
    shortQuestions: [
      {
        id: "ch5-t5.3-ex-s1",
        topicNumber: "5.3",
        question: "What tools can be used for profiling and measuring performance in Python?",
        marks: 2,
        category: "exercise",
        isExercise: true
      }
    ],
    longQuestions: []
  }
];

export const CHAPTER_5_DATA = {
  id: "cs-12-ch5",
  chapterNumber: 5,
  name: "Code Testing and Debugging",
  topics: CHAPTER_5_NEW_TOPICS
};
