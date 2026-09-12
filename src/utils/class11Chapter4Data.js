/**
 * Class 11th Computer Science - Chapter 4: Computational Structures
 * Complete Board-Style Topic-Wise Question Bank (25 Board MCQs + Previous Topic MCQs)
 */

export const CLASS_11_CHAPTER_4_TOPICS = [
  {
    "id": "cs-11-ch4-topic-4.1",
    "topicNumber": "4.1",
    "name": "Lists & Primitive Computational Structures",
    "mcqs": [
      {
        "id": "cs11-ch4-t4.1-m1",
        "question": "In Python, lists are classified as data structures that are:",
        "options": [
          "Mutable and ordered",
          "Immutable and ordered",
          "Mutable and unordered",
          "Immutable and unordered"
        ],
        "answer": "(a)",
        "correctIndex": 0,
        "answerKey": "Mutable and ordered",
        "marks": 1,
        "category": "topic"
      },
      {
        "id": "cs11-ch4-t4.1-m2",
        "question": "When two variables reference the exact same list object in memory, this situation is termed:",
        "options": [
          "Aliasing",
          "Cloning",
          "Slicing",
          "Deep Copying"
        ],
        "answer": "(a)",
        "correctIndex": 0,
        "answerKey": "Aliasing",
        "marks": 1,
        "category": "topic"
      },
      {
        "id": "cs11-ch4-b1",
        "topicNumber": "4.1",
        "question": "A list is a data structure used to store multiple items in a specific sequence where each element is located at a specific:",
        "options": [
          "Memory address",
          "Index",
          "Hash key",
          "Node height"
        ],
        "answer": "(b)",
        "correctIndex": 1,
        "answerKey": "Index",
        "marks": 1,
        "category": "topic"
      },
      {
        "id": "cs11-ch4-b2",
        "topicNumber": "4.1",
        "question": "Which property of Python lists allows them to expand or shrink dynamically as items are added or removed?",
        "options": [
          "Static Allocation",
          "Dynamic Size",
          "Fixed Slicing",
          "Immutable Storage"
        ],
        "answer": "(b)",
        "correctIndex": 1,
        "answerKey": "Dynamic Size",
        "marks": 1,
        "category": "topic"
      },
      {
        "id": "cs11-ch4-b3",
        "topicNumber": "4.1",
        "question": "In Python, indexing starts at zero, meaning the first item in a list always has an index of:",
        "options": [
          "1",
          "-1",
          "0",
          "None"
        ],
        "answer": "(c)",
        "correctIndex": 2,
        "answerKey": "0",
        "marks": 1,
        "category": "topic"
      },
      {
        "id": "cs11-ch4-b4",
        "topicNumber": "4.1",
        "question": "To insert a new item at a specific position (e.g., at index 0) in a Python list, which function is used?",
        "options": [
          "append()",
          "insert()",
          "add()",
          "push()"
        ],
        "answer": "(b)",
        "correctIndex": 1,
        "answerKey": "insert()",
        "marks": 1,
        "category": "topic"
      },
      {
        "id": "cs11-ch4-b5",
        "topicNumber": "4.1",
        "question": "Which list function in Python removes the first occurrence of a specified item by its value?",
        "options": [
          "pop()",
          "remove()",
          "delete()",
          "clear()"
        ],
        "answer": "(b)",
        "correctIndex": 1,
        "answerKey": "remove()",
        "marks": 1,
        "category": "topic"
      },
      {
        "id": "cs11-ch4-b6",
        "topicNumber": "4.1",
        "question": "Which method is used to remove an item from a list at a specific index position and return that removed item?",
        "options": [
          "pop()",
          "remove()",
          "discard()",
          "shift()"
        ],
        "answer": "(a)",
        "correctIndex": 0,
        "answerKey": "pop()",
        "marks": 1,
        "category": "topic"
      },
      {
        "id": "cs11-ch4-b7",
        "topicNumber": "4.1",
        "question": "What happens when two variables reference the exact same list object in memory (aliasing)?",
        "options": [
          "Modifying the list via one variable leaves the other variable unchanged",
          "Changes made through one variable immediately reflect when accessed via the second variable",
          "Python automatically creates an independent duplicate copy",
          "A runtime exception is thrown"
        ],
        "answer": "(b)",
        "correctIndex": 1,
        "answerKey": "Changes made through one variable immediately reflect when accessed via the second variable",
        "marks": 1,
        "category": "topic"
      }
    ],
    "shortQuestions": [
      {
        "id": "cs11-ch4-t4.1-sq1",
        "question": "Define a computational structure and explain the difference between primitive and non-primitive structures.",
        "marks": 2,
        "category": "topic"
      },
      {
        "id": "cs11-ch4-t4.1-sq2",
        "question": "Explain Aliasing in Python lists and how it differs from Cloning using slice [:] or copy().",
        "marks": 2,
        "category": "topic"
      }
    ],
    "longQuestions": []
  },
  {
    "id": "cs-11-ch4-topic-4.2",
    "topicNumber": "4.2",
    "name": "Stack Operations & LIFO",
    "mcqs": [
      {
        "id": "cs11-ch4-t4.2-m1",
        "question": "Which data structure operates strictly on the Last-In, First-Out (LIFO) principle?",
        "options": [
          "Stack",
          "Queue",
          "Tree",
          "Graph"
        ],
        "answer": "(a)",
        "correctIndex": 0,
        "answerKey": "Stack",
        "marks": 1,
        "category": "topic"
      },
      {
        "id": "cs11-ch4-t4.2-m2",
        "question": "The operation that checks the value at the top of a stack without removing it is:",
        "options": [
          "Peek / Top",
          "Pop",
          "Push",
          "Enqueue"
        ],
        "answer": "(a)",
        "correctIndex": 0,
        "answerKey": "Peek / Top",
        "marks": 1,
        "category": "topic"
      },
      {
        "id": "cs11-ch4-b8",
        "topicNumber": "4.2",
        "question": "A stack is a linear data structure that operates strictly according to which data access principle?",
        "options": [
          "First-In, First-Out (FIFO)",
          "Last-In, First-Out (LIFO)",
          "Random Access",
          "Shortest Job First"
        ],
        "answer": "(b)",
        "correctIndex": 1,
        "answerKey": "Last-In, First-Out (LIFO)",
        "marks": 1,
        "category": "topic"
      },
      {
        "id": "cs11-ch4-b9",
        "topicNumber": "4.2",
        "question": "In a stack data structure, both insertion and deletion operations take place at a single end known as the:",
        "options": [
          "Bottom",
          "Rear",
          "Top",
          "Front"
        ],
        "answer": "(c)",
        "correctIndex": 2,
        "answerKey": "Top",
        "marks": 1,
        "category": "topic"
      },
      {
        "id": "cs11-ch4-b10",
        "topicNumber": "4.2",
        "question": "The operation of adding a new item onto the top of a stack is referred to as:",
        "options": [
          "Pop",
          "Push",
          "Enqueue",
          "Insert"
        ],
        "answer": "(b)",
        "correctIndex": 1,
        "answerKey": "Push",
        "marks": 1,
        "category": "topic"
      },
      {
        "id": "cs11-ch4-b11",
        "topicNumber": "4.2",
        "question": "The operation of removing the topmost item from a stack is referred to as:",
        "options": [
          "Pop",
          "Push",
          "Dequeue",
          "Extract"
        ],
        "answer": "(a)",
        "correctIndex": 0,
        "answerKey": "Pop",
        "marks": 1,
        "category": "topic"
      },
      {
        "id": "cs11-ch4-b12",
        "topicNumber": "4.2",
        "question": "Looking at or inspecting the top element of a stack without removing it is known as:",
        "options": [
          "Peek",
          "Pop",
          "Pull",
          "Seek"
        ],
        "answer": "(a)",
        "correctIndex": 0,
        "answerKey": "Peek",
        "marks": 1,
        "category": "topic"
      },
      {
        "id": "cs11-ch4-b13",
        "topicNumber": "4.2",
        "question": "Which real-world example best models the LIFO behavior of a stack?",
        "options": [
          "People standing in line at a bank counter",
          "A stack of plates or books placed on top of each other",
          "Water flowing through a pipe",
          "Vehicles moving through a one-way tunnel"
        ],
        "answer": "(b)",
        "correctIndex": 1,
        "answerKey": "A stack of plates or books placed on top of each other",
        "marks": 1,
        "category": "topic"
      }
    ],
    "shortQuestions": [
      {
        "id": "cs11-ch4-t4.2-sq3",
        "question": "Define a Stack and explain its Last-In, First-Out (LIFO) principle.",
        "marks": 2,
        "category": "topic"
      },
      {
        "id": "cs11-ch4-t4.2-sq4",
        "question": "Describe Push, Pop, and Peek operations on a stack with Python examples.",
        "marks": 2,
        "category": "topic"
      }
    ],
    "longQuestions": []
  },
  {
    "id": "cs-11-ch4-topic-4.3",
    "topicNumber": "4.3",
    "name": "Queue Operations & FIFO",
    "mcqs": [
      {
        "id": "cs11-ch4-t4.3-m1",
        "question": "Which data structure operates on the First-In, First-Out (FIFO) principle?",
        "options": [
          "Queue",
          "Stack",
          "Binary Tree",
          "Graph"
        ],
        "answer": "(a)",
        "correctIndex": 0,
        "answerKey": "Queue",
        "marks": 1,
        "category": "topic"
      },
      {
        "id": "cs11-ch4-t4.3-m2",
        "question": "Removing an element from the front of a queue is called:",
        "options": [
          "Dequeue",
          "Enqueue",
          "Pop",
          "Peek"
        ],
        "answer": "(a)",
        "correctIndex": 0,
        "answerKey": "Dequeue",
        "marks": 1,
        "category": "topic"
      },
      {
        "id": "cs11-ch4-b14",
        "topicNumber": "4.3",
        "question": "A queue is a computational structure that processes data according to which order?",
        "options": [
          "Last-In, First-Out (LIFO)",
          "First-In, First-Out (FIFO)",
          "Highest Priority First",
          "Random Order"
        ],
        "answer": "(b)",
        "correctIndex": 1,
        "answerKey": "First-In, First-Out (FIFO)",
        "marks": 1,
        "category": "topic"
      },
      {
        "id": "cs11-ch4-b15",
        "topicNumber": "4.3",
        "question": "The operation of adding a new item to the back (rear) of a queue is called:",
        "options": [
          "Dequeue",
          "Enqueue",
          "Push",
          "Append"
        ],
        "answer": "(b)",
        "correctIndex": 1,
        "answerKey": "Enqueue",
        "marks": 1,
        "category": "topic"
      },
      {
        "id": "cs11-ch4-b16",
        "topicNumber": "4.3",
        "question": "The operation of serving and removing an item from the front of a queue is called:",
        "options": [
          "Enqueue",
          "Dequeue",
          "Pop",
          "Shift"
        ],
        "answer": "(b)",
        "correctIndex": 1,
        "answerKey": "Dequeue",
        "marks": 1,
        "category": "topic"
      },
      {
        "id": "cs11-ch4-b17",
        "topicNumber": "4.3",
        "question": "In Python's standard queue module, which method is used to perform an Enqueue operation?",
        "options": [
          "put()",
          "get()",
          "push()",
          "enqueue()"
        ],
        "answer": "(a)",
        "correctIndex": 0,
        "answerKey": "put()",
        "marks": 1,
        "category": "topic"
      },
      {
        "id": "cs11-ch4-b18",
        "topicNumber": "4.3",
        "question": "In Python's standard queue module, which method is used to perform a Dequeue operation?",
        "options": [
          "put()",
          "get()",
          "pop()",
          "dequeue()"
        ],
        "answer": "(b)",
        "correctIndex": 1,
        "answerKey": "get()",
        "marks": 1,
        "category": "topic"
      }
    ],
    "shortQuestions": [
      {
        "id": "cs11-ch4-t4.3-sq5",
        "question": "Define a Queue and explain its First-In, First-Out (FIFO) principle.",
        "marks": 2,
        "category": "topic"
      },
      {
        "id": "cs11-ch4-t4.3-sq6",
        "question": "Differentiate between Enqueue and Dequeue operations of a queue.",
        "marks": 2,
        "category": "topic"
      }
    ],
    "longQuestions": []
  },
  {
    "id": "cs-11-ch4-topic-4.4",
    "topicNumber": "4.4",
    "name": "Trees & Graphs",
    "mcqs": [
      {
        "id": "cs11-ch4-t4.4-m1",
        "question": "In a tree data structure, the topmost node that has no parent is called the:",
        "options": [
          "Root node",
          "Leaf node",
          "Child node",
          "Subtree"
        ],
        "answer": "(a)",
        "correctIndex": 0,
        "answerKey": "Root node",
        "marks": 1,
        "category": "topic"
      },
      {
        "id": "cs11-ch4-t4.4-m2",
        "question": "A non-linear computational structure consisting of vertices (nodes) connected by edges is a:",
        "options": [
          "Graph",
          "Linear Array",
          "Queue",
          "Stack"
        ],
        "answer": "(a)",
        "correctIndex": 0,
        "answerKey": "Graph",
        "marks": 1,
        "category": "topic"
      },
      {
        "id": "cs11-ch4-b19",
        "topicNumber": "4.4",
        "question": "Unlike lists or arrays, a tree data structure stores information in a branching, non-linear format called a:",
        "options": [
          "Sequential structure",
          "Hierarchical structure",
          "Matrix structure",
          "Circular structure"
        ],
        "answer": "(b)",
        "correctIndex": 1,
        "answerKey": "Hierarchical structure",
        "marks": 1,
        "category": "topic"
      },
      {
        "id": "cs11-ch4-b20",
        "topicNumber": "4.4",
        "question": "The single, topmost starting node in a tree hierarchy is known as the:",
        "options": [
          "Leaf node",
          "Root node",
          "Child node",
          "Branch node"
        ],
        "answer": "(b)",
        "correctIndex": 1,
        "answerKey": "Root node",
        "marks": 1,
        "category": "topic"
      },
      {
        "id": "cs11-ch4-b21",
        "topicNumber": "4.4",
        "question": "In a tree structure, a node that does not have any child nodes attached to it is called a:",
        "options": [
          "Root node",
          "Leaf node",
          "Parent node",
          "Internal node"
        ],
        "answer": "(b)",
        "correctIndex": 1,
        "answerKey": "Leaf node",
        "marks": 1,
        "category": "topic"
      },
      {
        "id": "cs11-ch4-b22",
        "topicNumber": "4.4",
        "question": "The height of a tree is defined as the:",
        "options": [
          "Total count of all nodes present in the tree",
          "Number of edges on the longest path from the root node down to the farthest leaf node",
          "Total count of leaf nodes",
          "Number of direct children attached to the root"
        ],
        "answer": "(b)",
        "correctIndex": 1,
        "answerKey": "Number of edges on the longest path from the root node down to the farthest leaf node",
        "marks": 1,
        "category": "topic"
      },
      {
        "id": "cs11-ch4-b23",
        "topicNumber": "4.4",
        "question": "Which tree traversal method visits the root directory first before recursively backing up subdirectories, making it ideal for file system backups?",
        "options": [
          "Post-order traversal",
          "Pre-order traversal",
          "In-order traversal",
          "Level-order traversal"
        ],
        "answer": "(b)",
        "correctIndex": 1,
        "answerKey": "Pre-order traversal",
        "marks": 1,
        "category": "topic"
      },
      {
        "id": "cs11-ch4-b24",
        "topicNumber": "4.4",
        "question": "A graph consists of a set of vertices (nodes) connected together by pathways called:",
        "options": [
          "Edges",
          "Roots",
          "Leaves",
          "Heights"
        ],
        "answer": "(a)",
        "correctIndex": 0,
        "answerKey": "Edges",
        "marks": 1,
        "category": "topic"
      },
      {
        "id": "cs11-ch4-b25",
        "topicNumber": "4.4",
        "question": "A graph in which connections allow two-way movement between vertices (e.g., a mutual friendship on a social network) is an:",
        "options": [
          "Directed Graph",
          "Undirected Graph",
          "Weighted Graph",
          "Cyclic Graph"
        ],
        "answer": "(b)",
        "correctIndex": 1,
        "answerKey": "Undirected Graph",
        "marks": 1,
        "category": "topic"
      }
    ],
    "shortQuestions": [
      {
        "id": "cs11-ch4-t4.4-sq7",
        "question": "Define a Tree data structure and define Root, Leaf, Height, and Depth.",
        "marks": 2,
        "category": "topic"
      },
      {
        "id": "cs11-ch4-t4.4-sq8",
        "question": "Explain Graph representations: Adjacency Matrix vs Adjacency List.",
        "marks": 2,
        "category": "topic"
      }
    ],
    "longQuestions": []
  }
];
