/**
 * Class 11th Computer Science & Entrepreneurship
 * Units 3 to 9 - Comprehensive Question Bank
 * (Board-Style Topic-Wise MCQs, Topic-Wise Short Questions, Exercise MCQs & Exercise Short Questions)
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
            id: "cs11-ch3-m1",
            question: "The characteristic of a well-defined problem is:",
            options: [
              "Ambiguous goals and unclear requirements",
              "Vague processes and inputs",
              "Clear goals, inputs, processes, and outputs",
              "Undefined solutions"
            ],
            answer: "(c)",
            correctIndex: 2,
            answerKey: "Clear goals, inputs, processes, and outputs",
            marks: 1,
            isExercise: true,
            category: "exercise"
          }
        ],
        shortQuestions: [
          {
            id: "cs11-ch3-t3.1-sq1",
            question: "Define a computational problem and state its three core components (Input, Process, Output).",
            marks: 2,
            category: "topic"
          },
          {
            id: "cs11-ch3-t3.1-sq2",
            question: "Differentiate between Decision Problems, Search Problems, Optimization Problems, and Counting Problems.",
            marks: 2,
            category: "topic"
          },
          {
            id: "cs11-ch3-t3.1-sq3",
            question: "Differentiate between Well-defined Problems and Ill-defined Problems with an example of each.",
            marks: 2,
            category: "topic"
          },
          {
            id: "cs11-ch3-t3.1-s1",
            question: "Differentiate between well-defined and ill-defined problems within the realm of computational problem-solving.",
            marks: 2,
            isExercise: true,
            category: "exercise"
          },
          {
            id: "cs11-ch3-t3.1-s2",
            question: "Outline the main steps involved in the Generate-and-Test method.",
            marks: 2,
            isExercise: true,
            category: "exercise"
          },
          {
            id: "cs11-ch3-t3.1-s3",
            question: "Compare tractable and intractable problems in the context of computational complexity.",
            marks: 2,
            isExercise: true,
            category: "exercise"
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
            question: "The problem-solving method that works by repeatedly producing potential solutions and testing each one until a valid solution is found is:",
            options: [
              "Divide and Conquer",
              "Generate-and-Test Method",
              "Dynamic Programming",
              "Backtracking"
            ],
            answer: "(b)",
            correctIndex: 1,
            answerKey: "Generate-and-Test Method",
            marks: 1,
            category: "topic"
          },
          {
            id: "cs11-ch3-t3.2-m2",
            question: "What is used in the Generate-and-Test method to reduce the number of generated solutions and increase efficiency?",
            options: [
              "Random guesses",
              "Heuristics or rules",
              "Hardware timers",
              "Compiler directives"
            ],
            answer: "(b)",
            correctIndex: 1,
            answerKey: "Heuristics or rules",
            marks: 1,
            category: "topic"
          }
        ],
        shortQuestions: [
          {
            id: "cs11-ch3-t3.2-sq4",
            question: "Explain the working mechanism of the Generate-and-Test method in algorithmic problem solving.",
            marks: 2,
            category: "topic"
          },
          {
            id: "cs11-ch3-t3.2-sq5",
            question: "How do heuristics or rules help reduce the solution space in the Generate-and-Test approach?",
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
            question: "A problem is classified as unsolvable if:",
            options: [
              "It takes more than 1 hour to execute",
              "No algorithm can be created that guarantees a solution for all possible inputs",
              "It requires more than 1 GB of RAM",
              "It uses recursive function calls"
            ],
            answer: "(b)",
            correctIndex: 1,
            answerKey: "No algorithm can be created that guarantees a solution for all possible inputs",
            marks: 1,
            category: "topic"
          },
          {
            id: "cs11-ch3-t3.3-m2",
            question: "Which famous problem proved by Alan Turing serves as a classic example of an unsolvable problem?",
            options: [
              "Traveling Salesman Problem",
              "Knapsack Problem",
              "Halting Problem",
              "Sudoku Puzzle"
            ],
            answer: "(c)",
            correctIndex: 2,
            answerKey: "Halting Problem",
            marks: 1,
            category: "topic"
          },
          {
            id: "cs11-ch3-t3.3-m3",
            question: "Problems that can be solved in polynomial time O(n^k) are categorized as:",
            options: [
              "Intractable Problems",
              "Tractable Problems",
              "Unsolvable Problems",
              "NP-Hard Problems"
            ],
            answer: "(b)",
            correctIndex: 1,
            answerKey: "Tractable Problems",
            marks: 1,
            category: "topic"
          },
          {
            id: "cs11-ch3-t3.3-m4",
            question: "Which complexity class includes problems whose solutions can be verified quickly by a computer, even if finding the solution is difficult?",
            options: [
              "Class P",
              "Class NP",
              "Class NP-Hard",
              "Class Intractable"
            ],
            answer: "(b)",
            correctIndex: 1,
            answerKey: "Class NP",
            marks: 1,
            category: "topic"
          },
          {
            id: "cs11-ch3-m2",
            question: "Complexity class representing problems solvable efficiently by a deterministic algorithm:",
            options: ["NP", "NP-hard", "NP-complete", "P"],
            answer: "(d)",
            correctIndex: 3,
            answerKey: "P",
            marks: 1,
            isExercise: true,
            category: "exercise"
          },
          {
            id: "cs11-ch3-m3",
            question: "The statement that applies to unsolvable problems:",
            options: [
              "They can be solved in polynomial time",
              "They cannot be solved by any algorithm",
              "They are always in NP class",
              "They require exponential time to solve"
            ],
            answer: "(b)",
            correctIndex: 1,
            answerKey: "They cannot be solved by any algorithm",
            marks: 1,
            isExercise: true,
            category: "exercise"
          },
          {
            id: "cs11-ch3-m4",
            question: "The meaning of NP in computational complexity is:",
            options: [
              "Non-deterministic Polynomial time",
              "Negative Polynomial time",
              "Non-trivial Polynomial time",
              "Numerical Polynomial time"
            ],
            answer: "(a)",
            correctIndex: 0,
            answerKey: "Non-deterministic Polynomial time",
            marks: 1,
            isExercise: true,
            category: "exercise"
          }
        ],
        shortQuestions: [
          {
            id: "cs11-ch3-t3.3-sq6",
            question: "Differentiate between Solvable Problems and Unsolvable Problems.",
            marks: 2,
            category: "topic"
          },
          {
            id: "cs11-ch3-t3.3-sq7",
            question: "What is the Halting Problem, and why is it considered a classic example of an unsolvable problem?",
            marks: 2,
            category: "topic"
          },
          {
            id: "cs11-ch3-t3.3-sq8",
            question: "Differentiate between Tractable Problems and Intractable Problems based on computational complexity.",
            marks: 2,
            category: "topic"
          },
          {
            id: "cs11-ch3-t3.3-sq9",
            question: "Compare the complexity classes P, NP, NP-Hard, and NP-Complete.",
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
            question: "Big O notation is used in algorithm analysis to describe:",
            options: [
              "The minimum memory required by a program",
              "The upper bound of an algorithm's time complexity in the worst-case scenario",
              "The exact line count of source code",
              "The network bandwidth speed"
            ],
            answer: "(b)",
            correctIndex: 1,
            answerKey: "The upper bound of an algorithm's time complexity in the worst-case scenario",
            marks: 1,
            category: "topic"
          },
          {
            id: "cs11-ch3-t3.4-m2",
            question: "What is the time complexity of an algorithm where the execution time remains unchanged regardless of input size?",
            options: ["O(n)", "O(n^2)", "O(1)", "O(log n)"],
            answer: "(c)",
            correctIndex: 2,
            answerKey: "O(1)",
            marks: 1,
            category: "topic"
          },
          {
            id: "cs11-ch3-m8",
            question: "Time complexity of Depth-First Search (DFS) in a graph is:",
            options: ["O(n log n)", "O(V)", "O(V + E)", "O(n)"],
            answer: "(c)",
            correctIndex: 2,
            answerKey: "O(V + E)",
            marks: 1,
            isExercise: true,
            category: "exercise"
          },
          {
            id: "cs11-ch3-m9",
            question: "Best description of time complexity:",
            options: [
              "Amount of memory an algorithm needs",
              "Time taken as a function of input size",
              "Efficiency as input size grows",
              "Upper bound of space requirements"
            ],
            answer: "(b)",
            correctIndex: 1,
            answerKey: "Time taken as a function of input size",
            marks: 1,
            isExercise: true,
            category: "exercise"
          },
          {
            id: "cs11-ch3-m10",
            question: "An algorithm with a time complexity of O(n log n):",
            options: ["Bubble Sort", "Binary Search", "Merge Sort", "Insertion Sort"],
            answer: "(b)",
            correctIndex: 1,
            answerKey: "Binary Search",
            marks: 1,
            isExercise: true,
            category: "exercise"
          }
        ],
        shortQuestions: [
          {
            id: "cs11-ch3-t3.4-sq10",
            question: "Define Big O notation and explain its importance in predicting algorithm performance.",
            marks: 2,
            category: "topic"
          },
          {
            id: "cs11-ch3-t3.4-sq11",
            question: "Compare O(1), O(n), O(n^2), and O(log n) runtimes in terms of execution efficiency.",
            marks: 2,
            category: "topic"
          },
          {
            id: "cs11-ch3-t3.4-sq12",
            question: "Differentiate between Time Complexity and Space Complexity.",
            marks: 2,
            category: "topic"
          },
          {
            id: "cs11-ch3-t3.4-s1",
            question: "Explain the importance of breaking down a problem into smaller components in algorithmic thinking.",
            marks: 2,
            isExercise: true,
            category: "exercise"
          },
          {
            id: "cs11-ch3-t3.4-s2",
            question: "Identify the key factors used to evaluate the performance of an algorithm.",
            marks: 2,
            isExercise: true,
            category: "exercise"
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
            question: "Which algorithm design technique breaks a large problem into smaller subproblems, solves them independently, and combines their results?",
            options: [
              "Greedy Algorithm",
              "Divide and Conquer",
              "Dynamic Programming",
              "Backtracking"
            ],
            answer: "(b)",
            correctIndex: 1,
            answerKey: "Divide and Conquer",
            marks: 1,
            category: "topic"
          },
          {
            id: "cs11-ch3-t3.5-m2",
            question: "An algorithm technique that makes locally optimal choices at each step with the hope of finding a global optimum is called:",
            options: [
              "Dynamic Programming",
              "Greedy Algorithm",
              "Backtracking",
              "Divide and Conquer"
            ],
            answer: "(b)",
            correctIndex: 1,
            answerKey: "Greedy Algorithm",
            marks: 1,
            category: "topic"
          },
          {
            id: "cs11-ch3-t3.5-m3",
            question: "Dynamic Programming (DP) optimizes problem-solving by:",
            options: [
              "Trying all possible combinations randomly",
              "Storing the results of overlapping subproblems to avoid redundant calculations",
              "Dropping input values that are negative",
              "Executing code on multiple servers simultaneously"
            ],
            answer: "(b)",
            correctIndex: 1,
            answerKey: "Storing the results of overlapping subproblems to avoid redundant calculations",
            marks: 1,
            category: "topic"
          },
          {
            id: "cs11-ch3-m6",
            question: "A scenario where Dynamic Programming proves most useful:",
            options: [
              "Problems without overlapping subproblems",
              "Problems solved by making local choices",
              "Problems with overlapping subproblems and optimal substructure",
              "Problems divided into independent subproblems"
            ],
            answer: "(c)",
            correctIndex: 2,
            answerKey: "Problems with overlapping subproblems and optimal substructure",
            marks: 1,
            isExercise: true,
            category: "exercise"
          }
        ],
        shortQuestions: [
          {
            id: "cs11-ch3-t3.5-sq13",
            question: "Explain the working steps of the Divide and Conquer algorithm design technique.",
            marks: 2,
            category: "topic"
          },
          {
            id: "cs11-ch3-t3.5-sq14",
            question: "Describe the Greedy Algorithm approach using the Coin Change problem example.",
            marks: 2,
            category: "topic"
          },
          {
            id: "cs11-ch3-t3.5-sq15",
            question: "Discuss how Dynamic Programming (DP) optimizes problem solving using overlapping subproblems.",
            marks: 2,
            category: "topic"
          },
          {
            id: "cs11-ch3-t3.5-sq16",
            question: "Define Backtracking and state a practical scenario where it is applied.",
            marks: 2,
            category: "topic"
          },
          {
            id: "cs11-ch3-t3.5-s1",
            question: "Summarize the key idea behind Greedy Algorithms.",
            marks: 2,
            isExercise: true,
            category: "exercise"
          },
          {
            id: "cs11-ch3-t3.5-s2",
            question: "Discuss the advantages of using Dynamic Programming.",
            marks: 2,
            isExercise: true,
            category: "exercise"
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
            question: "Which sorting algorithm repeatedly compares adjacent elements and swaps them if they are in the wrong order?",
            options: ["Selection Sort", "Merge Sort", "Bubble Sort", "Quick Sort"],
            answer: "(c)",
            correctIndex: 2,
            answerKey: "Bubble Sort",
            marks: 1,
            category: "topic"
          },
          {
            id: "cs11-ch3-t3.6-m2",
            question: "What is the prerequisite condition required before applying Binary Search on a dataset?",
            options: [
              "The dataset must be stored in a stack",
              "The dataset must be sorted",
              "The dataset size must be an even number",
              "The elements must be strings"
            ],
            answer: "(b)",
            correctIndex: 1,
            answerKey: "The dataset must be sorted",
            marks: 1,
            category: "topic"
          },
          {
            id: "cs11-ch3-t3.6-m3",
            question: "Which graph traversal algorithm explores nodes level-by-level using a Queue data structure?",
            options: [
              "Depth-First Search (DFS)",
              "Breadth-First Search (BFS)",
              "Selection Search",
              "Binary Search"
            ],
            answer: "(b)",
            correctIndex: 1,
            answerKey: "Breadth-First Search (BFS)",
            marks: 1,
            category: "topic"
          },
          {
            id: "cs11-ch3-m5",
            question: "Search algorithm more efficient for large datasets:",
            options: ["Bubble Sort", "Merge Sort", "Selection Sort", "Quick Sort"],
            answer: "(b)",
            correctIndex: 1,
            answerKey: "Merge Sort",
            marks: 1,
            isExercise: true,
            category: "exercise"
          },
          {
            id: "cs11-ch3-m7",
            question: "An algorithm that sorts data by stepping through the list and swapping adjacent elements if needed is:",
            options: ["Selection Sort", "Quick Sort", "Bubble Sort", "Merge Sort"],
            answer: "(c)",
            correctIndex: 2,
            answerKey: "Bubble Sort",
            marks: 1,
            isExercise: true,
            category: "exercise"
          }
        ],
        shortQuestions: [
          {
            id: "cs11-ch3-t3.6-sq17",
            question: "Explain the step-by-step process of Bubble Sort and state its worst-case time complexity.",
            marks: 2,
            category: "topic"
          },
          {
            id: "cs11-ch3-t3.6-sq18",
            question: "Describe how Selection Sort works to arrange elements in ascending order.",
            marks: 2,
            category: "topic"
          },
          {
            id: "cs11-ch3-t3.6-sq19",
            question: "Compare Linear Search and Binary Search in terms of prerequisites and performance.",
            marks: 2,
            category: "topic"
          },
          {
            id: "cs11-ch3-t3.6-sq20",
            question: "Compare Breadth-First Search (BFS) and Depth-First Search (DFS) in graph traversal.",
            marks: 2,
            category: "topic"
          },
          {
            id: "cs11-ch3-t3.6-s1",
            question: "Compare the advantages of Breadth-First Search (BFS) with Depth-First Search (DFS) in graph traversal.",
            marks: 2,
            isExercise: true,
            category: "exercise"
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
            question: "Which property of a Python List allows it to expand or shrink automatically as items are added or removed?",
            options: [
              "Fixed Allocation",
              "Dynamic Size",
              "Static Memory",
              "Immutable Length"
            ],
            answer: "(b)",
            correctIndex: 1,
            answerKey: "Dynamic Size",
            marks: 1,
            category: "topic"
          },
          {
            id: "cs11-ch4-m1",
            question: "A data structure used to store multiple pieces of data in a specific sequence:",
            options: ["Stack", "List", "Queue", "Tree"],
            answer: "(b)",
            correctIndex: 1,
            answerKey: "List",
            marks: 1,
            isExercise: true,
            category: "exercise"
          },
          {
            id: "cs11-ch4-m2",
            question: "Which property allows a list to change its size dynamically:",
            options: [
              "Index-Based Access",
              "Dynamic Size",
              "Ordered Collection",
              "Random Access"
            ],
            answer: "(b)",
            correctIndex: 1,
            answerKey: "Dynamic Size",
            marks: 1,
            isExercise: true,
            category: "exercise"
          },
          {
            id: "cs11-ch4-m3",
            question: "In Python, removing an item from a list is done using:",
            options: ["delete()", "remove()", "pop()", "clear()"],
            answer: "(b)",
            correctIndex: 1,
            answerKey: "remove()",
            marks: 1,
            isExercise: true,
            category: "exercise"
          }
        ],
        shortQuestions: [
          {
            id: "cs11-ch4-t4.1-sq1",
            question: "Describe the dynamic size and index-based access properties of Python lists.",
            marks: 2,
            category: "topic"
          },
          {
            id: "cs11-ch4-t4.1-sq2",
            question: "Differentiate between deleting items by value (remove()) and deleting items by index (pop()) in Python lists.",
            marks: 2,
            category: "topic"
          },
          {
            id: "cs11-ch4-t4.1-s1",
            question: "Explain how the 'insert()' function works in python lists. Provide an example.",
            marks: 2,
            isExercise: true,
            category: "exercise"
          },
          {
            id: "cs11-ch4-t4.1-s2",
            question: "Explain the potential issues which could arise when two variables reference the same list in a program? Provide an example.",
            marks: 2,
            isExercise: true,
            category: "exercise"
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
            question: "A Stack is a linear computational structure that operates on which operational principle?",
            options: [
              "First-In, First-Out (FIFO)",
              "Last-In, First-Out (LIFO)",
              "Random Access",
              "Highest-Priority First"
            ],
            answer: "(b)",
            correctIndex: 1,
            answerKey: "Last-In, First-Out (LIFO)",
            marks: 1,
            category: "topic"
          },
          {
            id: "cs11-ch4-t4.2-m2",
            question: "What is the operation called when an item is removed from the top of a stack?",
            options: ["Push", "Enqueue", "Pop", "Dequeue"],
            answer: "(c)",
            correctIndex: 2,
            answerKey: "Pop",
            marks: 1,
            category: "topic"
          },
          {
            id: "cs11-ch4-m4",
            question: "LIFO principle stands for:",
            options: [
              "Last In First Out",
              "Linear Input First Output",
              "List Item File Output",
              "Load Input Format Output"
            ],
            answer: "(a)",
            correctIndex: 0,
            answerKey: "Last In First Out",
            marks: 1,
            isExercise: true,
            category: "exercise"
          },
          {
            id: "cs11-ch4-m5",
            question: "A stack operation that adds an element to the top:",
            options: ["Pop", "Peek", "Push", "Pull"],
            answer: "(c)",
            correctIndex: 2,
            answerKey: "Push",
            marks: 1,
            isExercise: true,
            category: "exercise"
          }
        ],
        shortQuestions: [
          {
            id: "cs11-ch4-t4.2-sq3",
            question: "Define a Stack and explain the Last-In, First-Out (LIFO) operational principle.",
            marks: 2,
            category: "topic"
          },
          {
            id: "cs11-ch4-t4.2-sq4",
            question: "Differentiate between push and pop operations on a stack.",
            marks: 2,
            category: "topic"
          },
          {
            id: "cs11-ch4-t4.2-s1",
            question: "Define a stack and explain the Last-In, First-Out (LIFO) principle.",
            marks: 2,
            isExercise: true,
            category: "exercise"
          },
          {
            id: "cs11-ch4-t4.2-s2",
            question: "Name two basic operations performed on stack.",
            marks: 2,
            isExercise: true,
            category: "exercise"
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
            question: "A Queue data structure operates on which principle?",
            options: [
              "Last-In, First-Out (LIFO)",
              "First-In, First-Out (FIFO)",
              "Bottom-Up Execution",
              "Hierarchical Access"
            ],
            answer: "(b)",
            correctIndex: 1,
            answerKey: "First-In, First-Out (FIFO)",
            marks: 1,
            category: "topic"
          },
          {
            id: "cs11-ch4-m6",
            question: "FIFO principle in queues means:",
            options: [
              "First In First Out",
              "File Input Format Output",
              "Fast In First Output",
              "First In Final Output"
            ],
            answer: "(a)",
            correctIndex: 0,
            answerKey: "First In First Out",
            marks: 1,
            isExercise: true,
            category: "exercise"
          },
          {
            id: "cs11-ch4-m7",
            question: "Queue operation that removes an element from the front:",
            options: ["Enqueue", "Dequeue", "Peek", "Push"],
            answer: "(b)",
            correctIndex: 1,
            answerKey: "Dequeue",
            marks: 1,
            isExercise: true,
            category: "exercise"
          }
        ],
        shortQuestions: [
          {
            id: "cs11-ch4-t4.3-sq5",
            question: "Define a Queue and explain the First-In, First-Out (FIFO) operational principle.",
            marks: 2,
            category: "topic"
          },
          {
            id: "cs11-ch4-t4.3-sq6",
            question: "Differentiate between enqueue and dequeue operations in a queue.",
            marks: 2,
            category: "topic"
          },
          {
            id: "cs11-ch4-t4.3-s1",
            question: "Differentiate between the Enqueue and Dequeue operations of queue.",
            marks: 2,
            isExercise: true,
            category: "exercise"
          },
          {
            id: "cs11-ch4-t4.3-s2",
            question: "What is difference between enqueue ( ) and dequeue ( ).",
            marks: 2,
            isExercise: true,
            category: "exercise"
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
            question: "In a Tree structure, a node that has no child nodes attached to it is known as a:",
            options: ["Root Node", "Leaf Node", "Parent Node", "Ancestor Node"],
            answer: "(b)",
            correctIndex: 1,
            answerKey: "Leaf Node",
            marks: 1,
            category: "topic"
          },
          {
            id: "cs11-ch4-t4.4-m2",
            question: "The number of edges connected to a specific vertex in a Graph structure is called its:",
            options: ["Height", "Weight", "Degree", "Path"],
            answer: "(c)",
            correctIndex: 2,
            answerKey: "Degree",
            marks: 1,
            category: "topic"
          },
          {
            id: "cs11-ch4-m8",
            question: "A tree is a special kind of graph with:",
            options: [
              "Multiple root nodes",
              "Cycles allowed",
              "Single root node and no cycles",
              "No connections between nodes"
            ],
            answer: "(c)",
            correctIndex: 2,
            answerKey: "Single root node and no cycles",
            marks: 1,
            isExercise: true,
            category: "exercise"
          },
          {
            id: "cs11-ch4-m9",
            question: "Pre-order tree traversal visits nodes in sequence:",
            options: [
              "Left, Root, Right",
              "Root, Left, Right",
              "Left, Right, Root",
              "Right, Root, Left"
            ],
            answer: "(b)",
            correctIndex: 1,
            answerKey: "Root, Left, Right",
            marks: 1,
            isExercise: true,
            category: "exercise"
          },
          {
            id: "cs11-ch4-m10",
            question: "Time complexity of searching in a balanced binary search tree:",
            options: ["O(n)", "O(log n)", "O(n²)", "O(2ⁿ)"],
            answer: "(b)",
            correctIndex: 1,
            answerKey: "O(log n)",
            marks: 1,
            isExercise: true,
            category: "exercise"
          }
        ],
        shortQuestions: [
          {
            id: "cs11-ch4-t4.4-sq7",
            question: "Define a Tree data structure and explain the terms: Root Node, Leaf Node, and Height.",
            marks: 2,
            category: "topic"
          },
          {
            id: "cs11-ch4-t4.4-sq8",
            question: "What is a Balanced Tree, and why is structural balance important?",
            marks: 2,
            category: "topic"
          },
          {
            id: "cs11-ch4-t4.4-sq9",
            question: "Define a Graph data structure and differentiate between Vertices (Nodes) and Edges.",
            marks: 2,
            category: "topic"
          },
          {
            id: "cs11-ch4-t4.4-sq10",
            question: "Differentiate between Directed Graphs, Undirected Graphs, and Weighted Graphs.",
            marks: 2,
            category: "topic"
          },
          {
            id: "cs11-ch4-t4.4-sq11",
            question: "Compare a Tree and a Graph data structure based on hierarchy and presence of cycles.",
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
            question: "The measure of central tendency that represents the middle value in an ordered dataset is the:",
            options: ["Mean", "Median", "Mode", "Variance"],
            answer: "(b)",
            correctIndex: 1,
            answerKey: "Median",
            marks: 1,
            category: "topic"
          },
          {
            id: "cs11-ch5-t5.1-m2",
            question: "How is Standard Deviation calculated in relation to Variance?",
            options: [
              "By multiplying Variance by 2",
              "By taking the square root of Variance",
              "By dividing Variance by total sample size",
              "By squaring the Variance value"
            ],
            answer: "(b)",
            correctIndex: 1,
            answerKey: "By taking the square root of Variance",
            marks: 1,
            category: "topic"
          }
        ],
        shortQuestions: [
          {
            id: "cs11-ch5-t5.1-sq1",
            question: "Differentiate between Mean, Median, and Mode as measures of central tendency.",
            marks: 2,
            category: "topic"
          },
          {
            id: "cs11-ch5-t5.1-sq2",
            question: "Define Variance and Standard Deviation. How is Standard Deviation mathematically derived from Variance?",
            marks: 2,
            category: "topic"
          }
        ],
        longQuestions: []
      },
      {
        id: "cs-11-ch5-topic-5.2",
        topicNumber: "5.2",
        name: "Data Collection and Preparation",
        mcqs: [
          {
            id: "cs11-ch5-t5.2-m1",
            question: "The data cleaning technique where a missing value is estimated using existing data (such as assigning the class average) is called:",
            options: ["Removal", "Flagging", "Imputation", "Interpolation"],
            answer: "(c)",
            correctIndex: 2,
            answerKey: "Imputation",
            marks: 1,
            category: "topic"
          }
        ],
        shortQuestions: [
          {
            id: "cs11-ch5-t5.2-sq3",
            question: "Compare Surveys, Observations, and Experiments as primary data collection methods.",
            marks: 2,
            category: "topic"
          },
          {
            id: "cs11-ch5-t5.2-sq4",
            question: "Explain three main strategies for handling missing data: Imputation, Flagging, and Removal.",
            marks: 2,
            category: "topic"
          },
          {
            id: "cs11-ch5-t5.2-sq5",
            question: "Differentiate between Data Cleaning and Data Transformation.",
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
            question: "In the simple linear regression formula Y = \u03b2\u2080 + \u03b2\u2081X + \u03b5, what does \u03b2\u2081 represent?",
            options: [
              "The dependent variable",
              "The y-intercept",
              "The slope of the line",
              "The error term"
            ],
            answer: "(c)",
            correctIndex: 2,
            answerKey: "The slope of the line",
            marks: 1,
            category: "topic"
          },
          {
            id: "cs11-ch5-t5.3-m2",
            question: "Which statistical modeling technique is specifically used when predicting a categorical binary outcome (such as \"pass\" or \"fail\")?",
            options: [
              "Linear Regression",
              "Logistic Regression",
              "Time-Series Smoothing",
              "Boxplot Analysis"
            ],
            answer: "(b)",
            correctIndex: 1,
            answerKey: "Logistic Regression",
            marks: 1,
            category: "topic"
          },
          {
            id: "cs11-ch5-t5.3-m3",
            question: "K-means clustering is an unsupervised learning technique whose main purpose is to:",
            options: [
              "Predict future numeric sales figures",
              "Group similar data points into K distinct clusters based on feature similarity",
              "Calculate variance of a sample",
              "Clean missing string entries"
            ],
            answer: "(b)",
            correctIndex: 1,
            answerKey: "Group similar data points into K distinct clusters based on feature similarity",
            marks: 1,
            category: "topic"
          }
        ],
        shortQuestions: [
          {
            id: "cs11-ch5-t5.3-sq6",
            question: "State the 5 basic steps involved in developing a statistical model.",
            marks: 2,
            category: "topic"
          },
          {
            id: "cs11-ch5-t5.3-sq7",
            question: "Explain the Simple Linear Regression formula (Y = \u03b2\u2080 + \u03b2\u2081X + \u03b5) and define each variable.",
            marks: 2,
            category: "topic"
          },
          {
            id: "cs11-ch5-t5.3-sq8",
            question: "How does Logistic Regression differ from Linear Regression in terms of predicted output?",
            marks: 2,
            category: "topic"
          },
          {
            id: "cs11-ch5-t5.3-sq9",
            question: "What is K-Means Clustering, and how does it group data points into clusters?",
            marks: 2,
            category: "topic"
          },
          {
            id: "cs11-ch5-t5.3-sq10",
            question: "Discuss two ethical considerations (Fairness/Bias and Data Privacy) when building data models.",
            marks: 2,
            category: "topic"
          },
          {
            id: "cs11-ch5-t5.3-s1",
            question: "What is the importance of building statistical models in real-world applications?",
            marks: 2,
            isExercise: true,
            category: "exercise"
          },
          {
            id: "cs11-ch5-t5.3-s2",
            question: "Name one basic statistical model used for predicting outcomes and explain its purpose.",
            marks: 2,
            isExercise: true,
            category: "exercise"
          }
        ],
        longQuestions: []
      },
      {
        id: "cs-11-ch5-topic-5.4",
        topicNumber: "5.4",
        name: "Data Visualization and Tools",
        mcqs: [
          {
            id: "cs11-ch5-t5.4-m1",
            question: "Which type of data visualization is specifically designed to show trends and changes over time?",
            options: ["Bar Chart", "Line Graph", "Histogram", "Boxplot"],
            answer: "(b)",
            correctIndex: 1,
            answerKey: "Line Graph",
            marks: 1,
            category: "topic"
          },
          {
            id: "cs11-ch5-t5.4-m2",
            question: "Which plot summarizes data distribution by displaying the median, quartiles, and potential outliers?",
            options: [
              "Scatterplot",
              "Boxplot (Whisker plot)",
              "Line Graph",
              "Bar Chart"
            ],
            answer: "(b)",
            correctIndex: 1,
            answerKey: "Boxplot (Whisker plot)",
            marks: 1,
            category: "topic"
          }
        ],
        shortQuestions: [
          {
            id: "cs11-ch5-t5.4-sq11",
            question: "Compare Bar Charts, Line Graphs, and Histograms regarding their visual analysis purposes.",
            marks: 2,
            category: "topic"
          },
          {
            id: "cs11-ch5-t5.4-sq12",
            question: "Explain how a Boxplot (Whisker plot) summarizes data distribution using quartiles and median.",
            marks: 2,
            category: "topic"
          },
          {
            id: "cs11-ch5-t5.4-s1",
            question: "List two types of data visualizations and describe when you would use each.",
            marks: 2,
            isExercise: true,
            category: "exercise"
          },
          {
            id: "cs11-ch5-t5.4-s2",
            question: "How does visualizing data help in understanding descriptive statistics?",
            marks: 2,
            isExercise: true,
            category: "exercise"
          }
        ],
        longQuestions: []
      },
      {
        id: "cs-11-ch5-topic-5.5",
        topicNumber: "5.5",
        name: "Object-Oriented Programming (OOP)",
        mcqs: [
          {
            id: "cs11-ch5-m1",
            question: "Encapsulation in OOP means:",
            options: [
              "Bundling data and methods together",
              "Creating multiple objects",
              "Inheriting from parent classes",
              "Making all variables public"
            ],
            answer: "(a)",
            correctIndex: 0,
            answerKey: "Bundling data and methods together",
            marks: 1,
            isExercise: true,
            category: "exercise"
          },
          {
            id: "cs11-ch5-m2",
            question: "The concept where a class inherits properties from another class:",
            options: ["Polymorphism", "Inheritance", "Encapsulation", "Abstraction"],
            answer: "(b)",
            correctIndex: 1,
            answerKey: "Inheritance",
            marks: 1,
            isExercise: true,
            category: "exercise"
          },
          {
            id: "cs11-ch5-m3",
            question: "A method that has multiple implementations based on the object type is:",
            options: ["Encapsulation", "Inheritance", "Polymorphism", "Abstraction"],
            answer: "(c)",
            correctIndex: 2,
            answerKey: "Polymorphism",
            marks: 1,
            isExercise: true,
            category: "exercise"
          },
          {
            id: "cs11-ch5-m4",
            question: "The process of hiding unnecessary details is called:",
            options: ["Polymorphism", "Inheritance", "Encapsulation", "Abstraction"],
            answer: "(d)",
            correctIndex: 3,
            answerKey: "Abstraction",
            marks: 1,
            isExercise: true,
            category: "exercise"
          },
          {
            id: "cs11-ch5-m5",
            question: "A class that cannot be instantiated directly:",
            options: ["Concrete class", "Abstract class", "Parent class", "Child class"],
            answer: "(b)",
            correctIndex: 1,
            answerKey: "Abstract class",
            marks: 1,
            isExercise: true,
            category: "exercise"
          },
          {
            id: "cs11-ch5-m6",
            question: "In Python, a method that acts on both class and instance data:",
            options: ["Static method", "Class method", "Instance method", "Private method"],
            answer: "(b)",
            correctIndex: 1,
            answerKey: "Class method",
            marks: 1,
            isExercise: true,
            category: "exercise"
          },
          {
            id: "cs11-ch5-m7",
            question: "A method that defines the behavior when an object is created:",
            options: ["__str__()", "__init__()", "__del__()", "__call__()"],
            answer: "(b)",
            correctIndex: 1,
            answerKey: "__init__()",
            marks: 1,
            isExercise: true,
            category: "exercise"
          }
        ],
        shortQuestions: [],
        longQuestions: []
      }
    ]
  },

  // =========================================================================
  // UNIT 6: EMERGING TECHNOLOGIES & CLOUD COMPUTING
  // =========================================================================
  {
    id: "cs-11-ch6",
    chapterNumber: 6,
    name: "Emerging Technologies",
    topics: [
      {
        id: "cs-11-ch6-topic-6.1",
        topicNumber: "6.1",
        name: "Overview & Cloud Computing",
        mcqs: [
          {
            id: "cs11-ch6-t6.1-m1",
            question: "Which technology allows a single physical computer to act as multiple independent virtual machines running their own operating systems?",
            options: [
              "Containerization",
              "Virtualization",
              "Quantum Tunneling",
              "Edge Routing"
            ],
            answer: "(b)",
            correctIndex: 1,
            answerKey: "Virtualization",
            marks: 1,
            category: "topic"
          },
          {
            id: "cs11-ch6-t6.1-m2",
            question: "The cloud computing characteristic that refers to the system's ability to automatically scale resources up or down based on real-time demand is:",
            options: ["On-Demand Access", "Elasticity", "Virtualization", "Multi-Tenancy"],
            answer: "(b)",
            correctIndex: 1,
            answerKey: "Elasticity",
            marks: 1,
            category: "topic"
          },
          {
            id: "cs11-ch6-t6.1-m3",
            question: "Google Workspace (Gmail, Google Docs) and Microsoft Office 365 are examples of which cloud service model?",
            options: [
              "Infrastructure as a Service (IaaS)",
              "Platform as a Service (PaaS)",
              "Software as a Service (SaaS)",
              "Data as a Service (DaaS)"
            ],
            answer: "(c)",
            correctIndex: 2,
            answerKey: "Software as a Service (SaaS)",
            marks: 1,
            category: "topic"
          },
          {
            id: "cs11-ch6-t6.1-m4",
            question: "A cloud deployment model that combines both public and private cloud features to share data and applications is a:",
            options: [
              "Community Cloud",
              "Hybrid Cloud",
              "Distributed Cloud",
              "Multi-Tenant Cloud"
            ],
            answer: "(b)",
            correctIndex: 1,
            answerKey: "Hybrid Cloud",
            marks: 1,
            category: "topic"
          }
        ],
        shortQuestions: [
          {
            id: "cs11-ch6-t6.1-sq1",
            question: "Define Virtualization and explain how it allows one physical server to host multiple virtual machines.",
            marks: 2,
            category: "topic"
          },
          {
            id: "cs11-ch6-t6.1-sq2",
            question: "Differentiate between Scalability and Elasticity in cloud computing environments.",
            marks: 2,
            category: "topic"
          },
          {
            id: "cs11-ch6-t6.1-sq3",
            question: "Compare the three cloud service models: IaaS, PaaS, and SaaS, with real-world examples.",
            marks: 2,
            category: "topic"
          },
          {
            id: "cs11-ch6-t6.1-sq4",
            question: "Compare Public, Private, Hybrid, and Multi-Cloud deployment models.",
            marks: 2,
            category: "topic"
          },
          {
            id: "cs11-ch6-t6.1-sq5",
            question: "List three major business applications of cloud computing.",
            marks: 2,
            category: "topic"
          },
          {
            id: "cs11-ch6-t6.1-sq6",
            question: "Discuss two security challenges in cloud data storage and strategies to mitigate them.",
            marks: 2,
            category: "topic"
          },
          {
            id: "cs11-ch6-t6.1-s1",
            question: "Differentiate between Elasticity and On-Demand access in cloud computing.",
            marks: 2,
            isExercise: true,
            category: "exercise"
          }
        ],
        longQuestions: []
      },
      {
        id: "cs-11-ch6-topic-6.2",
        topicNumber: "6.2",
        name: "Blockchain Technology & P2P Networks",
        mcqs: [
          {
            id: "cs11-ch6-t6.2-m1",
            question: "What property of Blockchain ensures that once a transaction block is added, it cannot be altered or deleted?",
            options: ["Decentralization", "Immutability", "Scalability", "Elasticity"],
            answer: "(b)",
            correctIndex: 1,
            answerKey: "Immutability",
            marks: 1,
            category: "topic"
          },
          {
            id: "cs11-ch6-t6.2-m2",
            question: "Automated digital agreements written in code that execute themselves on a blockchain when specific conditions are met are called:",
            options: [
              "Smart Contracts",
              "Consensus Protocols",
              "Ledger Rules",
              "Distributed Signatures"
            ],
            answer: "(a)",
            correctIndex: 0,
            answerKey: "Smart Contracts",
            marks: 1,
            category: "topic"
          }
        ],
        shortQuestions: [
          {
            id: "cs11-ch6-t6.2-sq7",
            question: "Define Blockchain and explain its three core principles: Decentralization, Immutability, and Consensus.",
            marks: 2,
            category: "topic"
          },
          {
            id: "cs11-ch6-t6.2-sq8",
            question: "Explain the roles of Nodes, Ledgers, Blocks, and Transactions in a blockchain network.",
            marks: 2,
            category: "topic"
          },
          {
            id: "cs11-ch6-t6.2-sq9",
            question: "What are Smart Contracts, and how do they automatically execute agreements?",
            marks: 2,
            category: "topic"
          },
          {
            id: "cs11-ch6-t6.2-sq10",
            question: "Explain how cryptography and digital signatures ensure data security in blockchain.",
            marks: 2,
            category: "topic"
          },
          {
            id: "cs11-ch6-t6.2-s1",
            question: "Analyze the role of Peer-to-Peer Networks in Blockchain. How do they function and why are they essential?",
            marks: 2,
            isExercise: true,
            category: "exercise"
          },
          {
            id: "cs11-ch6-t6.2-s2",
            question: "Describe the concept of immutability in blockchain. Why is it a critical feature?",
            marks: 2,
            isExercise: true,
            category: "exercise"
          }
        ],
        longQuestions: []
      },
      {
        id: "cs-11-ch6-topic-6.3",
        topicNumber: "6.3",
        name: "Future Trends, Edge & Serverless Computing",
        mcqs: [
          {
            id: "cs11-ch6-t6.3-m1",
            question: "Which computing architecture processes data locally near the data source (e.g., inside autonomous vehicles) to minimize latency?",
            options: [
              "Serverless Architecture",
              "Edge Computing",
              "Mainframe Computing",
              "Quantum Grid"
            ],
            answer: "(b)",
            correctIndex: 1,
            answerKey: "Edge Computing",
            marks: 1,
            category: "topic"
          },
          {
            id: "cs11-ch6-t6.3-m2",
            question: "In a Serverless Architecture (e.g., AWS Lambda), developers are billed based on:",
            options: [
              "A fixed monthly server rental fee",
              "The actual execution time and usage of computing resources",
              "The total bandwidth capacity reserved",
              "The number of lines of uploaded code"
            ],
            answer: "(b)",
            correctIndex: 1,
            answerKey: "The actual execution time and usage of computing resources",
            marks: 1,
            category: "topic"
          }
        ],
        shortQuestions: [
          {
            id: "cs11-ch6-t6.3-sq11",
            question: "Define Edge Computing and explain how it minimizes data processing latency in autonomous vehicles.",
            marks: 2,
            category: "topic"
          },
          {
            id: "cs11-ch6-t6.3-sq12",
            question: "Explain Serverless Architecture and describe its resource allocation and billing model.",
            marks: 2,
            category: "topic"
          },
          {
            id: "cs11-ch6-t6.3-s1",
            question: "What is edge computing and how does it benefit data processing?",
            marks: 2,
            isExercise: true,
            category: "exercise"
          },
          {
            id: "cs11-ch6-t6.3-s2",
            question: "How does edge computing improve the efficiency of autonomous vehicles?",
            marks: 2,
            isExercise: true,
            category: "exercise"
          },
          {
            id: "cs11-ch6-t6.3-s3",
            question: "Describe the concept of serverless architectures.",
            marks: 2,
            isExercise: true,
            category: "exercise"
          },
          {
            id: "cs11-ch6-t6.3-s4",
            question: "What advantages do serverless architectures offer to developers?",
            marks: 2,
            isExercise: true,
            category: "exercise"
          }
        ],
        longQuestions: []
      },
      {
        id: "cs-11-ch6-topic-6.4",
        topicNumber: "6.4",
        name: "Database Management Systems (DBMS)",
        mcqs: [
          {
            id: "cs11-ch6-m1",
            question: "A collection of related data organized in tables:",
            options: ["File", "Database", "Record", "Field"],
            answer: "(b)",
            correctIndex: 1,
            answerKey: "Database",
            marks: 1,
            isExercise: true,
            category: "exercise"
          },
          {
            id: "cs11-ch6-m2",
            question: "ACID properties in databases ensure:",
            options: [
              "Automatic data updates",
              "Data reliability and consistency",
              "Faster query execution",
              "Security encryption"
            ],
            answer: "(b)",
            correctIndex: 1,
            answerKey: "Data reliability and consistency",
            marks: 1,
            isExercise: true,
            category: "exercise"
          },
          {
            id: "cs11-ch6-m3",
            question: "A unique identifier for each record in a table:",
            options: ["Foreign Key", "Primary Key", "Candidate Key", "Composite Key"],
            answer: "(b)",
            correctIndex: 1,
            answerKey: "Primary Key",
            marks: 1,
            isExercise: true,
            category: "exercise"
          },
          {
            id: "cs11-ch6-m4",
            question: "A relationship where one record in a table relates to many records:",
            options: ["One-to-One", "One-to-Many", "Many-to-Many", "Many-to-One"],
            answer: "(b)",
            correctIndex: 1,
            answerKey: "One-to-Many",
            marks: 1,
            isExercise: true,
            category: "exercise"
          },
          {
            id: "cs11-ch6-m5",
            question: "SQL command used to retrieve data from a database:",
            options: ["INSERT", "UPDATE", "SELECT", "DELETE"],
            answer: "(c)",
            correctIndex: 2,
            answerKey: "SELECT",
            marks: 1,
            isExercise: true,
            category: "exercise"
          },
          {
            id: "cs11-ch6-m6",
            question: "The process of organizing data to reduce redundancy:",
            options: ["Denormalization", "Normalization", "Indexing", "Backup"],
            answer: "(b)",
            correctIndex: 1,
            answerKey: "Normalization",
            marks: 1,
            isExercise: true,
            category: "exercise"
          },
          {
            id: "cs11-ch6-m7",
            question: "A table with multiple rows of the same data:",
            options: ["Normalized table", "Denormalized table", "Indexed table", "Duplicate table"],
            answer: "(d)",
            correctIndex: 3,
            answerKey: "Duplicate table",
            marks: 1,
            isExercise: true,
            category: "exercise"
          },
          {
            id: "cs11-ch6-m8",
            question: "SQL JOIN operation that returns all rows from both tables:",
            options: ["INNER JOIN", "OUTER JOIN", "FULL OUTER JOIN", "LEFT JOIN"],
            answer: "(c)",
            correctIndex: 2,
            answerKey: "FULL OUTER JOIN",
            marks: 1,
            isExercise: true,
            category: "exercise"
          },
          {
            id: "cs11-ch6-m9",
            question: "A condition used in SQL to filter records:",
            options: ["ORDER BY", "WHERE", "GROUP BY", "HAVING"],
            answer: "(b)",
            correctIndex: 1,
            answerKey: "WHERE",
            marks: 1,
            isExercise: true,
            category: "exercise"
          }
        ],
        shortQuestions: [],
        longQuestions: []
      }
    ]
  },

  // =========================================================================
  // UNIT 7: LEGAL AND ETHICAL ASPECTS OF COMPUTING
  // =========================================================================
  {
    id: "cs-11-ch7",
    chapterNumber: 7,
    name: "Legal and Ethical Aspects of Computing",
    topics: [
      {
        id: "cs-11-ch7-topic-7.1",
        topicNumber: "7.1",
        name: "Terms of Use & Security Threats",
        mcqs: [
          {
            id: "cs11-ch7-t7.1-m1",
            question: "Small files placed on a user's device by websites to remember login details and preferences are called:",
            options: ["Spyware", "Spam", "Cookies", "Malware"],
            answer: "(c)",
            correctIndex: 2,
            answerKey: "Cookies",
            marks: 1,
            category: "topic"
          },
          {
            id: "cs11-ch7-t7.1-m2",
            question: "A cyber attack where users are redirected to a fake counterfeit website without their knowledge to steal login details is called:",
            options: ["Phishing", "Pharming", "Spamming", "Adware"],
            answer: "(b)",
            correctIndex: 1,
            answerKey: "Pharming",
            marks: 1,
            category: "topic"
          }
        ],
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
          },
          {
            id: "cs11-ch7-t7.1-sq3",
            question: "Differentiate between Spam and Spyware as digital security threats.",
            marks: 2,
            category: "topic"
          },
          {
            id: "cs11-ch7-t7.1-sq4",
            question: "Differentiate between Phishing and Pharming attack methods.",
            marks: 2,
            category: "topic"
          },
          {
            id: "cs11-ch7-t7.1-sq5",
            question: "What are Cookies, and why is Cookie Management essential for online privacy?",
            marks: 2,
            category: "topic"
          },
          {
            id: "cs11-ch7-t7.1-s1",
            question: "Why is it important for users to understand Terms of Use?",
            marks: 2,
            isExercise: true,
            category: "exercise"
          },
          {
            id: "cs11-ch7-t7.1-s2",
            question: "Differentiate between phishing and pharming.",
            marks: 2,
            isExercise: true,
            category: "exercise"
          }
        ],
        longQuestions: []
      },
      {
        id: "cs-11-ch7-topic-7.2",
        topicNumber: "7.2",
        name: "Digital Divide & Social Impacts",
        mcqs: [
          {
            id: "cs11-ch7-t7.2-m1",
            question: "The gap between individuals and communities who have access to modern ICT tools and those who do not is known as the:",
            options: ["Technology Barrier", "Digital Divide", "Information Lag", "Bandwidth Gap"],
            answer: "(b)",
            correctIndex: 1,
            answerKey: "Digital Divide",
            marks: 1,
            category: "topic"
          }
        ],
        shortQuestions: [
          {
            id: "cs11-ch7-t7.2-sq6",
            question: "Define the Digital Divide and list four key barriers (economic, geographical, educational, social) that cause it.",
            marks: 2,
            category: "topic"
          },
          {
            id: "cs11-ch7-t7.2-sq7",
            question: "Discuss the educational and economic impacts of the Digital Divide in developing countries like Pakistan.",
            marks: 2,
            category: "topic"
          },
          {
            id: "cs11-ch7-t7.2-sq8",
            question: "State three initiatives used by governments or organizations to bridge the Digital Divide.",
            marks: 2,
            category: "topic"
          },
          {
            id: "cs11-ch7-t7.2-s1",
            question: "Identify two impacts of the digital divide on social and civic participation.",
            marks: 2,
            isExercise: true,
            category: "exercise"
          }
        ],
        longQuestions: []
      },
      {
        id: "cs-11-ch7-topic-7.3",
        topicNumber: "7.3",
        name: "Digital Citizenship and Ethics",
        mcqs: [
          {
            id: "cs11-ch7-t7.3-m1",
            question: "Using someone else's ideas, text, or work without giving proper credit or source attribution is called:",
            options: [
              "Copyright Licensing",
              "Plagiarism",
              "Trademark Infringement",
              "Software Piracy"
            ],
            answer: "(b)",
            correctIndex: 1,
            answerKey: "Plagiarism",
            marks: 1,
            category: "topic"
          },
          {
            id: "cs11-ch7-t7.3-m2",
            question: "In Pakistan, cybersecurity awareness and online cybercrime complaints are officially managed by which agency unit?",
            options: ["PTA", "NR3C-FIA", "PEMRA", "NADRA"],
            answer: "(b)",
            correctIndex: 1,
            answerKey: "NR3C-FIA",
            marks: 1,
            category: "topic"
          }
        ],
        shortQuestions: [
          {
            id: "cs11-ch7-t7.3-sq9",
            question: "Define Digital Citizenship and state two practices of responsible digital conduct.",
            marks: 2,
            category: "topic"
          },
          {
            id: "cs11-ch7-t7.3-sq10",
            question: "Differentiate between Copyright Infringement and Plagiarism.",
            marks: 2,
            category: "topic"
          },
          {
            id: "cs11-ch7-t7.3-sq11",
            question: "State the official role of NR3C-FIA in Pakistan regarding cybercrime reporting and awareness.",
            marks: 2,
            category: "topic"
          },
          {
            id: "cs11-ch7-t7.3-s1",
            question: "What are the key steps involved in evaluating information sources?",
            marks: 2,
            isExercise: true,
            category: "exercise"
          },
          {
            id: "cs11-ch7-t7.3-s2",
            question: "How does responsible data sharing contribute to ethical use of information?",
            marks: 2,
            isExercise: true,
            category: "exercise"
          }
        ],
        longQuestions: []
      },
      {
        id: "cs-11-ch7-topic-7.4",
        topicNumber: "7.4",
        name: "Web Technologies & Networking",
        mcqs: [
          {
            id: "cs11-ch7-m1",
            question: "Protocol used for secure data transmission:",
            options: ["HTTP", "FTP", "HTTPS", "SMTP"],
            answer: "(c)",
            correctIndex: 2,
            answerKey: "HTTPS",
            marks: 1,
            isExercise: true,
            category: "exercise"
          },
          {
            id: "cs11-ch7-m2",
            question: "A method of identifying computers on a network:",
            options: ["MAC address", "IP address", "Port number", "URL"],
            answer: "(b)",
            correctIndex: 1,
            answerKey: "IP address",
            marks: 1,
            isExercise: true,
            category: "exercise"
          },
          {
            id: "cs11-ch7-m3",
            question: "The technology that enables responsive web design:",
            options: ["CSS Grid", "JavaScript only", "HTML only", "Server-side rendering"],
            answer: "(a)",
            correctIndex: 0,
            answerKey: "CSS Grid",
            marks: 1,
            isExercise: true,
            category: "exercise"
          },
          {
            id: "cs11-ch7-m4",
            question: "A software that intercepts and filters network traffic:",
            options: ["Proxy server", "Firewall", "Router", "Gateway"],
            answer: "(b)",
            correctIndex: 1,
            answerKey: "Firewall",
            marks: 1,
            isExercise: true,
            category: "exercise"
          },
          {
            id: "cs11-ch7-m5",
            question: "API stands for:",
            options: [
              "Application Programming Interface",
              "Application Process Integration",
              "Advanced Programming Input",
              "Automated Processing Integration"
            ],
            answer: "(a)",
            correctIndex: 0,
            answerKey: "Application Programming Interface",
            marks: 1,
            isExercise: true,
            category: "exercise"
          },
          {
            id: "cs11-ch7-m6",
            question: "Client-side validation improves:",
            options: ["Security", "User experience", "Server performance", "Database speed"],
            answer: "(b)",
            correctIndex: 1,
            answerKey: "User experience",
            marks: 1,
            isExercise: true,
            category: "exercise"
          },
          {
            id: "cs11-ch7-m7",
            question: "A request-response model used in web communication:",
            options: ["Push model", "Pull model", "Broadcast model", "Multicast model"],
            answer: "(b)",
            correctIndex: 1,
            answerKey: "Pull model",
            marks: 1,
            isExercise: true,
            category: "exercise"
          }
        ],
        shortQuestions: [],
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
    name: "Online Research & Digital Literacy",
    topics: [
      {
        id: "cs-11-ch8-topic-8.1",
        topicNumber: "8.1",
        name: "Research & Digital Resources",
        mcqs: [
          {
            id: "cs11-ch8-t8.1-m1",
            question: "Which Boolean search operator is used in search engines to combine terms so that results contain ALL specified keywords?",
            options: ["OR", "NOT", "AND", "NEAR"],
            answer: "(c)",
            correctIndex: 2,
            answerKey: "AND",
            marks: 1,
            category: "topic"
          },
          {
            id: "cs11-ch8-t8.1-m2",
            question: "Articles published in academic journals that have been thoroughly checked and verified by other domain experts before publishing are called:",
            options: ["Editorial blogs", "Peer-reviewed articles", "Press releases", "White papers"],
            answer: "(b)",
            correctIndex: 1,
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
          },
          {
            id: "cs11-ch8-t8.1-sq3",
            question: "What is a Peer-Reviewed Article, and why is it considered a highly credible academic source?",
            marks: 2,
            category: "topic"
          },
          {
            id: "cs11-ch8-t8.1-sq4",
            question: "How do Boolean search operators (AND, OR, NOT) help refine online search queries?",
            marks: 2,
            category: "topic"
          }
        ],
        longQuestions: []
      },
      {
        id: "cs-11-ch8-topic-8.2",
        topicNumber: "8.2",
        name: "Research Ethics & Intellectual Property",
        mcqs: [
          {
            id: "cs11-ch8-t8.2-m1",
            question: "Obtaining explicit permission from study participants after informing them about the study's purpose is known as:",
            options: ["Confidentiality", "Informed Consent", "Integrity", "Copyright"],
            answer: "(b)",
            correctIndex: 1,
            answerKey: "Informed Consent",
            marks: 1,
            category: "topic"
          },
          {
            id: "cs11-ch8-t8.2-m2",
            question: "An exclusive legal right granted for a new invention or technical solution that prevents others from making or selling it is a:",
            options: ["Trademark", "Patent", "Copyright", "Industrial Design"],
            answer: "(b)",
            correctIndex: 1,
            answerKey: "Patent",
            marks: 1,
            category: "topic"
          },
          {
            id: "cs11-ch8-t8.2-m3",
            question: "Which form of intellectual property protects brand logos, names, and slogans (e.g., National Foods logo)?",
            options: ["Patent", "Trade Secret", "Trademark", "Copyright"],
            answer: "(c)",
            correctIndex: 2,
            answerKey: "Trademark",
            marks: 1,
            category: "topic"
          },
          {
            id: "cs11-ch8-t8.2-m4",
            question: "In Pakistan, the official government organization responsible for registering and protecting intellectual property rights is:",
            options: ["SECP", "IPO Pakistan", "FBR", "HEC"],
            answer: "(b)",
            correctIndex: 1,
            answerKey: "IPO Pakistan",
            marks: 1,
            category: "topic"
          }
        ],
        shortQuestions: [
          {
            id: "cs11-ch8-t8.2-sq5",
            question: "Explain the principles of Informed Consent and Confidentiality in research ethics.",
            marks: 2,
            category: "topic"
          },
          {
            id: "cs11-ch8-t8.2-sq6",
            question: "What is Integrity in academic research, and why must data falsification be avoided?",
            marks: 2,
            category: "topic"
          },
          {
            id: "cs11-ch8-t8.2-sq7",
            question: "Define Intellectual Property (IP) and explain its importance for creators.",
            marks: 2,
            category: "topic"
          },
          {
            id: "cs11-ch8-t8.2-sq8",
            question: "Differentiate between a Patent, a Trademark, a Copyright, an Industrial Design, and a Trade Secret with examples.",
            marks: 2,
            category: "topic"
          },
          {
            id: "cs11-ch8-t8.2-sq9",
            question: "What is the role of IPO Pakistan in protecting intellectual property rights?",
            marks: 2,
            category: "topic"
          }
        ],
        longQuestions: []
      },
      {
        id: "cs-11-ch8-topic-8.3",
        topicNumber: "8.3",
        name: "Cybersecurity & Digital Protection",
        mcqs: [
          {
            id: "cs11-ch8-m1",
            question: "A type of malware that replicates itself:",
            options: ["Trojan", "Worm", "Spyware", "Ransomware"],
            answer: "(b)",
            correctIndex: 1,
            answerKey: "Worm",
            marks: 1,
            isExercise: true,
            category: "exercise"
          },
          {
            id: "cs11-ch8-m2",
            question: "Encryption that uses the same key for encryption and decryption:",
            options: [
              "Asymmetric encryption",
              "Public-key encryption",
              "Symmetric encryption",
              "Hash function"
            ],
            answer: "(c)",
            correctIndex: 2,
            answerKey: "Symmetric encryption",
            marks: 1,
            isExercise: true,
            category: "exercise"
          },
          {
            id: "cs11-ch8-m3",
            question: "A security practice of keeping systems up-to-date:",
            options: ["Patching", "Backing up", "Logging", "Monitoring"],
            answer: "(a)",
            correctIndex: 0,
            answerKey: "Patching",
            marks: 1,
            isExercise: true,
            category: "exercise"
          },
          {
            id: "cs11-ch8-m4",
            question: "Unauthorized access to computer systems:",
            options: ["Hacking", "Programming", "Debugging", "Testing"],
            answer: "(a)",
            correctIndex: 0,
            answerKey: "Hacking",
            marks: 1,
            isExercise: true,
            category: "exercise"
          },
          {
            id: "cs11-ch8-m5",
            question: "Authentication factor that requires something you know:",
            options: ["Biometrics", "Smart card", "Password", "Token"],
            answer: "(c)",
            correctIndex: 2,
            answerKey: "Password",
            marks: 1,
            isExercise: true,
            category: "exercise"
          },
          {
            id: "cs11-ch8-m6",
            question: "Creating multiple copies of data for protection:",
            options: ["Encryption", "Backup", "Compression", "Archiving"],
            answer: "(b)",
            correctIndex: 1,
            answerKey: "Backup",
            marks: 1,
            isExercise: true,
            category: "exercise"
          },
          {
            id: "cs11-ch8-m7",
            question: "Protection against unauthorized data access:",
            options: ["Availability", "Integrity", "Confidentiality", "Authenticity"],
            answer: "(c)",
            correctIndex: 2,
            answerKey: "Confidentiality",
            marks: 1,
            isExercise: true,
            category: "exercise"
          },
          {
            id: "cs11-ch8-m8",
            question: "A security layer that monitors network activity:",
            options: ["Firewall", "Router", "Gateway", "Switch"],
            answer: "(a)",
            correctIndex: 0,
            answerKey: "Firewall",
            marks: 1,
            isExercise: true,
            category: "exercise"
          },
          {
            id: "cs11-ch8-m9",
            question: "Unauthorized use of someone's identity online:",
            options: ["Phishing", "Identity theft", "Cyberstalking", "Catfishing"],
            answer: "(b)",
            correctIndex: 1,
            answerKey: "Identity theft",
            marks: 1,
            isExercise: true,
            category: "exercise"
          },
          {
            id: "cs11-ch8-m10",
            question: "Use of multiple security methods together:",
            options: ["Layering", "Encryption", "Defense in depth", "Multi-factor"],
            answer: "(c)",
            correctIndex: 2,
            answerKey: "Defense in depth",
            marks: 1,
            isExercise: true,
            category: "exercise"
          }
        ],
        shortQuestions: [],
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
            question: "What is the correct sequence of the 5 key steps in the Design Thinking process?",
            options: [
              "Ideate ➔ Prototype ➔ Define ➔ Empathize ➔ Test",
              "Empathize ➔ Define ➔ Ideate ➔ Prototype ➔ Test",
              "Define ➔ Empathize ➔ Test ➔ Prototype ➔ Ideate",
              "Prototype ➔ Test ➔ Ideate ➔ Empathize ➔ Define"
            ],
            answer: "(b)",
            correctIndex: 1,
            answerKey: "Empathize ➔ Define ➔ Ideate ➔ Prototype ➔ Test",
            marks: 1,
            category: "topic"
          },
          {
            id: "cs11-ch9-t9.1-m2",
            question: "In Design Thinking, creating a simple, quick, and low-cost model of an idea to show how it works is called:",
            options: ["Empathizing", "Ideating", "Prototyping", "Segmenting"],
            answer: "(c)",
            correctIndex: 2,
            answerKey: "Prototyping",
            marks: 1,
            category: "topic"
          }
        ],
        shortQuestions: [
          {
            id: "cs11-ch9-t9.1-sq1",
            question: "Define Design Thinking and list its 5 key steps in correct sequential order.",
            marks: 2,
            category: "topic"
          },
          {
            id: "cs11-ch9-t9.1-sq2",
            question: "Differentiate between the Empathize stage and the Define stage in Design Thinking.",
            marks: 2,
            category: "topic"
          },
          {
            id: "cs11-ch9-t9.1-sq3",
            question: "What is a Prototype, and why is prototyping crucial before launching a product?",
            marks: 2,
            category: "topic"
          }
        ],
        longQuestions: []
      },
      {
        id: "cs-11-ch9-topic-9.2",
        topicNumber: "9.2",
        name: "Creating a Business Plan & Market Insights",
        mcqs: [
          {
            id: "cs11-ch9-t9.2-m1",
            question: "Which section of a business plan provides a high-level brief overview capturing the most important points of the entire plan?",
            options: [
              "Market Analysis",
              "Financial Plan",
              "Executive Summary",
              "Business Description"
            ],
            answer: "(c)",
            correctIndex: 2,
            answerKey: "Executive Summary",
            marks: 1,
            category: "topic"
          },
          {
            id: "cs11-ch9-t9.2-m2",
            question: "Research that focuses on understanding underlying opinions and motivations using non-numerical data (such as interviews and focus groups) is:",
            options: [
              "Quantitative Research",
              "Qualitative Research",
              "Predictive Research",
              "Statistical Research"
            ],
            answer: "(b)",
            correctIndex: 1,
            answerKey: "Qualitative Research",
            marks: 1,
            category: "topic"
          },
          {
            id: "cs11-ch9-t9.2-m3",
            question: "Dividing a large target market into smaller, specific groups based on age, income, or buying habits is known as:",
            options: [
              "Market Research",
              "Market Segmentation",
              "Competitor Analysis",
              "Business Pitching"
            ],
            answer: "(b)",
            correctIndex: 1,
            answerKey: "Market Segmentation",
            marks: 1,
            category: "topic"
          }
        ],
        shortQuestions: [
          {
            id: "cs11-ch9-t9.2-sq4",
            question: "What is a Business Plan, and why is the Executive Summary section considered its most critical part?",
            marks: 2,
            category: "topic"
          },
          {
            id: "cs11-ch9-t9.2-sq5",
            question: "List six key sections that must be included in a standard business plan.",
            marks: 2,
            category: "topic"
          },
          {
            id: "cs11-ch9-t9.2-sq6",
            question: "Differentiate between Qualitative Research and Quantitative Research in market analysis.",
            marks: 2,
            category: "topic"
          },
          {
            id: "cs11-ch9-t9.2-sq7",
            question: "Differentiate between Customer Surveys and Focus Groups.",
            marks: 2,
            category: "topic"
          },
          {
            id: "cs11-ch9-t9.2-sq8",
            question: "Define Market Segmentation and explain how it helps businesses target specific customer groups.",
            marks: 2,
            category: "topic"
          },
          {
            id: "cs11-ch9-t9.2-sq9",
            question: "What is a Business Pitch, and what five key steps should be followed when pitching an idea?",
            marks: 2,
            category: "topic"
          },
          {
            id: "cs11-ch9-t9.2-s1",
            question: "What are the main components of a business plan?",
            marks: 2,
            isExercise: true,
            category: "exercise"
          },
          {
            id: "cs11-ch9-t9.2-s2",
            question: "How does Design Thinking approach help in developing business solutions?",
            marks: 2,
            isExercise: true,
            category: "exercise"
          },
          {
            id: "cs11-ch9-t9.2-s3",
            question: "What is the importance of market research in entrepreneurship?",
            marks: 2,
            isExercise: true,
            category: "exercise"
          }
        ],
        longQuestions: []
      },
      {
        id: "cs-11-ch9-topic-9.3",
        topicNumber: "9.3",
        name: "Marketing, Sales & Financial Concepts",
        mcqs: [
          {
            id: "cs11-ch9-t9.3-m1",
            question: "What is the basic financial formula used to calculate business Profit?",
            options: [
              "Profit = Revenue + Costs",
              "Profit = Revenue - Costs",
              "Profit = Costs \u00f7 Revenue",
              "Profit = Investment \u00d7 Savings"
            ],
            answer: "(b)",
            correctIndex: 1,
            answerKey: "Profit = Revenue - Costs",
            marks: 1,
            category: "topic"
          }
        ],
        shortQuestions: [
          {
            id: "cs11-ch9-t9.3-sq10",
            question: "Differentiate between Revenue, Expenses, and Profit, and state the mathematical formula for Profit.",
            marks: 2,
            category: "topic"
          },
          {
            id: "cs11-ch9-t9.3-sq11",
            question: "Differentiate between Investment and Savings in a business context.",
            marks: 2,
            category: "topic"
          },
          {
            id: "cs11-ch9-t9.3-s1",
            question: "How should financial planning be incorporated into a business plan?",
            marks: 2,
            isExercise: true,
            category: "exercise"
          }
        ],
        longQuestions: []
      },
      {
        id: "cs-11-ch9-topic-9.4",
        topicNumber: "9.4",
        name: "Communication & Storytelling",
        mcqs: [],
        shortQuestions: [
          {
            id: "cs11-ch9-t9.4-s1",
            question: "Explain the difference between effective communication and storytelling in business pitches.",
            marks: 2,
            isExercise: true,
            category: "exercise"
          }
        ],
        longQuestions: []
      },
      {
        id: "cs-11-ch9-topic-9.5",
        topicNumber: "9.5",
        name: "Collaboration, Iteration & Innovation",
        mcqs: [
          {
            id: "cs11-ch9-t9.5-m1",
            question: "Repeating a process to make continuous improvements based on feedback until the final outcome is achieved is called:",
            options: ["Innovation", "Iteration", "Collaboration", "Pitching"],
            answer: "(b)",
            correctIndex: 1,
            answerKey: "Iteration",
            marks: 1,
            category: "topic"
          },
          {
            id: "cs11-ch9-t9.5-m2",
            question: "Developing new ideas, products, or methods that bring significant improvement or value to existing processes is defined as:",
            options: ["Iteration", "Innovation", "Prototyping", "Budgeting"],
            answer: "(b)",
            correctIndex: 1,
            answerKey: "Innovation",
            marks: 1,
            category: "topic"
          }
        ],
        shortQuestions: [
          {
            id: "cs11-ch9-t9.5-sq12",
            question: "Differentiate between Collaboration and Iteration in product development.",
            marks: 2,
            category: "topic"
          },
          {
            id: "cs11-ch9-t9.5-sq13",
            question: "Differentiate between Innovation and Creativity with real-world examples.",
            marks: 2,
            category: "topic"
          },
          {
            id: "cs11-ch9-t9.5-s1",
            question: "What is the role of innovation and creativity in business success?",
            marks: 2,
            isExercise: true,
            category: "exercise"
          },
          {
            id: "cs11-ch9-t9.5-s2",
            question: "How does collaboration improve the entrepreneurial process?",
            marks: 2,
            isExercise: true,
            category: "exercise"
          },
          {
            id: "cs11-ch9-t9.5-s3",
            question: "What are the benefits of iterating on business ideas based on feedback?",
            marks: 2,
            isExercise: true,
            category: "exercise"
          }
        ],
        longQuestions: []
      },
      {
        id: "cs-11-ch9-topic-9.6",
        topicNumber: "9.6",
        name: "Emerging Technologies & Innovation in Business",
        mcqs: [
          {
            id: "cs11-ch9-m1",
            question: "Technology that creates computer-generated environments:",
            options: [
              "Artificial Intelligence",
              "Virtual Reality",
              "Machine Learning",
              "Augmented Reality"
            ],
            answer: "(b)",
            correctIndex: 1,
            answerKey: "Virtual Reality",
            marks: 1,
            isExercise: true,
            category: "exercise"
          },
          {
            id: "cs11-ch9-m2",
            question: "Computing done on remote servers accessed via internet:",
            options: [
              "Edge computing",
              "Cloud computing",
              "Fog computing",
              "Distributed computing"
            ],
            answer: "(b)",
            correctIndex: 1,
            answerKey: "Cloud computing",
            marks: 1,
            isExercise: true,
            category: "exercise"
          },
          {
            id: "cs11-ch9-m3",
            question: "Technology enabling decentralized data storage:",
            options: ["Blockchain", "Database", "File system", "Cache"],
            answer: "(a)",
            correctIndex: 0,
            answerKey: "Blockchain",
            marks: 1,
            isExercise: true,
            category: "exercise"
          },
          {
            id: "cs11-ch9-m4",
            question: "Ability of devices to connect and communicate with each other:",
            options: ["AI", "IoT", "ML", "AR"],
            answer: "(b)",
            correctIndex: 1,
            answerKey: "IoT",
            marks: 1,
            isExercise: true,
            category: "exercise"
          },
          {
            id: "cs11-ch9-m5",
            question: "Algorithms that learn from data without explicit programming:",
            options: [
              "Artificial Intelligence",
              "Deep Learning",
              "Machine Learning",
              "Neural Networks"
            ],
            answer: "(c)",
            correctIndex: 2,
            answerKey: "Machine Learning",
            marks: 1,
            isExercise: true,
            category: "exercise"
          },
          {
            id: "cs11-ch9-m6",
            question: "Technology overlaying digital information on real world:",
            options: [
              "Virtual Reality",
              "Augmented Reality",
              "Mixed Reality",
              "Extended Reality"
            ],
            answer: "(b)",
            correctIndex: 1,
            answerKey: "Augmented Reality",
            marks: 1,
            isExercise: true,
            category: "exercise"
          },
          {
            id: "cs11-ch9-m7",
            question: "Type of network spread across large geographic areas:",
            options: ["LAN", "MAN", "WAN", "PAN"],
            answer: "(c)",
            correctIndex: 2,
            answerKey: "WAN",
            marks: 1,
            isExercise: true,
            category: "exercise"
          },
          {
            id: "cs11-ch9-m8",
            question: "5G technology primarily improves:",
            options: [
              "Power consumption",
              "Speed and latency",
              "Display quality",
              "Battery life"
            ],
            answer: "(b)",
            correctIndex: 1,
            answerKey: "Speed and latency",
            marks: 1,
            isExercise: true,
            category: "exercise"
          },
          {
            id: "cs11-ch9-m9",
            question: "Transfer of learning from one task to another:",
            options: [
              "Deep Learning",
              "Reinforcement Learning",
              "Transfer Learning",
              "Supervised Learning"
            ],
            answer: "(c)",
            correctIndex: 2,
            answerKey: "Transfer Learning",
            marks: 1,
            isExercise: true,
            category: "exercise"
          },
          {
            id: "cs11-ch9-m10",
            question: "Computing at the edge of the network:",
            options: [
              "Cloud computing",
              "Edge computing",
              "Fog computing",
              "Central computing"
            ],
            answer: "(b)",
            correctIndex: 1,
            answerKey: "Edge computing",
            marks: 1,
            isExercise: true,
            category: "exercise"
          }
        ],
        shortQuestions: [],
        longQuestions: []
      }
    ]
  }
];
