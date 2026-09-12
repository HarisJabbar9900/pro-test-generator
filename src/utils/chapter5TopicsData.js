/**
 * Chapter 5: Code Testing and Debugging (12th Class Computer Science)
 * Official Exercise Questions (MCQs & Short Questions) & Board-Style Topic-Wise MCQs & Shorts
 * Topics: 5.1, 5.2, 5.3
 */

export const CHAPTER_5_NEW_TOPICS = [
  {
    "id": "cs-ch5-topic-5.1",
    "topicNumber": "5.1",
    "name": "Introduction to Testing and Debugging",
    "mcqs": [
      {
        "id": "ch5-t5.1-ex-m1",
        "topicNumber": "5.1",
        "question": "Testing is essential for reliable applications because it helps to:",
        "options": [
          "Optimise code performance",
          "Identify and fix bugs",
          "Reduce the program size",
          "Make code run faster"
        ],
        "answer": "(b)",
        "correctIndex": 1,
        "answerKey": "Identify and fix bugs",
        "category": "exercise",
        "isExercise": true,
        "marks": 1
      },
      {
        "id": "ch5-t5.1-ex-m2",
        "topicNumber": "5.1",
        "question": "Common types of programming errors include:",
        "options": [
          "Syntax error",
          "Logic error",
          "Runtime error",
          "All of the above"
        ],
        "answer": "(d)",
        "correctIndex": 3,
        "answerKey": "All of the above",
        "category": "exercise",
        "isExercise": true,
        "marks": 1
      },
      {
        "id": "ch5-t5.1-m1",
        "topicNumber": "5.1",
        "question": "Software testing is primarily performed during application development to:",
        "options": [
          "Design user interface layouts",
          "Verify that the application meets requirements and produces correct output",
          "Convert Python code into machine language",
          "Create database schemas"
        ],
        "answer": "(b)",
        "correctIndex": 1,
        "answerKey": "Verify that the application meets requirements and produces correct output",
        "category": "topic",
        "isExercise": false,
        "marks": 1
      },
      {
        "id": "ch5-t5.1-m2",
        "topicNumber": "5.1",
        "question": "The process of locating the specific cause of a bug in source code and fixing it is called:",
        "options": [
          "Profiling",
          "Debugging",
          "Unit Testing",
          "Optimization"
        ],
        "answer": "(b)",
        "correctIndex": 1,
        "answerKey": "Debugging",
        "category": "topic",
        "isExercise": false,
        "marks": 1
      },
      {
        "id": "ch5-t5.1-m3",
        "topicNumber": "5.1",
        "question": "An error caused by violating the grammatical rules of the programming language (such as missing a colon : in an if statement) is a:",
        "options": [
          "Syntax Error",
          "Logic Error",
          "Runtime Error",
          "Resource Leak"
        ],
        "answer": "(a)",
        "correctIndex": 0,
        "answerKey": "Syntax Error",
        "category": "topic",
        "isExercise": false,
        "marks": 1
      },
      {
        "id": "ch5-t5.1-m4",
        "topicNumber": "5.1",
        "question": "If a program runs without crashing but calculates area = length + width instead of length * width , it contains a:",
        "options": [
          "Syntax Error",
          "Logic Error",
          "Runtime Error",
          "Compilation Error"
        ],
        "answer": "(b)",
        "correctIndex": 1,
        "answerKey": "Logic Error",
        "category": "topic",
        "isExercise": false,
        "marks": 1
      },
      {
        "id": "ch5-t5.1-m5",
        "topicNumber": "5.1",
        "question": "Division by zero ( result = a / b where b = 0 ) during execution causes which runtime exception in Python?",
        "options": [
          "SyntaxError",
          "LogicError",
          "ZeroDivisionError",
          "TypeError"
        ],
        "answer": "(c)",
        "correctIndex": 2,
        "answerKey": "ZeroDivisionError",
        "category": "topic",
        "isExercise": false,
        "marks": 1
      },
      {
        "id": "ch5-t5.1-m6",
        "topicNumber": "5.1",
        "question": "An error that occurs when a program fails to release memory or close open file connections after use is known as a:",
        "options": [
          "Data Error",
          "Resource Leak",
          "Syntax Error",
          "Logic Error"
        ],
        "answer": "(b)",
        "correctIndex": 1,
        "answerKey": "Resource Leak",
        "category": "topic",
        "isExercise": false,
        "marks": 1
      },
      {
        "id": "ch5-t5.1-m7",
        "topicNumber": "5.1",
        "question": "Entering invalid data types (such as entering letters when a number is expected) causes a:",
        "options": [
          "Syntax Error",
          "Data Error / Runtime Error",
          "Logic Error",
          "Resource Leak"
        ],
        "answer": "(b)",
        "correctIndex": 1,
        "answerKey": "Data Error / Runtime Error",
        "category": "topic",
        "isExercise": false,
        "marks": 1
      }
    ],
    "shortQuestions": [
      {
        "id": "ch5-t5.1-ex-s1",
        "topicNumber": "5.1",
        "question": "Why is testing essential for ensuring reliable applications?",
        "marks": 2,
        "category": "exercise",
        "isExercise": true
      },
      {
        "id": "ch5-t5.1-ex-s2",
        "topicNumber": "5.1",
        "question": "What are some common types of programming errors and bugs?",
        "marks": 2,
        "category": "exercise",
        "isExercise": true
      },
      {
        "id": "ch5-t5.1-s1",
        "topicNumber": "5.1",
        "question": "Differentiate between software testing and debugging in application development.",
        "marks": 2,
        "category": "topic",
        "isExercise": false
      },
      {
        "id": "ch5-t5.1-s2",
        "topicNumber": "5.1",
        "question": "Compare Syntax Errors and Logic Errors with a simple code example for each.",
        "marks": 2,
        "category": "topic",
        "isExercise": false
      },
      {
        "id": "ch5-t5.1-s3",
        "topicNumber": "5.1",
        "question": "What is a Runtime Error? State two common operations in Python that trigger runtime exceptions.",
        "marks": 2,
        "category": "topic",
        "isExercise": false
      },
      {
        "id": "ch5-t5.1-s4",
        "topicNumber": "5.1",
        "question": "Define a Resource Leak in software development and explain why it is harmful to system performance.",
        "marks": 2,
        "category": "topic",
        "isExercise": false
      },
      {
        "id": "ch5-t5.1-s5",
        "topicNumber": "5.1",
        "question": "What is a Data Error, and how does it affect application execution?",
        "marks": 2,
        "category": "topic",
        "isExercise": false
      }
    ],
    "longQuestions": []
  },
  {
    "id": "cs-ch5-topic-5.2",
    "topicNumber": "5.2",
    "name": "Testing, Debugging and Exception Handling",
    "mcqs": [
      {
        "id": "ch5-t5.2-ex-m1",
        "topicNumber": "5.2",
        "question": "Unit testing focuses on:",
        "options": [
          "Testing the entire application",
          "Testing individual components or functions",
          "Testing the user interface",
          "Testing database connections"
        ],
        "answer": "(b)",
        "correctIndex": 1,
        "answerKey": "Testing individual components or functions",
        "category": "exercise",
        "isExercise": true,
        "marks": 1
      },
      {
        "id": "ch5-t5.2-ex-m2",
        "topicNumber": "5.2",
        "question": "The Python module used for unit testing is:",
        "options": [
          "numpy",
          "matplotlib",
          "unittest",
          "os"
        ],
        "answer": "(c)",
        "correctIndex": 2,
        "answerKey": "unittest",
        "category": "exercise",
        "isExercise": true,
        "marks": 1
      },
      {
        "id": "ch5-t5.2-ex-m3",
        "topicNumber": "5.2",
        "question": "The main purpose of using testing tools like unittest and pytest is:",
        "options": [
          "To increase program size",
          "To verify code works correctly",
          "To design layouts",
          "To compile programs"
        ],
        "answer": "(b)",
        "correctIndex": 1,
        "answerKey": "To verify code works correctly",
        "category": "exercise",
        "isExercise": true,
        "marks": 1
      },
      {
        "id": "ch5-t5.2-ex-m4",
        "topicNumber": "5.2",
        "question": "Breakpoints in debugging are used to:",
        "options": [
          "Run the program faster",
          "Pause the program at specific points and inspect its state",
          "Skip certain code sections",
          "Optimise the code"
        ],
        "answer": "(b)",
        "correctIndex": 1,
        "answerKey": "Pause the program at specific points and inspect its state",
        "category": "exercise",
        "isExercise": true,
        "marks": 1
      },
      {
        "id": "ch5-t5.2-ex-m5",
        "topicNumber": "5.2",
        "question": "Watch expressions in debugging are used to:",
        "options": [
          "Change variable values",
          "Monitor variable values during program execution",
          "Pause the program",
          "Display output messages"
        ],
        "answer": "(b)",
        "correctIndex": 1,
        "answerKey": "Monitor variable values during program execution",
        "category": "exercise",
        "isExercise": true,
        "marks": 1
      },
      {
        "id": "ch5-t5.2-ex-m6",
        "topicNumber": "5.2",
        "question": "Step-by-step debugging is used to:",
        "options": [
          "Run the program faster",
          "Execute code one line at a time for easier error identification",
          "Increase the program's performance",
          "Compile the code"
        ],
        "answer": "(b)",
        "correctIndex": 1,
        "answerKey": "Execute code one line at a time for easier error identification",
        "category": "exercise",
        "isExercise": true,
        "marks": 1
      },
      {
        "id": "ch5-t5.2-ex-m7",
        "topicNumber": "5.2",
        "question": "The Python keyword pair used for exception handling is:",
        "options": [
          "try-except",
          "try-finally",
          "try-catch",
          "handle-throw"
        ],
        "answer": "(a)",
        "correctIndex": 0,
        "answerKey": "try-except",
        "category": "exercise",
        "isExercise": true,
        "marks": 1
      },
      {
        "id": "ch5-t5.2-m8",
        "topicNumber": "5.2",
        "question": "Testing individual components or functions of a program independently to ensure proper operation is called:",
        "options": [
          "System Testing",
          "Unit Testing",
          "Integration Testing",
          "Performance Testing"
        ],
        "answer": "(b)",
        "correctIndex": 1,
        "answerKey": "Unit Testing",
        "category": "topic",
        "isExercise": false,
        "marks": 1
      },
      {
        "id": "ch5-t5.2-m9",
        "topicNumber": "5.2",
        "question": "Which built-in Python module provides a framework for creating and running automated unit test cases?",
        "options": [
          "pytest",
          "unittest",
          "cProfile",
          "timeit"
        ],
        "answer": "(b)",
        "correctIndex": 1,
        "answerKey": "unittest",
        "category": "topic",
        "isExercise": false,
        "marks": 1
      },
      {
        "id": "ch5-t5.2-m10",
        "topicNumber": "5.2",
        "question": "In the pytest testing framework, test functions are automatically detected if their name starts with:",
        "options": [
          "check_",
          "verify_",
          "test_",
          "unit_"
        ],
        "answer": "(c)",
        "correctIndex": 2,
        "answerKey": "test_",
        "category": "topic",
        "isExercise": false,
        "marks": 1
      },
      {
        "id": "ch5-t5.2-m11",
        "topicNumber": "5.2",
        "question": "Which Python statement is used in pytest functions to compare expected outputs with actual outputs?",
        "options": [
          "check",
          "assert",
          "verify",
          "confirm"
        ],
        "answer": "(b)",
        "correctIndex": 1,
        "answerKey": "assert",
        "category": "topic",
        "isExercise": false,
        "marks": 1
      },
      {
        "id": "ch5-t5.2-m12",
        "topicNumber": "5.2",
        "question": "What is a key benefit of automated unit testing using unittest or pytest ?",
        "options": [
          "It reduces the physical line count of source code",
          "It allows repeated testing to ensure code changes do not break existing features",
          "It automatically corrects syntax errors",
          "It removes the need for functions"
        ],
        "answer": "(b)",
        "correctIndex": 1,
        "answerKey": "It allows repeated testing to ensure code changes do not break existing features",
        "category": "topic",
        "isExercise": false,
        "marks": 1
      },
      {
        "id": "ch5-t5.2-m13",
        "topicNumber": "5.2",
        "question": "Unlike unittest , the third-party framework pytest simplifies testing because it does not require:",
        "options": [
          "Function definitions",
          "Boilerplate class structures or test case classes",
          "Input values",
          "Python installation"
        ],
        "answer": "(b)",
        "correctIndex": 1,
        "answerKey": "Boilerplate class structures or test case classes",
        "category": "topic",
        "isExercise": false,
        "marks": 1
      },
      {
        "id": "ch5-t5.2-m14",
        "topicNumber": "5.2",
        "question": "A marker set on a specific line of code in an IDE to temporarily stop program execution is called a:",
        "options": [
          "Watch Expression",
          "Breakpoint",
          "Exception Handler",
          "Performance Bottleneck"
        ],
        "answer": "(b)",
        "correctIndex": 1,
        "answerKey": "Breakpoint",
        "category": "topic",
        "isExercise": false,
        "marks": 1
      },
      {
        "id": "ch5-t5.2-m15",
        "topicNumber": "5.2",
        "question": "Which debugging feature allows developers to track how variable values change automatically line-by-line while a program runs?",
        "options": [
          "Watch Expression",
          "Profiler",
          "Syntax Highlighter",
          "Unit Test"
        ],
        "answer": "(a)",
        "correctIndex": 0,
        "answerKey": "Watch Expression",
        "category": "topic",
        "isExercise": false,
        "marks": 1
      },
      {
        "id": "ch5-t5.2-m16",
        "topicNumber": "5.2",
        "question": "In IDE step-by-step debugging, the \"Step Into\" command allows a developer to:",
        "options": [
          "Execute the current line and skip going inside a function",
          "Go inside a called function to observe its execution line-by-line",
          "Resume normal program execution until the next breakpoint",
          "Stop the debugging session immediately"
        ],
        "answer": "(b)",
        "correctIndex": 1,
        "answerKey": "Go inside a called function to observe its execution line-by-line",
        "category": "topic",
        "isExercise": false,
        "marks": 1
      },
      {
        "id": "ch5-t5.2-m17",
        "topicNumber": "5.2",
        "question": "The debugging command \"Step Over\" is used to:",
        "options": [
          "Execute the current line and move to the next line without stepping inside function calls",
          "Jump directly to the end of the script",
          "Delete the active breakpoint",
          "Restart the execution from line 1"
        ],
        "answer": "(a)",
        "correctIndex": 0,
        "answerKey": "Execute the current line and move to the next line without stepping inside function calls",
        "category": "topic",
        "isExercise": false,
        "marks": 1
      },
      {
        "id": "ch5-t5.2-m18",
        "topicNumber": "5.2",
        "question": "What action does the \"Continue\" button perform during a debugging session paused at a breakpoint?",
        "options": [
          "Terminates the program",
          "Resumes program execution until it hits the next breakpoint or finishes",
          "Steps into the next function call",
          "Clears all watch expressions"
        ],
        "answer": "(b)",
        "correctIndex": 1,
        "answerKey": "Resumes program execution until it hits the next breakpoint or finishes",
        "category": "topic",
        "isExercise": false,
        "marks": 1
      },
      {
        "id": "ch5-t5.2-m19",
        "topicNumber": "5.2",
        "question": "Exception handling is used in Python programs primarily to:",
        "options": [
          "Speed up overall algorithm execution",
          "Manage runtime errors gracefully and prevent unexpected program crashes",
          "Format SQL query strings",
          "Replace unit test suites"
        ],
        "answer": "(b)",
        "correctIndex": 1,
        "answerKey": "Manage runtime errors gracefully and prevent unexpected program crashes",
        "category": "topic",
        "isExercise": false,
        "marks": 1
      },
      {
        "id": "ch5-t5.2-m20",
        "topicNumber": "5.2",
        "question": "In Python exception handling, code that might raise an unexpected runtime error is placed inside the:",
        "options": [
          "try block",
          "except block",
          "finally block",
          "else block"
        ],
        "answer": "(a)",
        "correctIndex": 0,
        "answerKey": "try block",
        "category": "topic",
        "isExercise": false,
        "marks": 1
      },
      {
        "id": "ch5-t5.2-m21",
        "topicNumber": "5.2",
        "question": "When a database operation fails inside a try block, which function call in the except block cancels changes to preserve data integrity?",
        "options": [
          "connection.commit()",
          "connection.rollback()",
          "connection.close()",
          "connection.execute()"
        ],
        "answer": "(b)",
        "correctIndex": 1,
        "answerKey": "connection.rollback()",
        "category": "topic",
        "isExercise": false,
        "marks": 1
      },
      {
        "id": "ch5-t5.2-m22",
        "topicNumber": "5.2",
        "question": "Which block in Python exception handling always executes regardless of whether an exception occurred or not?",
        "options": [
          "try",
          "except",
          "finally",
          "catch"
        ],
        "answer": "(c)",
        "correctIndex": 2,
        "answerKey": "finally",
        "category": "topic",
        "isExercise": false,
        "marks": 1
      },
      {
        "id": "ch5-t5.2-m23",
        "topicNumber": "5.2",
        "question": "Handling multiple exception types separately in a single try-except structure allows a program to:",
        "options": [
          "Ignore syntax errors automatically",
          "Provide specific, tailored recovery actions for different error types",
          "Convert runtime errors into logic errors",
          "Bypass database security passwords"
        ],
        "answer": "(b)",
        "correctIndex": 1,
        "answerKey": "Provide specific, tailored recovery actions for different error types",
        "category": "topic",
        "isExercise": false,
        "marks": 1
      }
    ],
    "shortQuestions": [
      {
        "id": "ch5-t5.2-ex-s1",
        "topicNumber": "5.2",
        "question": "What is unit testing, and why is it important in programming?",
        "marks": 2,
        "category": "exercise",
        "isExercise": true
      },
      {
        "id": "ch5-t5.2-ex-s2",
        "topicNumber": "5.2",
        "question": "How do Python's unittest and pytest modules help in unit testing?",
        "marks": 2,
        "category": "exercise",
        "isExercise": true
      },
      {
        "id": "ch5-t5.2-ex-s3",
        "topicNumber": "5.2",
        "question": "What is the purpose of writing and executing test cases?",
        "marks": 2,
        "category": "exercise",
        "isExercise": true
      },
      {
        "id": "ch5-t5.2-ex-s4",
        "topicNumber": "5.2",
        "question": "How do you set breakpoints in IDEs like PyCharm or VS Code?",
        "marks": 2,
        "category": "exercise",
        "isExercise": true
      },
      {
        "id": "ch5-t5.2-ex-s5",
        "topicNumber": "5.2",
        "question": "What is the role of monitoring variable values with watch expressions during debugging?",
        "marks": 2,
        "category": "exercise",
        "isExercise": true
      },
      {
        "id": "ch5-t5.2-ex-s6",
        "topicNumber": "5.2",
        "question": "What is the step-by-step debugging process in IDEs?",
        "marks": 2,
        "category": "exercise",
        "isExercise": true
      },
      {
        "id": "ch5-t5.2-ex-s7",
        "topicNumber": "5.2",
        "question": "How does exception handling help in managing multiple exception types effectively?",
        "marks": 2,
        "category": "exercise",
        "isExercise": true
      },
      {
        "id": "ch5-t5.2-s6",
        "topicNumber": "5.2",
        "question": "What is a Test Case, and what two essential pieces of information must it contain?",
        "marks": 2,
        "category": "topic",
        "isExercise": false
      },
      {
        "id": "ch5-t5.2-s7",
        "topicNumber": "5.2",
        "question": "Explain how the pytest framework automatically detects and executes test functions in a Python file.",
        "marks": 2,
        "category": "topic",
        "isExercise": false
      },
      {
        "id": "ch5-t5.2-s8",
        "topicNumber": "5.2",
        "question": "What is the role of the assert statement in Python unit testing?",
        "marks": 2,
        "category": "topic",
        "isExercise": false
      },
      {
        "id": "ch5-t5.2-s9",
        "topicNumber": "5.2",
        "question": "State two key differences between Python's built-in unittest module and the pytest framework.",
        "marks": 2,
        "category": "topic",
        "isExercise": false
      },
      {
        "id": "ch5-t5.2-s10",
        "topicNumber": "5.2",
        "question": "Why is automated unit testing essential when updating or expanding an existing codebase?",
        "marks": 2,
        "category": "topic",
        "isExercise": false
      },
      {
        "id": "ch5-t5.2-s11",
        "topicNumber": "5.2",
        "question": "Explain how setting a Breakpoint in an IDE (such as PyCharm or VS Code) helps locate bugs in source code.",
        "marks": 2,
        "category": "topic",
        "isExercise": false
      },
      {
        "id": "ch5-t5.2-s12",
        "topicNumber": "5.2",
        "question": "What is a Watch Expression, and how does it assist developers during step-by-step execution?",
        "marks": 2,
        "category": "topic",
        "isExercise": false
      },
      {
        "id": "ch5-t5.2-s13",
        "topicNumber": "5.2",
        "question": "Differentiate between the Step Into and Step Over debugging commands.",
        "marks": 2,
        "category": "topic",
        "isExercise": false
      },
      {
        "id": "ch5-t5.2-s14",
        "topicNumber": "5.2",
        "question": "What occurs when a programmer clicks the Continue button while execution is paused at a breakpoint?",
        "marks": 2,
        "category": "topic",
        "isExercise": false
      },
      {
        "id": "ch5-t5.2-s15",
        "topicNumber": "5.2",
        "question": "What is the primary objective of Exception Handling in Python, and what happens if an error is left unhandled?",
        "marks": 2,
        "category": "topic",
        "isExercise": false
      },
      {
        "id": "ch5-t5.2-s16",
        "topicNumber": "5.2",
        "question": "Describe the specific functions of the try and except blocks in error management.",
        "marks": 2,
        "category": "topic",
        "isExercise": false
      },
      {
        "id": "ch5-t5.2-s17",
        "topicNumber": "5.2",
        "question": "Why is connection.rollback() called inside an except block during database operations?",
        "marks": 2,
        "category": "topic",
        "isExercise": false
      },
      {
        "id": "ch5-t5.2-s18",
        "topicNumber": "5.2",
        "question": "What is the purpose of the finally block in Python exception handling?",
        "marks": 2,
        "category": "topic",
        "isExercise": false
      },
      {
        "id": "ch5-t5.2-s19",
        "topicNumber": "5.2",
        "question": "How does catching multiple exception types separately improve application stability and user feedback?",
        "marks": 2,
        "category": "topic",
        "isExercise": false
      }
    ],
    "longQuestions": []
  },
  {
    "id": "cs-ch5-topic-5.3",
    "topicNumber": "5.3",
    "name": "Profiling and Optimization",
    "mcqs": [
      {
        "id": "ch5-t5.3-ex-m1",
        "topicNumber": "5.3",
        "question": "Profiling in programming is used to:",
        "options": [
          "Improve the user interface design",
          "Measure performance and identify bottlenecks",
          "Optimise memory usage only",
          "Test for security vulnerabilities"
        ],
        "answer": "(b)",
        "correctIndex": 1,
        "answerKey": "Measure performance and identify bottlenecks",
        "category": "exercise",
        "isExercise": true,
        "marks": 1
      },
      {
        "id": "ch5-t5.3-m24",
        "topicNumber": "5.3",
        "question": "Measuring the execution time and memory consumption of individual functions in a program is known as:",
        "options": [
          "Unit Testing",
          "Profiling",
          "Exception Handling",
          "Debugging"
        ],
        "answer": "(b)",
        "correctIndex": 1,
        "answerKey": "Profiling",
        "category": "topic",
        "isExercise": false,
        "marks": 1
      },
      {
        "id": "ch5-t5.3-m25",
        "topicNumber": "5.3",
        "question": "A specific part of a program that runs slowly or uses excessive resources, slowing down overall execution, is called a:",
        "options": [
          "Breakpoint",
          "Performance Bottleneck",
          "Syntax Bug",
          "Watch Expression"
        ],
        "answer": "(b)",
        "correctIndex": 1,
        "answerKey": "Performance Bottleneck",
        "category": "topic",
        "isExercise": false,
        "marks": 1
      },
      {
        "id": "ch5-t5.3-m26",
        "topicNumber": "5.3",
        "question": "Which built-in Python module generates a detailed profiling report showing call counts and cumulative execution time for each function?",
        "options": [
          "timeit",
          "cProfile",
          "unittest",
          "sqlite3"
        ],
        "answer": "(b)",
        "correctIndex": 1,
        "answerKey": "cProfile",
        "category": "topic",
        "isExercise": false,
        "marks": 1
      },
      {
        "id": "ch5-t5.3-m27",
        "topicNumber": "5.3",
        "question": "Which built-in Python module is specifically designed to measure and compare execution times of small code snippets?",
        "options": [
          "timeit",
          "cProfile",
          "pytest",
          "tkinter"
        ],
        "answer": "(a)",
        "correctIndex": 0,
        "answerKey": "timeit",
        "category": "topic",
        "isExercise": false,
        "marks": 1
      },
      {
        "id": "ch5-t5.3-m28",
        "topicNumber": "5.3",
        "question": "Why does a nested loop running 10,000 x 10,000 iterations create a severe performance bottleneck in Python?",
        "options": [
          "It causes a SyntaxError",
          "The inner statement executes 100,000,000 times, causing significant time delay",
          "Python cannot process nested loops",
          "It permanently corrupts hard drive data"
        ],
        "answer": "(b)",
        "correctIndex": 1,
        "answerKey": "The inner statement executes 100,000,000 times, causing significant time delay",
        "category": "topic",
        "isExercise": false,
        "marks": 1
      },
      {
        "id": "ch5-t5.3-m29",
        "topicNumber": "5.3",
        "question": "Replacing a manual for loop that sums numbers with Python's built-in sum() function is an example of:",
        "options": [
          "Exception handling",
          "Code optimization",
          "Setting a breakpoint",
          "Unit testing"
        ],
        "answer": "(b)",
        "correctIndex": 1,
        "answerKey": "Code optimization",
        "category": "topic",
        "isExercise": false,
        "marks": 1
      },
      {
        "id": "ch5-t5.3-m30",
        "topicNumber": "5.3",
        "question": "What is the primary objective of code optimization?",
        "options": [
          "Increasing the physical number of code lines",
          "Improving code execution speed and resource efficiency",
          "Adding graphical elements to user interfaces",
          "Converting errors into exceptions"
        ],
        "answer": "(b)",
        "correctIndex": 1,
        "answerKey": "Improving code execution speed and resource efficiency",
        "category": "topic",
        "isExercise": false,
        "marks": 1
      }
    ],
    "shortQuestions": [
      {
        "id": "ch5-t5.3-ex-s1",
        "topicNumber": "5.3",
        "question": "What tools can be used for profiling and measuring performance in Python?",
        "marks": 2,
        "category": "exercise",
        "isExercise": true
      },
      {
        "id": "ch5-t5.3-s20",
        "topicNumber": "5.3",
        "question": "What is Program Profiling, and why should it be performed before optimizing code?",
        "marks": 2,
        "category": "topic",
        "isExercise": false
      },
      {
        "id": "ch5-t5.3-s21",
        "topicNumber": "5.3",
        "question": "Define a Performance Bottleneck in software execution and give an example of code that causes it.",
        "marks": 2,
        "category": "topic",
        "isExercise": false
      },
      {
        "id": "ch5-t5.3-s22",
        "topicNumber": "5.3",
        "question": "Differentiate between the uses of Python's built-in cProfile and timeit modules.",
        "marks": 2,
        "category": "topic",
        "isExercise": false
      },
      {
        "id": "ch5-t5.3-s23",
        "topicNumber": "5.3",
        "question": "How does replacing a manual Python for loop with a built-in function (such as sum()) optimize program performance?",
        "marks": 2,
        "category": "topic",
        "isExercise": false
      },
      {
        "id": "ch5-t5.3-s24",
        "topicNumber": "5.3",
        "question": "Explain why a nested loop executing 10,000 x 10,000 iterations creates a severe bottleneck in Python.",
        "marks": 2,
        "category": "topic",
        "isExercise": false
      }
    ],
    "longQuestions": []
  }
];

export const CHAPTER_5_DATA = {
  id: "cs-12-ch5",
  chapterNumber: 5,
  name: "Code Testing and Debugging",
  topics: CHAPTER_5_NEW_TOPICS
};
