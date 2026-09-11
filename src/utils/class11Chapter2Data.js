/**
 * Class 11th Computer Science - Chapter 2: Python Programming
 * Complete Board-Style Topic-Wise Question Bank & Official Textbook Exercise (Pages 39–40)
 */

export const CLASS_11_CHAPTER_2_TOPICS = [
  // =========================================================================
  // TOPIC 2.1: INTRODUCTION TO PYTHON PROGRAMMING
  // =========================================================================
  {
    id: "cs-11-ch2-topic-2.1",
    topicNumber: "2.1",
    name: "Introduction to Python Programming",
    mcqs: [
      {
        id: "cs11-ch2-t2.1-m1",
        question: "Computer programming is best defined as the process of:",
        options: [
          "Assembling physical silicon microchips",
          "Creating a set of instructions that tell a computer how to perform a task",
          "Formatting hard drives for storage",
          "Manufacturing optical sensors"
        ],
        answer: "(b)",
        correctIndex: 1,
        answerKey: "Creating a set of instructions that tell a computer how to perform a task",
        marks: 1
      },
      {
        id: "cs11-ch2-t2.1-m2",
        question: "Which checkbox should be selected during Python installation on Windows to allow running Python easily from the command line?",
        options: [
          "Install IDE Only",
          "Uncheck \"Add Python to PATH\"",
          "Add Python to PATH",
          "Disable Command Line Interface"
        ],
        answer: "(c)",
        correctIndex: 2,
        answerKey: "Add Python to PATH",
        marks: 1
      },
      {
        id: "cs11-ch2-t2.1-m3",
        question: "What is the correct sequence of steps involved in writing and executing a program?",
        options: [
          "Execute ➔ Compile ➔ Write Code ➔ Output",
          "Write Code ➔ Compile/Interpret ➔ Execute ➔ Output",
          "Compile ➔ Output ➔ Write Code ➔ Execute",
          "Output ➔ Execute ➔ Compile ➔ Write Code"
        ],
        answer: "(b)",
        correctIndex: 1,
        answerKey: "Write Code ➔ Compile/Interpret ➔ Execute ➔ Output",
        marks: 1
      }
    ],
    shortQuestions: [
      {
        id: "cs11-ch2-t2.1-s1",
        question: "Define computer programming and state why Python is an excellent choice for beginners.",
        marks: 2
      },
      {
        id: "cs11-ch2-t2.1-s2",
        question: "List the four basic steps involved in creating and executing a computer program.",
        marks: 2
      }
    ],
    longQuestions: []
  },

  // =========================================================================
  // TOPIC 2.2: BASIC PYTHON SYNTAX AND STRUCTURE
  // =========================================================================
  {
    id: "cs-11-ch2-topic-2.2",
    topicNumber: "2.2",
    name: "Basic Python Syntax and Structure",
    mcqs: [
      {
        id: "cs11-ch2-t2.2-m1",
        question: "Lines in Python code that are not executed by the interpreter and are used to provide notes or explanations are called:",
        options: [
          "Variables",
          "Comments",
          "Functions",
          "Expressions"
        ],
        answer: "(b)",
        correctIndex: 1,
        answerKey: "Comments",
        marks: 1
      },
      {
        id: "cs11-ch2-t2.2-m2",
        question: "In Python, single-line comments begin with which symbol?",
        options: [
          "//",
          "#",
          "/*",
          "<!--"
        ],
        answer: "(b)",
        correctIndex: 1,
        answerKey: "#",
        marks: 1
      },
      {
        id: "cs11-ch2-t2.2-m3",
        question: "Which of the following is a valid variable name according to Python naming rules?",
        options: [
          "2nd_student",
          "student_age",
          "student-age",
          "for"
        ],
        answer: "(b)",
        correctIndex: 1,
        answerKey: "student_age",
        marks: 1
      },
      {
        id: "cs11-ch2-t2.2-m4",
        question: "The input() function in Python always returns user input as which data type by default?",
        options: [
          "Integer (int)",
          "Float (float)",
          "String (str)",
          "Boolean (bool)"
        ],
        answer: "(c)",
        correctIndex: 2,
        answerKey: "String (str)",
        marks: 1
      },
      {
        id: "cs11-ch2-t2.2-m5",
        question: "Which built-in function is used to convert a string input into a decimal number in Python?",
        options: [
          "int()",
          "float()",
          "str()",
          "bool()"
        ],
        answer: "(b)",
        correctIndex: 1,
        answerKey: "float()",
        marks: 1
      }
    ],
    shortQuestions: [
      {
        id: "cs11-ch2-t2.2-s1",
        question: "Explain the syntax rules for creating single-line and multi-line comments in Python.",
        marks: 2
      },
      {
        id: "cs11-ch2-t2.2-s2",
        question: "State four rules for naming variables in Python.",
        marks: 2
      },
      {
        id: "cs11-ch2-t2.2-s3",
        question: "How do you convert user input into an integer or float in Python? Give an example.",
        marks: 2
      }
    ],
    longQuestions: []
  },

  // =========================================================================
  // TOPIC 2.3: OPERATORS AND EXPRESSIONS
  // =========================================================================
  {
    id: "cs-11-ch2-topic-2.3",
    topicNumber: "2.3",
    name: "Operators and Expressions",
    mcqs: [
      {
        id: "cs11-ch2-t2.3-m1",
        question: "What is the output of the floor division expression 10 // 3 in Python?",
        options: [
          "3.3333",
          "3",
          "1",
          "3.0"
        ],
        answer: "(b)",
        correctIndex: 1,
        answerKey: "3",
        marks: 1
      },
      {
        id: "cs11-ch2-t2.3-m2",
        question: "Which operator in Python returns the remainder of a division operation?",
        options: [
          "/",
          "//",
          "%",
          "**"
        ],
        answer: "(c)",
        correctIndex: 2,
        answerKey: "%",
        marks: 1
      },
      {
        id: "cs11-ch2-t2.3-m3",
        question: "What is the output of the logical expression True and False in Python?",
        options: [
          "True",
          "False",
          "None",
          "Error"
        ],
        answer: "(b)",
        correctIndex: 1,
        answerKey: "False",
        marks: 1
      },
      {
        id: "cs11-ch2-t2.3-m4",
        question: "Which operator has the highest precedence in Python operator evaluation?",
        options: [
          "Addition (+)",
          "Multiplication (*)",
          "Parentheses ()",
          "Exponentiation (**)"
        ],
        answer: "(c)",
        correctIndex: 2,
        answerKey: "Parentheses ()",
        marks: 1
      },
      {
        id: "cs11-ch2-t2.3-m5",
        question: "What is the result of the expression (3 + 2) * 4 in Python?",
        options: [
          "11",
          "20",
          "14",
          "24"
        ],
        answer: "(b)",
        correctIndex: 1,
        answerKey: "20",
        marks: 1
      }
    ],
    shortQuestions: [
      {
        id: "cs11-ch2-t2.3-s1",
        question: "Differentiate between float division (/) and floor division (//) in Python with examples.",
        marks: 2
      },
      {
        id: "cs11-ch2-t2.3-s2",
        question: "List the three primary logical operators in Python and briefly explain their functions.",
        marks: 2
      },
      {
        id: "cs11-ch2-t2.3-s3",
        question: "Explain operator precedence in Python and arrange +, **, (), and * in order from highest to lowest precedence.",
        marks: 2
      }
    ],
    longQuestions: []
  },

  // =========================================================================
  // TOPIC 2.4: CONTROL STRUCTURES
  // =========================================================================
  {
    id: "cs-11-ch2-topic-2.4",
    topicNumber: "2.4",
    name: "Control Structures",
    mcqs: [
      {
        id: "cs11-ch2-t2.4-m1",
        question: "Which decision-making statement is used in Python when there are multiple conditions to test sequentially?",
        options: [
          "if-else",
          "if-elif-else",
          "while",
          "for"
        ],
        answer: "(b)",
        correctIndex: 1,
        answerKey: "if-elif-else",
        marks: 1
      },
      {
        id: "cs11-ch2-t2.4-m2",
        question: "A while loop in Python continues to execute as long as its conditional expression is:",
        options: [
          "False",
          "True",
          "0",
          "None"
        ],
        answer: "(b)",
        correctIndex: 1,
        answerKey: "True",
        marks: 1
      },
      {
        id: "cs11-ch2-t2.4-m3",
        question: "Which loop construct is commonly used in Python to iterate over a sequence (such as a list, tuple, or string)?",
        options: [
          "while loop",
          "for loop",
          "do-while loop",
          "repeat-until loop"
        ],
        answer: "(b)",
        correctIndex: 1,
        answerKey: "for loop",
        marks: 1
      },
      {
        id: "cs11-ch2-t2.4-m4",
        question: "What is the output of range(2, 10, 2) when converted to a sequence?",
        options: [
          "2, 3, 4, 5, 6, 7, 8, 9, 10",
          "2, 4, 6, 8",
          "2, 4, 6, 8, 10",
          "4, 6, 8, 10"
        ],
        answer: "(b)",
        correctIndex: 1,
        answerKey: "2, 4, 6, 8",
        marks: 1
      }
    ],
    shortQuestions: [
      {
        id: "cs11-ch2-t2.4-s1",
        question: "Differentiate between an if-else statement and an if-elif-else statement.",
        marks: 2
      },
      {
        id: "cs11-ch2-t2.4-s2",
        question: "Compare the execution mechanism of a while loop with a for loop.",
        marks: 2
      },
      {
        id: "cs11-ch2-t2.4-s3",
        question: "Write the syntax of a short-hand if-else statement in Python.",
        marks: 2
      }
    ],
    longQuestions: []
  },

  // =========================================================================
  // TOPIC 2.5: FUNCTIONS, MODULES, AND LIBRARIES
  // =========================================================================
  {
    id: "cs-11-ch2-topic-2.5",
    topicNumber: "2.5",
    name: "Functions, Modules, and Libraries",
    mcqs: [
      {
        id: "cs11-ch2-t2.5-m1",
        question: "Which keyword is used to define a custom function in Python?",
        options: [
          "function",
          "define",
          "def",
          "func"
        ],
        answer: "(c)",
        correctIndex: 2,
        answerKey: "def",
        marks: 1
      },
      {
        id: "cs11-ch2-t2.5-m2",
        question: "Values passed into a function when defining its signature to accept inputs are called:",
        options: [
          "Arguments / Parameters",
          "Return statements",
          "Keywords",
          "Modules"
        ],
        answer: "(a)",
        correctIndex: 0,
        answerKey: "Arguments / Parameters",
        marks: 1
      },
      {
        id: "cs11-ch2-t2.5-m3",
        question: "Which built-in Python module provides functions like randint() to generate random numbers?",
        options: [
          "math",
          "statistics",
          "random",
          "datetime"
        ],
        answer: "(c)",
        correctIndex: 2,
        answerKey: "random",
        marks: 1
      },
      {
        id: "cs11-ch2-t2.5-m4",
        question: "Which function from the statistics module calculates the average value of a numeric dataset?",
        options: [
          "statistics.median()",
          "statistics.mean()",
          "statistics.mode()",
          "statistics.average()"
        ],
        answer: "(b)",
        correctIndex: 1,
        answerKey: "statistics.mean()",
        marks: 1
      }
    ],
    shortQuestions: [
      {
        id: "cs11-ch2-t2.5-s1",
        question: "What is a function in Python, and what keyword is used to define it?",
        marks: 2
      },
      {
        id: "cs11-ch2-t2.5-s2",
        question: "How do default parameters work in Python functions? Provide a code example.",
        marks: 2
      },
      {
        id: "cs11-ch2-t2.5-s3",
        question: "Explain how to import and use a function from a built-in library like random or statistics.",
        marks: 2
      }
    ],
    longQuestions: []
  },

  // =========================================================================
  // TOPIC 2.6: BUILT-IN DATA STRUCTURES (LISTS & TUPLES)
  // =========================================================================
  {
    id: "cs-11-ch2-topic-2.6",
    topicNumber: "2.6",
    name: "Built-in Data Structures (Lists & Tuples)",
    mcqs: [
      {
        id: "cs11-ch2-t2.6-m1",
        question: "Lists in Python are created by enclosing items inside which type of brackets?",
        options: [
          "Parentheses ()",
          "Curly braces {}",
          "Square brackets []",
          "Angle brackets <>"
        ],
        answer: "(c)",
        correctIndex: 2,
        answerKey: "Square brackets []",
        marks: 1
      },
      {
        id: "cs11-ch2-t2.6-m2",
        question: "Which of the following statements is TRUE regarding Tuples in Python?",
        options: [
          "Tuples are mutable and can be modified after creation",
          "Tuples are immutable and cannot be changed after creation",
          "Tuples are created using square brackets []",
          "Tuples do not support indexing"
        ],
        answer: "(b)",
        correctIndex: 1,
        answerKey: "Tuples are immutable and cannot be changed after creation",
        marks: 1
      },
      {
        id: "cs11-ch2-t2.6-m3",
        question: "Which list method is used to add a new item to the very end of an existing list?",
        options: [
          "insert()",
          "append()",
          "add()",
          "extend()"
        ],
        answer: "(b)",
        correctIndex: 1,
        answerKey: "append()",
        marks: 1
      },
      {
        id: "cs11-ch2-t2.6-m4",
        question: "In Python indexing, what does a negative index of -1 refer to?",
        options: [
          "The first item in the sequence",
          "The second item in the sequence",
          "The last item in the sequence",
          "An invalid index error"
        ],
        answer: "(c)",
        correctIndex: 2,
        answerKey: "The last item in the sequence",
        marks: 1
      },
      {
        id: "cs11-ch2-t2.6-m5",
        question: "What operation is performed when using the + operator between two lists in Python?",
        options: [
          "Element-wise addition",
          "List concatenation (combining two lists)",
          "List intersection",
          "List subtraction"
        ],
        answer: "(b)",
        correctIndex: 1,
        answerKey: "List concatenation (combining two lists)",
        marks: 1
      }
    ],
    shortQuestions: [
      {
        id: "cs11-ch2-t2.6-s1",
        question: "Differentiate between a List and a Tuple in Python.",
        marks: 2
      },
      {
        id: "cs11-ch2-t2.6-s2",
        question: "Explain how indexing and slicing work in Python sequences with examples.",
        marks: 2
      },
      {
        id: "cs11-ch2-t2.6-s3",
        question: "Describe the functions of list methods append(), remove(), and sort().",
        marks: 2
      }
    ],
    longQuestions: []
  },

  // =========================================================================
  // TOPIC 2.7: MODULAR PROGRAMMING IN PYTHON
  // =========================================================================
  {
    id: "cs-11-ch2-topic-2.7",
    topicNumber: "2.7",
    name: "Modular Programming in Python",
    mcqs: [
      {
        id: "cs11-ch2-t2.7-m1",
        question: "Modular programming involves dividing a large program into smaller, manageable, and reusable pieces called:",
        options: [
          "Variables",
          "Modules",
          "Classes",
          "Operators"
        ],
        answer: "(b)",
        correctIndex: 1,
        answerKey: "Modules",
        marks: 1
      },
      {
        id: "cs11-ch2-t2.7-m2",
        question: "In Python, the main() function block is executed only when the script is run directly using which conditional check?",
        options: [
          "if name == \"main\":",
          "if __name__ == \"__main__\":",
          "if main() == True:",
          "if script == \"__main__\":"
        ],
        answer: "(b)",
        correctIndex: 1,
        answerKey: "if __name__ == \"__main__\":",
        marks: 1
      }
    ],
    shortQuestions: [
      {
        id: "cs11-ch2-t2.7-s1",
        question: "Define modular programming and state two of its advantages.",
        marks: 2
      },
      {
        id: "cs11-ch2-t2.7-s2",
        question: "Explain the purpose of the if __name__ == \"__main__\": statement in a Python script.",
        marks: 2
      }
    ],
    longQuestions: []
  },

  // =========================================================================
  // TOPIC 2.8: OBJECT-ORIENTED PROGRAMMING IN PYTHON
  // =========================================================================
  {
    id: "cs-11-ch2-topic-2.8",
    topicNumber: "2.8",
    name: "Object-Oriented Programming in Python",
    mcqs: [
      {
        id: "cs11-ch2-t2.8-m1",
        question: "In Object-Oriented Programming, a blueprint or template used to create objects is called a:",
        options: [
          "Instance",
          "Class",
          "Method",
          "Attribute"
        ],
        answer: "(b)",
        correctIndex: 1,
        answerKey: "Class",
        marks: 1
      },
      {
        id: "cs11-ch2-t2.8-m2",
        question: "An actual individual entity created from a class template is known as an:",
        options: [
          "Attribute",
          "Object (or Instance)",
          "Method",
          "Function"
        ],
        answer: "(b)",
        correctIndex: 1,
        answerKey: "Object (or Instance)",
        marks: 1
      },
      {
        id: "cs11-ch2-t2.8-m3",
        question: "Which special method is automatically called when a new object is created to initialize its attributes in Python?",
        options: [
          "__start__()",
          "__init__()",
          "__create__()",
          "__main__()"
        ],
        answer: "(b)",
        correctIndex: 1,
        answerKey: "__init__()",
        marks: 1
      },
      {
        id: "cs11-ch2-t2.8-m4",
        question: "In Python class methods, what does the self parameter represent?",
        options: [
          "A global system variable",
          "The specific instance/object of the class being operated on",
          "The parent module name",
          "A reserved keyword for loops"
        ],
        answer: "(b)",
        correctIndex: 1,
        answerKey: "The specific instance/object of the class being operated on",
        marks: 1
      }
    ],
    shortQuestions: [
      {
        id: "cs11-ch2-t2.8-s1",
        question: "Differentiate between a Class and an Object in Python with an analogy or example.",
        marks: 2
      },
      {
        id: "cs11-ch2-t2.8-s2",
        question: "What is the purpose of the __init__() method and the self keyword in Python classes?",
        marks: 2
      }
    ],
    longQuestions: []
  },

  // =========================================================================
  // TOPIC 2.9: ADVANCED PYTHON CONCEPTS (EXCEPTION & FILE HANDLING)
  // =========================================================================
  {
    id: "cs-11-ch2-topic-2.9",
    topicNumber: "2.9",
    name: "Advanced Python Concepts (Exception & File Handling)",
    mcqs: [
      {
        id: "cs11-ch2-t2.9-m1",
        question: "Which block in Python is used to write code that might potentially cause an error, so it can be tested safely during execution?",
        options: [
          "catch block",
          "try block",
          "except block",
          "finally block"
        ],
        answer: "(b)",
        correctIndex: 1,
        answerKey: "try block",
        marks: 1
      },
      {
        id: "cs11-ch2-t2.9-m2",
        question: "Which block catches and handles errors if an exception occurs inside the try block?",
        options: [
          "test block",
          "except block",
          "error block",
          "check block"
        ],
        answer: "(b)",
        correctIndex: 1,
        answerKey: "except block",
        marks: 1
      },
      {
        id: "cs11-ch2-t2.9-m3",
        question: "Which file opening mode in Python opens a file for writing and overwrites existing contents?",
        options: [
          "\"r\"",
          "\"w\"",
          "\"a\"",
          "\"x\""
        ],
        answer: "(b)",
        correctIndex: 1,
        answerKey: "\"w\"",
        marks: 1
      },
      {
        id: "cs11-ch2-t2.9-m4",
        question: "Which file opening mode adds new data to the end of a file without overwriting existing content?",
        options: [
          "\"r\"",
          "\"w\"",
          "\"a\"",
          "\"r+\""
        ],
        answer: "(c)",
        correctIndex: 2,
        answerKey: "\"a\"",
        marks: 1
      },
      {
        id: "cs11-ch2-t2.9-m5",
        question: "What is the advantage of using the with open(...) statement when handling files in Python?",
        options: [
          "It increases file read speed",
          "It automatically closes the file after operations complete, even if errors occur",
          "It encrypts the file on the hard drive",
          "It converts text files into binary code"
        ],
        answer: "(b)",
        correctIndex: 1,
        answerKey: "It automatically closes the file after operations complete, even if errors occur",
        marks: 1
      }
    ],
    shortQuestions: [
      {
        id: "cs11-ch2-t2.9-s1",
        question: "What is exception handling? Explain how try and except blocks prevent program crashes.",
        marks: 2
      },
      {
        id: "cs11-ch2-t2.9-s2",
        question: "Differentiate between write mode (\"w\") and append mode (\"a\") in Python file handling.",
        marks: 2
      }
    ],
    longQuestions: []
  },

  // =========================================================================
  // TOPIC 2.10: TESTING AND DEBUGGING IN PYTHON
  // =========================================================================
  {
    id: "cs-11-ch2-topic-2.10",
    topicNumber: "2.10",
    name: "Testing and Debugging in Python",
    mcqs: [
      {
        id: "cs11-ch2-t2.10-m1",
        question: "Testing individual components, functions, or classes of software in isolation is called:",
        options: [
          "Integration Testing",
          "Unit Testing",
          "System Testing",
          "Regression Testing"
        ],
        answer: "(b)",
        correctIndex: 1,
        answerKey: "Unit Testing",
        marks: 1
      },
      {
        id: "cs11-ch2-t2.10-m2",
        question: "Which built-in module in Python is commonly used for writing and executing unit tests?",
        options: [
          "pytest",
          "unittest",
          "pdb",
          "testlib"
        ],
        answer: "(b)",
        correctIndex: 1,
        answerKey: "unittest",
        marks: 1
      },
      {
        id: "cs11-ch2-t2.10-m3",
        question: "The process of finding, analyzing, and fixing errors (bugs) in source code is known as:",
        options: [
          "Compiling",
          "Debugging",
          "Refactoring",
          "Deployment"
        ],
        answer: "(b)",
        correctIndex: 1,
        answerKey: "Debugging",
        marks: 1
      }
    ],
    shortQuestions: [
      {
        id: "cs11-ch2-t2.10-s1",
        question: "Differentiate between Unit Testing and Integration Testing in Python.",
        marks: 2
      },
      {
        id: "cs11-ch2-t2.10-s2",
        question: "List three common debugging techniques used by Python developers.",
        marks: 2
      }
    ],
    longQuestions: []
  },

  // =========================================================================
  // OFFICIAL TEXTBOOK EXERCISE QUESTIONS (PAGES 39–40)
  // =========================================================================
  {
    id: "cs-11-ch2-topic-exercise",
    topicNumber: "Exercise",
    name: "Official Textbook Exercise (Pages 39–40)",
    mcqs: [
      {
        id: "cs11-ch2-tex-m1",
        question: "An action needed during Python installation to run from the command line easily:",
        options: [
          "Uncheck \"Add Python to PATH\"",
          "Choose a different IDE",
          "Check \"Add Python to PATH\"",
          "Install only the IDE"
        ],
        answer: "(c)",
        correctIndex: 2,
        answerKey: "Check \"Add Python to PATH\"",
        marks: 1
      },
      {
        id: "cs11-ch2-tex-m2",
        question: "A valid variable name in Python is:",
        options: [
          "variable1",
          "1variable",
          "variable-name",
          "variable name"
        ],
        answer: "(a)",
        correctIndex: 0,
        answerKey: "variable1",
        marks: 1
      },
      {
        id: "cs11-ch2-tex-m3",
        question: "Output of the following piece of code is:\n\nage = 25\nprint(\"Age : \", age)",
        options: [
          "Age : 25",
          "25",
          "Age",
          "age"
        ],
        answer: "(a)",
        correctIndex: 0,
        answerKey: "Age : 25",
        marks: 1
      },
      {
        id: "cs11-ch2-tex-m4",
        question: "The operator used for exponentiation in Python is:",
        options: [
          "*",
          "**",
          "//",
          "/"
        ],
        answer: "(b)",
        correctIndex: 1,
        answerKey: "**",
        marks: 1
      },
      {
        id: "cs11-ch2-tex-m5",
        question: "A loop used to iterate over a collection such as lists is:",
        options: [
          "while",
          "for",
          "do-while",
          "repeat"
        ],
        answer: "(b)",
        correctIndex: 1,
        answerKey: "for",
        marks: 1
      },
      {
        id: "cs11-ch2-tex-m6",
        question: "A range() function used to generate a sequence of numbers:",
        options: [
          "Generates a list of numbers",
          "Creates a sequence of numbers",
          "Calculates the sum of numbers",
          "Prints a range of numbers"
        ],
        answer: "(d)",
        correctIndex: 3,
        answerKey: "Prints a range of numbers",
        marks: 1
      },
      {
        id: "cs11-ch2-tex-m7",
        question: "A keyword used to define a function in Python:",
        options: [
          "define",
          "function",
          "def",
          "func"
        ],
        answer: "(c)",
        correctIndex: 2,
        answerKey: "def",
        marks: 1
      },
      {
        id: "cs11-ch2-tex-m8",
        question: "The Output of the following code is:\n\ntemperature, humidity, wind_speed = 25, 60, 15\nprint(\"Hot and humid\" if temperature > 30 and humidity > 50 else \"Warm and breezy\" if temperature == 25 and wind_speed > 10 else \"Cool and dry\" if temperature < 20 and humidity < 30 else \"Moderate\")",
        options: [
          "Hot",
          "Warm",
          "Cool",
          "Nothing"
        ],
        answer: "(b)",
        correctIndex: 1,
        answerKey: "Warm",
        marks: 1
      },
      {
        id: "cs11-ch2-tex-m9",
        question: "The operation used to combine two lists in Python:",
        options: [
          "combine()",
          "concat()",
          "+",
          "merge()"
        ],
        answer: "(c)",
        correctIndex: 2,
        answerKey: "+",
        marks: 1
      }
    ],
    shortQuestions: [
      {
        id: "cs11-ch2-tex-s1",
        question: "Explain the purpose of using comments in Python code.",
        marks: 2
      },
      {
        id: "cs11-ch2-tex-s2",
        question: "Describe the difference between integer and float data types in Python. Provide an example of each.",
        marks: 2
      },
      {
        id: "cs11-ch2-tex-s3",
        question: "Define operator precedence and give an example of an expression where operator precedence affects the result.",
        marks: 2
      },
      {
        id: "cs11-ch2-tex-s4",
        question: "How does the short-hand if-else statement differ from the regular if-else statement?",
        marks: 2
      },
      {
        id: "cs11-ch2-tex-s5",
        question: "Explain the use of the range() function in a for loop.",
        marks: 2
      }
    ],
    longQuestions: []
  }
];
