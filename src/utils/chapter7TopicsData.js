/**
 * Chapter 7: Hypothesis Testing (12th Class Computer Science)
 * Official Exercise Questions (MCQs & Short Questions)
 * Topics: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6
 */

export const CHAPTER_7_NEW_TOPICS = [
  {
    id: "cs-ch7-topic-7.1",
    topicNumber: "7.1",
    name: "Introduction to Hypothesis Testing",
    mcqs: [
      {
        id: "ch7-t7.1-ex-m1",
        topicNumber: "7.1",
        question: "A hypothesis is:",
        options: [
          "A final result",
          "A test value",
          "A proposed explanation",
          "A dataset"
        ],
        answer: "(c)",
        correctIndex: 2,
        answerKey: "A proposed explanation",
        category: "exercise",
        isExercise: true,
        marks: 1
      }
    ],
    shortQuestions: [
      {
        id: "ch7-t7.1-ex-s1",
        topicNumber: "7.1",
        question: "What is a hypothesis?",
        marks: 2,
        category: "exercise",
        isExercise: true
      },
      {
        id: "ch7-t7.1-ex-s2",
        topicNumber: "7.1",
        question: "What is a research question?",
        marks: 2,
        category: "exercise",
        isExercise: true
      }
    ],
    longQuestions: []
  },
  {
    id: "cs-ch7-topic-7.2",
    topicNumber: "7.2",
    name: "Types of Hypotheses",
    mcqs: [
      {
        id: "ch7-t7.2-ex-m1",
        topicNumber: "7.2",
        question: "The null hypothesis represents:",
        options: [
          "An alternative idea",
          "No effect or no difference",
          "A final conclusion",
          "A prediction model"
        ],
        answer: "(b)",
        correctIndex: 1,
        answerKey: "No effect or no difference",
        category: "exercise",
        isExercise: true,
        marks: 1
      },
      {
        id: "ch7-t7.2-ex-m2",
        topicNumber: "7.2",
        question: "The symbol used for the null hypothesis is:",
        options: [
          "H₁",
          "H₂",
          "H₀",
          "H_x"
        ],
        answer: "(c)",
        correctIndex: 2,
        answerKey: "H₀",
        category: "exercise",
        isExercise: true,
        marks: 1
      }
    ],
    shortQuestions: [
      {
        id: "ch7-t7.2-ex-s1",
        topicNumber: "7.2",
        question: "Define null hypothesis (H₀).",
        marks: 2,
        category: "exercise",
        isExercise: true
      }
    ],
    longQuestions: []
  },
  {
    id: "cs-ch7-topic-7.3",
    topicNumber: "7.3",
    name: "Concepts in Hypothesis Testing",
    mcqs: [
      {
        id: "ch7-t7.3-ex-m1",
        topicNumber: "7.3",
        question: "A p-value is used for:",
        options: [
          "Measuring accuracy",
          "Testing a hypothesis",
          "Measuring variance",
          "Data storage"
        ],
        answer: "(b)",
        correctIndex: 1,
        answerKey: "Testing a hypothesis",
        category: "exercise",
        isExercise: true,
        marks: 1
      },
      {
        id: "ch7-t7.3-ex-m2",
        topicNumber: "7.3",
        question: "The critical region is the:",
        options: [
          "Safe area",
          "Rejection area",
          "Data range",
          "Sample space"
        ],
        answer: "(b)",
        correctIndex: 1,
        answerKey: "Rejection area",
        category: "exercise",
        isExercise: true,
        marks: 1
      },
      {
        id: "ch7-t7.3-ex-m3",
        topicNumber: "7.3",
        question: "An example of a test statistic is:",
        options: [
          "Mean",
          "t-value",
          "Mode",
          "Median"
        ],
        answer: "(b)",
        correctIndex: 1,
        answerKey: "t-value",
        category: "exercise",
        isExercise: true,
        marks: 1
      }
    ],
    shortQuestions: [
      {
        id: "ch7-t7.3-ex-s1",
        topicNumber: "7.3",
        question: "What is a test statistic?",
        marks: 2,
        category: "exercise",
        isExercise: true
      },
      {
        id: "ch7-t7.3-ex-s2",
        topicNumber: "7.3",
        question: "What is meant by p-value?",
        marks: 2,
        category: "exercise",
        isExercise: true
      },
      {
        id: "ch7-t7.3-ex-s3",
        topicNumber: "7.3",
        question: "What is a critical region?",
        marks: 2,
        category: "exercise",
        isExercise: true
      }
    ],
    longQuestions: []
  },
  {
    id: "cs-ch7-topic-7.4",
    topicNumber: "7.4",
    name: "Performing Hypothesis Tests",
    mcqs: [
      {
        id: "ch7-t7.4-ex-m1",
        topicNumber: "7.4",
        question: "If (p-value < α), the decision is to:",
        options: [
          "Accept H₀",
          "Reject H₀",
          "Ignore data",
          "Recalculate the mean"
        ],
        answer: "(b)",
        correctIndex: 1,
        answerKey: "Reject H₀",
        category: "exercise",
        isExercise: true,
        marks: 1
      }
    ],
    shortQuestions: [
      {
        id: "ch7-t7.4-ex-s1",
        topicNumber: "7.4",
        question: "What are the basic steps in hypothesis testing?",
        marks: 2,
        category: "exercise",
        isExercise: true
      }
    ],
    longQuestions: []
  },
  {
    id: "cs-ch7-topic-7.5",
    topicNumber: "7.5",
    name: "Data Visualization For Hypothesis Testing",
    mcqs: [
      {
        id: "ch7-t7.5-ex-m1",
        topicNumber: "7.5",
        question: "Data visualisation is used to:",
        options: [
          "Store data",
          "Present results clearly",
          "Delete data",
          "Calculate the mean"
        ],
        answer: "(b)",
        correctIndex: 1,
        answerKey: "Present results clearly",
        category: "exercise",
        isExercise: true,
        marks: 1
      },
      {
        id: "ch7-t7.5-ex-m2",
        topicNumber: "7.5",
        question: "A chart useful for comparison is:",
        options: [
          "Pie chart",
          "Bar chart",
          "Table",
          "Text"
        ],
        answer: "(b)",
        correctIndex: 1,
        answerKey: "Bar chart",
        category: "exercise",
        isExercise: true,
        marks: 1
      }
    ],
    shortQuestions: [
      {
        id: "ch7-t7.5-ex-s1",
        topicNumber: "7.5",
        question: "Why is data visualization important?",
        marks: 2,
        category: "exercise",
        isExercise: true
      }
    ],
    longQuestions: []
  },
  {
    id: "cs-ch7-topic-7.6",
    topicNumber: "7.6",
    name: "Ethical Issues in Data Science and Analysis",
    mcqs: [
      {
        id: "ch7-t7.6-ex-m1",
        topicNumber: "7.6",
        question: "Bias in data means:",
        options: [
          "Correct data",
          "Balanced data",
          "Unfair representation",
          "Random data"
        ],
        answer: "(c)",
        correctIndex: 2,
        answerKey: "Unfair representation",
        category: "exercise",
        isExercise: true,
        marks: 1
      }
    ],
    shortQuestions: [
      {
        id: "ch7-t7.6-ex-s1",
        topicNumber: "7.6",
        question: "What is bias in data collection?",
        marks: 2,
        category: "exercise",
        isExercise: true
      },
      {
        id: "ch7-t7.6-ex-s2",
        topicNumber: "7.6",
        question: "Why is ethical use of data important?",
        marks: 2,
        category: "exercise",
        isExercise: true
      }
    ],
    longQuestions: []
  }
];

export const CHAPTER_7_DATA = {
  id: "cs-12-ch7",
  chapterNumber: 7,
  name: "Hypothesis Testing",
  topics: CHAPTER_7_NEW_TOPICS
};
