/**
 * Chapter 4: Applications of Python (12th Class Computer Science)
 * GUI Development with Tkinter & Working with Databases in Python
 * Official Exercise Questions (MCQs & Short Questions) & Board-Style Topic-Wise MCQs
 */

export const CHAPTER_4_NEW_TOPICS = [
  {
    "id": "cs-ch4-topic-4.1",
    "topicNumber": "4.1",
    "name": "Graphical User Interface (GUI) Development with Tkinter",
    "mcqs": [
      {
        "id": "ch4-t4.1-ex-m1",
        "topicNumber": "4.1",
        "question": "The main purpose of a GUI in Python programming is to:",
        "options": [
          "Create a user-friendly interface for interacting with software",
          "Manage files in Python",
          "Handle network operations",
          "Store and retrieve data from databases"
        ],
        "answer": "(a)",
        "correctIndex": 0,
        "answerKey": "Create a user-friendly interface for interacting with software",
        "category": "exercise",
        "isExercise": true,
        "marks": 1
      },
      {
        "id": "ch4-t4.1-ex-m2",
        "topicNumber": "4.1",
        "question": "Python's built-in GUI toolkit is:",
        "options": [
          "wxPython",
          "Tkinter",
          "PyQt",
          "Kivy"
        ],
        "answer": "(b)",
        "correctIndex": 1,
        "answerKey": "Tkinter",
        "category": "exercise",
        "isExercise": true,
        "marks": 1
      },
      {
        "id": "ch4-t4.1-ex-m3",
        "topicNumber": "4.1",
        "question": "The Tkinter widget used to display text is:",
        "options": [
          "Button",
          "Label",
          "Entry",
          "Listbox"
        ],
        "answer": "(b)",
        "correctIndex": 1,
        "answerKey": "Label",
        "category": "exercise",
        "isExercise": true,
        "marks": 1
      },
      {
        "id": "ch4-t4.1-ex-m4",
        "topicNumber": "4.1",
        "question": "The pack() method in Tkinter is used to:",
        "options": [
          "Align widgets vertically or horizontally",
          "Organize widgets in rows and columns",
          "Set widget sizes manually",
          "Create pop-up windows"
        ],
        "answer": "(a)",
        "correctIndex": 0,
        "answerKey": "Align widgets vertically or horizontally",
        "category": "exercise",
        "isExercise": true,
        "marks": 1
      },
      {
        "id": "ch4-t4.1-ex-m5",
        "topicNumber": "4.1",
        "question": "The methods used to organize widgets in Tkinter include:",
        "options": [
          "grid()",
          "pack()",
          "place()",
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
        "id": "ch4-t4.1-ex-m6",
        "topicNumber": "4.1",
        "question": "Event-driven programming in Tkinter means:",
        "options": [
          "Writing code that runs without user input",
          "Writing code that responds to user actions such as clicks or key presses",
          "Writing code to manage database queries",
          "Writing code to handle network requests"
        ],
        "answer": "(b)",
        "correctIndex": 1,
        "answerKey": "Writing code that responds to user actions such as clicks or key presses",
        "category": "exercise",
        "isExercise": true,
        "marks": 1
      },
      {
        "id": "ch4-t4.1-ex-m7",
        "topicNumber": "4.1",
        "question": "The Tkinter widget used to get user input is:",
        "options": [
          "Label",
          "Button",
          "Entry",
          "Listbox"
        ],
        "answer": "(c)",
        "correctIndex": 2,
        "answerKey": "Entry",
        "category": "exercise",
        "isExercise": true,
        "marks": 1
      },
      {
        "id": "ch4-t4.1-ex-m8",
        "topicNumber": "4.1",
        "question": "The Tkinter layout manager that allows precise positioning of widgets using coordinates is:",
        "options": [
          "pack()",
          "grid()",
          "place()",
          "align()"
        ],
        "answer": "(c)",
        "correctIndex": 2,
        "answerKey": "place()",
        "category": "exercise",
        "isExercise": true,
        "marks": 1
      },
      {
        "id": "ch4-t4.1-ex-m9",
        "topicNumber": "4.1",
        "question": "The Tkinter option that connects a button click to a function is:",
        "options": [
          "bind()",
          "configure()",
          "command= (no parentheses)",
          "execute()"
        ],
        "answer": "(c)",
        "correctIndex": 2,
        "answerKey": "command= (no parentheses)",
        "category": "exercise",
        "isExercise": true,
        "marks": 1
      },
      {
        "id": "ch4-t4.1-m1",
        "topicNumber": "4.1",
        "question": "What is a Graphical User Interface (GUI)?",
        "options": [
          "A command-based text interface",
          "A visual interface using elements like buttons, windows, and text boxes",
          "A database connection driver",
          "A compiled binary executable file"
        ],
        "answer": "(b)",
        "correctIndex": 1,
        "answerKey": "A visual interface using elements like buttons, windows, and text boxes",
        "category": "topic",
        "isExercise": false,
        "marks": 1
      },
      {
        "id": "ch4-t4.1-m2",
        "topicNumber": "4.1",
        "question": "What is the primary advantage of a GUI over a Command-Line Interface (CLI)?",
        "options": [
          "It uses less system memory",
          "It provides visual feedback and makes applications user-friendly without requiring users to memorize commands",
          "It eliminates the need for operating systems",
          "It executes Python code without a interpreter"
        ],
        "answer": "(b)",
        "correctIndex": 1,
        "answerKey": "It provides visual feedback and makes applications user-friendly without requiring users to memorize commands",
        "category": "topic",
        "isExercise": false,
        "marks": 1
      },
      {
        "id": "ch4-t4.1-m3",
        "topicNumber": "4.1",
        "question": "Which built-in Python library is standard for creating desktop graphical user interfaces?",
        "options": [
          "PyQt",
          "wxPython",
          "tkinter",
          "Kivy"
        ],
        "answer": "(c)",
        "correctIndex": 2,
        "answerKey": "tkinter",
        "category": "topic",
        "isExercise": false,
        "marks": 1
      },
      {
        "id": "ch4-t4.1-m4",
        "topicNumber": "4.1",
        "question": "Which function/class call creates the main application window in Tkinter?",
        "options": [
          "tk.Window()",
          "tk.Tk()",
          "tk.Main()",
          "tk.GUI()"
        ],
        "answer": "(b)",
        "correctIndex": 1,
        "answerKey": "tk.Tk()",
        "category": "topic",
        "isExercise": false,
        "marks": 1
      },
      {
        "id": "ch4-t4.1-m5",
        "topicNumber": "4.1",
        "question": "What is the purpose of the window.mainloop() method in a Tkinter application?",
        "options": [
          "It compiles the Python script into machine code",
          "It runs the event loop to keep the window open and listen for user interactions",
          "It connects the window to an SQLite database",
          "It closes the window automatically after 10 seconds"
        ],
        "answer": "(b)",
        "correctIndex": 1,
        "answerKey": "It runs the event loop to keep the window open and listen for user interactions",
        "category": "topic",
        "isExercise": false,
        "marks": 1
      },
      {
        "id": "ch4-t4.1-m6",
        "topicNumber": "4.1",
        "question": "Which Tkinter widget is specifically used to display static text or messages on the screen?",
        "options": [
          "Button",
          "Label",
          "Entry",
          "Listbox"
        ],
        "answer": "(b)",
        "correctIndex": 1,
        "answerKey": "Label",
        "category": "topic",
        "isExercise": false,
        "marks": 1
      },
      {
        "id": "ch4-t4.1-m7",
        "topicNumber": "4.1",
        "question": "Which Tkinter widget allows users to enter a single line of text input?",
        "options": [
          "Label",
          "Entry",
          "Button",
          "Frame"
        ],
        "answer": "(b)",
        "correctIndex": 1,
        "answerKey": "Entry",
        "category": "topic",
        "isExercise": false,
        "marks": 1
      },
      {
        "id": "ch4-t4.1-m8",
        "topicNumber": "4.1",
        "question": "Which Tkinter widget serves as a container to group and organize other widgets inside a window?",
        "options": [
          "Label",
          "Entry",
          "Frame",
          "Menu"
        ],
        "answer": "(c)",
        "correctIndex": 2,
        "answerKey": "Frame",
        "category": "topic",
        "isExercise": false,
        "marks": 1
      },
      {
        "id": "ch4-t4.1-m9",
        "topicNumber": "4.1",
        "question": "To mask password input in a Tkinter Entry widget (so characters appear as * ), which attribute is used?",
        "options": [
          "mask=\"*\"",
          "password=True",
          "show=\"*\"",
          "hidden=True"
        ],
        "answer": "(c)",
        "correctIndex": 2,
        "answerKey": "show=\"*\"",
        "category": "topic",
        "isExercise": false,
        "marks": 1
      },
      {
        "id": "ch4-t4.1-m10",
        "topicNumber": "4.1",
        "question": "Which Tkinter widget provides a list of selectable items to the user?",
        "options": [
          "Label",
          "Entry",
          "Listbox",
          "Frame"
        ],
        "answer": "(c)",
        "correctIndex": 2,
        "answerKey": "Listbox",
        "category": "topic",
        "isExercise": false,
        "marks": 1
      },
      {
        "id": "ch4-t4.1-m11",
        "topicNumber": "4.1",
        "question": "Which Tkinter layout manager places widgets stacked vertically or horizontally in a simple sequence?",
        "options": [
          "grid()",
          "pack()",
          "place()",
          "align()"
        ],
        "answer": "(b)",
        "correctIndex": 1,
        "answerKey": "pack()",
        "category": "topic",
        "isExercise": false,
        "marks": 1
      },
      {
        "id": "ch4-t4.1-m12",
        "topicNumber": "4.1",
        "question": "Which Tkinter layout manager arranges widgets in a structured table format using rows and columns?",
        "options": [
          "pack()",
          "grid()",
          "place()",
          "absolute()"
        ],
        "answer": "(b)",
        "correctIndex": 1,
        "answerKey": "grid()",
        "category": "topic",
        "isExercise": false,
        "marks": 1
      },
      {
        "id": "ch4-t4.1-m13",
        "topicNumber": "4.1",
        "question": "Which Tkinter layout manager places widgets at exact pixel coordinates ( x and y ) on the window?",
        "options": [
          "pack()",
          "grid()",
          "place()",
          "align()"
        ],
        "answer": "(c)",
        "correctIndex": 2,
        "answerKey": "place()",
        "category": "topic",
        "isExercise": false,
        "marks": 1
      },
      {
        "id": "ch4-t4.1-m14",
        "topicNumber": "4.1",
        "question": "In grid() layout management, which option allows a widget to stretch across multiple columns?",
        "options": [
          "rowspan",
          "columnspan",
          "colspan",
          "expand"
        ],
        "answer": "(b)",
        "correctIndex": 1,
        "answerKey": "columnspan",
        "category": "topic",
        "isExercise": false,
        "marks": 1
      },
      {
        "id": "ch4-t4.1-m15",
        "topicNumber": "4.1",
        "question": "A programming approach where program flow is determined by user actions like button clicks or key presses is called:",
        "options": [
          "Procedural Programming",
          "Sequential Programming",
          "Event-Driven Programming",
          "Functional Programming"
        ],
        "answer": "(c)",
        "correctIndex": 2,
        "answerKey": "Event-Driven Programming",
        "category": "topic",
        "isExercise": false,
        "marks": 1
      },
      {
        "id": "ch4-t4.1-m16",
        "topicNumber": "4.1",
        "question": "Which option in a Tkinter Button widget connects a button click to a specific Python function?",
        "options": [
          "action=",
          "event=",
          "command=",
          "connect="
        ],
        "answer": "(c)",
        "correctIndex": 2,
        "answerKey": "command=",
        "category": "topic",
        "isExercise": false,
        "marks": 1
      },
      {
        "id": "ch4-t4.1-m17",
        "topicNumber": "4.1",
        "question": "Which Tkinter module is imported to display pop-up dialog boxes such as success or error alerts?",
        "options": [
          "tk.dialog",
          "messagebox",
          "alertbox",
          "popup"
        ],
        "answer": "(b)",
        "correctIndex": 1,
        "answerKey": "messagebox",
        "category": "topic",
        "isExercise": false,
        "marks": 1
      }
    ],
    "shortQuestions": [
      {
        "id": "ch4-t4.1-ex-s1",
        "topicNumber": "4.1",
        "question": "What is a GUI and why is it important in application development?",
        "marks": 2,
        "category": "exercise",
        "isExercise": true
      },
      {
        "id": "ch4-t4.1-ex-s2",
        "topicNumber": "4.1",
        "question": "What is Tkinter and why is it Python's built-in GUI toolkit?",
        "marks": 2,
        "category": "exercise",
        "isExercise": true
      },
      {
        "id": "ch4-t4.1-ex-s3",
        "topicNumber": "4.1",
        "question": "How do you create a window and add frames in Tkinter?",
        "marks": 2,
        "category": "exercise",
        "isExercise": true
      },
      {
        "id": "ch4-t4.1-ex-s4",
        "topicNumber": "4.1",
        "question": "Name two common widgets used in Tkinter.",
        "marks": 2,
        "category": "exercise",
        "isExercise": true
      },
      {
        "id": "ch4-t4.1-ex-s5",
        "topicNumber": "4.1",
        "question": "What is the purpose of layout management in Tkinter?",
        "marks": 2,
        "category": "exercise",
        "isExercise": true
      },
      {
        "id": "ch4-t4.1-ex-s6",
        "topicNumber": "4.1",
        "question": "How does the pack() method organize elements in Tkinter?",
        "marks": 2,
        "category": "exercise",
        "isExercise": true
      },
      {
        "id": "ch4-t4.1-ex-s7",
        "topicNumber": "4.1",
        "question": "What is event-driven programming and how is it used in Tkinter?",
        "marks": 2,
        "category": "exercise",
        "isExercise": true
      },
      {
        "id": "ch4-t4.1-ex-s8",
        "topicNumber": "4.1",
        "question": "How do you handle user input in Tkinter?",
        "marks": 2,
        "category": "exercise",
        "isExercise": true
      }
    ],
    "longQuestions": []
  },
  {
    "id": "cs-ch4-topic-4.2",
    "topicNumber": "4.2",
    "name": "Working with Databases in Python",
    "mcqs": [
      {
        "id": "ch4-t4.2-ex-m1",
        "topicNumber": "4.2",
        "question": "CRUD operations in databases stand for:",
        "options": [
          "Create, Read, Update, Delete",
          "Create, Run, Upload, Delete",
          "Copy, Retrieve, Upload, Download",
          "Create, Remove, Update, Manage"
        ],
        "answer": "(a)",
        "correctIndex": 0,
        "answerKey": "Create, Read, Update, Delete",
        "category": "exercise",
        "isExercise": true,
        "marks": 1
      },
      {
        "id": "ch4-t4.2-m18",
        "topicNumber": "4.2",
        "question": "A real-world object, person, event, or concept about which data is stored in a database is an:",
        "options": [
          "Attribute",
          "Entity",
          "Identifier",
          "Instance"
        ],
        "answer": "(b)",
        "correctIndex": 1,
        "answerKey": "Entity",
        "category": "topic",
        "isExercise": false,
        "marks": 1
      },
      {
        "id": "ch4-t4.2-m19",
        "topicNumber": "4.2",
        "question": "A property or characteristic describing a specific entity (e.g., student name or age) is an:",
        "options": [
          "Entity",
          "Attribute",
          "Identifier",
          "Foreign Key"
        ],
        "answer": "(b)",
        "correctIndex": 1,
        "answerKey": "Attribute",
        "category": "topic",
        "isExercise": false,
        "marks": 1
      },
      {
        "id": "ch4-t4.2-m20",
        "topicNumber": "4.2",
        "question": "A field in a relational database table that uniquely identifies each record is called a:",
        "options": [
          "Foreign Key",
          "Primary Key",
          "Secondary Key",
          "Composite Attribute"
        ],
        "answer": "(b)",
        "correctIndex": 1,
        "answerKey": "Primary Key",
        "category": "topic",
        "isExercise": false,
        "marks": 1
      },
      {
        "id": "ch4-t4.2-m21",
        "topicNumber": "4.2",
        "question": "A field in one database table that links to the primary key of another table to form a relationship is a:",
        "options": [
          "Primary Key",
          "Foreign Key",
          "Candidate Key",
          "Identifier"
        ],
        "answer": "(b)",
        "correctIndex": 1,
        "answerKey": "Foreign Key",
        "category": "topic",
        "isExercise": false,
        "marks": 1
      },
      {
        "id": "ch4-t4.2-m22",
        "topicNumber": "4.2",
        "question": "Which lightweight database module comes pre-installed with Python and stores data in a single file?",
        "options": [
          "MySQL",
          "PostgreSQL",
          "sqlite3",
          "MongoDB"
        ],
        "answer": "(c)",
        "correctIndex": 2,
        "answerKey": "sqlite3",
        "category": "topic",
        "isExercise": false,
        "marks": 1
      },
      {
        "id": "ch4-t4.2-m23",
        "topicNumber": "4.2",
        "question": "What database object must be created in Python to execute SQL queries and fetch results?",
        "options": [
          "Connection",
          "Cursor",
          "Table",
          "Connector"
        ],
        "answer": "(b)",
        "correctIndex": 1,
        "answerKey": "Cursor",
        "category": "topic",
        "isExercise": false,
        "marks": 1
      },
      {
        "id": "ch4-t4.2-m24",
        "topicNumber": "4.2",
        "question": "Which method of a database cursor object is used to execute an SQL command string in Python?",
        "options": [
          "cursor.run()",
          "cursor.execute()",
          "cursor.perform()",
          "cursor.query()"
        ],
        "answer": "(b)",
        "correctIndex": 1,
        "answerKey": "cursor.execute()",
        "category": "topic",
        "isExercise": false,
        "marks": 1
      },
      {
        "id": "ch4-t4.2-m25",
        "topicNumber": "4.2",
        "question": "Which cursor method retrieves all matching rows returned by an executed SELECT SQL query?",
        "options": [
          "cursor.getall()",
          "cursor.readall()",
          "cursor.fetchall()",
          "cursor.retrieve()"
        ],
        "answer": "(c)",
        "correctIndex": 2,
        "answerKey": "cursor.fetchall()",
        "category": "topic",
        "isExercise": false,
        "marks": 1
      },
      {
        "id": "ch4-t4.2-m26",
        "topicNumber": "4.2",
        "question": "Which connection method must be called to permanently save changes (like INSERT , UPDATE , or DELETE ) to an SQLite database?",
        "options": [
          "connection.save()",
          "connection.commit()",
          "connection.push()",
          "connection.close()"
        ],
        "answer": "(b)",
        "correctIndex": 1,
        "answerKey": "connection.commit()",
        "category": "topic",
        "isExercise": false,
        "marks": 1
      },
      {
        "id": "ch4-t4.2-m27",
        "topicNumber": "4.2",
        "question": "In database management, what does the acronym CRUD stand for?",
        "options": [
          "Compile, Read, Update, Delete",
          "Create, Read, Update, and Delete",
          "Connect, Run, Undo, Disconnect",
          "Create, Retrieve, Upload, Destroy"
        ],
        "answer": "(b)",
        "correctIndex": 1,
        "answerKey": "Create, Read, Update, and Delete",
        "category": "topic",
        "isExercise": false,
        "marks": 1
      },
      {
        "id": "ch4-t4.2-m28",
        "topicNumber": "4.2",
        "question": "Which SQL command corresponds to the \"Create\" operation in CRUD to add a new record to a table?",
        "options": [
          "ADD RECORD",
          "INSERT INTO",
          "NEW ROW",
          "CREATE RECORD"
        ],
        "answer": "(b)",
        "correctIndex": 1,
        "answerKey": "INSERT INTO",
        "category": "topic",
        "isExercise": false,
        "marks": 1
      },
      {
        "id": "ch4-t4.2-m29",
        "topicNumber": "4.2",
        "question": "Which SQL command corresponds to the \"Read\" operation in CRUD to fetch data from a table?",
        "options": [
          "FETCH",
          "GET",
          "SELECT",
          "READ"
        ],
        "answer": "(c)",
        "correctIndex": 2,
        "answerKey": "SELECT",
        "category": "topic",
        "isExercise": false,
        "marks": 1
      },
      {
        "id": "ch4-t4.2-m30",
        "topicNumber": "4.2",
        "question": "Which SQL command modifies existing records in a database table based on a specific condition?",
        "options": [
          "MODIFY",
          "ALTER",
          "UPDATE",
          "CHANGE"
        ],
        "answer": "(c)",
        "correctIndex": 2,
        "answerKey": "UPDATE",
        "category": "topic",
        "isExercise": false,
        "marks": 1
      }
    ],
    "shortQuestions": [
      {
        "id": "ch4-t4.2-ex-s1",
        "topicNumber": "4.2",
        "question": "What is the CRUD operation in database management?",
        "marks": 2,
        "category": "exercise",
        "isExercise": true
      },
      {
        "id": "ch4-t4.2-ex-s2",
        "topicNumber": "4.2",
        "question": "How do you connect Python to a database like SQLite?",
        "marks": 2,
        "category": "exercise",
        "isExercise": true
      }
    ],
    "longQuestions": []
  }
];

export const CHAPTER_4_DATA = {
  id: "cs-12-ch4",
  chapterNumber: 4,
  name: "Applications of Python",
  topics: CHAPTER_4_NEW_TOPICS
};
