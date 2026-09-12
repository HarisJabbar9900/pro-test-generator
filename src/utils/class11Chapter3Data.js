/**
 * Class 11th Computer Science - Chapter 3: Algorithms & Problem Solving
 * Complete Board-Style Topic-Wise Question Bank & Official Exercises
 */

export const CLASS_11_CHAPTER_3_TOPICS = [
  {
    "id": "cs-11-ch3-topic-3.1",
    "topicNumber": "3.1",
    "name": "Understanding Computational Problems",
    "mcqs": [
      {
        "id": "cs11-ch3-t3.1-m1",
        "question": "A computational problem is defined as a challenge that can be solved using:",
        "options": [
          "Physical electronic circuits",
          "An algorithm (step-by-step instructions)",
          "Manual record books",
          "Hardware expansion cards"
        ],
        "answer": "(b)",
        "correctIndex": 1,
        "answerKey": "An algorithm (step-by-step instructions)",
        "marks": 1
      },
      {
        "id": "cs11-ch3-t3.1-m2",
        "question": "Which classification of computational problems requires an output that is strictly \"yes\" or \"no\"?",
        "options": [
          "Search Problems",
          "Optimization Problems",
          "Decision Problems",
          "Counting Problems"
        ],
        "answer": "(c)",
        "correctIndex": 2,
        "answerKey": "Decision Problems",
        "marks": 1
      },
      {
        "id": "cs11-ch3-t3.1-m3",
        "question": "Problems that have clear goals, defined inputs, processes, and outputs (e.g., determining if a number is even) are called:",
        "options": [
          "Ill-defined Problems",
          "Well-defined Problems",
          "Unsolvable Problems",
          "Intractable Problems"
        ],
        "answer": "(b)",
        "correctIndex": 1,
        "answerKey": "Well-defined Problems",
        "marks": 1
      },
      {
        "id": "cs11-ch3-t3.1-m4",
        "question": "A problem that lacks clarity regarding initial requirements, success criteria, or expected output is known as an:",
        "options": [
          "Ill-defined problem",
          "Intractable problem",
          "Optimized problem",
          "Algorithmic problem"
        ],
        "answer": "(a)",
        "correctIndex": 0,
        "answerKey": "Ill-defined problem",
        "marks": 1
      },
      {
        "id": "cs11-ch3-b1",
        "question": "A computational problem is best defined as a challenge that can be solved through a computational process using:",
        "options": [
          "Physical hardware testing",
          "An algorithm (step-by-step instructions)",
          "High-speed network cables",
          "Unstructured random guessing"
        ],
        "answer": "(b)",
        "correctIndex": 1,
        "answerKey": "An algorithm (step-by-step instructions)",
        "marks": 1
      },
      {
        "id": "cs11-ch3-b2",
        "question": "Which classification of computational problems yields a simple \"yes\" or \"no\" answer?",
        "options": [
          "Search Problems",
          "Optimization Problems",
          "Decision Problems",
          "Counting Problems"
        ],
        "answer": "(c)",
        "correctIndex": 2,
        "answerKey": "Decision Problems",
        "marks": 1
      },
      {
        "id": "cs11-ch3-b3",
        "question": "A problem aimed at finding the best possible solution according to specific criteria (such as finding the shortest delivery route) is an:",
        "options": [
          "Decision Problem",
          "Optimization Problem",
          "Counting Problem",
          "Ill-defined Problem"
        ],
        "answer": "(b)",
        "correctIndex": 1,
        "answerKey": "Optimization Problem",
        "marks": 1
      },
      {
        "id": "cs11-ch3-b4",
        "question": "Which of the following represents an ill-defined problem?",
        "options": [
          "Determining if a number is even or odd",
          "Calculating the square root of 81",
          "How to reduce poverty in a country",
          "Sorting ten integers in ascending order"
        ],
        "answer": "(c)",
        "correctIndex": 2,
        "answerKey": "How to reduce poverty in a country",
        "marks": 1
      }
    ],
    "shortQuestions": [
      {
        "id": "cs11-ch3-t3.1-sq1",
        "question": "Define a computational problem and state its three fundamental components (Input, Processing, Output).",
        "marks": 2,
        "category": "topic"
      },
      {
        "id": "cs11-ch3-t3.1-sq2",
        "question": "Differentiate between Decision Problems, Search Problems, Counting Problems, and Optimization Problems.",
        "marks": 2,
        "category": "topic"
      },
      {
        "id": "cs11-ch3-t3.1-sq3",
        "question": "Differentiate between Well-defined and Ill-defined problems in computational thinking.",
        "marks": 2,
        "category": "topic"
      },
      {
        "id": "cs11-ch3-t3.1-sq4",
        "question": "What are Constraints in problem formulation, and why must they be identified early?",
        "marks": 2,
        "category": "topic"
      },
      {
        "id": "cs11-ch3-t3.1-sq5",
        "question": "Why is problem decomposition essential when solving complex computing tasks?",
        "marks": 2,
        "category": "topic"
      }
    ],
    "longQuestions": []
  },
  {
    "id": "cs-11-ch3-topic-3.2",
    "topicNumber": "3.2",
    "name": "Algorithms for Problem Solving",
    "mcqs": [
      {
        "id": "cs11-ch3-t3.2-m1",
        "question": "Which problem-solving strategy generates all potential candidate solutions and tests each against a verification predicate?",
        "options": [
          "Generate-and-Test (Trial and Error)",
          "Dynamic Programming",
          "Greedy Heuristics",
          "Binary Divide and Conquer"
        ],
        "answer": "(a)",
        "correctIndex": 0,
        "answerKey": "Generate-and-Test (Trial and Error)",
        "marks": 1
      },
      {
        "id": "cs11-ch3-t3.2-m2",
        "question": "The primary limitation of the Generate-and-Test method for problems with large search spaces is:",
        "options": [
          "Inability to find an optimal solution",
          "Combinatorial explosion of test states",
          "Need for recursive data structures",
          "Requirement of a deterministic compiler"
        ],
        "answer": "(b)",
        "correctIndex": 1,
        "answerKey": "Combinatorial explosion of test states",
        "marks": 1
      },
      {
        "id": "cs11-ch3-b5",
        "question": "An algorithmic method that systematically generates potential solutions and tests each one until a valid solution is found is called the:",
        "options": [
          "Divide and Conquer Method",
          "Generate-and-Test Method",
          "Dynamic Programming Method",
          "Greedy Approach"
        ],
        "answer": "(b)",
        "correctIndex": 1,
        "answerKey": "Generate-and-Test Method",
        "marks": 1
      }
    ],
    "shortQuestions": [
      {
        "id": "cs11-ch3-t3.2-sq6",
        "question": "Explain the working principle of the Generate-and-Test algorithmic technique.",
        "marks": 2,
        "category": "topic"
      },
      {
        "id": "cs11-ch3-t3.2-sq7",
        "question": "State two advantages and two disadvantages of using Generate-and-Test for computational search.",
        "marks": 2,
        "category": "topic"
      }
    ],
    "longQuestions": []
  },
  {
    "id": "cs-11-ch3-topic-3.3",
    "topicNumber": "3.3",
    "name": "Problem Solvability and Complexity",
    "mcqs": [
      {
        "id": "cs11-ch3-t3.3-m1",
        "question": "Problems for which no algorithm can ever be designed that will always provide a correct answer for all inputs are:",
        "options": [
          "Unsolvable / Undecidable Problems",
          "NP-Complete Problems",
          "Intractable Problems",
          "Polynomial-time Problems"
        ],
        "answer": "(a)",
        "correctIndex": 0,
        "answerKey": "Unsolvable / Undecidable Problems",
        "marks": 1
      },
      {
        "id": "cs11-ch3-t3.3-m2",
        "question": "A classic example of an undecidable/unsolvable problem in computer science is the:",
        "options": [
          "Halting Problem (Turing)",
          "Traveling Salesperson Problem",
          "Sorting Problem",
          "Tower of Hanoi"
        ],
        "answer": "(a)",
        "correctIndex": 0,
        "answerKey": "Halting Problem (Turing)",
        "marks": 1
      },
      {
        "id": "cs11-ch3-t3.3-m3",
        "question": "Problems that can theoretically be solved by an algorithm, but require exponential or factorial time (e.g. O(2^n)), making them practically impossible for large n, are:",
        "options": [
          "Intractable Problems",
          "Tractable Problems",
          "Unsolvable Problems",
          "Linear Problems"
        ],
        "answer": "(a)",
        "correctIndex": 0,
        "answerKey": "Intractable Problems",
        "marks": 1
      },
      {
        "id": "cs11-ch3-t3.3-m4",
        "question": "The computational complexity class \"P\" consists of all decision problems that can be solved by a deterministic algorithm in:",
        "options": [
          "Polynomial time O(n^k)",
          "Exponential time O(k^n)",
          "Factorial time O(n!)",
          "Infinite time"
        ],
        "answer": "(a)",
        "correctIndex": 0,
        "answerKey": "Polynomial time O(n^k)",
        "marks": 1
      },
      {
        "id": "cs11-ch3-b6",
        "question": "A problem in computer science is classified as unsolvable if:",
        "options": [
          "Execution takes longer than one hour",
          "No algorithm can be created that guarantees a solution for all possible inputs",
          "It requires exponential RAM memory",
          "It cannot be implemented in Python"
        ],
        "answer": "(b)",
        "correctIndex": 1,
        "answerKey": "No algorithm can be created that guarantees a solution for all possible inputs",
        "marks": 1
      },
      {
        "id": "cs11-ch3-b7",
        "question": "Which famous problem proved by Alan Turing serves as a classic example of an unsolvable problem?",
        "options": [
          "Traveling Salesman Problem",
          "The Halting Problem",
          "Sudoku Puzzle",
          "Knapsack Problem"
        ],
        "answer": "(b)",
        "correctIndex": 1,
        "answerKey": "The Halting Problem",
        "marks": 1
      },
      {
        "id": "cs11-ch3-b8",
        "question": "Problems that can be solved in polynomial time O(n^k) using a deterministic algorithm are called:",
        "options": [
          "Intractable Problems",
          "Unsolvable Problems",
          "Tractable Problems",
          "NP-Hard Problems"
        ],
        "answer": "(c)",
        "correctIndex": 2,
        "answerKey": "Tractable Problems",
        "marks": 1
      },
      {
        "id": "cs11-ch3-b9",
        "question": "The complexity class P consists of problems that can be:",
        "options": [
          "Verified in polynomial time but solved in exponential time",
          "Solved efficiently by a computer in polynomial time",
          "Solved only using quantum computing",
          "Solved only using non-deterministic machines"
        ],
        "answer": "(b)",
        "correctIndex": 1,
        "answerKey": "Solved efficiently by a computer in polynomial time",
        "marks": 1
      },
      {
        "id": "cs11-ch3-b10",
        "question": "The complexity class NP represents problems where a proposed solution can be:",
        "options": [
          "Solved instantly without any processing",
          "Checked / verified quickly (in polynomial time) by a computer",
          "Executed in constant time O(1)",
          "Never verified by any computing system"
        ],
        "answer": "(b)",
        "correctIndex": 1,
        "answerKey": "Checked / verified quickly (in polynomial time) by a computer",
        "marks": 1
      },
      {
        "id": "cs11-ch3-b11",
        "question": "The classic Knapsack Problem, which belongs to a subset of NP problems that are at least as hard as the hardest problems in NP, is classified as:",
        "options": [
          "Class P",
          "NP-Complete",
          "Linear Problem",
          "Constant Time Problem"
        ],
        "answer": "(b)",
        "correctIndex": 1,
        "answerKey": "NP-Complete",
        "marks": 1
      }
    ],
    "shortQuestions": [
      {
        "id": "cs11-ch3-t3.3-sq8",
        "question": "Differentiate between Solvable and Unsolvable problems in computer science.",
        "marks": 2,
        "category": "topic"
      },
      {
        "id": "cs11-ch3-t3.3-sq9",
        "question": "Briefly explain Turing's Halting Problem and why it is undecidable.",
        "marks": 2,
        "category": "topic"
      },
      {
        "id": "cs11-ch3-t3.3-sq10",
        "question": "Compare Tractable and Intractable problems with suitable examples.",
        "marks": 2,
        "category": "topic"
      },
      {
        "id": "cs11-ch3-t3.3-sq11",
        "question": "Differentiate between Complexity Class P and Complexity Class NP.",
        "marks": 2,
        "category": "topic"
      }
    ],
    "longQuestions": []
  },
  {
    "id": "cs-11-ch3-topic-3.4",
    "topicNumber": "3.4",
    "name": "Algorithm Analysis",
    "mcqs": [
      {
        "id": "cs11-ch3-t3.4-m1",
        "question": "Which asymptotic notation represents the upper bound (worst-case scenario) of an algorithm's running time?",
        "options": [
          "Big-O (O)",
          "Big-Omega (Ω)",
          "Big-Theta (Θ)",
          "Little-o"
        ],
        "answer": "(a)",
        "correctIndex": 0,
        "answerKey": "Big-O (O)",
        "marks": 1
      },
      {
        "id": "cs11-ch3-t3.4-m2",
        "question": "The time complexity of Binary Search on a sorted array of n elements is:",
        "options": [
          "O(log n)",
          "O(n)",
          "O(n log n)",
          "O(1)"
        ],
        "answer": "(a)",
        "correctIndex": 0,
        "answerKey": "O(log n)",
        "marks": 1
      },
      {
        "id": "cs11-ch3-t3.4-m3",
        "question": "If an algorithm's running time doubles each time the input size increases by 1, its time complexity is:",
        "options": [
          "Exponential O(2^n)",
          "Quadratic O(n^2)",
          "Linear O(n)",
          "Logarithmic O(log n)"
        ],
        "answer": "(a)",
        "correctIndex": 0,
        "answerKey": "Exponential O(2^n)",
        "marks": 1
      },
      {
        "id": "cs11-ch3-b12",
        "question": "Big O notation is a mathematical notation used to describe an algorithm's:",
        "options": [
          "Total number of code lines",
          "Upper bound runtime or space requirement as input size grows",
          "Exact execution duration in milliseconds",
          "Syntax error frequency"
        ],
        "answer": "(b)",
        "correctIndex": 1,
        "answerKey": "Upper bound runtime or space requirement as input size grows",
        "marks": 1
      },
      {
        "id": "cs11-ch3-b13",
        "question": "An algorithm whose execution time remains unchanged regardless of input size has a time complexity of:",
        "options": [
          "O(n)",
          "O(log n)",
          "O(1)",
          "O(n^2)"
        ],
        "answer": "(c)",
        "correctIndex": 2,
        "answerKey": "O(1)",
        "marks": 1
      },
      {
        "id": "cs11-ch3-b14",
        "question": "Searching for a specific record by scanning through an unsorted list of n items one by one has a time complexity of:",
        "options": [
          "O(1)",
          "O(n)",
          "O(n^2)",
          "O(2^n)"
        ],
        "answer": "(b)",
        "correctIndex": 1,
        "answerKey": "O(n)",
        "marks": 1
      },
      {
        "id": "cs11-ch3-b15",
        "question": "What is the time complexity of Binary Search on a sorted array of size n?",
        "options": [
          "O(n)",
          "O(n^2)",
          "O(log n)",
          "O(1)"
        ],
        "answer": "(c)",
        "correctIndex": 2,
        "answerKey": "O(log n)",
        "marks": 1
      },
      {
        "id": "cs11-ch3-b16",
        "question": "Space complexity in algorithm analysis measures:",
        "options": [
          "Physical monitor resolution requirements",
          "The amount of memory an algorithm uses relative to input size",
          "CPU clock speed utilization",
          "Network bandwidth consumption"
        ],
        "answer": "(b)",
        "correctIndex": 1,
        "answerKey": "The amount of memory an algorithm uses relative to input size",
        "marks": 1
      }
    ],
    "shortQuestions": [
      {
        "id": "cs11-ch3-t3.4-sq12",
        "question": "Define Time Complexity and Space Complexity of an algorithm.",
        "marks": 2,
        "category": "topic"
      },
      {
        "id": "cs11-ch3-t3.4-sq13",
        "question": "Explain Big-O notation and why constants and lower-order terms are ignored.",
        "marks": 2,
        "category": "topic"
      },
      {
        "id": "cs11-ch3-t3.4-sq14",
        "question": "Differentiate between Worst-case, Best-case, and Average-case time complexities.",
        "marks": 2,
        "category": "topic"
      }
    ],
    "longQuestions": []
  },
  {
    "id": "cs-11-ch3-topic-3.5",
    "topicNumber": "3.5",
    "name": "Algorithm Design Techniques",
    "mcqs": [
      {
        "id": "cs11-ch3-t3.5-m1",
        "question": "The algorithm design paradigm that divides a problem into subproblems, solves them recursively, and combines results is:",
        "options": [
          "Divide and Conquer",
          "Greedy Method",
          "Brute Force",
          "Backtracking"
        ],
        "answer": "(a)",
        "correctIndex": 0,
        "answerKey": "Divide and Conquer",
        "marks": 1
      },
      {
        "id": "cs11-ch3-t3.5-m2",
        "question": "An algorithmic approach that makes the locally optimal choice at each step hoping for a global optimum is called:",
        "options": [
          "Greedy Algorithm",
          "Dynamic Programming",
          "Generate-and-Test",
          "Exhaustive Search"
        ],
        "answer": "(a)",
        "correctIndex": 0,
        "answerKey": "Greedy Algorithm",
        "marks": 1
      },
      {
        "id": "cs11-ch3-b17",
        "question": "The design technique that breaks a problem into smaller subproblems, solves them independently, and combines their solutions is:",
        "options": [
          "Greedy Approach",
          "Divide and Conquer",
          "Backtracking",
          "Dynamic Programming"
        ],
        "answer": "(b)",
        "correctIndex": 1,
        "answerKey": "Divide and Conquer",
        "marks": 1
      },
      {
        "id": "cs11-ch3-b18",
        "question": "A Greedy Algorithm arrives at a solution by:",
        "options": [
          "Evaluating all possible future choices simultaneously",
          "Making a locally optimal choice at each step with the hope of finding a global optimum",
          "Storing past calculations in a lookup table",
          "Retracing steps whenever an error occurs"
        ],
        "answer": "(b)",
        "correctIndex": 1,
        "answerKey": "Making a locally optimal choice at each step with the hope of finding a global optimum",
        "marks": 1
      },
      {
        "id": "cs11-ch3-b19",
        "question": "Which algorithmic technique solves complex problems by breaking them down into overlapping subproblems and storing results to avoid redundant calculations?",
        "options": [
          "Backtracking",
          "Dynamic Programming (DP)",
          "Generate-and-Test",
          "Linear Search"
        ],
        "answer": "(b)",
        "correctIndex": 1,
        "answerKey": "Dynamic Programming (DP)",
        "marks": 1
      },
      {
        "id": "cs11-ch3-b20",
        "question": "Trying candidate solutions step-by-step and reversing (turning back) as soon as a path fails to lead to a valid solution is known as:",
        "options": [
          "Divide and Conquer",
          "Greedy Approach",
          "Backtracking",
          "Binary Slicing"
        ],
        "answer": "(c)",
        "correctIndex": 2,
        "answerKey": "Backtracking",
        "marks": 1
      }
    ],
    "shortQuestions": [
      {
        "id": "cs11-ch3-t3.5-sq15",
        "question": "Explain the three phases of the Divide-and-Conquer strategy.",
        "marks": 2,
        "category": "topic"
      },
      {
        "id": "cs11-ch3-t3.5-sq16",
        "question": "How do Greedy Algorithms work? Mention one limitation of this approach.",
        "marks": 2,
        "category": "topic"
      },
      {
        "id": "cs11-ch3-t3.5-sq17",
        "question": "Define Dynamic Programming and explain how it differs from Divide and Conquer.",
        "marks": 2,
        "category": "topic"
      }
    ],
    "longQuestions": []
  },
  {
    "id": "cs-11-ch3-topic-3.6",
    "topicNumber": "3.6",
    "name": "Commonly Used Algorithms & Graph Traversal",
    "mcqs": [
      {
        "id": "cs11-ch3-t3.6-m1",
        "question": "Which sorting algorithm repeatedly steps through the list, compares adjacent items, and swaps them if in wrong order?",
        "options": [
          "Bubble Sort",
          "Selection Sort",
          "Insertion Sort",
          "Quick Sort"
        ],
        "answer": "(a)",
        "correctIndex": 0,
        "answerKey": "Bubble Sort",
        "marks": 1
      },
      {
        "id": "cs11-ch3-t3.6-m2",
        "question": "The worst-case time complexity of Bubble Sort on an array of size n is:",
        "options": [
          "O(n^2)",
          "O(n log n)",
          "O(n)",
          "O(log n)"
        ],
        "answer": "(a)",
        "correctIndex": 0,
        "answerKey": "O(n^2)",
        "marks": 1
      },
      {
        "id": "cs11-ch3-t3.6-m3",
        "question": "Which graph traversal algorithm uses a Queue data structure to explore nodes level-by-level?",
        "options": [
          "Breadth-First Search (BFS)",
          "Depth-First Search (DFS)",
          "Binary Search",
          "Dijkstra's Algorithm"
        ],
        "answer": "(a)",
        "correctIndex": 0,
        "answerKey": "Breadth-First Search (BFS)",
        "marks": 1
      },
      {
        "id": "cs11-ch3-b21",
        "question": "Which sorting algorithm repeatedly compares adjacent elements and swaps them if they are in the wrong order?",
        "options": [
          "Selection Sort",
          "Bubble Sort",
          "Binary Sort",
          "Quick Search"
        ],
        "answer": "(b)",
        "correctIndex": 1,
        "answerKey": "Bubble Sort",
        "marks": 1
      },
      {
        "id": "cs11-ch3-b22",
        "question": "Selection Sort operates by repeatedly finding the smallest element from the unsorted section and swapping it with:",
        "options": [
          "A random element in the list",
          "The first element of the unsorted section",
          "The last element of the sorted section",
          "The middle element"
        ],
        "answer": "(b)",
        "correctIndex": 1,
        "answerKey": "The first element of the unsorted section",
        "marks": 1
      },
      {
        "id": "cs11-ch3-b23",
        "question": "What essential prerequisite must be satisfied before applying Binary Search on a dataset?",
        "options": [
          "The dataset must contain prime numbers only",
          "The elements in the dataset must be sorted in order",
          "The dataset size must be under 10 elements",
          "The data must be arranged in a matrix"
        ],
        "answer": "(b)",
        "correctIndex": 1,
        "answerKey": "The elements in the dataset must be sorted in order",
        "marks": 1
      },
      {
        "id": "cs11-ch3-b24",
        "question": "Which graph traversal algorithm explores nodes level-by-level starting from the root using a queue data structure?",
        "options": [
          "Depth-First Search (DFS)",
          "Breadth-First Search (BFS)",
          "Binary Search",
          "Bubble Traversal"
        ],
        "answer": "(b)",
        "correctIndex": 1,
        "answerKey": "Breadth-First Search (BFS)",
        "marks": 1
      },
      {
        "id": "cs11-ch3-b25",
        "question": "Depth-First Search (DFS) explores as far down a branch as possible before backtracking, using which data structure to manage unvisited nodes?",
        "options": [
          "Queue",
          "Stack",
          "Array",
          "Linked List"
        ],
        "answer": "(b)",
        "correctIndex": 1,
        "answerKey": "Stack",
        "marks": 1
      }
    ],
    "shortQuestions": [
      {
        "id": "cs11-ch3-t3.6-sq18",
        "question": "Explain the working of Bubble Sort with a short example.",
        "marks": 2,
        "category": "topic"
      },
      {
        "id": "cs11-ch3-t3.6-sq19",
        "question": "Compare Breadth-First Search (BFS) and Depth-First Search (DFS).",
        "marks": 2,
        "category": "topic"
      }
    ],
    "longQuestions": []
  }
];
