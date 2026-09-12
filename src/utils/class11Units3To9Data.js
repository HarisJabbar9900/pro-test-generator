/**
 * Class 11th Computer Science & Entrepreneurship
 * Units 3 to 9 - Comprehensive Question Bank
 * Strictly mapped to 2-segment topic format (e.g. 3.1, 4.2, 5.3, 6.6, 9.8)
 */

export const CLASS_11_UNITS_3_TO_9_CHAPTERS = [
  // =========================================================================
  // UNIT 3: ALGORITHMS AND PROBLEM SOLVING
  // =========================================================================
  {
    id: "cs-11-ch3",
    chapterNumber: 3,
    name: "Algorithms & Problem Solving",
    topics: [
      {
        id: "cs-11-ch3-topic-3.1",
        topicNumber: "3.1",
        name: "Understanding Computational Problems",
        mcqs: [
          {
            id: "cs11-ch3-t3.1-m1",
            question: "A computational problem is defined as a challenge that can be solved using:",
            options: [
              "Physical electronic circuits",
              "An algorithm (step-by-step instructions)",
              "Manual record books",
              "Hardware expansion cards"
            ],
            answer: "(b)",
            correctIndex: 1,
            answerKey: "An algorithm (step-by-step instructions)",
            marks: 1,
            category: "topic"
          },
          {
            id: "cs11-ch3-t3.1-m2",
            question: "Which classification of computational problems requires an output that is strictly \"yes\" or \"no\"?",
            options: [
              "Search Problems",
              "Optimization Problems",
              "Decision Problems",
              "Counting Problems"
            ],
            answer: "(c)",
            correctIndex: 2,
            answerKey: "Decision Problems",
            marks: 1,
            category: "topic"
          },
          {
            id: "cs11-ch3-t3.1-m3",
            question: "Problems that have clear goals, defined inputs, processes, and outputs (e.g., determining if a number is even) are called:",
            options: [
              "Ill-defined Problems",
              "Well-defined Problems",
              "Unsolvable Problems",
              "Intractable Problems"
            ],
            answer: "(b)",
            correctIndex: 1,
            answerKey: "Well-defined Problems",
            marks: 1,
            category: "topic"
          },
          {
            id: "cs11-ch3-t3.1-m4",
            question: "A problem that lacks clarity regarding initial requirements, success criteria, or expected output is known as an:",
            options: [
              "Ill-defined problem",
              "Intractable problem",
              "Optimized problem",
              "Algorithmic problem"
            ],
            answer: "(a)",
            correctIndex: 0,
            answerKey: "Ill-defined problem",
            marks: 1,
            category: "topic"
          }
        ],
        shortQuestions: [
          {
            id: "cs11-ch3-t3.1-sq1",
            question: "Define a computational problem and state its three fundamental components (Input, Processing, Output).",
            marks: 2,
            category: "topic"
          },
          {
            id: "cs11-ch3-t3.1-sq2",
            question: "Differentiate between Decision Problems, Search Problems, Counting Problems, and Optimization Problems.",
            marks: 2,
            category: "topic"
          },
          {
            id: "cs11-ch3-t3.1-sq3",
            question: "Differentiate between Well-defined and Ill-defined problems in computational thinking.",
            marks: 2,
            category: "topic"
          },
          {
            id: "cs11-ch3-t3.1-sq4",
            question: "What are Constraints in problem formulation, and why must they be identified early?",
            marks: 2,
            category: "topic"
          },
          {
            id: "cs11-ch3-t3.1-sq5",
            question: "Why is problem decomposition essential when solving complex computing tasks?",
            marks: 2,
            category: "topic"
          }
        ],
        longQuestions: []
      },
      {
        id: "cs-11-ch3-topic-3.2",
        topicNumber: "3.2",
        name: "Algorithms for Problem Solving",
        mcqs: [
          {
            id: "cs11-ch3-t3.2-m1",
            question: "Which problem-solving strategy generates all potential candidate solutions and tests each against a verification predicate?",
            options: [
              "Generate-and-Test (Trial and Error)",
              "Dynamic Programming",
              "Greedy Heuristics",
              "Binary Divide and Conquer"
            ],
            answer: "(a)",
            correctIndex: 0,
            answerKey: "Generate-and-Test (Trial and Error)",
            marks: 1,
            category: "topic"
          },
          {
            id: "cs11-ch3-t3.2-m2",
            question: "The primary limitation of the Generate-and-Test method for problems with large search spaces is:",
            options: [
              "Inability to find an optimal solution",
              "Combinatorial explosion of test states",
              "Need for recursive data structures",
              "Requirement of a deterministic compiler"
            ],
            answer: "(b)",
            correctIndex: 1,
            answerKey: "Combinatorial explosion of test states",
            marks: 1,
            category: "topic"
          }
        ],
        shortQuestions: [
          {
            id: "cs11-ch3-t3.2-sq6",
            question: "Explain the working principle of the Generate-and-Test algorithmic technique.",
            marks: 2,
            category: "topic"
          },
          {
            id: "cs11-ch3-t3.2-sq7",
            question: "State two advantages and two disadvantages of using Generate-and-Test for computational search.",
            marks: 2,
            category: "topic"
          }
        ],
        longQuestions: []
      },
      {
        id: "cs-11-ch3-topic-3.3",
        topicNumber: "3.3",
        name: "Problem Solvability and Complexity",
        mcqs: [
          {
            id: "cs11-ch3-t3.3-m1",
            question: "Problems for which no algorithm can ever be designed that will always provide a correct answer for all inputs are:",
            options: [
              "Unsolvable / Undecidable Problems",
              "NP-Complete Problems",
              "Intractable Problems",
              "Polynomial-time Problems"
            ],
            answer: "(a)",
            correctIndex: 0,
            answerKey: "Unsolvable / Undecidable Problems",
            marks: 1,
            category: "topic"
          },
          {
            id: "cs11-ch3-t3.3-m2",
            question: "A classic example of an undecidable/unsolvable problem in computer science is the:",
            options: [
              "Halting Problem (Turing)",
              "Traveling Salesperson Problem",
              "Sorting Problem",
              "Tower of Hanoi"
            ],
            answer: "(a)",
            correctIndex: 0,
            answerKey: "Halting Problem (Turing)",
            marks: 1,
            category: "topic"
          },
          {
            id: "cs11-ch3-t3.3-m3",
            question: "Problems that can theoretically be solved by an algorithm, but require exponential or factorial time (e.g. O(2^n)), making them practically impossible for large n, are:",
            options: [
              "Intractable Problems",
              "Tractable Problems",
              "Unsolvable Problems",
              "Linear Problems"
            ],
            answer: "(a)",
            correctIndex: 0,
            answerKey: "Intractable Problems",
            marks: 1,
            category: "topic"
          },
          {
            id: "cs11-ch3-t3.3-m4",
            question: "The computational complexity class \"P\" consists of all decision problems that can be solved by a deterministic algorithm in:",
            options: [
              "Polynomial time O(n^k)",
              "Exponential time O(k^n)",
              "Factorial time O(n!)",
              "Infinite time"
            ],
            answer: "(a)",
            correctIndex: 0,
            answerKey: "Polynomial time O(n^k)",
            marks: 1,
            category: "topic"
          }
        ],
        shortQuestions: [
          {
            id: "cs11-ch3-t3.3-sq8",
            question: "Differentiate between Solvable and Unsolvable problems in computer science.",
            marks: 2,
            category: "topic"
          },
          {
            id: "cs11-ch3-t3.3-sq9",
            question: "Briefly explain Turing's Halting Problem and why it is undecidable.",
            marks: 2,
            category: "topic"
          },
          {
            id: "cs11-ch3-t3.3-sq10",
            question: "Compare Tractable and Intractable problems with suitable examples.",
            marks: 2,
            category: "topic"
          },
          {
            id: "cs11-ch3-t3.3-sq11",
            question: "Differentiate between Complexity Class P and Complexity Class NP.",
            marks: 2,
            category: "topic"
          }
        ],
        longQuestions: []
      },
      {
        id: "cs-11-ch3-topic-3.4",
        topicNumber: "3.4",
        name: "Algorithm Analysis",
        mcqs: [
          {
            id: "cs11-ch3-t3.4-m1",
            question: "Which asymptotic notation represents the upper bound (worst-case scenario) of an algorithm's running time?",
            options: ["Big-O (O)", "Big-Omega (Ω)", "Big-Theta (Θ)", "Little-o"],
            answer: "(a)",
            correctIndex: 0,
            answerKey: "Big-O (O)",
            marks: 1,
            category: "topic"
          },
          {
            id: "cs11-ch3-t3.4-m2",
            question: "The time complexity of Binary Search on a sorted array of n elements is:",
            options: ["O(log n)", "O(n)", "O(n log n)", "O(1)"],
            answer: "(a)",
            correctIndex: 0,
            answerKey: "O(log n)",
            marks: 1,
            category: "topic"
          },
          {
            id: "cs11-ch3-t3.4-m3",
            question: "If an algorithm's running time doubles each time the input size increases by 1, its time complexity is:",
            options: ["Exponential O(2^n)", "Quadratic O(n^2)", "Linear O(n)", "Logarithmic O(log n)"],
            answer: "(a)",
            correctIndex: 0,
            answerKey: "Exponential O(2^n)",
            marks: 1,
            category: "topic"
          }
        ],
        shortQuestions: [
          {
            id: "cs11-ch3-t3.4-sq12",
            question: "Define Time Complexity and Space Complexity of an algorithm.",
            marks: 2,
            category: "topic"
          },
          {
            id: "cs11-ch3-t3.4-sq13",
            question: "Explain Big-O notation and why constants and lower-order terms are ignored.",
            marks: 2,
            category: "topic"
          },
          {
            id: "cs11-ch3-t3.4-sq14",
            question: "Differentiate between Worst-case, Best-case, and Average-case time complexities.",
            marks: 2,
            category: "topic"
          }
        ],
        longQuestions: []
      },
      {
        id: "cs-11-ch3-topic-3.5",
        topicNumber: "3.5",
        name: "Algorithm Design Techniques",
        mcqs: [
          {
            id: "cs11-ch3-t3.5-m1",
            question: "The algorithm design paradigm that divides a problem into subproblems, solves them recursively, and combines results is:",
            options: ["Divide and Conquer", "Greedy Method", "Brute Force", "Backtracking"],
            answer: "(a)",
            correctIndex: 0,
            answerKey: "Divide and Conquer",
            marks: 1,
            category: "topic"
          },
          {
            id: "cs11-ch3-t3.5-m2",
            question: "An algorithmic approach that makes the locally optimal choice at each step hoping for a global optimum is called:",
            options: ["Greedy Algorithm", "Dynamic Programming", "Generate-and-Test", "Exhaustive Search"],
            answer: "(a)",
            correctIndex: 0,
            answerKey: "Greedy Algorithm",
            marks: 1,
            category: "topic"
          }
        ],
        shortQuestions: [
          {
            id: "cs11-ch3-t3.5-sq15",
            question: "Explain the three phases of the Divide-and-Conquer strategy.",
            marks: 2,
            category: "topic"
          },
          {
            id: "cs11-ch3-t3.5-sq16",
            question: "How do Greedy Algorithms work? Mention one limitation of this approach.",
            marks: 2,
            category: "topic"
          },
          {
            id: "cs11-ch3-t3.5-sq17",
            question: "Define Dynamic Programming and explain how it differs from Divide and Conquer.",
            marks: 2,
            category: "topic"
          }
        ],
        longQuestions: []
      },
      {
        id: "cs-11-ch3-topic-3.6",
        topicNumber: "3.6",
        name: "Commonly Used Algorithms & Graph Traversal",
        mcqs: [
          {
            id: "cs11-ch3-t3.6-m1",
            question: "Which sorting algorithm repeatedly steps through the list, compares adjacent items, and swaps them if in wrong order?",
            options: ["Bubble Sort", "Selection Sort", "Insertion Sort", "Quick Sort"],
            answer: "(a)",
            correctIndex: 0,
            answerKey: "Bubble Sort",
            marks: 1,
            category: "topic"
          },
          {
            id: "cs11-ch3-t3.6-m2",
            question: "The worst-case time complexity of Bubble Sort on an array of size n is:",
            options: ["O(n^2)", "O(n log n)", "O(n)", "O(log n)"],
            answer: "(a)",
            correctIndex: 0,
            answerKey: "O(n^2)",
            marks: 1,
            category: "topic"
          },
          {
            id: "cs11-ch3-t3.6-m3",
            question: "Which graph traversal algorithm uses a Queue data structure to explore nodes level-by-level?",
            options: [
              "Breadth-First Search (BFS)",
              "Depth-First Search (DFS)",
              "Binary Search",
              "Dijkstra's Algorithm"
            ],
            answer: "(a)",
            correctIndex: 0,
            answerKey: "Breadth-First Search (BFS)",
            marks: 1,
            category: "topic"
          }
        ],
        shortQuestions: [
          {
            id: "cs11-ch3-t3.6-sq18",
            question: "Explain the working of Bubble Sort with a short example.",
            marks: 2,
            category: "topic"
          },
          {
            id: "cs11-ch3-t3.6-sq19",
            question: "Compare Breadth-First Search (BFS) and Depth-First Search (DFS).",
            marks: 2,
            category: "topic"
          }
        ],
        longQuestions: []
      }
    ]
  },

  // =========================================================================
  // UNIT 4: COMPUTATIONAL STRUCTURES
  // =========================================================================
  {
    id: "cs-11-ch4",
    chapterNumber: 4,
    name: "Computational Structures",
    topics: [
      {
        id: "cs-11-ch4-topic-4.1",
        topicNumber: "4.1",
        name: "Lists & Primitive Computational Structures",
        mcqs: [
          {
            id: "cs11-ch4-t4.1-m1",
            question: "In Python, lists are classified as data structures that are:",
            options: ["Mutable and ordered", "Immutable and ordered", "Mutable and unordered", "Immutable and unordered"],
            answer: "(a)",
            correctIndex: 0,
            answerKey: "Mutable and ordered",
            marks: 1,
            category: "topic"
          },
          {
            id: "cs11-ch4-t4.1-m2",
            question: "When two variables reference the exact same list object in memory, this situation is termed:",
            options: ["Aliasing", "Cloning", "Slicing", "Deep Copying"],
            answer: "(a)",
            correctIndex: 0,
            answerKey: "Aliasing",
            marks: 1,
            category: "topic"
          }
        ],
        shortQuestions: [
          {
            id: "cs11-ch4-t4.1-sq1",
            question: "Define a computational structure and explain the difference between primitive and non-primitive structures.",
            marks: 2,
            category: "topic"
          },
          {
            id: "cs11-ch4-t4.1-sq2",
            question: "Explain Aliasing in Python lists and how it differs from Cloning using slice [:] or copy().",
            marks: 2,
            category: "topic"
          }
        ],
        longQuestions: []
      },
      {
        id: "cs-11-ch4-topic-4.2",
        topicNumber: "4.2",
        name: "Stack Operations & LIFO",
        mcqs: [
          {
            id: "cs11-ch4-t4.2-m1",
            question: "Which data structure operates strictly on the Last-In, First-Out (LIFO) principle?",
            options: ["Stack", "Queue", "Tree", "Graph"],
            answer: "(a)",
            correctIndex: 0,
            answerKey: "Stack",
            marks: 1,
            category: "topic"
          },
          {
            id: "cs11-ch4-t4.2-m2",
            question: "The operation that checks the value at the top of a stack without removing it is:",
            options: ["Peek / Top", "Pop", "Push", "Enqueue"],
            answer: "(a)",
            correctIndex: 0,
            answerKey: "Peek / Top",
            marks: 1,
            category: "topic"
          }
        ],
        shortQuestions: [
          {
            id: "cs11-ch4-t4.2-sq3",
            question: "Define a Stack and explain its Last-In, First-Out (LIFO) principle.",
            marks: 2,
            category: "topic"
          },
          {
            id: "cs11-ch4-t4.2-sq4",
            question: "Describe Push, Pop, and Peek operations on a stack with Python examples.",
            marks: 2,
            category: "topic"
          }
        ],
        longQuestions: []
      },
      {
        id: "cs-11-ch4-topic-4.3",
        topicNumber: "4.3",
        name: "Queue Operations & FIFO",
        mcqs: [
          {
            id: "cs11-ch4-t4.3-m1",
            question: "Which data structure operates on the First-In, First-Out (FIFO) principle?",
            options: ["Queue", "Stack", "Binary Tree", "Graph"],
            answer: "(a)",
            correctIndex: 0,
            answerKey: "Queue",
            marks: 1,
            category: "topic"
          },
          {
            id: "cs11-ch4-t4.3-m2",
            question: "Removing an element from the front of a queue is called:",
            options: ["Dequeue", "Enqueue", "Pop", "Peek"],
            answer: "(a)",
            correctIndex: 0,
            answerKey: "Dequeue",
            marks: 1,
            category: "topic"
          }
        ],
        shortQuestions: [
          {
            id: "cs11-ch4-t4.3-sq5",
            question: "Define a Queue and explain its First-In, First-Out (FIFO) principle.",
            marks: 2,
            category: "topic"
          },
          {
            id: "cs11-ch4-t4.3-sq6",
            question: "Differentiate between Enqueue and Dequeue operations of a queue.",
            marks: 2,
            category: "topic"
          }
        ],
        longQuestions: []
      },
      {
        id: "cs-11-ch4-topic-4.4",
        topicNumber: "4.4",
        name: "Trees & Graphs",
        mcqs: [
          {
            id: "cs11-ch4-t4.4-m1",
            question: "In a tree data structure, the topmost node that has no parent is called the:",
            options: ["Root node", "Leaf node", "Child node", "Subtree"],
            answer: "(a)",
            correctIndex: 0,
            answerKey: "Root node",
            marks: 1,
            category: "topic"
          },
          {
            id: "cs11-ch4-t4.4-m2",
            question: "A non-linear computational structure consisting of vertices (nodes) connected by edges is a:",
            options: ["Graph", "Linear Array", "Queue", "Stack"],
            answer: "(a)",
            correctIndex: 0,
            answerKey: "Graph",
            marks: 1,
            category: "topic"
          }
        ],
        shortQuestions: [
          {
            id: "cs11-ch4-t4.4-sq7",
            question: "Define a Tree data structure and define Root, Leaf, Height, and Depth.",
            marks: 2,
            category: "topic"
          },
          {
            id: "cs11-ch4-t4.4-sq8",
            question: "Explain Graph representations: Adjacency Matrix vs Adjacency List.",
            marks: 2,
            category: "topic"
          }
        ],
        longQuestions: []
      }
    ]
  },

  // =========================================================================
  // UNIT 5: DATA ANALYTICS
  // =========================================================================
  {
    id: "cs-11-ch5",
    chapterNumber: 5,
    name: "Data Analytics",
    topics: [
      {
        id: "cs-11-ch5-topic-5.1",
        topicNumber: "5.1",
        name: "Basic Statistical Concepts",
        mcqs: [
          {
            id: "cs11-ch5-t5.1-m1",
            question: "The measure of central tendency that represents the middle value in a sorted dataset is the:",
            options: ["Mean", "Median", "Mode", "Standard Deviation"],
            answer: "(b)",
            correctIndex: 1,
            answerKey: "Median",
            marks: 1,
            category: "topic"
          },
          {
            id: "cs11-ch5-t5.1-m2",
            question: "How is Standard Deviation calculated in relation to Variance?",
            options: ["Square root of variance", "Square of variance", "Double the variance", "Variance divided by mean"],
            answer: "(a)",
            correctIndex: 0,
            answerKey: "Square root of variance",
            marks: 1,
            category: "topic"
          }
        ],
        shortQuestions: [
          {
            id: "cs11-ch5-t5.1-sq1",
            question: "Differentiate between Mean, Median, and Mode with simple examples.",
            marks: 2,
            category: "topic"
          },
          {
            id: "cs11-ch5-t5.1-sq2",
            question: "Define Variance and Standard Deviation and explain why dispersion measures are important.",
            marks: 2,
            category: "topic"
          }
        ],
        longQuestions: []
      },
      {
        id: "cs-11-ch5-topic-5.2",
        topicNumber: "5.2",
        name: "Data Collection, Preparation & Experiments",
        mcqs: [
          {
            id: "cs11-ch5-t5.2-m1",
            question: "The data cleaning technique where a missing numerical value is replaced with the mean or median is called:",
            options: ["Imputation", "Normalization", "Binarization", "Standardization"],
            answer: "(a)",
            correctIndex: 0,
            answerKey: "Imputation",
            marks: 1,
            category: "topic"
          }
        ],
        shortQuestions: [
          {
            id: "cs11-ch5-t5.2-sq3",
            question: "Compare Surveys, Observations, and Experiments as data collection methodologies.",
            marks: 2,
            category: "topic"
          },
          {
            id: "cs11-ch5-t5.2-sq4",
            question: "Explain three main strategies for handling missing values during data preparation.",
            marks: 2,
            category: "topic"
          }
        ],
        longQuestions: []
      },
      {
        id: "cs-11-ch5-topic-5.3",
        topicNumber: "5.3",
        name: "Building Statistical Models",
        mcqs: [
          {
            id: "cs11-ch5-t5.3-m1",
            question: "In the simple linear regression formula y = mx + c, the symbol m represents the:",
            options: ["Slope of the regression line", "Y-intercept", "Error term", "Mean of x"],
            answer: "(a)",
            correctIndex: 0,
            answerKey: "Slope of the regression line",
            marks: 1,
            category: "topic"
          },
          {
            id: "cs11-ch5-t5.3-m2",
            question: "Which statistical modeling technique is most appropriate for predicting binary categorical outcomes (e.g. Yes/No)?",
            options: ["Logistic Regression", "Linear Regression", "Polynomial Regression", "K-Means Clustering"],
            answer: "(a)",
            correctIndex: 0,
            answerKey: "Logistic Regression",
            marks: 1,
            category: "topic"
          },
          {
            id: "cs11-ch5-t5.3-m3",
            question: "K-means clustering is an unsupervised learning algorithm designed to partition data into K clusters based on:",
            options: ["Centroid distance / similarity", "Regression coefficients", "Predefined category labels", "Hypothesis p-values"],
            answer: "(a)",
            correctIndex: 0,
            answerKey: "Centroid distance / similarity",
            marks: 1,
            category: "topic"
          }
        ],
        shortQuestions: [
          {
            id: "cs11-ch5-t5.3-sq5",
            question: "State the 5 basic steps involved in developing a statistical model.",
            marks: 2,
            category: "topic"
          },
          {
            id: "cs11-ch5-t5.3-sq6",
            question: "Explain the Simple Linear Regression formula y = mx + c and describe slope and intercept.",
            marks: 2,
            category: "topic"
          },
          {
            id: "cs11-ch5-t5.3-sq7",
            question: "What is K-Means Clustering, and how does the centroid update mechanism function?",
            marks: 2,
            category: "topic"
          }
        ],
        longQuestions: []
      },
      {
        id: "cs-11-ch5-topic-5.4",
        topicNumber: "5.4",
        name: "Introduction to Data Visualization",
        mcqs: [
          {
            id: "cs11-ch5-t5.4-m1",
            question: "Which type of data visualization is specifically suited for showing continuous trends over time?",
            options: ["Line Graph", "Scatter Plot", "Pie Chart", "Heatmap"],
            answer: "(a)",
            correctIndex: 0,
            answerKey: "Line Graph",
            marks: 1,
            category: "topic"
          },
          {
            id: "cs11-ch5-t5.4-m2",
            question: "Which plot summarizes data distribution through five summary numbers (Min, Q1, Median, Q3, Max)?",
            options: ["Boxplot (Whisker plot)", "Histogram", "Bar Chart", "Scatter Plot"],
            answer: "(a)",
            correctIndex: 0,
            answerKey: "Boxplot (Whisker plot)",
            marks: 1,
            category: "topic"
          }
        ],
        shortQuestions: [
          {
            id: "cs11-ch5-t5.4-sq8",
            question: "Compare Bar Charts, Line Graphs, and Histograms regarding their visual analysis purposes.",
            marks: 2,
            category: "topic"
          },
          {
            id: "cs11-ch5-t5.4-sq9",
            question: "Explain how a Boxplot (Whisker plot) summarizes data distribution using quartiles and median.",
            marks: 2,
            category: "topic"
          }
        ],
        longQuestions: []
      },
      {
        id: "cs-11-ch5-topic-5.5",
        topicNumber: "5.5",
        name: "Tools for Data Visualization",
        mcqs: [],
        shortQuestions: [
          {
            id: "cs11-ch5-t5.5-sq1",
            question: "Name two modern tools or Python libraries used for creating data visualizations.",
            marks: 2,
            category: "topic"
          }
        ],
        longQuestions: []
      }
    ]
  },

  // =========================================================================
  // UNIT 6: EMERGING TECHNOLOGIES
  // =========================================================================
  {
    id: "cs-11-ch6",
    chapterNumber: 6,
    name: "Emerging Technologies",
    topics: [
      {
        id: "cs-11-ch6-topic-6.1",
        topicNumber: "6.1",
        name: "Introduction to Emerging Technologies & Virtualization",
        mcqs: [
          {
            id: "cs11-ch6-t6.1-m1",
            question: "Which technology allows a single physical computer to act as multiple independent virtual machines running their own operating systems?",
            options: ["Virtualization", "Containerization", "Quantum Tunneling", "Edge Routing"],
            answer: "(a)",
            correctIndex: 0,
            answerKey: "Virtualization",
            marks: 1,
            category: "topic"
          }
        ],
        shortQuestions: [
          {
            id: "cs11-ch6-t6.1-sq1",
            question: "Define Virtualization and explain how it helps maximize hardware resource utilization.",
            marks: 2,
            category: "topic"
          }
        ],
        longQuestions: []
      },
      {
        id: "cs-11-ch6-topic-6.2",
        topicNumber: "6.2",
        name: "Cloud Computing & Deployment Models",
        mcqs: [
          {
            id: "cs11-ch6-t6.2-m1",
            question: "The cloud computing characteristic that refers to the system's ability to automatically scale resources up or down based on real-time demand is:",
            options: ["Elasticity", "Virtualization", "Multi-Tenancy", "On-Demand Access"],
            answer: "(a)",
            correctIndex: 0,
            answerKey: "Elasticity",
            marks: 1,
            category: "topic"
          },
          {
            id: "cs11-ch6-t6.2-m2",
            question: "Google Workspace (Gmail, Google Docs) and Microsoft Office 365 are examples of which cloud service model?",
            options: ["Software as a Service (SaaS)", "Platform as a Service (PaaS)", "Infrastructure as a Service (IaaS)", "Data as a Service (DaaS)"],
            answer: "(a)",
            correctIndex: 0,
            answerKey: "Software as a Service (SaaS)",
            marks: 1,
            category: "topic"
          }
        ],
        shortQuestions: [
          {
            id: "cs11-ch6-t6.2-sq2",
            question: "Differentiate between Scalability and Elasticity in cloud computing environments.",
            marks: 2,
            category: "topic"
          },
          {
            id: "cs11-ch6-t6.2-sq3",
            question: "Compare the three cloud service models: IaaS, PaaS, and SaaS with examples.",
            marks: 2,
            category: "topic"
          },
          {
            id: "cs11-ch6-t6.2-sq4",
            question: "Compare Public, Private, Hybrid, and Community cloud deployment models.",
            marks: 2,
            category: "topic"
          }
        ],
        longQuestions: []
      },
      {
        id: "cs-11-ch6-topic-6.3",
        topicNumber: "6.3",
        name: "Cloud Architecture & Scalability",
        mcqs: [],
        shortQuestions: [
          {
            id: "cs11-ch6-t6.3-sq1",
            question: "List three major business advantages of adopting cloud infrastructure.",
            marks: 2,
            category: "topic"
          }
        ],
        longQuestions: []
      },
      {
        id: "cs-11-ch6-topic-6.4",
        topicNumber: "6.4",
        name: "Blockchain Technology, P2P Networks & Smart Contracts",
        mcqs: [
          {
            id: "cs11-ch6-t6.4-m1",
            question: "What property of Blockchain ensures that recorded transaction blocks cannot be altered or deleted retroactively?",
            options: ["Immutability", "Centralization", "Ephemeral Storage", "Anonymity"],
            answer: "(a)",
            correctIndex: 0,
            answerKey: "Immutability",
            marks: 1,
            category: "topic"
          },
          {
            id: "cs11-ch6-t6.4-m2",
            question: "Automated digital agreements written in code that execute immediately when predetermined conditions are met are:",
            options: ["Smart Contracts", "Legal Writs", "Block Hashes", "Merkle Trees"],
            answer: "(a)",
            correctIndex: 0,
            answerKey: "Smart Contracts",
            marks: 1,
            category: "topic"
          }
        ],
        shortQuestions: [
          {
            id: "cs11-ch6-t6.4-sq5",
            question: "Define Blockchain and explain its three core elements: Decentralization, Distributed Ledger, and Cryptography.",
            marks: 2,
            category: "topic"
          },
          {
            id: "cs11-ch6-t6.4-sq6",
            question: "Explain the roles of Nodes, Ledgers, Blocks, and Nonce in a Blockchain network.",
            marks: 2,
            category: "topic"
          },
          {
            id: "cs11-ch6-t6.4-sq7",
            question: "What are Smart Contracts, and how do they automate transactions without intermediaries?",
            marks: 2,
            category: "topic"
          }
        ],
        longQuestions: []
      },
      {
        id: "cs-11-ch6-topic-6.5",
        topicNumber: "6.5",
        name: "Cryptocurrencies & Distributed Ledgers",
        mcqs: [],
        shortQuestions: [
          {
            id: "cs11-ch6-t6.5-sq1",
            question: "Explain how distributed ledgers differ from centralized relational databases.",
            marks: 2,
            category: "topic"
          }
        ],
        longQuestions: []
      },
      {
        id: "cs-11-ch6-topic-6.6",
        topicNumber: "6.6",
        name: "Edge Computing & Serverless Architecture",
        mcqs: [
          {
            id: "cs11-ch6-t6.6-m1",
            question: "Which computing architecture processes data closer to the source device (e.g. IoT sensors) to eliminate latency?",
            options: ["Edge Computing", "Mainframe Computing", "Centralized Data Warehousing", "Batch Processing"],
            answer: "(a)",
            correctIndex: 0,
            answerKey: "Edge Computing",
            marks: 1,
            category: "topic"
          },
          {
            id: "cs11-ch6-t6.6-m2",
            question: "In a Serverless Architecture (e.g., AWS Lambda), developers are charged based on:",
            options: [
              "Exact execution time and resources used per request",
              "A fixed monthly server leasing rate",
              "Number of virtual CPU cores allocated 24/7",
              "Physical rack installation fees"
            ],
            answer: "(a)",
            correctIndex: 0,
            answerKey: "Exact execution time and resources used per request",
            marks: 1,
            category: "topic"
          }
        ],
        shortQuestions: [
          {
            id: "cs11-ch6-t6.6-sq8",
            question: "Define Edge Computing and explain how it solves bandwidth and latency challenges.",
            marks: 2,
            category: "topic"
          },
          {
            id: "cs11-ch6-t6.6-sq9",
            question: "Explain Serverless Architecture and describe Function-as-a-Service (FaaS).",
            marks: 2,
            category: "topic"
          }
        ],
        longQuestions: []
      }
    ]
  },

  // =========================================================================
  // UNIT 7: LEGAL AND ETHICAL ASPECTS OF COMPUTING SYSTEM
  // =========================================================================
  {
    id: "cs-11-ch7",
    chapterNumber: 7,
    name: "Legal and Ethical Aspects of Computing System",
    topics: [
      {
        id: "cs-11-ch7-topic-7.1",
        topicNumber: "7.1",
        name: "Terms of Use & Common Clauses",
        mcqs: [],
        shortQuestions: [
          {
            id: "cs11-ch7-t7.1-sq1",
            question: "Define Terms of Use and list two common clauses usually found in these agreements.",
            marks: 2,
            category: "topic"
          },
          {
            id: "cs11-ch7-t7.1-sq2",
            question: "Explain the purpose of the \"Limitation of Liability\" clause for online service providers.",
            marks: 2,
            category: "topic"
          }
        ],
        longQuestions: []
      },
      {
        id: "cs-11-ch7-topic-7.2",
        topicNumber: "7.2",
        name: "Security Threats & Harmful Software",
        mcqs: [
          {
            id: "cs11-ch7-t7.2-m1",
            question: "Small files placed on a user's device by websites to remember login details and preferences are called:",
            options: ["Cookies", "Spyware", "Spam", "Malware"],
            answer: "(a)",
            correctIndex: 0,
            answerKey: "Cookies",
            marks: 1,
            category: "topic"
          },
          {
            id: "cs11-ch7-t7.2-m2",
            question: "A cyber attack where users are redirected to a fake counterfeit website without their knowledge is called:",
            options: ["Pharming", "Phishing", "Spamming", "Adware"],
            answer: "(a)",
            correctIndex: 0,
            answerKey: "Pharming",
            marks: 1,
            category: "topic"
          }
        ],
        shortQuestions: [
          {
            id: "cs11-ch7-t7.2-sq3",
            question: "Differentiate between Spam and Spyware as digital security threats.",
            marks: 2,
            category: "topic"
          },
          {
            id: "cs11-ch7-t7.2-sq4",
            question: "What are Cookies, and why is Cookie Management essential for online privacy?",
            marks: 2,
            category: "topic"
          }
        ],
        longQuestions: []
      },
      {
        id: "cs-11-ch7-topic-7.3",
        topicNumber: "7.3",
        name: "Digital Divide & Educational Inequality",
        mcqs: [
          {
            id: "cs11-ch7-t7.3-m1",
            question: "The gap between individuals and communities who have access to modern ICT and those who do not is the:",
            options: ["Digital Divide", "Digital Footprint", "Digital Citizenship", "Cyber Boundary"],
            answer: "(a)",
            correctIndex: 0,
            answerKey: "Digital Divide",
            marks: 1,
            category: "topic"
          }
        ],
        shortQuestions: [
          {
            id: "cs11-ch7-t7.3-sq5",
            question: "Define the Digital Divide and list four factors (e.g. income, location) that cause it.",
            marks: 2,
            category: "topic"
          },
          {
            id: "cs11-ch7-t7.3-sq6",
            question: "Discuss the educational and economic impacts of the digital divide on developing societies.",
            marks: 2,
            category: "topic"
          }
        ],
        longQuestions: []
      },
      {
        id: "cs-11-ch7-topic-7.4",
        topicNumber: "7.4",
        name: "Positive Societal Impacts of Computing Systems",
        mcqs: [],
        shortQuestions: [
          {
            id: "cs11-ch7-t7.4-sq1",
            question: "Describe three positive impacts of modern computing systems on global communication and healthcare.",
            marks: 2,
            category: "topic"
          }
        ],
        longQuestions: []
      },
      {
        id: "cs-11-ch7-topic-7.5",
        topicNumber: "7.5",
        name: "Responsible Digital Behavior & Ethical Use of Information",
        mcqs: [
          {
            id: "cs11-ch7-t7.5-m1",
            question: "Using someone else's ideas, text, or code without proper citation and claiming it as one's own is:",
            options: ["Plagiarism", "Fair Use", "Open Source Collaboration", "Indexing"],
            answer: "(a)",
            correctIndex: 0,
            answerKey: "Plagiarism",
            marks: 1,
            category: "topic"
          },
          {
            id: "cs11-ch7-t7.5-m2",
            question: "In Pakistan, cybersecurity awareness and cybercrime reporting are officially managed by:",
            options: ["NR3C (FIA)", "PTCL", "NADRA", "HEC"],
            answer: "(a)",
            correctIndex: 0,
            answerKey: "NR3C (FIA)",
            marks: 1,
            category: "topic"
          }
        ],
        shortQuestions: [
          {
            id: "cs11-ch7-t7.5-sq7",
            question: "Define Digital Citizenship and state two essential responsibilities of a good digital citizen.",
            marks: 2,
            category: "topic"
          },
          {
            id: "cs11-ch7-t7.5-sq8",
            question: "Differentiate between Copyright Infringement and Plagiarism.",
            marks: 2,
            category: "topic"
          }
        ],
        longQuestions: []
      }
    ]
  },

  // =========================================================================
  // UNIT 8: ONLINE RESEARCH AND DIGITAL LITERACY
  // =========================================================================
  {
    id: "cs-11-ch8",
    chapterNumber: 8,
    name: "Online Research and Digital Literacy",
    topics: [
      {
        id: "cs-11-ch8-topic-8.1",
        topicNumber: "8.1",
        name: "Digital Literacy & Evaluating Online Sources",
        mcqs: [
          {
            id: "cs11-ch8-t8.1-m1",
            question: "Articles published in academic journals after being critically vetted by fellow domain experts are:",
            options: ["Peer-reviewed articles", "Editorial blogs", "Press releases", "White papers"],
            answer: "(a)",
            correctIndex: 0,
            answerKey: "Peer-reviewed articles",
            marks: 1,
            category: "topic"
          }
        ],
        shortQuestions: [
          {
            id: "cs11-ch8-t8.1-sq1",
            question: "Differentiate between General Information Research, Academic Research, and Market Research.",
            marks: 2,
            category: "topic"
          },
          {
            id: "cs11-ch8-t8.1-sq2",
            question: "Define Digital Literacy and list its key components.",
            marks: 2,
            category: "topic"
          }
        ],
        longQuestions: []
      },
      {
        id: "cs-11-ch8-topic-8.2",
        topicNumber: "8.2",
        name: "Effective Navigation, Online Libraries & Boolean Operators",
        mcqs: [
          {
            id: "cs11-ch8-t8.2-m1",
            question: "Which Boolean search operator is used in search engines to combine terms so that BOTH must be present?",
            options: ["AND", "OR", "NOT", "NEAR"],
            answer: "(a)",
            correctIndex: 0,
            answerKey: "AND",
            marks: 1,
            category: "topic"
          }
        ],
        shortQuestions: [
          {
            id: "cs11-ch8-t8.2-sq3",
            question: "What is a Peer-Reviewed Article, and why is it considered a highly credible academic source?",
            marks: 2,
            category: "topic"
          },
          {
            id: "cs11-ch8-t8.2-sq4",
            question: "How do Boolean search operators (AND, OR, NOT) help refine online search queries?",
            marks: 2,
            category: "topic"
          }
        ],
        longQuestions: []
      },
      {
        id: "cs-11-ch8-topic-8.3",
        topicNumber: "8.3",
        name: "Key Principles of Research Ethics & Integrity",
        mcqs: [
          {
            id: "cs11-ch8-t8.3-m1",
            question: "Obtaining explicit permission from study participants after informing them about the study's purpose is known as:",
            options: ["Informed Consent", "Confidentiality", "Integrity", "Copyright"],
            answer: "(a)",
            correctIndex: 0,
            answerKey: "Informed Consent",
            marks: 1,
            category: "topic"
          }
        ],
        shortQuestions: [
          {
            id: "cs11-ch8-t8.3-sq5",
            question: "Explain the principles of Informed Consent and Confidentiality in research ethics.",
            marks: 2,
            category: "topic"
          },
          {
            id: "cs11-ch8-t8.3-sq6",
            question: "What is Integrity in academic research, and why must data falsification be avoided?",
            marks: 2,
            category: "topic"
          }
        ],
        longQuestions: []
      },
      {
        id: "cs-11-ch8-topic-8.4",
        topicNumber: "8.4",
        name: "Types of Intellectual Property",
        mcqs: [
          {
            id: "cs11-ch8-t8.4-m1",
            question: "An exclusive legal right granted for a new invention or technical solution that prevents others from making or selling it is a:",
            options: ["Patent", "Trademark", "Copyright", "Industrial Design"],
            answer: "(a)",
            correctIndex: 0,
            answerKey: "Patent",
            marks: 1,
            category: "topic"
          },
          {
            id: "cs11-ch8-t8.4-m2",
            question: "Which form of intellectual property protects brand logos, names, and slogans?",
            options: ["Trademark", "Patent", "Trade Secret", "Copyright"],
            answer: "(a)",
            correctIndex: 0,
            answerKey: "Trademark",
            marks: 1,
            category: "topic"
          },
          {
            id: "cs11-ch8-t8.4-m3",
            question: "In Pakistan, the official government organization responsible for registering and protecting intellectual property rights is:",
            options: ["IPO Pakistan", "SECP", "FBR", "HEC"],
            answer: "(a)",
            correctIndex: 0,
            answerKey: "IPO Pakistan",
            marks: 1,
            category: "topic"
          }
        ],
        shortQuestions: [
          {
            id: "cs11-ch8-t8.4-sq7",
            question: "Define Intellectual Property (IP) and explain its importance for innovators.",
            marks: 2,
            category: "topic"
          },
          {
            id: "cs11-ch8-t8.4-sq8",
            question: "Differentiate between a Patent, a Trademark, a Copyright, and a Trade Secret with examples.",
            marks: 2,
            category: "topic"
          },
          {
            id: "cs11-ch8-t8.4-sq9",
            question: "What is the role of IPO Pakistan in protecting intellectual property rights?",
            marks: 2,
            category: "topic"
          }
        ],
        longQuestions: []
      }
    ]
  },

  // =========================================================================
  // UNIT 9: ENTREPRENEURSHIP IN DIGITAL AGE
  // =========================================================================
  {
    id: "cs-11-ch9",
    chapterNumber: 9,
    name: "Entrepreneurship in Digital Age",
    topics: [
      {
        id: "cs-11-ch9-topic-9.1",
        topicNumber: "9.1",
        name: "Design Thinking and Business Solutions",
        mcqs: [
          {
            id: "cs11-ch9-t9.1-m1",
            question: "What is the correct sequence of the 5 key stages in Design Thinking?",
            options: [
              "Empathize -> Define -> Ideate -> Prototype -> Test",
              "Define -> Ideate -> Empathize -> Test -> Prototype",
              "Ideate -> Empathize -> Prototype -> Define -> Test",
              "Empathize -> Prototype -> Define -> Ideate -> Test"
            ],
            answer: "(a)",
            correctIndex: 0,
            answerKey: "Empathize -> Define -> Ideate -> Prototype -> Test",
            marks: 1,
            category: "topic"
          },
          {
            id: "cs11-ch9-t9.1-m2",
            question: "In Design Thinking, creating a simple, quick experimental version of a product to validate ideas is:",
            options: ["Prototyping", "Ideation", "Empathizing", "Pitching"],
            answer: "(a)",
            correctIndex: 0,
            answerKey: "Prototyping",
            marks: 1,
            category: "topic"
          }
        ],
        shortQuestions: [
          {
            id: "cs11-ch9-t9.1-sq1",
            question: "Define Design Thinking and list its 5 key stages.",
            marks: 2,
            category: "topic"
          },
          {
            id: "cs11-ch9-t9.1-sq2",
            question: "What is a Prototype, and why is prototyping essential before full production?",
            marks: 2,
            category: "topic"
          }
        ],
        longQuestions: []
      },
      {
        id: "cs-11-ch9-topic-9.2",
        topicNumber: "9.2",
        name: "Creating a Business Plan",
        mcqs: [
          {
            id: "cs11-ch9-t9.2-m1",
            question: "Which section of a business plan provides an initial high-level snapshot of the entire business concept?",
            options: ["Executive Summary", "Financial Plan", "Marketing Strategy", "Appendix"],
            answer: "(a)",
            correctIndex: 0,
            answerKey: "Executive Summary",
            marks: 1,
            category: "topic"
          }
        ],
        shortQuestions: [
          {
            id: "cs11-ch9-t9.2-sq3",
            question: "What is a Business Plan, and why is the Executive Summary section considered its most critical part?",
            marks: 2,
            category: "topic"
          },
          {
            id: "cs11-ch9-t9.2-sq4",
            question: "List six key sections that must be included in a standard business plan.",
            marks: 2,
            category: "topic"
          }
        ],
        longQuestions: []
      },
      {
        id: "cs-11-ch9-topic-9.3",
        topicNumber: "9.3",
        name: "Collecting Market Insights & Business Pitch",
        mcqs: [
          {
            id: "cs11-ch9-t9.3-m1",
            question: "Research that focuses on understanding user motivations, feelings, and subjective feedback is:",
            options: ["Qualitative Research", "Quantitative Research", "Secondary Research", "Statistical Modeling"],
            answer: "(a)",
            correctIndex: 0,
            answerKey: "Qualitative Research",
            marks: 1,
            category: "topic"
          },
          {
            id: "cs11-ch9-t9.3-m2",
            question: "Dividing a large target market into smaller groups of consumers with shared characteristics is called:",
            options: ["Market Segmentation", "Product Diversification", "Benchmarking", "Market Penetration"],
            answer: "(a)",
            correctIndex: 0,
            answerKey: "Market Segmentation",
            marks: 1,
            category: "topic"
          }
        ],
        shortQuestions: [
          {
            id: "cs11-ch9-t9.3-sq5",
            question: "Differentiate between Qualitative Research and Quantitative Research in market analysis.",
            marks: 2,
            category: "topic"
          },
          {
            id: "cs11-ch9-t9.3-sq6",
            question: "Define Market Segmentation and explain how it helps businesses target specific customer groups.",
            marks: 2,
            category: "topic"
          },
          {
            id: "cs11-ch9-t9.3-sq7",
            question: "What is a Business Pitch, and what key points should be communicated to investors?",
            marks: 2,
            category: "topic"
          }
        ],
        longQuestions: []
      },
      {
        id: "cs-11-ch9-topic-9.4",
        topicNumber: "9.4",
        name: "Developing Effective Marketing and Sales Strategies",
        mcqs: [],
        shortQuestions: [
          {
            id: "cs11-ch9-t9.4-sq1",
            question: "Explain the role of brand identity in developing an effective marketing strategy.",
            marks: 2,
            category: "topic"
          }
        ],
        longQuestions: []
      },
      {
        id: "cs-11-ch9-topic-9.5",
        topicNumber: "9.5",
        name: "Financial Concepts for Business",
        mcqs: [
          {
            id: "cs11-ch9-t9.5-m1",
            question: "What is the basic financial formula used to calculate business Profit?",
            options: [
              "Profit = Revenue - Costs",
              "Profit = Revenue + Costs",
              "Profit = Costs / Revenue",
              "Profit = Investment * Savings"
            ],
            answer: "(a)",
            correctIndex: 0,
            answerKey: "Profit = Revenue - Costs",
            marks: 1,
            category: "topic"
          }
        ],
        shortQuestions: [
          {
            id: "cs11-ch9-t9.5-sq8",
            question: "Differentiate between Revenue, Expenses, and Profit with mathematical formulas.",
            marks: 2,
            category: "topic"
          },
          {
            id: "cs11-ch9-t9.5-sq9",
            question: "Differentiate between Investment and Savings in a business context.",
            marks: 2,
            category: "topic"
          }
        ],
        longQuestions: []
      },
      {
        id: "cs-11-ch9-topic-9.6",
        topicNumber: "9.6",
        name: "Storytelling in Business",
        mcqs: [],
        shortQuestions: [
          {
            id: "cs11-ch9-t9.6-sq1",
            question: "Why is emotional connection important in business storytelling?",
            marks: 2,
            category: "topic"
          }
        ],
        longQuestions: []
      },
      {
        id: "cs-11-ch9-topic-9.7",
        topicNumber: "9.7",
        name: "Importance of Collaboration and Iteration",
        mcqs: [
          {
            id: "cs11-ch9-t9.7-m1",
            question: "Repeating a process to make continuous improvements based on user feedback is called:",
            options: ["Iteration", "Innovation", "Collaboration", "Pitching"],
            answer: "(a)",
            correctIndex: 0,
            answerKey: "Iteration",
            marks: 1,
            category: "topic"
          }
        ],
        shortQuestions: [
          {
            id: "cs11-ch9-t9.7-sq1",
            question: "Differentiate between Collaboration and Iteration in product development.",
            marks: 2,
            category: "topic"
          }
        ],
        longQuestions: []
      },
      {
        id: "cs-11-ch9-topic-9.8",
        topicNumber: "9.8",
        name: "Innovation in Business",
        mcqs: [
          {
            id: "cs11-ch9-t9.8-m1",
            question: "Developing new ideas or significantly improving existing products and processes to create value is:",
            options: ["Innovation", "Iteration", "Benchmarking", "Budgeting"],
            answer: "(a)",
            correctIndex: 0,
            answerKey: "Innovation",
            marks: 1,
            category: "topic"
          }
        ],
        shortQuestions: [
          {
            id: "cs11-ch9-t9.8-sq1",
            question: "Differentiate between Innovation and Creativity with real-world examples.",
            marks: 2,
            category: "topic"
          }
        ],
        longQuestions: []
      }
    ]
  }
];
