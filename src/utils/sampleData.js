export const SAMPLE_TEXTS = [
  {
    id: "cs-networking",
    title: "Computer Networks & Internet",
    subject: "Computer Science",
    grade: "10th",
    content: `A Computer Network is a system of interconnected computers and devices that can communicate with each other and share resources like files, printers, and internet connections.

Types of Computer Networks:
1. Local Area Network (LAN): Connects computers within a small geographical area such as a home, office building, or school laboratory. LANs provide high speed data transfer and high security.
2. Wide Area Network (WAN): Connects computers across large geographical distances, such as across cities, countries, or globally. The Internet is the largest example of a WAN.
3. Metropolitan Area Network (MAN): Covers a larger geographic area than a LAN but smaller than a WAN, typically spanning an entire city or university campus.

Network Topologies:
- Star Topology: All nodes are connected to a central device such as a hub or switch. If one line fails, only that node is disconnected.
- Bus Topology: All devices share a single main communication line (backbone). Easy to set up but main cable failure brings down the entire network.
- Ring Topology: Each device is connected to exactly two other devices in a circular ring. Signals travel in one direction.

Network Hardware and Protocols:
- Router: A networking device that forwards data packets between computer networks.
- IP Address: A unique numerical identifier assigned to each device connected to a network using the Internet Protocol.
- TCP/IP (Transmission Control Protocol / Internet Protocol): The fundamental communications protocol suite of the Internet.
- Bandwidth: The maximum amount of data that can be transmitted over a network connection in a given amount of time, measured in bits per second (bps).`
  },
  {
    id: "physics-forces",
    title: "Newton's Laws of Motion & Energy",
    subject: "Physics",
    grade: "11th",
    content: `Force is a push or pull upon an object resulting from the object's interaction with another object. Force is a vector quantity having both magnitude and direction, measured in Newtons (N).

Newton's Three Laws of Motion:
1. First Law of Motion (Law of Inertia): An object at rest remains at rest, and an object in motion continues in motion with a constant velocity, unless acted upon by a net external force.
2. Second Law of Motion: The acceleration of an object is directly proportional to the net force acting on it and inversely proportional to its mass. Expressed mathematically as F = m * a.
3. Third Law of Motion: For every action force, there is an equal and opposite reaction force. Forces always occur in action-reaction pairs.

Types of Energy:
- Kinetic Energy (KE): The energy possessed by an object due to its motion. Formula: KE = 0.5 * m * v^2.
- Potential Energy (PE): Stored energy due to an object's position or configuration. Gravitational Potential Energy: PE = m * g * h.
- Law of Conservation of Energy: Energy cannot be created or destroyed; it can only be transformed from one form to another. Total energy in an isolated system remains constant.`
  },
  {
    id: "biology-cells",
    title: "Cell Structure and Function",
    subject: "Biology",
    grade: "9th",
    content: `The cell is the basic structural, functional, and biological unit of all known living organisms. Cells are often referred to as the building blocks of life.

Cell Types:
1. Prokaryotic Cells: Simple cells lacking a membrane-bound nucleus or membrane-bound organelles. Bacteria and Archaea are prokaryotes.
2. Eukaryotic Cells: Complex cells containing a distinct nucleus enclosing genetic material (DNA) and membrane-bound organelles. Animals, plants, and fungi are eukaryotes.

Key Cell Organelles:
- Nucleus: The control center of the cell that contains DNA and directs cellular activities.
- Mitochondria: The powerhouse of the cell responsible for generating cellular energy in the form of ATP through cellular respiration.
- Chloroplasts: Found in plant cells, containing chlorophyll to perform photosynthesis, converting solar energy into chemical energy (glucose).
- Cell Membrane (Plasma Membrane): A selectively permeable phospholipid bilayer that regulates the passage of substances into and out of the cell.
- Ribosomes: Cellular structures responsible for protein synthesis by assembling amino acids.`
  }
];

const getStoredSettings = () => {
  try {
    const raw = localStorage.getItem('ptm_default_paper_settings');
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    return {};
  }
};

const stored = getStoredSettings();

export const DEFAULT_PAPER_CONFIG = {
  academyName: stored.academyName || "PRO TEST MAKER",
  tagline: stored.tagline || "One Stop Test Solution",
  addressPhone: "",
  examTitle: "CLASS TEST EXAMINATION",
  paperType: "Subjective + Objective",
  subject: "Computer Science",
  gradeClass: "9th Class",
  timeAllowed: "60 Mins",
  totalMarks: 50,
  topMargin: 15, // Upper margin in mm (default 15mm)
  questionGap: 2, // Dynamic Gap range slider (0px to 24px, default 2px)
  fontSize: stored.textFontSize || 10, // Dynamic Font Size slider (8pt to 14pt, default 10pt)
  mcqLayout: stored.mcqLayout || "1 Column", // "1 Column" or "2 Columns"
  mcqOptionsCols: Number(stored.mcqOptionsCols) || 2, // 1, 2, or 4
  englishFont: "Open Sans", // Default English font
  urduFont: "Jameel Noori Nastaleeq", // Default Urdu font
  date: new Date().toISOString().split('T')[0],
  showInstructions: false,
  instructions: [
    "Read all questions carefully before attempting.",
    "Attempt all sections."
  ],
  showMcqIndividualMarks: false,
  watermarkText: stored.watermarkText || "AL-ZIA SCIENCE ACADEMY",
  showWatermark: true,
  theme: "classic",
  paperSize: "A4",
  showAnswerKey: false,
  language: "English",

  // 8 Specific Settings from Reference
  headerLayout: stored.headerLayout === "Layout 42" ? "Layout 13" : (stored.headerLayout || "Layout 13"),
  headerFontStyle: stored.headerFontStyle || "Default",
  headerFontSize: stored.headerFontSize || 30,
  headingFontSize: stored.headingFontSize || 12,
  textFontSize: stored.textFontSize || 11,
  textFormatting: stored.textFormatting || "Normal",
  paperFontColor: stored.paperFontColor || "Black",
  watermarkType: stored.watermarkType || "Text Watermark",
  syllabus: stored.syllabus || "Chapter 1 (Topic: 1.1 to 1.6)"
};
