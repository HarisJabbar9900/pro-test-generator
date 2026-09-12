/**
 * Chapter 6: Data Science and Machine Learning (12th Class Computer Science)
 * Complete Board-Style Conceptual Question Bank:
 * - 40 Total MCQs (10 Official Exercise MCQs + 30 Board-Style Topic MCQs)
 * - 10 Official Exercise Short Questions
 * Topics: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 6.7, 6.8, 6.9, 6.10
 */

export const CHAPTER_6_NEW_TOPICS = [
  {
    id: "cs-ch6-topic-6.1",
    topicNumber: "6.1",
    name: "Introduction to Data Science",
    mcqs: [
      {
        id: "ch6-t6.1-ex-m1",
        topicNumber: "6.1",
        question: "Data science is mainly concerned with:",
        options: [
          "Designing hardware",
          "Extracting useful information from data",
          "Writing only code",
          "Creating websites"
        ],
        answer: "(b)",
        correctIndex: 1,
        answerKey: "Extracting useful information from data",
        category: "exercise",
        isExercise: true,
        marks: 1
      },
      {
        id: "cs12-ch6-b1",
        topicNumber: "6.1",
        question: "Data science is described as an interdisciplinary field because it combines computer science tools with:",
        options: [
          "Mechanical design and robotics",
          "Mathematics, statistics, domain knowledge, and communication skills",
          "Physical circuit wiring",
          "Network hardware manufacturing"
        ],
        answer: "(b)",
        correctIndex: 1,
        answerKey: "Mathematics, statistics, domain knowledge, and communication skills",
        category: "topic",
        isExercise: false,
        marks: 1
      },
      {
        id: "cs12-ch6-b2",
        topicNumber: "6.1",
        question: "The complete workflow of Data Science converts raw data into:",
        options: [
          "Uncompiled source code",
          "Meaningful knowledge to solve real-world problems",
          "Physical storage devices",
          "Graphical user interfaces"
        ],
        answer: "(b)",
        correctIndex: 1,
        answerKey: "Meaningful knowledge to solve real-world problems",
        category: "topic",
        isExercise: false,
        marks: 1
      },
      {
        id: "cs12-ch6-b3",
        topicNumber: "6.1",
        question: "In the data science workflow, what step immediately follows Data Analysis (exploring and cleaning)?",
        options: [
          "Decision Making",
          "Modeling (training and testing)",
          "Data Collection",
          "System Deployment"
        ],
        answer: "(b)",
        correctIndex: 1,
        answerKey: "Modeling (training and testing)",
        category: "topic",
        isExercise: false,
        marks: 1
      }
    ],
    shortQuestions: [
      {
        id: "ch6-t6.1-ex-s1",
        topicNumber: "6.1",
        question: "What is data science?",
        marks: 2,
        category: "exercise",
        isExercise: true
      }
    ],
    longQuestions: []
  },
  {
    id: "cs-ch6-topic-6.2",
    topicNumber: "6.2",
    name: "Understanding Data",
    mcqs: [
      {
        id: "ch6-t6.2-ex-m1",
        topicNumber: "6.2",
        question: "Data organised in rows and columns is called:",
        options: [
          "Unstructured data",
          "Structured data",
          "Raw data",
          "Random data"
        ],
        answer: "(b)",
        correctIndex: 1,
        answerKey: "Structured data",
        category: "exercise",
        isExercise: true,
        marks: 1
      },
      {
        id: "ch6-t6.2-ex-m2",
        topicNumber: "6.2",
        question: "An example of unstructured data is:",
        options: [
          "Tables",
          "Spreadsheets",
          "Images and videos",
          "Databases"
        ],
        answer: "(c)",
        correctIndex: 2,
        answerKey: "Images and videos",
        category: "exercise",
        isExercise: true,
        marks: 1
      },
      {
        id: "cs12-ch6-b4",
        topicNumber: "6.2",
        question: "Data that is organized in tables or spreadsheets with clear rows and columns is classified as:",
        options: [
          "Unstructured data",
          "Structured data",
          "Raw unformatted text",
          "Anomaly data"
        ],
        answer: "(b)",
        correctIndex: 1,
        answerKey: "Structured data",
        category: "topic",
        isExercise: false,
        marks: 1
      },
      {
        id: "cs12-ch6-b5",
        topicNumber: "6.2",
        question: "Which of the following is an example of unstructured data?",
        options: [
          "Relational SQL databases",
          "Student mark sheets",
          "Images, audio, videos, and text files",
          "Excel spreadsheets"
        ],
        answer: "(c)",
        correctIndex: 2,
        answerKey: "Images, audio, videos, and text files",
        category: "topic",
        isExercise: false,
        marks: 1
      },
      {
        id: "cs12-ch6-b6",
        topicNumber: "6.2",
        question: "Which method represents manual data collection directly involving human effort?",
        options: [
          "Machine sensors",
          "Surveys, interviews, and forms",
          "Automated web scraping",
          "Log file generation"
        ],
        answer: "(b)",
        correctIndex: 1,
        answerKey: "Surveys, interviews, and forms",
        category: "topic",
        isExercise: false,
        marks: 1
      }
    ],
    shortQuestions: [
      {
        id: "ch6-t6.2-ex-s1",
        topicNumber: "6.2",
        question: "What are the two main types of data?",
        marks: 2,
        category: "exercise",
        isExercise: true
      },
      {
        id: "ch6-t6.2-ex-s2",
        topicNumber: "6.2",
        question: "What is the difference between structured and unstructured data?",
        marks: 2,
        category: "exercise",
        isExercise: true
      },
      {
        id: "ch6-t6.2-ex-s3",
        topicNumber: "6.2",
        question: "Name two common data collection methods.",
        marks: 2,
        category: "exercise",
        isExercise: true
      }
    ],
    longQuestions: []
  },
  {
    id: "cs-ch6-topic-6.3",
    topicNumber: "6.3",
    name: "Overview of Machine Learning",
    mcqs: [
      {
        id: "ch6-t6.3-ex-m1",
        topicNumber: "6.3",
        question: "Machine learning allows systems to:",
        options: [
          "Work without data",
          "Learn from data and improve performance",
          "Only store data",
          "Replace databases"
        ],
        answer: "(b)",
        correctIndex: 1,
        answerKey: "Learn from data and improve performance",
        category: "exercise",
        isExercise: true,
        marks: 1
      },
      {
        id: "cs12-ch6-b7",
        topicNumber: "6.3",
        question: "Unlike traditional programming which uses fixed rules, Machine Learning generates outputs by:",
        options: [
          "Following hardcoded conditional statements",
          "Learning patterns automatically from input data",
          "Executing manual calculations",
          "Reading uncleaned database logs"
        ],
        answer: "(b)",
        correctIndex: 1,
        answerKey: "Learning patterns automatically from input data",
        category: "topic",
        isExercise: false,
        marks: 1
      },
      {
        id: "cs12-ch6-b8",
        topicNumber: "6.3",
        question: "Machine Learning algorithms adapt and become more accurate over time when:",
        options: [
          "New data is introduced and used for continuous training",
          "System RAM is cleared",
          "Database indexes are deleted",
          "Monitor resolution is increased"
        ],
        answer: "(a)",
        correctIndex: 0,
        answerKey: "New data is introduced and used for continuous training",
        category: "topic",
        isExercise: false,
        marks: 1
      },
      {
        id: "cs12-ch6-b9",
        topicNumber: "6.3",
        question: "Machine Learning is classified as a subfield of:",
        options: [
          "Computer Hardware Engineering",
          "Data Science and Artificial Intelligence",
          "Network Telecommunications",
          "Web Layout Design"
        ],
        answer: "(b)",
        correctIndex: 1,
        answerKey: "Data Science and Artificial Intelligence",
        category: "topic",
        isExercise: false,
        marks: 1
      }
    ],
    shortQuestions: [
      {
        id: "ch6-t6.3-ex-s1",
        topicNumber: "6.3",
        question: "What is machine learning?",
        marks: 2,
        category: "exercise",
        isExercise: true
      }
    ],
    longQuestions: []
  },
  {
    id: "cs-ch6-topic-6.4",
    topicNumber: "6.4",
    name: "Machine Learning Mechanisms",
    mcqs: [
      {
        id: "ch6-t6.4-ex-m1",
        topicNumber: "6.4",
        question: "The type of machine learning that uses labelled data is:",
        options: [
          "Unsupervised learning",
          "Reinforcement learning",
          "Supervised learning",
          "Rule-based learning"
        ],
        answer: "(c)",
        correctIndex: 2,
        answerKey: "Supervised learning",
        category: "exercise",
        isExercise: true,
        marks: 1
      },
      {
        id: "ch6-t6.4-ex-m2",
        topicNumber: "6.4",
        question: "The machine learning method that learns through rewards and penalties is:",
        options: [
          "Supervised learning",
          "Unsupervised learning",
          "Reinforcement learning",
          "Rule-based learning"
        ],
        answer: "(c)",
        correctIndex: 2,
        answerKey: "Reinforcement learning",
        category: "exercise",
        isExercise: true,
        marks: 1
      },
      {
        id: "cs12-ch6-b10",
        topicNumber: "6.4",
        question: "Supervised machine learning trains models using:",
        options: [
          "Unlabeled datasets",
          "Labeled datasets containing both inputs and correct output labels",
          "Environment rewards and penalties only",
          "Unsorted text files"
        ],
        answer: "(b)",
        correctIndex: 1,
        answerKey: "Labeled datasets containing both inputs and correct output labels",
        category: "topic",
        isExercise: false,
        marks: 1
      },
      {
        id: "cs12-ch6-b11",
        topicNumber: "6.4",
        question: "Which machine learning mechanism automatically groups similar unlabeled data points into clusters?",
        options: [
          "Supervised Learning",
          "Unsupervised Learning",
          "Reinforcement Learning",
          "Rule-Based Learning"
        ],
        answer: "(b)",
        correctIndex: 1,
        answerKey: "Unsupervised Learning",
        category: "topic",
        isExercise: false,
        marks: 1
      },
      {
        id: "cs12-ch6-b12",
        topicNumber: "6.4",
        question: "Reinforcement learning trains an agent through trial and error by providing:",
        options: [
          "Labeled spam email examples",
          "Positive rewards for correct behavior and penalties for errors",
          "Pre-defined mathematical spreadsheets",
          "Fixed database queries"
        ],
        answer: "(b)",
        correctIndex: 1,
        answerKey: "Positive rewards for correct behavior and penalties for errors",
        category: "topic",
        isExercise: false,
        marks: 1
      }
    ],
    shortQuestions: [
      {
        id: "ch6-t6.4-ex-s1",
        topicNumber: "6.4",
        question: "What is supervised learning?",
        marks: 2,
        category: "exercise",
        isExercise: true
      }
    ],
    longQuestions: []
  },
  {
    id: "cs-ch6-topic-6.5",
    topicNumber: "6.5",
    name: "Applications of Machine Learning",
    mcqs: [
      {
        id: "cs12-ch6-b13",
        topicNumber: "6.5",
        question: "In healthcare, machine learning algorithms assist doctors by:",
        options: [
          "Printing patient appointment forms",
          "Detecting cancerous cells in medical images and early signs of diseases",
          "Manufacturing pharmacy medicines",
          "Managing hospital accounting books"
        ],
        answer: "(b)",
        correctIndex: 1,
        answerKey: "Detecting cancerous cells in medical images and early signs of diseases",
        category: "topic",
        isExercise: false,
        marks: 1
      },
      {
        id: "cs12-ch6-b14",
        topicNumber: "6.5",
        question: "E-commerce platforms use machine learning to increase business efficiency by:",
        options: [
          "Increasing product prices dynamically",
          "Recommending personalized products based on customer browsing habits",
          "Disabling customer feedback forms",
          "Performing manual inventory counts"
        ],
        answer: "(b)",
        correctIndex: 1,
        answerKey: "Recommending personalized products based on customer browsing habits",
        category: "topic",
        isExercise: false,
        marks: 1
      },
      {
        id: "cs12-ch6-b15",
        topicNumber: "6.5",
        question: "Which daily application uses machine learning to filter unwanted messages from reaching a user's inbox?",
        options: [
          "Video player",
          "Email spam detection",
          "Text editor",
          "File compressor"
        ],
        answer: "(b)",
        correctIndex: 1,
        answerKey: "Email spam detection",
        category: "topic",
        isExercise: false,
        marks: 1
      }
    ],
    shortQuestions: [],
    longQuestions: []
  },
  {
    id: "cs-ch6-topic-6.6",
    topicNumber: "6.6",
    name: "Building a Machine Learning Model",
    mcqs: [
      {
        id: "ch6-t6.6-ex-m1",
        topicNumber: "6.6",
        question: "Feature engineering is used to:",
        options: [
          "Delete data",
          "Improve data for better model performance",
          "Store data",
          "Visualise data"
        ],
        answer: "(b)",
        correctIndex: 1,
        answerKey: "Improve data for better model performance",
        category: "exercise",
        isExercise: true,
        marks: 1
      },
      {
        id: "ch6-t6.6-ex-m2",
        topicNumber: "6.6",
        question: "Train-test split is used to:",
        options: [
          "Delete data",
          "Divide data for training and testing",
          "Store data",
          "Visualise data"
        ],
        answer: "(b)",
        correctIndex: 1,
        answerKey: "Divide data for training and testing",
        category: "exercise",
        isExercise: true,
        marks: 1
      },
      {
        id: "cs12-ch6-b16",
        topicNumber: "6.6",
        question: "In a predictive model for student grade estimation, \"study hours\" and \"attendance\" are classified as:",
        options: [
          "Target values",
          "Features (input variables)",
          "Model evaluation metrics",
          "Hyperparameters"
        ],
        answer: "(b)",
        correctIndex: 1,
        answerKey: "Features (input variables)",
        category: "topic",
        isExercise: false,
        marks: 1
      },
      {
        id: "cs12-ch6-b17",
        topicNumber: "6.6",
        question: "The process of cleaning, scaling, and modifying raw data to improve model predictions is called:",
        options: [
          "Feature selection",
          "Feature engineering",
          "Train-test split",
          "Model deployment"
        ],
        answer: "(b)",
        correctIndex: 1,
        answerKey: "Feature engineering",
        category: "topic",
        isExercise: false,
        marks: 1
      },
      {
        id: "cs12-ch6-b18",
        topicNumber: "6.6",
        question: "What is the standard percentage split commonly used to divide data into training and testing sets to prevent overfitting?",
        options: [
          "50% training and 50% testing",
          "80% training and 20% testing",
          "10% training and 90% testing",
          "100% training and 0% testing"
        ],
        answer: "(b)",
        correctIndex: 1,
        answerKey: "80% training and 20% testing",
        category: "topic",
        isExercise: false,
        marks: 1
      },
      {
        id: "cs12-ch6-b19",
        topicNumber: "6.6",
        question: "In a linear regression model predicting exam scores, testing performance evaluates how close predicted values are to actual values using:",
        options: [
          "Accuracy percentage",
          "Mean Squared Error (MSE)",
          "Recall ratio",
          "F1-score"
        ],
        answer: "(b)",
        correctIndex: 1,
        answerKey: "Mean Squared Error (MSE)",
        category: "topic",
        isExercise: false,
        marks: 1
      }
    ],
    shortQuestions: [
      {
        id: "ch6-t6.6-ex-s1",
        topicNumber: "6.6",
        question: "What is the purpose of feature selection in machine learning?",
        marks: 2,
        category: "exercise",
        isExercise: true
      }
    ],
    longQuestions: []
  },
  {
    id: "cs-ch6-topic-6.7",
    topicNumber: "6.7",
    name: "Model Evaluation and Performance Metrics",
    mcqs: [
      {
        id: "ch6-t6.7-ex-m1",
        topicNumber: "6.7",
        question: "The metric that measures the overall correctness of a model is:",
        options: [
          "Precision",
          "Recall",
          "Accuracy",
          "F1_score"
        ],
        answer: "(c)",
        correctIndex: 2,
        answerKey: "Accuracy",
        category: "exercise",
        isExercise: true,
        marks: 1
      },
      {
        id: "cs12-ch6-b20",
        topicNumber: "6.7",
        question: "Which performance metric calculates the ratio of correctly predicted positive instances to all predicted positive instances (TP / (TP + FP))?",
        options: [
          "Accuracy",
          "Precision",
          "Recall",
          "Error Rate"
        ],
        answer: "(b)",
        correctIndex: 1,
        answerKey: "Precision",
        category: "topic",
        isExercise: false,
        marks: 1
      },
      {
        id: "cs12-ch6-b21",
        topicNumber: "6.7",
        question: "Recall measures the completeness of a model by calculating the proportion of actual positive cases that were correctly identified using:",
        options: [
          "(TP + TN) / Total",
          "TP / (TP + FN)",
          "(Precision × Recall) / 2",
          "FP / (FP + TN)"
        ],
        answer: "(b)",
        correctIndex: 1,
        answerKey: "TP / (TP + FN)",
        category: "topic",
        isExercise: false,
        marks: 1
      },
      {
        id: "cs12-ch6-b22",
        topicNumber: "6.7",
        question: "The F1-score provides a single balanced performance score by combining:",
        options: [
          "Accuracy and Error rate",
          "Precision and Recall",
          "Mean and Variance",
          "True Positives and True Negatives"
        ],
        answer: "(b)",
        correctIndex: 1,
        answerKey: "Precision and Recall",
        category: "topic",
        isExercise: false,
        marks: 1
      },
      {
        id: "cs12-ch6-b23",
        topicNumber: "6.7",
        question: "Accuracy alone can be misleading when evaluating a model trained on:",
        options: [
          "Balanced datasets",
          "Unbalanced datasets",
          "Clean structured tables",
          "Numerical features"
        ],
        answer: "(b)",
        correctIndex: 1,
        answerKey: "Unbalanced datasets",
        category: "topic",
        isExercise: false,
        marks: 1
      }
    ],
    shortQuestions: [
      {
        id: "ch6-t6.7-ex-s1",
        topicNumber: "6.7",
        question: "What does accuracy measure in a model?",
        marks: 2,
        category: "exercise",
        isExercise: true
      }
    ],
    longQuestions: []
  },
  {
    id: "cs-ch6-topic-6.8",
    topicNumber: "6.8",
    name: "Validation and Model Improvement",
    mcqs: [
      {
        id: "cs12-ch6-b24",
        topicNumber: "6.8",
        question: "A separate validation dataset is used after training and testing to confirm model reliability and prevent:",
        options: [
          "Fast execution speed",
          "Models from memorizing training data (overfitting)",
          "Data collection errors",
          "Feature scaling"
        ],
        answer: "(b)",
        correctIndex: 1,
        answerKey: "Models from memorizing training data (overfitting)",
        category: "topic",
        isExercise: false,
        marks: 1
      },
      {
        id: "cs12-ch6-b25",
        topicNumber: "6.8",
        question: "Adjusting model settings (such as learning rate or tree depth) to optimize performance is known as:",
        options: [
          "Feature selection",
          "Hyperparameter tuning",
          "Data cleaning",
          "Train-test splitting"
        ],
        answer: "(b)",
        correctIndex: 1,
        answerKey: "Hyperparameter tuning",
        category: "topic",
        isExercise: false,
        marks: 1
      }
    ],
    shortQuestions: [],
    longQuestions: []
  },
  {
    id: "cs-ch6-topic-6.9",
    topicNumber: "6.9",
    name: "Predictive Modeling and Causality",
    mcqs: [
      {
        id: "cs12-ch6-b26",
        topicNumber: "6.9",
        question: "While predictive modeling uses historical data patterns to estimate future outcomes, Causality explains:",
        options: [
          "How fast an algorithm executes",
          "The direct cause-and-effect relationship between variables",
          "How many rows exist in a spreadsheet",
          "The exact precision score"
        ],
        answer: "(b)",
        correctIndex: 1,
        answerKey: "The direct cause-and-effect relationship between variables",
        category: "topic",
        isExercise: false,
        marks: 1
      },
      {
        id: "cs12-ch6-b27",
        topicNumber: "6.9",
        question: "Predicting tomorrow's weather based on past weather trends is an example of:",
        options: [
          "Causality",
          "Predictive outcome",
          "Feature engineering",
          "Hyperparameter tuning"
        ],
        answer: "(b)",
        correctIndex: 1,
        answerKey: "Predictive outcome",
        category: "topic",
        isExercise: false,
        marks: 1
      }
    ],
    shortQuestions: [
      {
        id: "ch6-t6.9-ex-s1",
        topicNumber: "6.9",
        question: "What is the difference between prediction and causality?",
        marks: 2,
        category: "exercise",
        isExercise: true
      }
    ],
    longQuestions: []
  },
  {
    id: "cs-ch6-topic-6.10",
    topicNumber: "6.10",
    name: "Machine Learning Tools and Platforms",
    mcqs: [
      {
        id: "ch6-t6.10-ex-m1",
        topicNumber: "6.10",
        question: "A commonly used tool for machine learning and data analysis is:",
        options: [
          "MS Word",
          "Python",
          "PowerPoint",
          "Notepad"
        ],
        answer: "(b)",
        correctIndex: 1,
        answerKey: "Python",
        category: "exercise",
        isExercise: true,
        marks: 1
      },
      {
        id: "cs12-ch6-b28",
        topicNumber: "6.10",
        question: "Which basic tool is widely used for organizing data in rows and columns, filtering, and performing simple chart visualizations?",
        options: [
          "PyCharm",
          "Microsoft Excel",
          "SQLite3",
          "Linux Terminal"
        ],
        answer: "(b)",
        correctIndex: 1,
        answerKey: "Microsoft Excel",
        category: "topic",
        isExercise: false,
        marks: 1
      },
      {
        id: "cs12-ch6-b29",
        topicNumber: "6.10",
        question: "Which programming language is widely used in scientific research for handling large datasets and creating advanced graphical data visualizations?",
        options: [
          "HTML",
          "R",
          "C++",
          "SQL"
        ],
        answer: "(b)",
        correctIndex: 1,
        answerKey: "R",
        category: "topic",
        isExercise: false,
        marks: 1
      },
      {
        id: "cs12-ch6-b30",
        topicNumber: "6.10",
        question: "Which Python interactive development environment allows programmers to display code and output results together in a single document?",
        options: [
          "Notepad",
          "Jupyter Notebooks",
          "Turbo C",
          "MS Word"
        ],
        answer: "(b)",
        correctIndex: 1,
        answerKey: "Jupyter Notebooks",
        category: "topic",
        isExercise: false,
        marks: 1
      }
    ],
    shortQuestions: [
      {
        id: "ch6-t6.10-ex-s1",
        topicNumber: "6.10",
        question: "Name any one tool used for machine learning.",
        marks: 2,
        category: "exercise",
        isExercise: true
      }
    ],
    longQuestions: []
  }
];

export const CHAPTER_6_DATA = {
  id: "cs-12-ch6",
  chapterNumber: 6,
  name: "Data Science and Machine Learning",
  topics: CHAPTER_6_NEW_TOPICS
};
