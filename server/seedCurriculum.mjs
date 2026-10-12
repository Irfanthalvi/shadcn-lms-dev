/**
 * LMS Curriculum Seeder — Populates real Firestore curriculum for all 5 classes.
 *
 * Strategy:
 * 1. Reads existing subjects/chapters from Firestore — skips duplicates.
 * 2. Creates missing subjects for Class 8, 11, 12 (and any missing for 9/10).
 * 3. Creates/updates chapters using real curriculum content from sindhBoardCurriculum.js.
 * 4. Updates existing placeholder chapters (empty title or missing content) with real data.
 *
 * Real Firestore class IDs:
 *   Class 8:  uy2EIa6YriEmZPhg27cB
 *   Class 9:  f55bJav7h3IDTNKQ57CY
 *   Class 10: KPz2iRBO0iVI9B28iyGh
 *   Class 11: ivcvpmbzZyn9AY3yPcvH
 *   Class 12: bbrXM2GDRHftSdg61BFC
 *
 * NOTE: videoUrl is NOT fabricated. Each chapter gets theoryNotes, keyFormulas,
 *       description, and textbookContent (built from theoryNotes).
 *       Admins can add real YouTube video links afterward via Edit Content.
 */

import { adminDb } from './firebaseAdmin.js';
import { FieldValue } from 'firebase-admin/firestore';

// ─── Real Firestore Class IDs ────────────────────────────────────────────────
const CLASS_IDS = {
  'class-8':  'uy2EIa6YriEmZPhg27cB',
  'class-9':  'f55bJav7h3IDTNKQ57CY',
  'class-10': 'KPz2iRBO0iVI9B28iyGh',
  'class-11': 'ivcvpmbzZyn9AY3yPcvH',
  'class-12': 'bbrXM2GDRHftSdg61BFC',
};

// ─── Subjects to ensure exist ────────────────────────────────────────────────
// (maps sindhBoard subjectId -> { name, code, classId (old), icon, color, description })
const SUBJECTS_CATALOG = [
  // Class 8
  { id: 'sub-c8-math',   classId: 'class-8',  name: 'Mathematics',       code: 'MATH-8',  icon: 'Calculator', color: 'blue',   description: 'Sets, Number Systems, Polynomials, and Geometry' },
  { id: 'sub-c8-sci',    classId: 'class-8',  name: 'General Science',   code: 'SCI-8',   icon: 'Atom',       color: 'emerald',description: 'Human Organ Systems, Heredity, Chemical Reactions, and Force' },
  { id: 'sub-c8-eng',    classId: 'class-8',  name: 'English',           code: 'ENG-8',   icon: 'BookOpen',   color: 'indigo', description: 'Comprehension, Grammar, Essay Writing and Vocabulary' },
  { id: 'sub-c8-comp',   classId: 'class-8',  name: 'Computer Education',code: 'COMP-8',  icon: 'Laptop',     color: 'cyan',   description: 'ICT Fundamentals, Networking, Excel and Problem Solving' },
  { id: 'sub-c8-urdu',   classId: 'class-8',  name: 'Urdu',              code: 'URDU-8',  icon: 'Feather',    color: 'amber',  description: 'Prose, Poetry, Qawaid and Insha' },
  { id: 'sub-c8-isl',    classId: 'class-8',  name: 'Islamiat',          code: 'ISL-8',   icon: 'Shield',     color: 'teal',   description: 'Quranic Verses, Ahadith, and Islamic Ethics' },
  // Class 9
  { id: 'sub-c9-phy',    classId: 'class-9',  name: 'Physics',           code: 'PHY-9',   icon: 'Zap',        color: 'blue',   description: 'Mechanics, Measurement, Kinematics, Dynamics and Matter' },
  { id: 'sub-c9-chem',   classId: 'class-9',  name: 'Chemistry',         code: 'CHEM-9',  icon: 'FlaskConical',color:'emerald', description: 'Atomic Structure, Periodic Table, Bonding and States of Matter' },
  { id: 'sub-c9-math',   classId: 'class-9',  name: 'Mathematics',       code: 'MATH-9',  icon: 'Calculator', color: 'amber',  description: 'Real Numbers, Logarithms, Algebra, Factorization and Equations' },
  { id: 'sub-c9-bio',    classId: 'class-9',  name: 'Biology',           code: 'BIO-9',   icon: 'Dna',        color: 'teal',   description: 'Cell Biology, Biodiversity, Bioenergetics, and Physiology' },
  { id: 'sub-c9-eng',    classId: 'class-9',  name: 'English Compulsory',code: 'ENG-9',   icon: 'BookOpen',   color: 'indigo', description: 'Secondary Stage English Book One — Prose, Poetry and Grammar' },
  { id: 'sub-c9-pst',    classId: 'class-9',  name: 'Pakistan Studies',  code: 'PST-9',   icon: 'Flag',       color: 'green',  description: 'Ideology of Pakistan, Movement, and Early History' },
  // Class 10
  { id: 'sub-c10-phy',   classId: 'class-10', name: 'Physics',           code: 'PHY-10',  icon: 'Zap',        color: 'blue',   description: 'Wave Motion, Sound, Optics, Electrostatics, and Nuclear Physics' },
  { id: 'sub-c10-chem',  classId: 'class-10', name: 'Chemistry',         code: 'CHEM-10', icon: 'FlaskConical',color:'emerald', description: 'Acids, Bases, Organic Chemistry, Hydrocarbons and Biochemistry' },
  { id: 'sub-c10-math',  classId: 'class-10', name: 'Mathematics',       code: 'MATH-10', icon: 'Calculator', color: 'amber',  description: 'Sets, Variations, Matrices, Statistics, Trigonometry and Geometry' },
  { id: 'sub-c10-bio',   classId: 'class-10', name: 'Biology',           code: 'BIO-10',  icon: 'Dna',        color: 'teal',   description: 'Gaseous Exchange, Homeostasis, Coordination, Reproduction, and Genetics' },
  { id: 'sub-c10-eng',   classId: 'class-10', name: 'English Compulsory',code: 'ENG-10',  icon: 'BookOpen',   color: 'indigo', description: 'Secondary Stage English Book Two — Prose, Poems and Composition' },
  { id: 'sub-c10-urdu',  classId: 'class-10', name: 'Urdu Salees',       code: 'URDU-10', icon: 'Feather',    color: 'rose',   description: 'Sindh Textbook Board Matric Urdu Course' },
  { id: 'sub-c10-isl',   classId: 'class-10', name: 'Islamiat Compulsory',code:'ISL-10',  icon: 'Shield',     color: 'purple', description: 'Surah Al-Ahzab, Surah Mumtahina, Ahadith, and Islamic History' },
  // Class 11
  { id: 'sub-c11-phy',   classId: 'class-11', name: 'Physics',           code: 'PHY-11',  icon: 'Zap',        color: 'blue',   description: 'Vectors, Motion, Force, Work, Circular Motion, and Physical Optics' },
  { id: 'sub-c11-chem',  classId: 'class-11', name: 'Chemistry',         code: 'CHEM-11', icon: 'FlaskConical',color:'emerald', description: 'Stoichiometry, States of Matter, Atomic Structure, and Kinetics' },
  { id: 'sub-c11-math',  classId: 'class-11', name: 'Mathematics',       code: 'MATH-11', icon: 'Calculator', color: 'amber',  description: 'Complex Numbers, Matrices, Vectors, Sequences and Trigonometry' },
  { id: 'sub-c11-bio',   classId: 'class-11', name: 'Biology',           code: 'BIO-11',  icon: 'Dna',        color: 'teal',   description: 'Biological Molecules, Enzymes, Cell, Animalia and Plantae' },
  { id: 'sub-c11-comp',  classId: 'class-11', name: 'Computer Science',  code: 'CS-11',   icon: 'Laptop',     color: 'cyan',   description: 'Information Technology, Architecture, Operating Systems and Networks' },
  { id: 'sub-c11-eng',   classId: 'class-11', name: 'English',           code: 'ENG-11',  icon: 'BookOpen',   color: 'indigo', description: 'A Selection of English Prose and Verse for Class XI' },
  { id: 'sub-c11-urdu',  classId: 'class-11', name: 'Urdu Lazmi',        code: 'URDU-11', icon: 'Feather',    color: 'rose',   description: 'Sindh Textbook Board Intermediate Urdu Part I' },
  // Class 12
  { id: 'sub-c12-phy',   classId: 'class-12', name: 'Physics',           code: 'PHY-12',  icon: 'Zap',        color: 'blue',   description: 'Heat, Thermodynamics, Electrostatics, Electromagnetism, Modern Physics' },
  { id: 'sub-c12-chem',  classId: 'class-12', name: 'Chemistry',         code: 'CHEM-12', icon: 'FlaskConical',color:'emerald', description: 'Inorganic Chemistry, Transition Elements, Organic Compounds and Biomolecules' },
  { id: 'sub-c12-math',  classId: 'class-12', name: 'Mathematics',       code: 'MATH-12', icon: 'Calculator', color: 'amber',  description: 'Calculus, Differentiation, Integration, Analytic Geometry and Conics' },
  { id: 'sub-c12-bio',   classId: 'class-12', name: 'Biology',           code: 'BIO-12',  icon: 'Dna',        color: 'teal',   description: 'Homeostasis, Support, Reproduction, Evolution, and Biotechnology' },
  { id: 'sub-c12-comp',  classId: 'class-12', name: 'Computer Science',  code: 'CS-12',   icon: 'Laptop',     color: 'cyan',   description: 'Advanced C Programming, OOP, Database Concepts, and SQL' },
  { id: 'sub-c12-eng',   classId: 'class-12', name: 'English Compulsory',code: 'ENG-12',  icon: 'BookOpen',   color: 'indigo', description: 'A Selection of English Prose and Verse for Class XII' },
  { id: 'sub-c12-pst',   classId: 'class-12', name: 'Pakistan Studies',  code: 'PST-12',  icon: 'Flag',       color: 'green',  description: 'Constitutional Development, Foreign Policy, and Economy of Pakistan' },
  { id: 'sub-c12-urdu',  classId: 'class-12', name: 'Urdu Lazmi',        code: 'URDU-12', icon: 'Feather',    color: 'rose',   description: 'Sindh Textbook Board Intermediate Urdu Part II' },
];

// ─── Chapter curriculum with full content ───────────────────────────────────
// NOTE: videoUrl is intentionally left empty — no YouTube IDs are fabricated.
// Admins add real videos via Edit Content. All academic text is from STB curriculum.
const CHAPTERS_CATALOG = [
  // ── CLASS 9: PHYSICS ──────────────────────────────────────────────────────
  {
    subjectKey: 'sub-c9-phy', classKey: 'class-9', chapterNumber: 1,
    title: 'Physical Quantities and Measurement',
    description: 'Introduction to physical quantities, SI base & derived units, scientific notation, and precision instruments.',
    learningObjectives: [
      'Distinguish between base and derived physical quantities and their SI units',
      'Understand the use of prefixes and standard scientific notation in measurements',
      'Demonstrate the working and least count of Vernier Calipers and Screw Gauge',
      'Apply rules for identifying significant figures in calculation results',
    ],
    textbookContent: `Chapter 1: Physical Quantities and Measurement

In physics we measure physical quantities. Every measurement consists of a number and a unit.

BASE QUANTITIES AND SI UNITS
There are seven base quantities in the SI system:
1. Length — metre (m)
2. Mass — kilogram (kg)
3. Time — second (s)
4. Electric Current — ampere (A)
5. Temperature — kelvin (K)
6. Amount of Substance — mole (mol)
7. Luminous Intensity — candela (cd)

DERIVED QUANTITIES
Derived quantities are expressed in terms of base quantities. Examples:
- Area = length × length (m²)
- Volume = length³ (m³)
- Speed = length / time (m/s)
- Force = mass × acceleration (N = kg·m/s²)

MEASURING INSTRUMENTS
Vernier Calipers: Used to measure length, internal/external diameters.
Least Count = 1 MSD − 1 VSD = 0.1 mm = 0.01 cm

Screw Gauge (Micrometer): Used to measure very small lengths like wire diameter.
Least Count = Pitch / Total circular scale divisions = 0.5/50 = 0.01 mm`,
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
    resourceLink: 'https://ebooks.stbb.edu.pk',
    videoUrl: '',
  },
  {
    subjectKey: 'sub-c9-phy', classKey: 'class-9', chapterNumber: 2,
    title: 'Kinematics',
    description: 'Study of motion of bodies without considering the causes of motion, scalar/vector quantities, and equations of motion.',
    learningObjectives: [
      'Differentiate between Rest and Motion, and classify types of motion (Translatory, Rotatory, Oscillatory)',
      'Distinguish between distance and displacement, speed and velocity, uniform and variable acceleration',
      'Derive the three fundamental equations of motion graphically and algebraically',
      'Solve numerical problems involving freely falling bodies under gravity',
    ],
    textbookContent: `Chapter 2: Kinematics

TYPES OF MOTION
Translatory Motion: Every particle of the body moves along parallel lines.
  - Linear (straight line): e.g., a car moving on a straight road
  - Circular: e.g., a car moving on a circular track
  - Random: e.g., molecules in a gas

Rotatory Motion: Spinning motion of a body about an axis passing through it. E.g., a spinning top, rotation of the Earth.

Oscillatory Motion: To-and-fro motion of a body about its mean position. E.g., a pendulum, a vibrating string.

SCALARS AND VECTORS
Scalars: Described completely by magnitude and unit (Mass, Time, Speed, Distance).
Vectors: Described by magnitude, unit, AND direction (Velocity, Displacement, Force, Acceleration).

REST AND MOTION
A body is at rest if it does not change its position with respect to its surroundings.
A body is in motion if it changes its position with time.

EQUATIONS OF MOTION
For uniformly accelerated motion:
1st: vf = vi + at
2nd: S = vi·t + ½a·t²
3rd: 2aS = vf² − vi²

Under gravity (free fall): replace a with g = 9.8 m/s² (downward)`,
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
    resourceLink: 'https://ebooks.stbb.edu.pk',
    videoUrl: '',
  },
  {
    subjectKey: 'sub-c9-phy', classKey: 'class-9', chapterNumber: 3,
    title: 'Dynamics',
    description: "Newton's laws of motion, momentum, friction, and circular motion with mathematical applications.",
    learningObjectives: [
      "Understand the concept of inertia and state Newton's three laws of motion",
      'Define momentum and state the law of conservation of linear momentum',
      'Explain the causes and effects of friction and methods of reducing friction',
      'Understand centripetal force and centripetal acceleration in circular paths',
    ],
    textbookContent: `Chapter 3: Dynamics

NEWTON'S LAWS OF MOTION
First Law (Law of Inertia): A body continues its state of rest or uniform motion in a straight line unless acted upon by an external net force.

Second Law: When a net force acts on a body, it produces acceleration in the direction of the force.
F = ma (Force = mass × acceleration)

Third Law: To every action, there is an equal and opposite reaction.

MOMENTUM
Momentum is the quantity of motion contained in a body.
p = m × v (SI unit: kg·m/s or N·s)

Law of Conservation of Momentum: The total momentum of an isolated system remains constant.

FRICTION
Friction is the force that opposes the relative motion between two surfaces in contact.
Static friction (fs) = μs × N
Kinetic friction (fk) = μk × N

CENTRIPETAL FORCE
Force required to keep a body moving in a circular path, directed toward the center.
Fc = mv²/r`,
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
    resourceLink: 'https://ebooks.stbb.edu.pk',
    videoUrl: '',
  },
  {
    subjectKey: 'sub-c9-phy', classKey: 'class-9', chapterNumber: 4,
    title: 'Turning Effect of Forces',
    description: 'Torque, center of mass, center of gravity, conditions of equilibrium, and states of equilibrium.',
    learningObjectives: [
      'Define torque (moment of force) and understand its mathematical representation',
      'Locate the center of gravity of regular and irregular shaped objects',
      'State the two conditions of equilibrium and classify the three states of equilibrium',
    ],
    textbookContent: `Chapter 4: Turning Effect of Forces

TORQUE (MOMENT OF FORCE)
The turning effect produced in a body about a pivot or axis of rotation is called Torque or Moment of Force.
τ = F × d (where d = perpendicular distance from the pivot to the line of action of force)
SI Unit: N·m

CENTER OF GRAVITY
The single point where the entire weight of a body appears to act is called the center of gravity (C.G.).
For regular objects, C.G. is at the geometric center.
For irregular objects, C.G. is found by the plumb line method.

CONDITIONS OF EQUILIBRIUM
First Condition: Vector sum of all forces acting on the body must be zero: ΣF = 0 (ΣFx = 0, ΣFy = 0)
Second Condition: Vector sum of all torques must be zero: Στ = 0

STATES OF EQUILIBRIUM
1. Stable Equilibrium: C.G. rises when displaced; body returns to original position.
2. Unstable Equilibrium: C.G. falls when displaced; body does not return.
3. Neutral Equilibrium: C.G. stays at same height; body stays in new position.`,
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
    resourceLink: 'https://ebooks.stbb.edu.pk',
    videoUrl: '',
  },

  // ── CLASS 9: CHEMISTRY ───────────────────────────────────────────────────
  {
    subjectKey: 'sub-c9-chem', classKey: 'class-9', chapterNumber: 1,
    title: 'Fundamentals of Chemistry',
    description: 'Branches of chemistry, atomic mass, molecular mass, formula mass, chemical species, and Avogadro\'s number.',
    learningObjectives: [
      'Define chemistry and identify its major branches (Organic, Inorganic, Physical, Analytical)',
      'Calculate molecular mass and formula mass of common chemical compounds',
      'Understand the mole concept and solve calculations involving Avogadro\'s number',
    ],
    textbookContent: `Chapter 1: Fundamentals of Chemistry

DEFINITION
Chemistry is the branch of science that deals with the composition, structure, properties, and reactions of matter.

BRANCHES OF CHEMISTRY
1. Organic Chemistry: Study of compounds of carbon (except CO, CO₂, carbonates, bicarbonates).
2. Inorganic Chemistry: Study of all elements and their compounds excluding carbon compounds.
3. Physical Chemistry: Study of physical properties of substances and energy changes during reactions.
4. Analytical Chemistry: Study of qualitative and quantitative analysis of substances.
5. Biochemistry: Study of chemical reactions in living organisms.

MOLE CONCEPT
A mole is the atomic mass, molecular mass, or formula mass of a substance expressed in grams.
One mole of any substance contains 6.022 × 10²³ particles (Avogadro's Number, Nₐ).

TYPES OF CHEMICAL FORMULAS
1. Empirical Formula: Shows the simplest whole-number ratio of atoms. E.g., CH₂O for glucose.
2. Molecular Formula: Shows actual number of atoms. E.g., C₆H₁₂O₆ for glucose.
3. Structural Formula: Shows arrangement of atoms and bonds.`,
    theoryNotes: `### 1.1 Mole and Avogadro's Number
A mole is the atomic mass, molecular mass, or formula mass of a substance expressed in grams.
One mole contains 6.022 × 10²³ particles (Avogadro's constant, NA).

### 1.2 Types of Chemical Formulas
* **Empirical Formula:** The simplest whole-number ratio of atoms in a compound.
* **Molecular Formula:** The actual number of atoms of each element in a molecule. Molecular Formula = n × Empirical Formula.`,
    keyFormulas: `* Number of Moles = Given Mass (g) / Molar Mass (g/mol)
* Number of Particles = Moles × NA (6.022 × 10²³)
* Molar Mass = Σ (Atomic Mass × Number of Atoms)`,
    resourceLink: 'https://ebooks.stbb.edu.pk',
    videoUrl: '',
  },
  {
    subjectKey: 'sub-c9-chem', classKey: 'class-9', chapterNumber: 2,
    title: 'Atomic Structure',
    description: "Subatomic particles, Rutherford's and Bohr's atomic models, electronic configuration, and isotopes.",
    learningObjectives: [
      'Describe the structure of atom, subatomic particles (protons, neutrons, electrons)',
      "Compare Rutherford's atomic model with Bohr's atomic theory",
      'Write the electronic configuration of elements up to atomic number 18',
    ],
    textbookContent: `Chapter 2: Atomic Structure

SUBATOMIC PARTICLES
1. Proton: Positively charged particle in the nucleus. Mass = 1 amu.
2. Neutron: Neutral particle in the nucleus. Mass = 1 amu.
3. Electron: Negatively charged particle outside the nucleus. Mass ≈ 1/1836 amu.

RUTHERFORD'S ATOMIC MODEL
- Atom has a small, dense, positively charged nucleus.
- Electrons revolve around the nucleus at large distances.
- Limitation: Could not explain stability of atom or line spectra.

BOHR'S ATOMIC THEORY
1. Electrons revolve in fixed circular orbits called energy levels or shells (K, L, M, N).
2. Each orbit has a fixed energy; electrons do not radiate energy while in orbit.
3. Energy is absorbed when an electron jumps to a higher orbit, and radiated when it falls to a lower orbit.

ELECTRONIC CONFIGURATION
Shell capacity formula: 2n²
- K Shell (n=1): max 2 electrons
- L Shell (n=2): max 8 electrons
- M Shell (n=3): max 18 electrons

ISOTOPES
Atoms of the same element with the same atomic number but different mass numbers.
Example: Carbon-12 (₆¹²C) and Carbon-14 (₆¹⁴C)`,
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
    resourceLink: 'https://ebooks.stbb.edu.pk',
    videoUrl: '',
  },

  // ── CLASS 10: PHYSICS ────────────────────────────────────────────────────
  {
    subjectKey: 'sub-c10-phy', classKey: 'class-10', chapterNumber: 10,
    title: 'Simple Harmonic Motion and Waves',
    description: 'Simple harmonic motion of mass-spring system, simple pendulum, wave motion, and wave properties.',
    learningObjectives: [
      'State conditions for a body executing Simple Harmonic Motion (SHM)',
      'Analyze the motion of simple pendulum and mass attached to a spring',
      'Understand wave properties: reflection, refraction, and diffraction',
    ],
    textbookContent: `Chapter 10: Simple Harmonic Motion and Waves

SIMPLE HARMONIC MOTION (SHM)
SHM occurs when:
1. The acceleration of the oscillating body is directly proportional to its displacement from the mean position.
2. The acceleration is always directed toward the mean position: a ∝ −x

SIMPLE PENDULUM
A simple pendulum consists of a bob suspended by a light, inextensible string.
Time period T = 2π√(L/g) — depends only on length and g, not on mass or amplitude (for small angles).

MASS-SPRING SYSTEM
A mass attached to a spring oscillates when displaced.
Time period T = 2π√(m/k)

WAVE MOTION
A wave is a disturbance that transfers energy without transferring matter.
Transverse waves: vibration perpendicular to wave direction (light, water waves).
Longitudinal waves: vibration parallel to wave direction (sound).

Wave properties:
- Wavelength (λ): distance between two consecutive crests or troughs.
- Frequency (f): number of complete vibrations per second (Hz).
- Wave speed (v): v = f·λ`,
    theoryNotes: `### 10.1 Simple Harmonic Motion (SHM)
SHM occurs when the acceleration of an oscillating body is directly proportional to its displacement from the mean position and is always directed towards the mean position: a ∝ -x.

### 10.2 Wave Equation
Relation between speed, frequency, and wavelength: v = f·λ.`,
    keyFormulas: `* Time period of Simple Pendulum: T = 2π√(L / g)
* Time period of Mass-Spring: T = 2π√(m / k)
* Wave equation: v = f · λ
* Frequency: f = 1 / T`,
    resourceLink: 'https://ebooks.stbb.edu.pk',
    videoUrl: '',
  },
  {
    subjectKey: 'sub-c10-phy', classKey: 'class-10', chapterNumber: 11,
    title: 'Sound',
    description: 'Sound waves, speed of sound, characteristics of sound (loudness, pitch, quality), and ultrasound applications.',
    learningObjectives: [
      'Understand the longitudinal nature of sound waves and medium requirement',
      'Explain loudness, pitch, quality, and intensity of sound',
      'Describe reflection of sound (echo) and uses of ultrasound in medicine and industry',
    ],
    textbookContent: `Chapter 11: Sound

NATURE OF SOUND
Sound is a longitudinal mechanical wave that requires a material medium (solid, liquid, or gas) for propagation. It cannot travel through vacuum.

CHARACTERISTICS OF SOUND
1. Loudness: The degree of sensation produced in the ear. Depends on amplitude, area of vibrating body, and distance. Measured in decibels (dB).

2. Pitch: The characteristic of sound by which a shrill (high-pitched) sound is distinguished from a grave (low-pitched) sound. Depends on frequency.

3. Quality (Timbre): The characteristic that distinguishes two sounds of the same loudness and pitch. Depends on the shape of sound wave (waveform).

ECHO
Reflection of sound from a hard surface is called echo. Minimum distance for echo: 17 m (at room temperature).

ULTRASOUND
Sound waves of frequency above 20,000 Hz (20 kHz). Used in:
- Medical imaging (sonography/ultrasonography)
- SONAR (Sound Navigation and Ranging)
- Industrial cleaning and testing`,
    theoryNotes: `### 11.1 Characteristics of Sound
* **Loudness:** Depends on the amplitude of vibrating body, area, and distance.
* **Pitch:** Characteristic by which a shrill sound can be distinguished from a grave one (depends on frequency).
* **Quality (Timbre):** Distinguishes two sounds of same loudness and pitch (depends on waveform).`,
    keyFormulas: `* Speed of sound: v = 2d / t (for Echo)
* Intensity Level: β = 10 log(I / I₀) dB`,
    resourceLink: 'https://ebooks.stbb.edu.pk',
    videoUrl: '',
  },

  // ── CLASS 11: PHYSICS ────────────────────────────────────────────────────
  {
    subjectKey: 'sub-c11-phy', classKey: 'class-11', chapterNumber: 1,
    title: 'Scope of Physics and Measurements',
    description: 'Fundamental and derived SI units, errors, uncertainties, significant figures, and dimensional analysis.',
    learningObjectives: [
      'Understand scientific notations, fractional uncertainties, and percentage uncertainties',
      'Perform dimensional analysis to verify the homogeneity of physical equations',
      'Derive relations between physical quantities using dimensions',
    ],
    textbookContent: `Chapter 1: Scope of Physics and Measurements

SCOPE OF PHYSICS
Physics is the study of matter, energy, and their interactions. It forms the foundation of all natural sciences.
Major branches: Mechanics, Heat, Sound, Light/Optics, Electricity & Magnetism, Modern Physics.

PHYSICAL QUANTITIES AND UNITS
Base SI quantities and units:
1. Length — metre (m)
2. Mass — kilogram (kg)
3. Time — second (s)
4. Electric Current — ampere (A)
5. Temperature — kelvin (K)
6. Amount of Substance — mole (mol)
7. Luminous Intensity — candela (cd)

ERRORS AND UNCERTAINTIES
Systematic Errors: Consistently in one direction; due to faulty apparatus.
Random Errors: Unpredictable variations; minimized by repeated measurements.

Absolute Uncertainty: ΔA (smallest readable value of instrument).
Fractional Uncertainty = ΔA / A
Percentage Uncertainty = (ΔA / A) × 100%

DIMENSIONAL ANALYSIS
Dimensions represent the physical nature of a quantity.
Uses:
1. Verifying the correctness of a physical equation (principle of homogeneity).
2. Deriving new relations between physical quantities.`,
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
    resourceLink: 'https://ebooks.stbb.edu.pk',
    videoUrl: '',
  },
  {
    subjectKey: 'sub-c11-phy', classKey: 'class-11', chapterNumber: 2,
    title: 'Scalars and Vectors',
    description: 'Addition of vectors by rectangular components, scalar (dot) product, and vector (cross) product.',
    learningObjectives: [
      'Resolve vectors into rectangular components in 2D and 3D coordinate systems',
      'Calculate the scalar (dot) product and cross product of vectors with properties',
      'Apply equilibrium conditions to solve vector problems',
    ],
    textbookContent: `Chapter 2: Scalars and Vectors

SCALARS AND VECTORS
Scalar quantities: Described by magnitude alone. E.g., mass, time, speed, energy, temperature.
Vector quantities: Described by both magnitude and direction. E.g., displacement, velocity, force, acceleration.

REPRESENTATION OF VECTORS
Vectors are represented by arrows. The length represents magnitude; the arrowhead shows direction.

RECTANGULAR COMPONENTS OF A VECTOR
Any vector A making angle θ with x-axis can be resolved into:
- Horizontal component: Ax = A cos(θ)
- Vertical component: Ay = A sin(θ)
- Magnitude: A = √(Ax² + Ay²)
- Direction: θ = tan⁻¹(Ay / Ax)

ADDITION OF VECTORS BY RECTANGULAR COMPONENTS
Rx = ΣAx (sum of all x-components)
Ry = ΣAy (sum of all y-components)
Resultant R = √(Rx² + Ry²)
Direction θ = tan⁻¹(Ry / Rx)

SCALAR (DOT) PRODUCT
A · B = |A||B| cos(θ)
Applications: Work = F · d

VECTOR (CROSS) PRODUCT
|A × B| = |A||B| sin(θ)
Direction: perpendicular to both A and B (right-hand rule).
Applications: Torque = r × F`,
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
    resourceLink: 'https://ebooks.stbb.edu.pk',
    videoUrl: '',
  },

  // ── CLASS 12: PHYSICS ────────────────────────────────────────────────────
  {
    subjectKey: 'sub-c12-phy', classKey: 'class-12', chapterNumber: 11,
    title: 'Heat and Thermodynamics',
    description: 'Kinetic theory of gases, First and Second laws of thermodynamics, Carnot engine, and entropy.',
    learningObjectives: [
      'State and explain the kinetic theory of gases and ideal gas equation',
      'Understand work done by gas, First law of thermodynamics (ΔQ = ΔU + ΔW)',
      'Explain Carnot cycle and calculate the maximum thermal efficiency of heat engine',
      'Understand the concept of entropy and degradation of energy',
    ],
    textbookContent: `Chapter 11: Heat and Thermodynamics

KINETIC THEORY OF GASES
Assumptions of kinetic theory:
1. Gas consists of a large number of identical molecules.
2. Molecules are in constant random motion.
3. Collisions between molecules are perfectly elastic.
4. Intermolecular forces are negligible (except during collision).

IDEAL GAS EQUATION
PV = nRT
where P = pressure (Pa), V = volume (m³), n = moles, R = 8.314 J/(mol·K), T = temperature (K)
Also: PV = NkBT where N = total molecules, kB = Boltzmann constant = 1.38 × 10⁻²³ J/K

FIRST LAW OF THERMODYNAMICS
The increase in internal energy of a system equals the heat added minus the work done by the system.
ΔQ = ΔU + ΔW = ΔU + P·ΔV

THERMODYNAMIC PROCESSES
- Isothermal (constant T): ΔU = 0, so ΔQ = ΔW
- Adiabatic (no heat exchange): ΔQ = 0, so ΔU = −ΔW
- Isobaric (constant P): ΔU = ΔQ − PΔV
- Isochoric (constant V): ΔW = 0, so ΔU = ΔQ

CARNOT ENGINE
An ideal reversible heat engine operating between two temperatures T₁ (hot) and T₂ (cold).
Efficiency: η = 1 − (T₂/T₁) = (T₁ − T₂)/T₁`,
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
    resourceLink: 'https://ebooks.stbb.edu.pk',
    videoUrl: '',
  },
  {
    subjectKey: 'sub-c12-phy', classKey: 'class-12', chapterNumber: 12,
    title: 'Electrostatics',
    description: "Coulomb's law, electric field, electric potential, Gauss's law and its applications, and capacitors.",
    learningObjectives: [
      "State and apply Coulomb's Law for point charges in vacuum and dielectrics",
      'Calculate Electric Field Intensity and Electric Potential due to point charges',
      "Apply Gauss's Law to calculate field due to infinite sheet and charged sphere",
      'Determine equivalent capacitance for series and parallel capacitor circuits',
    ],
    textbookContent: `Chapter 12: Electrostatics

ELECTRIC CHARGE
Two types of electric charges: positive (+) and negative (−).
Like charges repel; unlike charges attract.
SI unit of charge: Coulomb (C).

COULOMB'S LAW
The electrostatic force between two point charges q₁ and q₂ separated by distance r:
F = k·(q₁q₂ / r²) where k = 1/(4πε₀) = 9 × 10⁹ N·m²/C²

ELECTRIC FIELD
Electric field E at a point is the force experienced by a unit positive test charge at that point.
E = F / q = k·(q / r²)   (SI unit: N/C or V/m)
Electric field lines originate from positive charges and terminate at negative charges.

ELECTRIC POTENTIAL
Electric potential V at a point is the work done per unit positive charge to bring a charge from infinity to that point.
V = k·(q / r)   (SI unit: Volt = J/C)
Relation: E = −dV/dr

CAPACITOR
A capacitor stores electric charge and energy.
Capacitance C = Q / V   (SI unit: Farad)
For parallel plate capacitor: C = ε₀·A / d

Capacitors in series: 1/C_eq = 1/C₁ + 1/C₂ + ...
Capacitors in parallel: C_eq = C₁ + C₂ + ...
Energy stored: U = ½CV² = ½(Q²/C)`,
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
    resourceLink: 'https://ebooks.stbb.edu.pk',
    videoUrl: '',
  },

  // ── CLASS 8: GENERAL SCIENCE ─────────────────────────────────────────────
  {
    subjectKey: 'sub-c8-sci', classKey: 'class-8', chapterNumber: 1,
    title: 'Human Organ Systems',
    description: 'Structure and function of major human organ systems including digestive, respiratory, circulatory, and excretory systems.',
    learningObjectives: [
      'Identify the organs and functions of the human digestive, respiratory, and circulatory systems',
      'Explain the process of digestion from mouth to large intestine',
      'Describe how oxygen is transported to body cells via blood',
    ],
    textbookContent: `Chapter 1: Human Organ Systems

DIGESTIVE SYSTEM
The digestive system breaks down food into nutrients that the body can absorb.
Main organs: Mouth → Oesophagus → Stomach → Small Intestine → Large Intestine → Rectum → Anus
Digestive glands: Salivary glands (saliva), Liver (bile), Pancreas (enzymes)

RESPIRATORY SYSTEM
The respiratory system brings oxygen into the body and removes carbon dioxide.
Main organs: Nose → Trachea → Bronchi → Lungs → Alveoli
Alveoli: Tiny air sacs where gas exchange occurs — oxygen enters blood, CO₂ leaves blood.

CIRCULATORY SYSTEM
The circulatory system transports blood, nutrients, oxygen, and waste products.
Main organs: Heart, Blood vessels (arteries, veins, capillaries), Blood
Double circulation: Pulmonary (heart ↔ lungs) and Systemic (heart ↔ body).

EXCRETORY SYSTEM
The excretory system removes metabolic waste products from the body.
Main organs: Kidneys (urine), Lungs (CO₂), Skin (sweat), Liver (bile).
Kidney functions: Filtration of blood, reabsorption of useful substances, excretion of urea and salts.`,
    theoryNotes: `### 1.1 Digestive System
Food is digested mechanically (chewing) and chemically (enzymes) to release nutrients.
* Saliva: Contains amylase to digest starch.
* Stomach: HCl and pepsin digest proteins.
* Small Intestine: Main site of digestion and absorption (villi increase surface area).

### 1.2 Respiratory System
Gas exchange occurs in the alveoli of the lungs.
* Inhalation: Diaphragm contracts, ribcage rises, lungs expand.
* Exhalation: Diaphragm relaxes, ribcage falls, air is expelled.`,
    keyFormulas: `* Breathing rate at rest: ~16-20 breaths/minute
* Tidal volume: ~500 mL per breath
* Vital capacity: ~3.5-4.5 L (maximum air inhaled/exhaled)`,
    resourceLink: 'https://ebooks.stbb.edu.pk',
    videoUrl: '',
  },
  {
    subjectKey: 'sub-c8-math', classKey: 'class-8', chapterNumber: 1,
    title: 'Sets',
    description: 'Set notation, types of sets, set operations (union, intersection, complement, difference), and Venn diagrams.',
    learningObjectives: [
      'Define sets and represent them using set-builder and roster notation',
      'Identify types of sets: empty, finite, infinite, singleton, equal, and equivalent sets',
      'Perform set operations: union, intersection, difference, and complement',
      'Use Venn diagrams to represent and solve set problems',
    ],
    textbookContent: `Chapter 1: Sets

DEFINITION
A set is a well-defined collection of distinct objects, called elements or members.
A set is well-defined if we can clearly determine whether any object belongs to it or not.

SET NOTATION
Roster / Tabular method: A = {1, 2, 3, 4, 5}
Set-builder method: A = {x | x is a natural number less than 6}

TYPES OF SETS
- Empty Set (Null Set): Contains no elements. Denoted by {} or Ø.
- Singleton Set: Contains exactly one element. E.g., {5}
- Finite Set: Has a countable number of elements.
- Infinite Set: Has unlimited elements. E.g., set of all natural numbers.
- Universal Set (U): The set of all objects under consideration.
- Subset: A ⊆ B if every element of A is also in B.

SET OPERATIONS
Union (A ∪ B): All elements in A or B (or both).
Intersection (A ∩ B): Elements common to both A and B.
Difference (A − B): Elements in A but not in B.
Complement (A'): Elements in Universal Set but not in A.

VENN DIAGRAMS
Circles inside a rectangle (Universal Set) represent sets. Overlapping regions show common elements.`,
    theoryNotes: `### 1.1 Set Builder Notation
A = {x | condition} — reads "the set of all x such that condition holds."

### 1.2 Key Set Laws
* Commutative: A ∪ B = B ∪ A; A ∩ B = B ∩ A
* Associative: (A ∪ B) ∪ C = A ∪ (B ∪ C)
* Distributive: A ∩ (B ∪ C) = (A ∩ B) ∪ (A ∩ C)
* De Morgan's: (A ∪ B)' = A' ∩ B'; (A ∩ B)' = A' ∪ B'`,
    keyFormulas: `* n(A ∪ B) = n(A) + n(B) − n(A ∩ B)
* n(A') = n(U) − n(A)
* If A ⊆ B, then A ∩ B = A and A ∪ B = B`,
    resourceLink: 'https://ebooks.stbb.edu.pk',
    videoUrl: '',
  },
];

// ─── MAIN SEEDER ─────────────────────────────────────────────────────────────
async function seedCurriculum() {
  console.log('=== LMS CURRICULUM SEEDER STARTED ===\n');

  // 1. Load existing subjects from Firestore
  const existingSubjectsSnap = await adminDb.collection('subjects').get();
  // Map: "classDocId_subjectNameLower" -> firestoreDocId
  const existingSubjectMap = new Map();
  existingSubjectsSnap.forEach(doc => {
    const d = doc.data();
    const key = `${d.classId}_${(d.name || '').toLowerCase().trim()}`;
    existingSubjectMap.set(key, doc.id);
    existingSubjectMap.set(`${doc.id}`, doc.id); // by doc ID
  });
  console.log(`Loaded ${existingSubjectsSnap.size} existing subjects from Firestore.`);

  // 2. Map old sindhBoard subjectKey -> real Firestore subject docId
  //    We need to create missing subjects and return the mapping.
  const subjectKeyToFirestoreId = new Map(); // 'sub-c9-phy' -> 'firestoreDocId'

  let subjectsCreated = 0;
  for (const sub of SUBJECTS_CATALOG) {
    const realClassId = CLASS_IDS[sub.classId];
    if (!realClassId) {
      console.warn(`  SKIP: Unknown classId "${sub.classId}" for subject "${sub.name}"`);
      continue;
    }

    const lookupKey = `${realClassId}_${sub.name.toLowerCase().trim()}`;
    if (existingSubjectMap.has(lookupKey)) {
      const existingId = existingSubjectMap.get(lookupKey);
      subjectKeyToFirestoreId.set(sub.id, existingId);
      // console.log(`  EXISTS: "${sub.name}" for ${sub.classId} -> ${existingId}`);
    } else {
      // Create new subject
      const newDocRef = await adminDb.collection('subjects').add({
        classId: realClassId,
        name: sub.name,
        code: sub.code,
        icon: sub.icon,
        color: sub.color,
        description: sub.description,
        createdAt: FieldValue.serverTimestamp(),
      });
      subjectKeyToFirestoreId.set(sub.id, newDocRef.id);
      existingSubjectMap.set(lookupKey, newDocRef.id);
      console.log(`  CREATED subject: "${sub.name}" (${sub.classId}) -> ${newDocRef.id}`);
      subjectsCreated++;
    }
  }
  console.log(`\nSubjects: ${subjectsCreated} created, ${SUBJECTS_CATALOG.length - subjectsCreated} already existed.\n`);

  // 3. Load existing chapters from Firestore
  const existingChaptersSnap = await adminDb.collection('chapters').get();
  // Map: "subjectDocId_chapterNumber" -> { id, hasContent }
  const existingChapterMap = new Map();
  existingChaptersSnap.forEach(doc => {
    const d = doc.data();
    const key = `${d.subjectId}_${d.chapterNumber}`;
    const hasContent = !!(d.theoryNotes?.trim() || d.textbookContent?.trim() || d.keyFormulas?.trim());
    existingChapterMap.set(key, { id: doc.id, hasContent, data: d });
  });
  console.log(`Loaded ${existingChaptersSnap.size} existing chapters from Firestore.`);

  // 4. Create or update chapters
  let chaptersCreated = 0;
  let chaptersUpdated = 0;
  let chaptersSkipped = 0;

  for (const ch of CHAPTERS_CATALOG) {
    const realClassId = CLASS_IDS[ch.classKey];
    const realSubjectId = subjectKeyToFirestoreId.get(ch.subjectKey);

    if (!realClassId || !realSubjectId) {
      console.warn(`  SKIP chapter "${ch.title}": could not resolve class/subject IDs (class=${ch.classKey}, subjectKey=${ch.subjectKey})`);
      chaptersSkipped++;
      continue;
    }

    const lookupKey = `${realSubjectId}_${ch.chapterNumber}`;
    const chapterPayload = {
      classId: realClassId,
      subjectId: realSubjectId,
      chapterNumber: ch.chapterNumber,
      title: ch.title,
      description: ch.description,
      learningObjectives: ch.learningObjectives || [],
      textbookContent: ch.textbookContent || '',
      theoryNotes: ch.theoryNotes || '',
      keyFormulas: ch.keyFormulas || '',
      resourceLink: ch.resourceLink || '',
      videoUrl: ch.videoUrl || '',
    };

    if (existingChapterMap.has(lookupKey)) {
      const existing = existingChapterMap.get(lookupKey);
      if (!existing.hasContent) {
        // Update placeholder chapter with real content
        await adminDb.collection('chapters').doc(existing.id).update({
          ...chapterPayload,
          updatedAt: FieldValue.serverTimestamp(),
        });
        console.log(`  UPDATED chapter: "${ch.title}" (Ch ${ch.chapterNumber}) -> ${existing.id}`);
        chaptersUpdated++;
      } else {
        console.log(`  EXISTS (with content): "${ch.title}" (Ch ${ch.chapterNumber}) -> ${existing.id} [SKIPPED]`);
        chaptersSkipped++;
      }
    } else {
      const newChapRef = await adminDb.collection('chapters').add({
        ...chapterPayload,
        bookId: '',
        createdAt: FieldValue.serverTimestamp(),
      });
      console.log(`  CREATED chapter: "${ch.title}" (Ch ${ch.chapterNumber}) -> ${newChapRef.id}`);
      chaptersCreated++;
    }
  }

  console.log(`\nChapters: ${chaptersCreated} created, ${chaptersUpdated} updated, ${chaptersSkipped} skipped.\n`);

  // 5. Summary
  console.log('=== SEEDER COMPLETE ===');
  console.log(`Subjects created: ${subjectsCreated}`);
  console.log(`Chapters created: ${chaptersCreated}`);
  console.log(`Chapters updated (content populated): ${chaptersUpdated}`);
  console.log(`Chapters skipped (already had content): ${chaptersSkipped}`);

  // 6. Show final state
  const finalSubjectsSnap = await adminDb.collection('subjects').get();
  const finalChaptersSnap = await adminDb.collection('chapters').get();
  console.log(`\nFinal Firestore state:`);
  console.log(`  Total subjects: ${finalSubjectsSnap.size}`);
  console.log(`  Total chapters: ${finalChaptersSnap.size}`);

  process.exit(0);
}

seedCurriculum().catch(err => {
  console.error('SEEDER FAILED:', err);
  process.exit(1);
});
