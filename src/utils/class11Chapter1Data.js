/**
 * Class 11th Computer Science - Chapter 1: Software Development
 * Complete Question Bank with Topics 1.1 to 1.8 + Official Textbook Exercise (Pages 18-19)
 */

export const CLASS_11_CHAPTER_1_TOPICS = [
  // =========================================================================
  // TOPIC 1.1: SOFTWARE DEVELOPMENT
  // =========================================================================
  {
    id: "cs-11-ch1-topic-1.1",
    topicNumber: "1.1",
    name: "Software Development",
    mcqs: [
      {
        id: "cs11-ch1-t1.1-m1",
        question: "Software development is best defined as a systematic process that transforms:",
        options: [
          "Hardware circuits into microprocessors",
          "User needs into software products",
          "Text documents into printed books",
          "Analog signals into digital pulses"
        ],
        answer: "(b)",
        correctIndex: 1,
        answerKey: "User needs into software products",
        marks: 1
      },
      {
        id: "cs11-ch1-t1.1-m2",
        question: "Which of the following activities is directly involved in software development?",
        options: [
          "Assembling computer motherboards",
          "Writing code, testing it, and addressing issues",
          "Manufacturing optical storage drives",
          "Installing power supply units"
        ],
        answer: "(b)",
        correctIndex: 1,
        answerKey: "Writing code, testing it, and addressing issues",
        marks: 1
      }
    ],
    shortQuestions: [
      {
        id: "cs11-ch1-t1.1-s1",
        question: "Define software development and state its main objective.",
        marks: 2
      },
      {
        id: "cs11-ch1-t1.1-s2",
        question: "Why is understanding the software development process crucial for creating reliable software solutions?",
        marks: 2
      }
    ],
    longQuestions: []
  },

  // =========================================================================
  // TOPIC 1.2: SOFTWARE DEVELOPMENT LIFE CYCLE (SDLC)
  // =========================================================================
  {
    id: "cs-11-ch1-topic-1.2",
    topicNumber: "1.2",
    name: "Software Development Life Cycle (SDLC)",
    mcqs: [
      {
        id: "cs11-ch1-t1.2-m1",
        question: "The primary purpose of the Software Development Life Cycle (SDLC) is to:",
        options: [
          "Design computer chassis",
          "Deliver high-quality software within time and cost estimates",
          "Manufacture networking cables",
          "Replace human programmers with automated machines"
        ],
        answer: "(b)",
        correctIndex: 1,
        answerKey: "Deliver high-quality software within time and cost estimates",
        marks: 1
      },
      {
        id: "cs11-ch1-t1.2-m2",
        question: "In software engineering, a standardized and reusable set of concepts, practices, and tools that offers predefined components is called a:",
        options: [
          "Translator",
          "Framework",
          "Compiler",
          "Debugger"
        ],
        answer: "(b)",
        correctIndex: 1,
        answerKey: "Framework",
        marks: 1
      },
      {
        id: "cs11-ch1-t1.2-m3",
        question: "Requirements that define specific behaviors, functions, or tasks the system must perform are categorized as:",
        options: [
          "Non-Functional Requirements",
          "Functional Requirements",
          "Operational Constraints",
          "Environmental Requirements"
        ],
        answer: "(b)",
        correctIndex: 1,
        answerKey: "Functional Requirements",
        marks: 1
      },
      {
        id: "cs11-ch1-t1.2-m4",
        question: "Requirements that specify quality attributes, performance criteria, usability, and constraints (e.g., system handling 1000 users or 99.9% uptime) are known as:",
        options: [
          "Functional Requirements",
          "Non-Functional Requirements",
          "Architectural Diagrams",
          "User Stories"
        ],
        answer: "(b)",
        correctIndex: 1,
        answerKey: "Non-Functional Requirements",
        marks: 1
      },
      {
        id: "cs11-ch1-t1.2-m5",
        question: "In which SDLC stage do programmers translate design specifications into a programming language?",
        options: [
          "Requirement Gathering",
          "Design",
          "Coding / Development",
          "Maintenance"
        ],
        answer: "(c)",
        correctIndex: 2,
        answerKey: "Coding / Development",
        marks: 1
      }
    ],
    shortQuestions: [
      {
        id: "cs11-ch1-t1.2-s1",
        question: "What is SDLC, and what is its main goal?",
        marks: 2
      },
      {
        id: "cs11-ch1-t1.2-s2",
        question: "Differentiate between Functional Requirements and Non-Functional Requirements with examples.",
        marks: 3
      },
      {
        id: "cs11-ch1-t1.2-s3",
        question: "List the six main stages of the SDLC in correct sequential order.",
        marks: 2
      }
    ],
    longQuestions: []
  },

  // =========================================================================
  // TOPIC 1.3: SOFTWARE DEVELOPMENT METHODOLOGIES
  // =========================================================================
  {
    id: "cs-11-ch1-topic-1.3",
    topicNumber: "1.3",
    name: "Software Development Methodologies",
    mcqs: [
      {
        id: "cs11-ch1-t1.3-m1",
        question: "Which software development model is linear and sequential, where each phase must be completed before the next begins?",
        options: [
          "Agile Methodology",
          "Waterfall Model",
          "Spiral Model",
          "Evolutionary Model"
        ],
        answer: "(b)",
        correctIndex: 1,
        answerKey: "Waterfall Model",
        marks: 1
      },
      {
        id: "cs11-ch1-t1.3-m2",
        question: "A major limitation of the Waterfall Model is its:",
        options: [
          "Lack of distinct phases",
          "Inflexibility to go back and make changes once a phase is completed",
          "Requirement for daily customer feedback",
          "High complexity for small projects"
        ],
        answer: "(b)",
        correctIndex: 1,
        answerKey: "Inflexibility to go back and make changes once a phase is completed",
        marks: 1
      },
      {
        id: "cs11-ch1-t1.3-m3",
        question: "Short development cycles in Agile Methodology are commonly referred to as:",
        options: [
          "Sequences",
          "Sprints or Iterations",
          "Waterfalls",
          "Modules"
        ],
        answer: "(b)",
        correctIndex: 1,
        answerKey: "Sprints or Iterations",
        marks: 1
      },
      {
        id: "cs11-ch1-t1.3-m4",
        question: "An Agile practice where two developers work together at one workstation—one writing code and the other reviewing it in real-time—is called:",
        options: [
          "Continuous Integration",
          "Test-Driven Development",
          "Pair Programming",
          "Unit Testing"
        ],
        answer: "(c)",
        correctIndex: 2,
        answerKey: "Pair Programming",
        marks: 1
      }
    ],
    shortQuestions: [
      {
        id: "cs11-ch1-t1.3-s1",
        question: "Describe the Waterfall Model and name two of its key benefits.",
        marks: 2
      },
      {
        id: "cs11-ch1-t1.3-s2",
        question: "What is Agile Methodology, and how does it handle changing requirements during development?",
        marks: 3
      },
      {
        id: "cs11-ch1-t1.3-s3",
        question: "Briefly explain the concept of Pair Programming in Agile software development.",
        marks: 2
      }
    ],
    longQuestions: []
  },

  // =========================================================================
  // TOPIC 1.4: PROJECT PLANNING AND MANAGEMENT
  // =========================================================================
  {
    id: "cs-11-ch1-topic-1.4",
    topicNumber: "1.4",
    name: "Project Planning and Management",
    mcqs: [
      {
        id: "cs11-ch1-t1.4-m1",
        question: "Which of the following is NOT one of the main factors considered when estimating the cost of a software project?",
        options: [
          "Choice of technology stack",
          "Development team size and hourly rates",
          "Number of internal routine team meetings held",
          "Risk management and contingency funds"
        ],
        answer: "(c)",
        correctIndex: 2,
        answerKey: "Number of internal routine team meetings held",
        marks: 1
      },
      {
        id: "cs11-ch1-t1.4-m2",
        question: "The process of identifying potential technical or operational risks, analyzing their impact, and creating plans to minimize their effect is called:",
        options: [
          "Quality Assurance",
          "Risk Assessment and Management",
          "Continuous Integration",
          "Acceptance Testing"
        ],
        answer: "(b)",
        correctIndex: 1,
        answerKey: "Risk Assessment and Management",
        marks: 1
      }
    ],
    shortQuestions: [
      {
        id: "cs11-ch1-t1.4-s1",
        question: "List the five phases of a project management plan.",
        marks: 2
      },
      {
        id: "cs11-ch1-t1.4-s2",
        question: "State three key factors that influence the cost estimation of a software project.",
        marks: 2
      }
    ],
    longQuestions: []
  },

  // =========================================================================
  // TOPIC 1.5: GRAPHICAL REPRESENTATION OF SOFTWARE SYSTEMS (UML)
  // =========================================================================
  {
    id: "cs-11-ch1-topic-1.5",
    topicNumber: "1.5",
    name: "Graphical Representation of Software Systems (UML)",
    mcqs: [
      {
        id: "cs11-ch1-t1.5-m1",
        question: "What does the acronym UML stand for?",
        options: [
          "Universal Machine Language",
          "Unified Modeling Language",
          "Unified Management Logic",
          "User Model Layout"
        ],
        answer: "(b)",
        correctIndex: 1,
        answerKey: "Unified Modeling Language",
        marks: 1
      },
      {
        id: "cs11-ch1-t1.5-m2",
        question: "Which UML diagram provides a visual representation of a system's functionality from the user's perspective, showing actors and interactions?",
        options: [
          "Class Diagram",
          "Sequence Diagram",
          "Use Case Diagram",
          "Activity Diagram"
        ],
        answer: "(c)",
        correctIndex: 2,
        answerKey: "Use Case Diagram",
        marks: 1
      },
      {
        id: "cs11-ch1-t1.5-m3",
        question: "In a UML Class Diagram, the structural containers representing real-world entities or modules with attributes and methods are called:",
        options: [
          "Actors",
          "Classes",
          "Decision nodes",
          "Messages"
        ],
        answer: "(b)",
        correctIndex: 1,
        answerKey: "Classes",
        marks: 1
      },
      {
        id: "cs11-ch1-t1.5-m4",
        question: "Which UML diagram displays how objects interact with each other in a specific sequential order over time?",
        options: [
          "Activity Diagram",
          "Sequence Diagram",
          "Use Case Diagram",
          "Deployment Diagram"
        ],
        answer: "(b)",
        correctIndex: 1,
        answerKey: "Sequence Diagram",
        marks: 1
      },
      {
        id: "cs11-ch1-t1.5-m5",
        question: "Which UML diagram models the step-by-step flow of activities or operations in a process, similar to a flowchart?",
        options: [
          "Class Diagram",
          "Activity Diagram",
          "Component Diagram",
          "Use Case Diagram"
        ],
        answer: "(b)",
        correctIndex: 1,
        answerKey: "Activity Diagram",
        marks: 1
      }
    ],
    shortQuestions: [
      {
        id: "cs11-ch1-t1.5-s1",
        question: "Define UML and state its purpose in software design.",
        marks: 2
      },
      {
        id: "cs11-ch1-t1.5-s2",
        question: "Explain the roles of an Actor and a Use Case in a Use Case Diagram.",
        marks: 2
      },
      {
        id: "cs11-ch1-t1.5-s3",
        question: "Differentiate between a Sequence Diagram and an Activity Diagram.",
        marks: 2
      }
    ],
    longQuestions: []
  },

  // =========================================================================
  // TOPIC 1.6: INTRODUCTION TO DESIGN PATTERNS
  // =========================================================================
  {
    id: "cs-11-ch1-topic-1.6",
    topicNumber: "1.6",
    name: "Introduction to Design Patterns",
    mcqs: [
      {
        id: "cs11-ch1-t1.6-m1",
        question: "What are design patterns in software development?",
        options: [
          "Hardware circuit schematics",
          "Common reusable solutions/templates to recurring software design problems",
          "Visual color schemes for user interfaces",
          "Automated code compilers"
        ],
        answer: "(b)",
        correctIndex: 1,
        answerKey: "Common reusable solutions/templates to recurring software design problems",
        marks: 1
      },
      {
        id: "cs11-ch1-t1.6-m2",
        question: "Which design pattern ensures that a specific object or resource is created only once in a program and reused whenever needed?",
        options: [
          "Factory Pattern",
          "Singleton Pattern",
          "Observer Pattern",
          "Strategy Pattern"
        ],
        answer: "(b)",
        correctIndex: 1,
        answerKey: "Singleton Pattern",
        marks: 1
      },
      {
        id: "cs11-ch1-t1.6-m3",
        question: "Which design pattern acts like a workshop that creates different objects without exposing the instantiation logic to the caller?",
        options: [
          "Singleton Pattern",
          "Factory Pattern",
          "Observer Pattern",
          "Strategy Pattern"
        ],
        answer: "(b)",
        correctIndex: 1,
        answerKey: "Factory Pattern",
        marks: 1
      },
      {
        id: "cs11-ch1-t1.6-m4",
        question: "A design pattern that automatically notifies all interested dependent objects whenever a state change occurs in a subject is the:",
        options: [
          "Strategy Pattern",
          "Observer Pattern",
          "Singleton Pattern",
          "Factory Pattern"
        ],
        answer: "(b)",
        correctIndex: 1,
        answerKey: "Observer Pattern",
        marks: 1
      }
    ],
    shortQuestions: [
      {
        id: "cs11-ch1-t1.6-s1",
        question: "Define Design Patterns and state two advantages of using them.",
        marks: 2
      },
      {
        id: "cs11-ch1-t1.6-s2",
        question: "Differentiate between the Singleton Pattern and the Factory Pattern.",
        marks: 2
      }
    ],
    longQuestions: []
  },

  // =========================================================================
  // TOPIC 1.7: SOFTWARE DEBUGGING AND TESTING
  // =========================================================================
  {
    id: "cs-11-ch1-topic-1.7",
    topicNumber: "1.7",
    name: "Software Debugging and Testing",
    mcqs: [
      {
        id: "cs11-ch1-t1.7-m1",
        question: "The process of finding and fixing errors or bugs in software code is known as:",
        options: [
          "Testing",
          "Debugging",
          "Deployment",
          "Maintenance"
        ],
        answer: "(b)",
        correctIndex: 1,
        answerKey: "Debugging",
        marks: 1
      },
      {
        id: "cs11-ch1-t1.7-m2",
        question: "Testing individual components or modules of software in isolation to verify their correct functionality is called:",
        options: [
          "System Testing",
          "Unit Testing",
          "Acceptance Testing",
          "Integration Testing"
        ],
        answer: "(b)",
        correctIndex: 1,
        answerKey: "Unit Testing",
        marks: 1
      },
      {
        id: "cs11-ch1-t1.7-m3",
        question: "Testing performed by end-users or clients to determine whether the software is ready for final release is called:",
        options: [
          "Integration Testing",
          "Unit Testing",
          "Acceptance Testing (UAT)",
          "Regression Testing"
        ],
        answer: "(c)",
        correctIndex: 2,
        answerKey: "Acceptance Testing (UAT)",
        marks: 1
      }
    ],
    shortQuestions: [
      {
        id: "cs11-ch1-t1.7-s1",
        question: "Differentiate between Debugging and Testing.",
        marks: 2
      },
      {
        id: "cs11-ch1-t1.7-s2",
        question: "Explain the four levels of testing hierarchy: Unit, Integration, System, and Acceptance Testing.",
        marks: 3
      }
    ],
    longQuestions: []
  },

  // =========================================================================
  // TOPIC 1.8: SOFTWARE DEVELOPMENT TOOLS
  // =========================================================================
  {
    id: "cs-11-ch1-topic-1.8",
    topicNumber: "1.8",
    name: "Software Development Tools",
    mcqs: [
      {
        id: "cs11-ch1-t1.8-m1",
        question: "A language translator that converts high-level source code into machine language line-by-line during execution is an:",
        options: [
          "Compiler",
          "Interpreter",
          "Debugger",
          "Editor"
        ],
        answer: "(b)",
        correctIndex: 1,
        answerKey: "Interpreter",
        marks: 1
      },
      {
        id: "cs11-ch1-t1.8-m2",
        question: "A language translator that translates the entire source code into machine code all at once before execution is a:",
        options: [
          "Interpreter",
          "Compiler",
          "Text Editor",
          "Version Control System"
        ],
        answer: "(b)",
        correctIndex: 1,
        answerKey: "Compiler",
        marks: 1
      },
      {
        id: "cs11-ch1-t1.8-m3",
        question: "Which of the following is a popular platform used for source code hosting and version control repository management?",
        options: [
          "PyCharm",
          "GitHub",
          "GDB",
          "GCC"
        ],
        answer: "(b)",
        correctIndex: 1,
        answerKey: "GitHub",
        marks: 1
      }
    ],
    shortQuestions: [
      {
        id: "cs11-ch1-t1.8-s1",
        question: "Differentiate between a Compiler and an Interpreter with examples.",
        marks: 2
      }
    ],
    longQuestions: []
  }
];

