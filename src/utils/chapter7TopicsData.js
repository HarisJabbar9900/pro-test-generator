/**
 * Chapter 7: Hypothesis Testing (12th Class Computer Science)
 * Complete Board-Style Topic-Wise Question Bank:
 * - 37 Total MCQs (10 Official Exercise MCQs + 27 Board-Style Topic MCQs)
 * - 34 Total Short Questions (10 Official Exercise Shorts + 24 Board-Style Topic Shorts)
 * Topics: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, 7.7
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
      },
      {
        id: "cs12-ch7-b1",
        topicNumber: "7.1",
        question: "What is hypothesis testing primarily used for in data analysis?",
        options: [
          "Designing hardware microchips",
          "Making decisions and checking whether an assumption is true or false",
          "Formatting database tables",
          "Writing graphical user interfaces"
        ],
        answer: "(b)",
        correctIndex: 1,
        answerKey: "Making decisions and checking whether an assumption is true or false",
        category: "topic",
        isExercise: false,
        marks: 1
      },
      {
        id: "cs12-ch7-b2",
        topicNumber: "7.1",
        question: "A hypothesis in research is defined as a testable assumption or statement made before:",
        options: [
          "System deployment",
          "Testing begins",
          "Data deletion",
          "Hardware installation"
        ],
        answer: "(b)",
        correctIndex: 1,
        answerKey: "Testing begins",
        category: "topic",
        isExercise: false,
        marks: 1
      },
      {
        id: "cs12-ch7-b3",
        topicNumber: "7.1",
        question: "In the hypothesis function h_θ(x) = y, what does x represent?",
        options: [
          "Predicted target value",
          "Model parameters or weights",
          "Input features or data points",
          "Significance level"
        ],
        answer: "(c)",
        correctIndex: 2,
        answerKey: "Input features or data points",
        category: "topic",
        isExercise: false,
        marks: 1
      },
      {
        id: "cs12-ch7-b4",
        topicNumber: "7.1",
        question: "In the hypothesis function h_θ(x) = y, what does y represent?",
        options: [
          "Input features",
          "Predicted output or target value",
          "Sample standard deviation",
          "Degrees of freedom"
        ],
        answer: "(b)",
        correctIndex: 1,
        answerKey: "Predicted output or target value",
        category: "topic",
        isExercise: false,
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
      },
      {
        id: "cs12-ch7-sq1",
        topicNumber: "7.1",
        question: "What is a hypothesis in research and data analysis?",
        marks: 2,
        category: "topic",
        isExercise: false
      },
      {
        id: "cs12-ch7-sq2",
        topicNumber: "7.1",
        question: "What is the role of hypothesis testing in evidence-based decision-making?",
        marks: 2,
        category: "topic",
        isExercise: false
      },
      {
        id: "cs12-ch7-sq3",
        topicNumber: "7.1",
        question: "In the hypothesis function h_θ(x) = y, what do the terms x and y represent?",
        marks: 2,
        category: "topic",
        isExercise: false
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
      },
      {
        id: "cs12-ch7-b5",
        topicNumber: "7.2",
        question: "Which hypothesis states that there is no significant effect, difference, or relationship between variables?",
        options: [
          "Alternative Hypothesis (H₁)",
          "Null Hypothesis (H₀)",
          "Critical Hypothesis",
          "Complex Hypothesis"
        ],
        answer: "(b)",
        correctIndex: 1,
        answerKey: "Null Hypothesis (H₀)",
        category: "topic",
        isExercise: false,
        marks: 1
      },
      {
        id: "cs12-ch7-b6",
        topicNumber: "7.2",
        question: "The Alternative Hypothesis is represented by which symbol?",
        options: [
          "H₀",
          "H₁ or H_a",
          "P_α",
          "T₀"
        ],
        answer: "(b)",
        correctIndex: 1,
        answerKey: "H₁ or H_a",
        category: "topic",
        isExercise: false,
        marks: 1
      },
      {
        id: "cs12-ch7-b7",
        topicNumber: "7.2",
        question: "What is the primary purpose of conducting a statistical hypothesis test?",
        options: [
          "To prove that H₀ is always true",
          "To test data against the Null Hypothesis (H₀) to decide whether to accept or reject it",
          "To delete bad rows from a dataset",
          "To eliminate sample variance"
        ],
        answer: "(b)",
        correctIndex: 1,
        answerKey: "To test data against the Null Hypothesis (H₀) to decide whether to accept or reject it",
        category: "topic",
        isExercise: false,
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
      },
      {
        id: "cs12-ch7-sq4",
        topicNumber: "7.2",
        question: "Define the Null Hypothesis (H₀) and state its default assumption in testing.",
        marks: 2,
        category: "topic",
        isExercise: false
      },
      {
        id: "cs12-ch7-sq5",
        topicNumber: "7.2",
        question: "What is the Alternative Hypothesis (H₁ or H_a), and what does it represent?",
        marks: 2,
        category: "topic",
        isExercise: false
      },
      {
        id: "cs12-ch7-sq6",
        topicNumber: "7.2",
        question: "Why is it essential for hypotheses to be clear, specific, and testable using data?",
        marks: 2,
        category: "topic",
        isExercise: false
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
      },
      {
        id: "cs12-ch7-b8",
        topicNumber: "7.3",
        question: "Numerical values calculated from sample data used to evaluate hypotheses (e.g., t-value, chi-square) are called:",
        options: [
          "Parameters",
          "Test statistics",
          "Critical limits",
          "Error margins"
        ],
        answer: "(b)",
        correctIndex: 1,
        answerKey: "Test statistics",
        category: "topic",
        isExercise: false,
        marks: 1
      },
      {
        id: "cs12-ch7-b9",
        topicNumber: "7.3",
        question: "In the t-value test formula t = (x̄ - μ₀) / (s / √n), what does x̄ represent?",
        options: [
          "Population mean under the null hypothesis",
          "Sample mean",
          "Sample size",
          "Sample standard deviation"
        ],
        answer: "(b)",
        correctIndex: 1,
        answerKey: "Sample mean",
        category: "topic",
        isExercise: false,
        marks: 1
      },
      {
        id: "cs12-ch7-b10",
        topicNumber: "7.3",
        question: "In the Chi-Square test formula χ² = Σ ((Oᵢ - Eᵢ)² / Eᵢ), what does Oᵢ represent?",
        options: [
          "Expected frequency",
          "Observed frequency in each category",
          "Overall population mean",
          "Optimal sample size"
        ],
        answer: "(b)",
        correctIndex: 1,
        answerKey: "Observed frequency in each category",
        category: "topic",
        isExercise: false,
        marks: 1
      },
      {
        id: "cs12-ch7-b11",
        topicNumber: "7.3",
        question: "The area in a statistical distribution where, if the test statistic falls within it, the null hypothesis is rejected is called the:",
        options: [
          "Acceptance region",
          "Critical region (Rejection area)",
          "Sample space",
          "Confidence interval"
        ],
        answer: "(b)",
        correctIndex: 1,
        answerKey: "Critical region (Rejection area)",
        category: "topic",
        isExercise: false,
        marks: 1
      },
      {
        id: "cs12-ch7-b12",
        topicNumber: "7.3",
        question: "The significance level (α) defines the maximum probability of making an error by:",
        options: [
          "Accepting a true null hypothesis",
          "Rejecting the null hypothesis when it is actually true",
          "Calculating an incorrect mean",
          "Collecting biased data"
        ],
        answer: "(b)",
        correctIndex: 1,
        answerKey: "Rejecting the null hypothesis when it is actually true",
        category: "topic",
        isExercise: false,
        marks: 1
      },
      {
        id: "cs12-ch7-b13",
        topicNumber: "7.3",
        question: "What is a commonly used standard value for the significance level (α) in research?",
        options: [
          "0.50",
          "0.05 (5%)",
          "0.95",
          "0.00"
        ],
        answer: "(b)",
        correctIndex: 1,
        answerKey: "0.05 (5%)",
        category: "topic",
        isExercise: false,
        marks: 1
      },
      {
        id: "cs12-ch7-b14",
        topicNumber: "7.3",
        question: "If the calculated p-value is LESS than the significance level (α), what decision is made regarding H₀?",
        options: [
          "Accept H₀",
          "Reject H₀",
          "Ignore the dataset",
          "Recalculate the mean"
        ],
        answer: "(b)",
        correctIndex: 1,
        answerKey: "Reject H₀",
        category: "topic",
        isExercise: false,
        marks: 1
      },
      {
        id: "cs12-ch7-b15",
        topicNumber: "7.3",
        question: "If the p-value is GREATER than α, the correct decision is to:",
        options: [
          "Reject H₀",
          "Accept (fail to reject) H₀",
          "Change the significance level",
          "Discard all sample data"
        ],
        answer: "(b)",
        correctIndex: 1,
        answerKey: "Accept (fail to reject) H₀",
        category: "topic",
        isExercise: false,
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
      },
      {
        id: "cs12-ch7-sq7",
        topicNumber: "7.3",
        question: "What is a test statistic? Name two commonly used test statistics.",
        marks: 2,
        category: "topic",
        isExercise: false
      },
      {
        id: "cs12-ch7-sq8",
        topicNumber: "7.3",
        question: "Define the Critical Region (rejection area) in a statistical distribution.",
        marks: 2,
        category: "topic",
        isExercise: false
      },
      {
        id: "cs12-ch7-sq9",
        topicNumber: "7.3",
        question: "What is the Significance Level (α), and what is its standard threshold value in research?",
        marks: 2,
        category: "topic",
        isExercise: false
      },
      {
        id: "cs12-ch7-sq10",
        topicNumber: "7.3",
        question: "Define the p-value and explain how it measures evidence against the null hypothesis.",
        marks: 2,
        category: "topic",
        isExercise: false
      },
      {
        id: "cs12-ch7-sq11",
        topicNumber: "7.3",
        question: "State the decision rule when comparing the calculated p-value with the significance level (α).",
        marks: 2,
        category: "topic",
        isExercise: false
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
      },
      {
        id: "cs12-ch7-b16",
        topicNumber: "7.4",
        question: "What is the very first step in performing a hypothesis test?",
        options: [
          "Collect data",
          "State the hypotheses (H₀ and H₁)",
          "Set the significance level",
          "Calculate the p-value"
        ],
        answer: "(b)",
        correctIndex: 1,
        answerKey: "State the hypotheses (H₀ and H₁)",
        category: "topic",
        isExercise: false,
        marks: 1
      },
      {
        id: "cs12-ch7-b17",
        topicNumber: "7.4",
        question: "Which advanced statistical test is used specifically to compare variances between two samples?",
        options: [
          "t-test",
          "F-test",
          "Chi-Square test",
          "Z-test"
        ],
        answer: "(b)",
        correctIndex: 1,
        answerKey: "F-test",
        category: "topic",
        isExercise: false,
        marks: 1
      },
      {
        id: "cs12-ch7-b18",
        topicNumber: "7.4",
        question: "Which test is used when analyzing categorical data to check relationships between variables?",
        options: [
          "F-test",
          "Chi-Square test",
          "Linear Regression",
          "t-test"
        ],
        answer: "(b)",
        correctIndex: 1,
        answerKey: "Chi-Square test",
        category: "topic",
        isExercise: false,
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
      },
      {
        id: "cs12-ch7-sq12",
        topicNumber: "7.4",
        question: "List the sequential steps involved in performing a statistical hypothesis test.",
        marks: 2,
        category: "topic",
        isExercise: false
      },
      {
        id: "cs12-ch7-sq13",
        topicNumber: "7.4",
        question: "What is the primary purpose of an F-test in advanced statistical analysis?",
        marks: 2,
        category: "topic",
        isExercise: false
      },
      {
        id: "cs12-ch7-sq14",
        topicNumber: "7.4",
        question: "When is a Chi-Square test applied in categorical data analysis?",
        marks: 2,
        category: "topic",
        isExercise: false
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
      },
      {
        id: "cs12-ch7-b19",
        topicNumber: "7.5",
        question: "Which chart type is best suited for comparing discrete categories or experimental groups in hypothesis testing?",
        options: [
          "Line Graph",
          "Bar Chart",
          "Pie Chart",
          "Scatter Plot"
        ],
        answer: "(b)",
        correctIndex: 1,
        answerKey: "Bar Chart",
        category: "topic",
        isExercise: false,
        marks: 1
      },
      {
        id: "cs12-ch7-b20",
        topicNumber: "7.5",
        question: "Which visual tool is most effective for displaying trends and changes over time?",
        options: [
          "Bar Chart",
          "Line Graph",
          "Pie Chart",
          "Table"
        ],
        answer: "(b)",
        correctIndex: 1,
        answerKey: "Line Graph",
        category: "topic",
        isExercise: false,
        marks: 1
      },
      {
        id: "cs12-ch7-b21",
        topicNumber: "7.5",
        question: "Which graph displays relationships between two variables and helps identify outliers or anomalies in a dataset?",
        options: [
          "Bar Chart",
          "Scatter Plot",
          "Pie Chart",
          "Histogram"
        ],
        answer: "(b)",
        correctIndex: 1,
        answerKey: "Scatter Plot",
        category: "topic",
        isExercise: false,
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
      },
      {
        id: "cs12-ch7-sq15",
        topicNumber: "7.5",
        question: "Why is data visualization an important preliminary and post-analysis step in hypothesis testing?",
        marks: 2,
        category: "topic",
        isExercise: false
      },
      {
        id: "cs12-ch7-sq16",
        topicNumber: "7.5",
        question: "Which chart type is best suited for comparing control and experimental treatment groups?",
        marks: 2,
        category: "topic",
        isExercise: false
      },
      {
        id: "cs12-ch7-sq17",
        topicNumber: "7.5",
        question: "How do scatter plots assist in identifying trends, correlations, and outliers in a dataset?",
        marks: 2,
        category: "topic",
        isExercise: false
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
      },
      {
        id: "cs12-ch7-b22",
        topicNumber: "7.6",
        question: "Conducting a survey on student performance by surveying ONLY top-performing schools is an example of:",
        options: [
          "Sampling Bias",
          "Survey Bias",
          "Gender Bias",
          "Confirmation Bias"
        ],
        answer: "(b)",
        correctIndex: 1,
        answerKey: "Survey Bias",
        category: "topic",
        isExercise: false,
        marks: 1
      },
      {
        id: "cs12-ch7-b23",
        topicNumber: "7.6",
        question: "A health study that includes ONLY young adults, failing to represent older age groups, suffers from:",
        options: [
          "Geographical Bias",
          "Sampling Bias",
          "Confirmation Bias",
          "Survey Bias"
        ],
        answer: "(b)",
        correctIndex: 1,
        answerKey: "Sampling Bias",
        category: "topic",
        isExercise: false,
        marks: 1
      },
      {
        id: "cs12-ch7-b24",
        topicNumber: "7.6",
        question: "When a researcher focuses ONLY on data that supports their pre-existing belief and ignores contradictory results, this is called:",
        options: [
          "Gender Bias",
          "Confirmation Bias",
          "Sampling Bias",
          "Geographical Bias"
        ],
        answer: "(b)",
        correctIndex: 1,
        answerKey: "Confirmation Bias",
        category: "topic",
        isExercise: false,
        marks: 1
      },
      {
        id: "cs12-ch7-b25",
        topicNumber: "7.6",
        question: "Using data collected exclusively from urban areas to make decisions for rural populations exhibits:",
        options: [
          "Confirmation Bias",
          "Geographical Bias",
          "Survey Bias",
          "Gender Bias"
        ],
        answer: "(b)",
        correctIndex: 1,
        answerKey: "Geographical Bias",
        category: "topic",
        isExercise: false,
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
      },
      {
        id: "cs12-ch7-sq18",
        topicNumber: "7.6",
        question: "Define bias in data collection and analysis, and explain how it leads to misleading conclusions.",
        marks: 2,
        category: "topic",
        isExercise: false
      },
      {
        id: "cs12-ch7-sq19",
        topicNumber: "7.6",
        question: "Differentiate between Sampling Bias and Survey Bias with real-world examples.",
        marks: 2,
        category: "topic",
        isExercise: false
      },
      {
        id: "cs12-ch7-sq20",
        topicNumber: "7.6",
        question: "Explain Confirmation Bias and its negative impact on objective data analysis.",
        marks: 2,
        category: "topic",
        isExercise: false
      },
      {
        id: "cs12-ch7-sq21",
        topicNumber: "7.6",
        question: "What is Geographical Bias in data collection, and how does it affect rural decision-making?",
        marks: 2,
        category: "topic",
        isExercise: false
      },
      {
        id: "cs12-ch7-sq22",
        topicNumber: "7.6",
        question: "What practices define the ethical use of data and predictive models?",
        marks: 2,
        category: "topic",
        isExercise: false
      }
    ],
    longQuestions: []
  },
  {
    id: "cs-ch7-topic-7.7",
    topicNumber: "7.7",
    name: "Communicating Results and Conclusions",
    mcqs: [
      {
        id: "cs12-ch7-b26",
        topicNumber: "7.7",
        question: "When presenting research findings clearly, language should be simple and organized without unnecessary:",
        options: [
          "Tables and charts",
          "Technical jargon",
          "Logical structures",
          "Statistical outcomes"
        ],
        answer: "(b)",
        correctIndex: 1,
        answerKey: "Technical jargon",
        category: "topic",
        isExercise: false,
        marks: 1
      },
      {
        id: "cs12-ch7-b27",
        topicNumber: "7.7",
        question: "Conclusions derived from data analysis must be directly linked to the:",
        options: [
          "Personal opinions of the researcher",
          "Original hypotheses",
          "Unverified online claims",
          "Uncleaned raw data"
        ],
        answer: "(b)",
        correctIndex: 1,
        answerKey: "Original hypotheses",
        category: "topic",
        isExercise: false,
        marks: 1
      }
    ],
    shortQuestions: [
      {
        id: "cs12-ch7-sq23",
        topicNumber: "7.7",
        question: "Why should research findings be presented in simple, organized language without technical jargon?",
        marks: 2,
        category: "topic",
        isExercise: false
      },
      {
        id: "cs12-ch7-sq24",
        topicNumber: "7.7",
        question: "How must final research conclusions be explicitly linked back to the original hypotheses?",
        marks: 2,
        category: "topic",
        isExercise: false
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
