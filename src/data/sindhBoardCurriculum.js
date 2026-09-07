/**
 * Sindh Textbook Board (STBB Jamshoro) Official Curriculum Data Structure
 * Organization: Class → Subject → Book → Chapters → Content
 * Supports Classes 8, 9, 10, 11, and 12
 */

export const sindhBoardClasses = [
  {
    id: "class-8",
    name: "Class 8",
    grade: 8,
    section: "Middle Section",
    board: "Sindh Textbook Board",
    description: "Middle Section Foundational Core Curriculum & Board Preparation",
  },
  {
    id: "class-9",
    name: "Class 9",
    grade: 9,
    section: "Matric Part I (SSC-I)",
    board: "Sindh Textbook Board",
    description: "Secondary School Certificate Part I — Science & General Groups",
  },
  {
    id: "class-10",
    name: "Class 10",
    grade: 10,
    section: "Matric Part II (SSC-II)",
    board: "Sindh Textbook Board",
    description: "Secondary School Certificate Part II — Board Examinations",
  },
  {
    id: "class-11",
    name: "Class 11",
    grade: 11,
    section: "Intermediate Part I (HSSC-I)",
    board: "Sindh Textbook Board",
    description: "FSc / Higher Secondary Certificate — Pre-Medical, Pre-Engineering & CS",
  },
  {
    id: "class-12",
    name: "Class 12",
    grade: 12,
    section: "Intermediate Part II (HSSC-II)",
    board: "Sindh Textbook Board",
    description: "FSc / Higher Secondary Certificate — Pre-Medical, Pre-Engineering & CS",
  },
];

export const sindhBoardSubjects = [
  // Class 8 Subjects
  { id: "sub-c8-math", classId: "class-8", name: "Mathematics", code: "MATH-8", icon: "Calculator", color: "blue", description: "Sets, Number Systems, Polynomials, and Geometry" },
  { id: "sub-c8-sci", classId: "class-8", name: "General Science", code: "SCI-8", icon: "Atom", color: "emerald", description: "Human Organ Systems, Heredity, Chemical Reactions, and Force" },
  { id: "sub-c8-eng", classId: "class-8", name: "English", code: "ENG-8", icon: "BookOpen", color: "indigo", description: "Comprehension, Grammar, Essay Writing and Vocabulary" },
  { id: "sub-c8-comp", classId: "class-8", name: "Computer Education", code: "COMP-8", icon: "Cpu", color: "cyan", description: "ICT Fundamentals, Networking, Excel and Problem Solving" },
  { id: "sub-c8-urdu", classId: "class-8", name: "Urdu", code: "URDU-8", icon: "Feather", color: "amber", description: "Prose, Poetry, Qawaid and Insha" },
  { id: "sub-c8-sindhi", classId: "class-8", name: "Sindhi", code: "SND-8", icon: "BookMarked", color: "rose", description: "Sindhi Boli, Adab, and Grammar" },
  { id: "sub-c8-pst", classId: "class-8", name: "Social Studies", code: "SST-8", icon: "Globe", color: "purple", description: "Geography, History of South Asia, and Civics" },
  { id: "sub-c8-isl", classId: "class-8", name: "Islamiat", code: "ISL-8", icon: "Shield", color: "teal", description: "Quranic Verses, Ahadith, and Islamic Ethics" },

  // Class 9 Subjects (Matric Part I)
  { id: "sub-c9-phy", classId: "class-9", name: "Physics", code: "PHY-9", icon: "Zap", color: "blue", description: "Mechanics, Measurement, Kinematics, Dynamics and Matter" },
  { id: "sub-c9-chem", classId: "class-9", name: "Chemistry", code: "CHEM-9", icon: "FlaskConical", color: "emerald", description: "Atomic Structure, Periodic Table, Bonding and States of Matter" },
  { id: "sub-c9-math", classId: "class-9", name: "Mathematics", code: "MATH-9", icon: "Calculator", color: "amber", description: "Real Numbers, Logarithms, Algebra, Factorization and Equations" },
  { id: "sub-c9-bio", classId: "class-9", name: "Biology", code: "BIO-9", icon: "Dna", color: "teal", description: "Cell Biology, Biodiversity, Bioenergetics, and Physiology" },
  { id: "sub-c9-comp", classId: "class-9", name: "Computer Science", code: "CS-9", icon: "Laptop", color: "cyan", description: "Computer Systems, OS, Networking, and Cyber Security" },
  { id: "sub-c9-eng", classId: "class-9", name: "English Compulsory", code: "ENG-9", icon: "BookOpen", color: "indigo", description: "Secondary Stage English Book One — Prose, Poetry and Grammar" },
  { id: "sub-c9-sindhi", classId: "class-9", name: "Sindhi Salees", code: "SND-9", icon: "Feather", color: "rose", description: "Sindh Textbook Board Matric Sindhi Curriculum" },
  { id: "sub-c9-pst", classId: "class-9", name: "Pakistan Studies", code: "PST-9", icon: "Flag", color: "emerald", description: "Ideology of Pakistan, Movement, and Early History" },

  // Class 10 Subjects (Matric Part II)
  { id: "sub-c10-phy", classId: "class-10", name: "Physics", code: "PHY-10", icon: "Zap", color: "blue", description: "Wave Motion, Sound, Optics, Electrostatics, and Nuclear Physics" },
  { id: "sub-c10-chem", classId: "class-10", name: "Chemistry", code: "CHEM-10", icon: "FlaskConical", color: "emerald", description: "Acids, Bases, Organic Chemistry, Hydrocarbons and Biochemistry" },
  { id: "sub-c10-math", classId: "class-10", name: "Mathematics", code: "MATH-10", icon: "Calculator", color: "amber", description: "Sets, Variations, Matrices, Statistics, Trigonometry and Geometry" },
  { id: "sub-c10-bio", classId: "class-10", name: "Biology", code: "BIO-10", icon: "Dna", color: "teal", description: "Gaseous Exchange, Homeostasis, Coordination, Reproduction, and Genetics" },
  { id: "sub-c10-comp", classId: "class-10", name: "Computer Science", code: "CS-10", icon: "Laptop", color: "cyan", description: "Algorithms, Flowcharts, Programming in C, and Database Basics" },
  { id: "sub-c10-eng", classId: "class-10", name: "English Compulsory", code: "ENG-10", icon: "BookOpen", color: "indigo", description: "Secondary Stage English Book Two — Prose, Poems and Composition" },
  { id: "sub-c10-urdu", classId: "class-10", name: "Urdu Salees", code: "URDU-10", icon: "Feather", color: "rose", description: "Sindh Textbook Board Matric Urdu Course" },
  { id: "sub-c10-isl", classId: "class-10", name: "Islamiat Compulsory", code: "ISL-10", icon: "Shield", color: "purple", description: "Surah Al-Ahzab, Surah Mumtahina, Ahadith, and Islamic History" },

  // Class 11 Subjects (Intermediate Part I)
  { id: "sub-c11-phy", classId: "class-11", name: "Physics", code: "PHY-11", icon: "Zap", color: "blue", description: "Vectors, Motion, Force, Work, Circular Motion, and Physical Optics" },
  { id: "sub-c11-chem", classId: "class-11", name: "Chemistry", code: "CHEM-11", icon: "FlaskConical", color: "emerald", description: "Stoichiometry, States of Matter, Atomic Structure, and Kinetics" },
  { id: "sub-c11-math", classId: "class-11", name: "Mathematics", code: "MATH-11", icon: "Calculator", color: "amber", description: "Complex Numbers, Matrices, Vectors, Sequences and Trigonometry" },
  { id: "sub-c11-bio", classId: "class-11", name: "Biology (Botany & Zoology)", code: "BIO-11", icon: "Dna", color: "teal", description: "Biological Molecules, Enzymes, Cell, Animalia and Plantae" },
  { id: "sub-c11-comp", classId: "class-11", name: "Computer Science", code: "CS-11", icon: "Laptop", color: "cyan", description: "Information Technology, Architecture, Operating Systems and Networks" },
  { id: "sub-c11-eng", classId: "class-11", name: "English Normal", code: "ENG-11", icon: "BookOpen", color: "indigo", description: "A Selection of English Prose and Verse for Class XI" },
  { id: "sub-c11-urdu", classId: "class-11", name: "Urdu Lazmi", code: "URDU-11", icon: "Feather", color: "rose", description: "Sindh Textbook Board Intermediate Urdu Part I" },
  { id: "sub-c11-isl", classId: "class-11", name: "Islamic Education", code: "ISL-11", icon: "Shield", color: "purple", description: "Islamic Culture, Quranic Principles, and Sunnah" },

  // Class 12 Subjects (Intermediate Part II)
  { id: "sub-c12-phy", classId: "class-12", name: "Physics", code: "PHY-12", icon: "Zap", color: "blue", description: "Heat, Thermodynamics, Electrostatics, Electromagnetism, Modern Physics" },
  { id: "sub-c12-chem", classId: "class-12", name: "Chemistry", code: "CHEM-12", icon: "FlaskConical", color: "emerald", description: "Inorganic Chemistry, Transition Elements, Organic Compounds and Biomolecules" },
  { id: "sub-c12-math", classId: "class-12", name: "Mathematics", code: "MATH-12", icon: "Calculator", color: "amber", description: "Calculus, Differentiation, Integration, Analytic Geometry and Conics" },
  { id: "sub-c12-bio", classId: "class-12", name: "Biology (Botany & Zoology)", code: "BIO-12", icon: "Dna", color: "teal", description: "Homeostasis, Support, Reproduction, Evolution, and Biotechnology" },
  { id: "sub-c12-comp", classId: "class-12", name: "Computer Science", code: "CS-12", icon: "Laptop", color: "cyan", description: "Advanced C Programming, OOP, Database Concepts, and SQL" },
  { id: "sub-c12-eng", classId: "class-12", name: "English Compulsory", code: "ENG-12", icon: "BookOpen", color: "indigo", description: "A Selection of English Prose and Verse for Class XII" },
  { id: "sub-c12-pst", classId: "class-12", name: "Pakistan Studies", code: "PST-12", icon: "Flag", color: "emerald", description: "Constitutional Development, Foreign Policy, and Economy of Pakistan" },
  { id: "sub-c12-urdu", classId: "class-12", name: "Urdu Lazmi", code: "URDU-12", icon: "Feather", color: "rose", description: "Sindh Textbook Board Intermediate Urdu Part II" },
];

export const sindhBoardBooks = [
  // Class 9 Books
  {
    id: "book-c9-phy",
    classId: "class-9",
    subjectId: "sub-c9-phy",
    title: "Secondary Stage Physics (Class IX)",
    author: "Sindh Textbook Board Panel of Authors",
    board: "Sindh Textbook Board, Jamshoro",
    edition: "Single National Curriculum Edition",
    description: "Official textbook prescribed by the Sindh Textbook Board for Class IX Secondary Examination.",
    coverUrl: "",
    totalChapters: 9,
  },
  {
    id: "book-c9-chem",
    classId: "class-9",
    subjectId: "sub-c9-chem",
    title: "Secondary Stage Chemistry (Class IX)",
    author: "Sindh Textbook Board Panel of Authors",
    board: "Sindh Textbook Board, Jamshoro",
    edition: "Single National Curriculum Edition",
    description: "Official textbook prescribed by the Sindh Textbook Board for Class IX Secondary Examination.",
    coverUrl: "",
    totalChapters: 8,
  },
  {
    id: "book-c9-math",
    classId: "class-9",
    subjectId: "sub-c9-math",
    title: "Secondary Stage Mathematics (Class IX)",
    author: "Sindh Textbook Board Panel of Authors",
    board: "Sindh Textbook Board, Jamshoro",
    edition: "Single National Curriculum Edition",
    description: "Official textbook prescribed by the Sindh Textbook Board for Class IX Secondary Examination.",
    coverUrl: "",
    totalChapters: 8,
  },
  {
    id: "book-c9-bio",
    classId: "class-9",
    subjectId: "sub-c9-bio",
    title: "Secondary Stage Biology (Class IX)",
    author: "Sindh Textbook Board Panel of Authors",
    board: "Sindh Textbook Board, Jamshoro",
    edition: "Single National Curriculum Edition",
    description: "Official textbook prescribed by the Sindh Textbook Board for Class IX Secondary Examination.",
    coverUrl: "",
    totalChapters: 9,
  },
  {
    id: "book-c9-eng",
    classId: "class-9",
    subjectId: "sub-c9-eng",
    title: "Secondary Stage English Book One (Class IX)",
    author: "Sindh Textbook Board Panel of Authors",
    board: "Sindh Textbook Board, Jamshoro",
    edition: "National Curriculum Edition",
    description: "Prescribed textbook for Class IX English prose, poetry, comprehension and grammar.",
    coverUrl: "",
    totalChapters: 6,
  },

  // Class 10 Books
  {
    id: "book-c10-phy",
    classId: "class-10",
    subjectId: "sub-c10-phy",
    title: "Secondary Stage Physics (Class X)",
    author: "Sindh Textbook Board Panel of Authors",
    board: "Sindh Textbook Board, Jamshoro",
    edition: "Single National Curriculum Edition",
    description: "Official textbook prescribed by the Sindh Textbook Board for Class X Secondary Examination.",
    coverUrl: "",
    totalChapters: 9,
  },
  {
    id: "book-c10-chem",
    classId: "class-10",
    subjectId: "sub-c10-chem",
    title: "Secondary Stage Chemistry (Class X)",
    author: "Sindh Textbook Board Panel of Authors",
    board: "Sindh Textbook Board, Jamshoro",
    edition: "Single National Curriculum Edition",
    description: "Official textbook prescribed by the Sindh Textbook Board for Class X Secondary Examination.",
    coverUrl: "",
    totalChapters: 8,
  },
  {
    id: "book-c10-math",
    classId: "class-10",
    subjectId: "sub-c10-math",
    title: "Secondary Stage Mathematics (Class X)",
    author: "Sindh Textbook Board Panel of Authors",
    board: "Sindh Textbook Board, Jamshoro",
    edition: "Single National Curriculum Edition",
    description: "Official textbook prescribed by the Sindh Textbook Board for Class X Secondary Examination.",
    coverUrl: "",
    totalChapters: 7,
  },

  // Class 11 Books
  {
    id: "book-c11-phy",
    classId: "class-11",
    subjectId: "sub-c11-phy",
    title: "Physics for Class XI (Higher Secondary Stage)",
    author: "Sindh Textbook Board Panel of Authors",
    board: "Sindh Textbook Board, Jamshoro",
    edition: "Higher Secondary Curriculum Edition",
    description: "Official intermediate textbook for Pre-Engineering, Pre-Medical and Computer Science students.",
    coverUrl: "",
    totalChapters: 10,
  },
  {
    id: "book-c11-chem",
    classId: "class-11",
    subjectId: "sub-c11-chem",
    title: "Chemistry for Class XI (Higher Secondary Stage)",
    author: "Sindh Textbook Board Panel of Authors",
    board: "Sindh Textbook Board, Jamshoro",
    edition: "Higher Secondary Curriculum Edition",
    description: "Comprehensive intermediate textbook covering Physical and Inorganic Chemistry.",
    coverUrl: "",
    totalChapters: 8,
  },
  {
    id: "book-c11-math",
    classId: "class-11",
    subjectId: "sub-c11-math",
    title: "Mathematics Part I (Class XI)",
    author: "Sindh Textbook Board Panel of Authors",
    board: "Sindh Textbook Board, Jamshoro",
    edition: "Higher Secondary Curriculum Edition",
    description: "Official textbook covering Algebra, Vectors, Probability and Trigonometric Analysis.",
    coverUrl: "",
    totalChapters: 10,
  },

  // Class 12 Books
  {
    id: "book-c12-phy",
    classId: "class-12",
    subjectId: "sub-c12-phy",
    title: "Physics for Class XII (Higher Secondary Stage)",
    author: "Sindh Textbook Board Panel of Authors",
    board: "Sindh Textbook Board, Jamshoro",
    edition: "Higher Secondary Curriculum Edition",
    description: "Prescribed textbook for Class XII covering Thermodynamics, Electromagnetism and Modern Physics.",
    coverUrl: "",
    totalChapters: 11,
  },
  {
    id: "book-c12-chem",
    classId: "class-12",
    subjectId: "sub-c12-chem",
    title: "Chemistry for Class XII (Higher Secondary Stage)",
    author: "Sindh Textbook Board Panel of Authors",
    board: "Sindh Textbook Board, Jamshoro",
    edition: "Higher Secondary Curriculum Edition",
    description: "Prescribed textbook covering Transition Elements, Organic Chemistry and Applied Chemical Industries.",
    coverUrl: "",
    totalChapters: 11,
  },
  {
    id: "book-c12-math",
    classId: "class-12",
    subjectId: "sub-c12-math",
    title: "Mathematics Part II (Class XII)",
    author: "Sindh Textbook Board Panel of Authors",
    board: "Sindh Textbook Board, Jamshoro",
    edition: "Higher Secondary Curriculum Edition",
    description: "Official textbook covering Functions, Calculus, Differentiation, Integration and Analytical Geometry.",
    coverUrl: "",
    totalChapters: 7,
  },

  // Class 8 Books
  {
    id: "book-c8-sci",
    classId: "class-8",
    subjectId: "sub-c8-sci",
    title: "General Science for Class VIII",
    author: "Sindh Textbook Board Panel of Authors",
    board: "Sindh Textbook Board, Jamshoro",
    edition: "National Curriculum Edition",
    description: "Foundational general science textbook for Middle Section students.",
    coverUrl: "",
    totalChapters: 7,
  },
  {
    id: "book-c8-math",
    classId: "class-8",
    subjectId: "sub-c8-math",
    title: "Mathematics for Class VIII",
    author: "Sindh Textbook Board Panel of Authors",
    board: "Sindh Textbook Board, Jamshoro",
    edition: "National Curriculum Edition",
    description: "Foundational mathematics textbook covering sets, number systems and geometry.",
    coverUrl: "",
    totalChapters: 7,
  },
];

export const sindhBoardChapters = [
  // Class 9 Physics Chapters
  {
    id: "chap-c9-phy-1",
    classId: "class-9",
    subjectId: "sub-c9-phy",
    bookId: "book-c9-phy",
    chapterNumber: 1,
    title: "Physical Quantities and Measurement",
    description: "Introduction to physical quantities, SI base & derived units, scientific notation, and precision instruments.",
    learningObjectives: [
      "Distinguish between base and derived physical quantities and their SI units",
      "Understand the use of prefixes and standard scientific notation in measurements",
      "Demonstrate the working and least count of Vernier Calipers and Screw Gauge",
      "Apply rules for identifying significant figures in calculation results",
    ],
    theoryNotes: `### 1.1 Physical Quantities
All measurable quantities are called physical quantities. They are categorized into:
* **Base Quantities:** The fundamental quantities on the basis of which other quantities are expressed (Length, Mass, Time, Electric Current, Thermodynamic Temperature, Amount of Substance, Luminous Intensity).
* **Derived Quantities:** Quantities expressed in terms of base quantities (e.g. Velocity, Force, Work, Power, Electric Charge).

### 1.2 International System of Units (SI)
In 1960, the Eleventh General Conference on Weights and Measures adopted a worldwide system called Système International d'Unités (SI).

### 1.3 Measuring Instruments
* **Vernier Calipers:** Used to measure small lengths, external and internal diameters. Least Count (L.C) = Smallest division on main scale / Total divisions on vernier scale = 0.1 mm or 0.01 cm.
* **Screw Gauge (Micrometer):** Used to measure thickness or diameter of wire. Least Count = Pitch / Total circular scale divisions = 0.01 mm or 0.001 cm.`,
    keyFormulas: `* Least Count (Vernier Calipers) = 1 mm / 10 = 0.1 mm = 0.01 cm
* Least Count (Screw Gauge) = Pitch / Circular Scale Divisions = 0.5 mm / 50 = 0.01 mm
* Volume of Sphere = (4/3)πr³
* Density = Mass / Volume (ρ = m / V)`,
    resourceLink: "https://ebooks.stbb.edu.pk",
  },
  {
    id: "chap-c9-phy-2",
    classId: "class-9",
    subjectId: "sub-c9-phy",
    bookId: "book-c9-phy",
    chapterNumber: 2,
    title: "Kinematics",
    description: "Study of motion of bodies without considering the causes of motion, scalar/vector quantities, and equations of motion.",
    learningObjectives: [
      "Differentiate between Rest and Motion, and classify types of motion (Translatory, Rotatory, Oscillatory)",
      "Distinguish between distance and displacement, speed and velocity, uniform and variable acceleration",
      "Derive the three fundamental equations of motion graphically and algebraically",
      "Solve numerical problems involving freely falling bodies under gravity",
    ],
    theoryNotes: `### 2.1 Types of Motion
* **Translatory Motion:** Every particle of the body moves along parallel lines (Linear, Circular, Random).
* **Rotatory Motion:** Spinning motion of a body about an axis passing through it.
* **Oscillatory / Vibratory Motion:** To-and-fro motion of a body about its mean position.

### 2.2 Scalars and Vectors
* **Scalars:** Quantities described completely by magnitude and unit (Mass, Time, Speed, Distance).
* **Vectors:** Quantities described by magnitude, unit, and direction (Velocity, Displacement, Force, Acceleration).`,
    keyFormulas: `* Velocity: v = s / t
* Acceleration: a = (vf - vi) / t
* 1st Equation of Motion: vf = vi + at
* 2nd Equation of Motion: s = vi*t + (1/2)a*t²
* 3rd Equation of Motion: 2as = vf² - vi²
* Motion under gravity: replace a with g (9.8 m/s²)`,
    resourceLink: "https://ebooks.stbb.edu.pk",
  },
  {
    id: "chap-c9-phy-3",
    classId: "class-9",
    subjectId: "sub-c9-phy",
    bookId: "book-c9-phy",
    chapterNumber: 3,
    title: "Dynamics",
    description: "Newton's laws of motion, momentum, friction, and circular motion with mathematical applications.",
    learningObjectives: [
      "Understand the concept of inertia and state Newton's three laws of motion",
      "Define momentum and state the law of conservation of linear momentum",
      "Explain the causes and effects of friction and methods of reducing friction",
      "Understand centripetal force and centripetal acceleration in circular paths",
    ],
    theoryNotes: `### 3.1 Newton's Laws of Motion
* **First Law (Law of Inertia):** A body continues its state of rest or uniform motion in a straight line unless acted upon by an external net force.
* **Second Law:** When a net force acts on a body, it produces acceleration in the direction of the force: F = ma.
* **Third Law:** To every action, there is an equal and opposite reaction.

### 3.2 Momentum
Momentum is the quantity of motion contained in a body: p = m*v (SI unit: kg·m/s or N·s).`,
    keyFormulas: `* Force: F = ma
* Weight: W = mg
* Momentum: p = mv
* Force & Momentum: F = (pf - pi) / t = Δp / Δt
* Friction: fs = μs * R
* Centripetal Force: Fc = (m*v²) / r`,
    resourceLink: "https://ebooks.stbb.edu.pk",
  },
  {
    id: "chap-c9-phy-4",
    classId: "class-9",
    subjectId: "sub-c9-phy",
    bookId: "book-c9-phy",
    chapterNumber: 4,
    title: "Turning Effect of Forces",
    description: "Torque, center of mass, center of gravity, conditions of equilibrium, and states of equilibrium.",
    learningObjectives: [
      "Define torque (moment of force) and understand its mathematical representation",
      "Locate the center of gravity of regular and irregular shaped objects",
      "State the two conditions of equilibrium and classify the three states of equilibrium",
    ],
    theoryNotes: `### 4.1 Torque / Moment of Force
The turning effect produced in a body about a pivot or axis of rotation is called torque.
τ = F × d (where d is the moment arm).

### 4.2 Conditions of Equilibrium
* **First Condition:** Vector sum of all forces acting on the body must be zero: ΣF = 0 (ΣFx = 0, ΣFy = 0).
* **Second Condition:** Vector sum of all torques acting on the body must be zero: Στ = 0.`,
    keyFormulas: `* Torque: τ = F × d (SI unit: N·m)
* Principle of Moments: Clockwise Moments = Anticlockwise Moments
* First Condition: ΣF = 0
* Second Condition: Στ = 0`,
    resourceLink: "https://ebooks.stbb.edu.pk",
  },

  // Class 9 Chemistry Chapters
  {
    id: "chap-c9-chem-1",
    classId: "class-9",
    subjectId: "sub-c9-chem",
    bookId: "book-c9-chem",
    chapterNumber: 1,
    title: "Fundamentals of Chemistry",
    description: "Branches of chemistry, atomic mass, molecular mass, formula mass, chemical species, and Avogadro's number.",
    learningObjectives: [
      "Define chemistry and identify its major branches (Organic, Inorganic, Physical, Analytical)",
      "Calculate molecular mass and formula mass of common chemical compounds",
      "Understand the mole concept and solve calculations involving Avogadro's number",
    ],
    theoryNotes: `### 1.1 Mole and Avogadro's Number
A mole is the atomic mass, molecular mass, or formula mass of a substance expressed in grams.
One mole contains 6.022 × 10²³ particles (Avogadro's constant, NA).

### 1.2 Types of Chemical Formulas
* **Empirical Formula:** The simplest whole-number ratio of atoms in a compound.
* **Molecular Formula:** The actual number of atoms of each element in a molecule. Molecular Formula = n × Empirical Formula.`,
    keyFormulas: `* Number of Moles = Given Mass (g) / Molar Mass (g/mol)
* Number of Particles = Moles × NA (6.022 × 10²³)
* Molar Mass = Σ (Atomic Mass × Number of Atoms)`,
    resourceLink: "https://ebooks.stbb.edu.pk",
  },
  {
    id: "chap-c9-chem-2",
    classId: "class-9",
    subjectId: "sub-c9-chem",
    bookId: "book-c9-chem",
    chapterNumber: 2,
    title: "Atomic Structure",
    description: "Subatomic particles, Rutherford's and Bohr's atomic models, electronic configuration, and isotopes.",
    learningObjectives: [
      "Describe the structure of atom, subatomic particles (protons, neutrons, electrons)",
      "Compare Rutherford's atomic model with Bohr's atomic theory",
      "Write the electronic configuration of elements up to atomic number 18",
    ],
    theoryNotes: `### 2.1 Bohr's Atomic Theory
1. Electrons revolve in fixed circular orbits called energy levels or shells (K, L, M, N).
2. Each orbit has a fixed energy.
3. Energy is absorbed when an electron jumps to a higher orbit, and radiated when it falls to a lower orbit.

### 2.2 Electronic Configuration
Capacity of shells is given by 2n² formula:
* K Shell (n=1): max 2 electrons
* L Shell (n=2): max 8 electrons
* M Shell (n=3): max 18 electrons`,
    keyFormulas: `* Shell capacity: 2n²
* Atomic Number (Z) = Number of protons
* Mass Number (A) = Number of protons + Number of neutrons (A = Z + N)`,
    resourceLink: "https://ebooks.stbb.edu.pk",
  },

  // Class 10 Physics Chapters
  {
    id: "chap-c10-phy-1",
    classId: "class-10",
    subjectId: "sub-c10-phy",
    bookId: "book-c10-phy",
    chapterNumber: 10,
    title: "Simple Harmonic Motion and Waves",
    description: "Simple harmonic motion of mass-spring system, simple pendulum, wave motion, and wave properties.",
    learningObjectives: [
      "State conditions for a body executing Simple Harmonic Motion (SHM)",
      "Analyze the motion of simple pendulum and mass attached to a spring",
      "Understand wave properties: reflection, refraction, and diffraction",
    ],
    theoryNotes: `### 10.1 Simple Harmonic Motion (SHM)
SHM occurs when the acceleration of an oscillating body is directly proportional to its displacement from the mean position and is always directed towards the mean position: a ∝ -x.

### 10.2 Wave Equation
Relation between speed, frequency, and wavelength: v = f·λ.`,
    keyFormulas: `* Time period of Simple Pendulum: T = 2π√(L / g)
* Time period of Mass-Spring: T = 2π√(m / k)
* Wave equation: v = f · λ
* Frequency: f = 1 / T`,
    resourceLink: "https://ebooks.stbb.edu.pk",
  },
  {
    id: "chap-c10-phy-2",
    classId: "class-10",
    subjectId: "sub-c10-phy",
    bookId: "book-c10-phy",
    chapterNumber: 11,
    title: "Sound",
    description: "Sound waves, speed of sound, characteristics of sound (loudness, pitch, quality), and ultrasound applications.",
    learningObjectives: [
      "Understand the longitudinal nature of sound waves and medium requirement",
      "Explain loudness, pitch, quality, and intensity of sound",
      "Describe reflection of sound (echo) and uses of ultrasound in medicine and industry",
    ],
    theoryNotes: `### 11.1 Characteristics of Sound
* **Loudness:** Depends on the amplitude of vibrating body, area, and distance.
* **Pitch:** Characteristic by which a shrill sound can be distinguished from a grave one (depends on frequency).
* **Quality (Timbre):** Distinguishes two sounds of same loudness and pitch (depends on waveform).`,
    keyFormulas: `* Speed of sound: v = 2d / t (for Echo)
* Intensity Level: β = 10 log(I / I₀) dB`,
    resourceLink: "https://ebooks.stbb.edu.pk",
  },

  // Class 11 Physics Chapters
  {
    id: "chap-c11-phy-1",
    classId: "class-11",
    subjectId: "sub-c11-phy",
    bookId: "book-c11-phy",
    chapterNumber: 1,
    title: "Scope of Physics and Measurements",
    description: "Fundamental and derived SI units, errors, uncertainties, significant figures, and dimensional analysis.",
    learningObjectives: [
      "Understand scientific notations, fractional uncertainties, and percentage uncertainties",
      "Perform dimensional analysis to verify the homogeneity of physical equations",
      "Derive relations between physical quantities using dimensions",
    ],
    theoryNotes: `### 1.1 Dimensional Analysis
Dimensions represent the physical nature of a quantity.
* Mass: [M]
* Length: [L]
* Time: [T]
* Velocity: [L T⁻¹]
* Acceleration: [L T⁻²]
* Force: [M L T⁻²]
* Work / Energy: [M L² T⁻²]`,
    keyFormulas: `* Percentage uncertainty = (Absolute uncertainty / Measured value) × 100%
* Dimensions of Force = [M L T⁻²]
* Dimensions of Energy = [M L² T⁻²]
* Dimensions of Power = [M L² T⁻³]`,
    resourceLink: "https://ebooks.stbb.edu.pk",
  },
  {
    id: "chap-c11-phy-2",
    classId: "class-11",
    subjectId: "sub-c11-phy",
    bookId: "book-c11-phy",
    chapterNumber: 2,
    title: "Scalars and Vectors",
    description: "Addition of vectors by rectangular components, scalar (dot) product, and vector (cross) product.",
    learningObjectives: [
      "Resolve vectors into rectangular components in 2D and 3D coordinate systems",
      "Calculate the scalar (dot) product and cross product of vectors with properties",
      "Apply equilibrium conditions to solve vector problems",
    ],
    theoryNotes: `### 2.1 Rectangular Components of a Vector
Ax = A cos(θ)
Ay = A sin(θ)
Magnitude: A = √(Ax² + Ay²)
Direction: θ = tan⁻¹(Ay / Ax)

### 2.2 Vector Products
* **Dot Product:** A · B = |A||B| cos(θ) (Work = F · d)
* **Cross Product:** A × B = |A||B| sin(θ) n̂ (Torque = r × F)`,
    keyFormulas: `* A · B = AxBx + AyBy + AzBz
* A × B = |A||B| sin(θ) n̂
* Angle between vectors: cos(θ) = (A · B) / (|A||B|)`,
    resourceLink: "https://ebooks.stbb.edu.pk",
  },

  // Class 12 Physics Chapters
  {
    id: "chap-c12-phy-1",
    classId: "class-12",
    subjectId: "sub-c12-phy",
    bookId: "book-c12-phy",
    chapterNumber: 11,
    title: "Heat and Thermodynamics",
    description: "Kinetic theory of gases, First and Second laws of thermodynamics, Carnot engine, and entropy.",
    learningObjectives: [
      "State and explain the kinetic theory of gases and ideal gas equation",
      "Understand work done by gas, First law of thermodynamics (ΔQ = ΔU + ΔW)",
      "Explain Carnot cycle and calculate the maximum thermal efficiency of heat engine",
      "Understand the concept of entropy and degradation of energy",
    ],
    theoryNotes: `### 11.1 First Law of Thermodynamics
Heat added to a closed system is equal to the increase in internal energy plus work done by the system:
ΔQ = ΔU + ΔW

### 11.2 Carnot Engine & Efficiency
An ideal reversible heat engine operating between two temperatures T1 (Hot reservoir) and T2 (Cold reservoir).
Efficiency: η = 1 - (T2 / T1) = (T1 - T2) / T1.`,
    keyFormulas: `* Ideal Gas: PV = nRT = N·kB·T
* First Law: ΔQ = ΔU + P·ΔV
* Carnot Efficiency: η = 1 - (T₂ / T₁)
* Work in Isothermal process: W = nRT ln(V₂ / V₁)`,
    resourceLink: "https://ebooks.stbb.edu.pk",
  },
  {
    id: "chap-c12-phy-2",
    classId: "class-12",
    subjectId: "sub-c12-phy",
    bookId: "book-c12-phy",
    chapterNumber: 12,
    title: "Electrostatics",
    description: "Coulomb's law, electric field, electric potential, Gauss's law and its applications, and capacitors.",
    learningObjectives: [
      "State and apply Coulomb's Law for point charges in vacuum and dielectrics",
      "Calculate Electric Field Intensity and Electric Potential due to point charges",
      "Apply Gauss's Law to calculate field due to infinite sheet and charged sphere",
      "Determine equivalent capacitance for series and parallel capacitor circuits",
    ],
    theoryNotes: `### 12.1 Coulomb's Law
The electrostatic force between two point charges is directly proportional to product of charges and inversely proportional to square of distance:
F = (1 / 4πε₀) · (q1·q2 / r²).

### 12.2 Capacitance
C = Q / V. For parallel plate capacitor: C = (ε₀ · εr · A) / d.`,
    keyFormulas: `* Coulomb's Law: F = k·(q₁q₂ / r²) where k = 9 × 10⁹ N·m²/C²
* Electric Field: E = F / q = k·(q / r²)
* Potential: V = k·(q / r)
* Capacitance: C = Q / V
* Energy in Capacitor: U = (1/2)CV² = (1/2)(Q² / C)`,
    resourceLink: "https://ebooks.stbb.edu.pk",
  },
];
