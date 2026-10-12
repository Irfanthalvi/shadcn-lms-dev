/**
 * Authentic Sindh Textbook Board (Jamshoro) Curriculum Catalog
 * Covers Classes 8, 9, 10, 11, and 12.
 * Contains genuine textbook theory, teacher notes, formulas, and SLOs.
 */

export const CURRICULUM_DATA = [
  // =========================================================================
  // CLASS 8 (Middle Section - Foundational Core Curriculum)
  // =========================================================================
  {
    grade: 8,
    subjects: [
      {
        name: "Mathematics",
        code: "MATH-8",
        icon: "Calculator",
        color: "blue",
        bookTitle: "Mathematics for Class VIII",
        chapters: [
          {
            chapterNumber: 1,
            title: "Operations on Sets",
            description: "Introduction to sets, set operations (union, intersection, difference), Venn diagrams, and De Morgan's laws.",
            learningObjectives: [
              "Recognize operation on sets: Union, Intersection, and Difference",
              "Demonstrate verification of De Morgan's Laws using Venn diagrams",
              "Solve word problems involving two intersecting and disjoint sets",
            ],
            textbookContent: `Chapter 1: Operations on Sets

A set is a well-defined collection of distinct objects called elements or members of the set.

1. UNION OF TWO SETS (A ∪ B)
The union of two sets A and B, denoted by A ∪ B, is the set consisting of all elements that belong to A or to B or to both.
Symbolically: A ∪ B = {x | x ∈ A or x ∈ B}

2. INTERSECTION OF TWO SETS (A ∩ B)
The intersection of two sets A and B, denoted by A ∩ B, is the set consisting of all elements that belong to both A and B.
Symbolically: A ∩ B = {x | x ∈ A and x ∈ B}

3. DIFFERENCE OF TWO SETS (A − B)
The difference of two sets A and B is the set of elements that belong to A but do not belong to B.
Symbolically: A − B = {x | x ∈ A and x ∉ B}

4. COMPLEMENT OF A SET (A')
If U is the universal set and A is a subset of U, then the complement of set A, denoted by A' or U − A, is the set of all elements in U that are not in A.

5. DE MORGAN'S LAWS
For any two sets A and B:
Law 1: (A ∪ B)' = A' ∩ B'
Law 2: (A ∩ B)' = A' ∪ B'`,
            theoryNotes: `### 1.1 Types of Sets
* **Empty / Null Set (∅ or {}):** A set with no elements.
* **Universal Set (U):** A set containing all objects under consideration.
* **Disjoint Sets:** Two sets with no common elements (A ∩ B = ∅).
* **Overlapping Sets:** Two sets having at least one common element, but neither is a subset of the other.

### 1.2 Venn Diagrams
Venn diagrams represent sets geometrically where the universal set is represented by a rectangle and its subsets by circles inside the rectangle.`,
            keyFormulas: `* n(A ∪ B) = n(A) + n(B) − n(A ∩ B)
* For disjoint sets: n(A ∪ B) = n(A) + n(B)
* De Morgan's Law 1: (A ∪ B)' = A' ∩ B'
* De Morgan's Law 2: (A ∩ B)' = A' ∪ B'
* (A')' = A`,
            videoUrl: "",
          },
          {
            chapterNumber: 2,
            title: "Real Numbers and Square Roots",
            description: "Rational and irrational numbers, terminating/non-terminating decimals, and finding square roots by factorization and division.",
            learningObjectives: [
              "Differentiate between rational and irrational numbers",
              "Find the square root of positive integers and fractions by prime factorization and division method",
              "Estimate square roots of numbers to specified decimal places",
            ],
            textbookContent: `Chapter 2: Real Numbers and Square Roots

1. RATIONAL NUMBERS (Q)
A number that can be expressed in the form p/q, where p and q are integers and q ≠ 0, is called a rational number.
Terminating decimals (e.g., 0.75 = 3/4) and recurring decimals (e.g., 0.333... = 1/3) are rational numbers.

2. IRRATIONAL NUMBERS (Q')
A number that cannot be written in the form p/q, where p, q ∈ Z and q ≠ 0, is called an irrational number.
Non-terminating and non-recurring decimals (e.g., √2 = 1.414213..., π = 3.14159...) are irrational numbers.

3. REAL NUMBERS (R)
The union of the set of rational numbers (Q) and irrational numbers (Q') forms the set of real numbers: R = Q ∪ Q'.

4. SQUARE ROOTS
The square root of a number x is a value y such that y² = x. It is denoted by √x.
Methods to find square root:
a) Prime Factorization Method: Group identical prime factors into pairs.
b) Long Division Method: Group digits in pairs starting from the units place.`,
            theoryNotes: `### 2.1 Properties of Square Roots
* √(a · b) = √a · √b
* √(a / b) = √a / √b (where b ≠ 0)
* (√a)² = a

### 2.2 Finding Square Roots of Decimals
1. Place bars over pairs of digits in integral and decimal parts.
2. Proceed as in whole numbers, placing the decimal point in the quotient when the decimal point is reached.`,
            keyFormulas: `* R = Q ∪ Q' and Q ∩ Q' = ∅
* Perfect squares: 1, 4, 9, 16, 25, 36, 49, 64, 81, 100, 121, 144...
* √(a · b) = √a · √b`,
            videoUrl: "",
          },
          {
            chapterNumber: 3,
            title: "Number Systems",
            description: "Base-2 (binary), base-5 (quinary), base-8 (octal), and base-10 (decimal) number systems and conversions.",
            learningObjectives: [
              "Convert numbers between base-10 and base-2, base-5, and base-8",
              "Add, subtract, and multiply numbers in binary, quinary, and octal systems",
            ],
            textbookContent: `Chapter 3: Number Systems

A number system is a writing system for expressing numbers using digits or other symbols.

1. DECIMAL NUMBER SYSTEM (BASE-10)
Uses ten digits: 0, 1, 2, 3, 4, 5, 6, 7, 8, 9. Each position represents powers of 10.

2. BINARY NUMBER SYSTEM (BASE-2)
Uses two digits: 0 and 1. Used in digital computer circuits. Each position represents powers of 2.
Example: (1101)₂ = 1×2³ + 1×2² + 0×2¹ + 1×2⁰ = 8 + 4 + 0 + 1 = 13 in base 10.

3. QUINARY NUMBER SYSTEM (BASE-5)
Uses five digits: 0, 1, 2, 3, 4. Each position represents powers of 5.

4. OCTAL NUMBER SYSTEM (BASE-8)
Uses eight digits: 0, 1, 2, 3, 4, 5, 6, 7. Each position represents powers of 8.`,
            theoryNotes: `### 3.1 Conversion from Base-10 to Other Bases
* Divide the decimal number repeatedly by the target base (2, 5, or 8).
* Write down remainders from bottom to top to get the equivalent number.

### 3.2 Binary Arithmetic
* 0 + 0 = 0
* 0 + 1 = 1
* 1 + 0 = 1
* 1 + 1 = 10 (0 with carry 1)
* 1 + 1 + 1 = 11 (1 with carry 1)`,
            keyFormulas: `* (10)₂ = 2₁₀
* (100)₂ = 4₁₀
* (1000)₂ = 8₁₀
* (10)₅ = 5₁₀
* (10)₈ = 8₁₀`,
            videoUrl: "",
          },
          {
            chapterNumber: 4,
            title: "Financial Arithmetic",
            description: "Compound proportion, partnership in business, profit and loss distribution, Zakat and Ushr calculations.",
            learningObjectives: [
              "Solve problems on compound proportion involving direct and inverse proportions",
              "Calculate partnership profit and loss division according to capital ratio and time period",
              "Calculate Zakat (2.5%) and Ushr (5% / 10%) on agricultural produce",
            ],
            textbookContent: `Chapter 4: Financial Arithmetic

1. COMPOUND PROPORTION
A proportion involving two or more relationships between three or more quantities.
- Direct Proportion: If increase in one quantity causes increase in the other.
- Inverse Proportion: If increase in one quantity causes decrease in the other.

2. PARTNERSHIP
A business entity in which two or more people share ownership, profits, and losses.
Profit or Loss of each partner is proportional to the capital invested and duration:
Profit Ratio = (Capital 1 × Time 1) : (Capital 2 × Time 2)

3. ZAKAT
Zakat is one of the pillars of Islam, levied at 2.5% (1/40th) on accumulated wealth, gold (7.5 tola), silver (52.5 tola), or cash held for one full lunar year above Nisab.

4. USHR
Ushr is Islamic tax on agricultural produce:
- 10% (1/10th) on produce from naturally irrigated land (rain/canal).
- 5% (1/20th) on produce from artificially irrigated land (tubewell/wells).`,
            theoryNotes: `### 4.1 Partnership Rules
Total Ratio = Sum of individual investment shares.
Partner's Share = (Individual Ratio / Total Ratio) × Total Profit or Loss.

### 4.2 Zakat Rate
Rate of Zakat = 2.5% = 2.5 / 100 = 1 / 40.
Amount of Zakat = Total Wealth × 0.025.`,
            keyFormulas: `* Zakat Amount = Total Value × 0.025
* Ushr (Natural irrigation) = Produce Value × 0.10
* Ushr (Artificial irrigation) = Produce Value × 0.05
* Partner Share = (Partner Ratio / Total Ratio) × Total Profit`,
            videoUrl: "",
          },
          {
            chapterNumber: 5,
            title: "Polynomials and Algebraic Identities",
            description: "Algebraic expressions, degree of polynomials, operations on polynomials, and fundamental algebraic identities.",
            learningObjectives: [
              "Identify polynomials, monomials, binomials, and trinomials with degrees",
              "Add, subtract, multiply, and divide polynomials",
              "Apply identities (a+b)², (a-b)², and a²-b² to expand and factorize expressions",
            ],
            textbookContent: `Chapter 5: Polynomials

1. DEFINITION
A polynomial is an algebraic expression consisting of variables and coefficients, that involves only the operations of addition, subtraction, multiplication, and non-negative integer exponentiation of variables.

2. DEGREE OF A POLYNOMIAL
The highest power of the variable in a polynomial:
- Linear polynomial: Degree 1 (e.g. 3x + 5)
- Quadratic polynomial: Degree 2 (e.g. 2x² - 4x + 1)
- Cubic polynomial: Degree 3 (e.g. x³ + 3x² - x + 7)

3. ALGEBRAIC IDENTITIES
Identity 1: (a + b)² = a² + 2ab + b²
Identity 2: (a - b)² = a² - 2ab + b²
Identity 3: (a + b)(a - b) = a² - b²
Identity 4: (x + a)(x + b) = x² + (a + b)x + ab`,
            theoryNotes: `### 5.1 Operations on Polynomials
* **Addition:** Combine like terms (terms with the same variable and exponent).
* **Multiplication:** Use distributive law to multiply every term of the first polynomial by every term of the second.
* **Division:** Use polynomial long division algorithm (Dividend = Divisor × Quotient + Remainder).`,
            keyFormulas: `* (a + b)² = a² + 2ab + b²
* (a − b)² = a² − 2ab + b²
* a² − b² = (a + b)(a − b)
* (a + b + c)² = a² + b² + c² + 2(ab + bc + ca)`,
            videoUrl: "",
          },
        ],
      },
      {
        name: "General Science",
        code: "SCI-8",
        icon: "Atom",
        color: "emerald",
        bookTitle: "General Science for Class VIII",
        chapters: [
          {
            chapterNumber: 1,
            title: "Human Organ Systems",
            description: "Central nervous system, peripheral nervous system, neurons, brain structure, and human digestive/respiratory systems.",
            learningObjectives: [
              "Describe the structure and function of the human nervous system",
              "Explain the parts of a neuron and transmission of nerve impulses",
              "Differentiate between voluntary and involuntary actions and reflex actions",
            ],
            textbookContent: `Chapter 1: Human Organ Systems

1. THE NERVOUS SYSTEM
The nervous system controls and coordinates all the body functions.
It consists of two main parts:
a) Central Nervous System (CNS): Brain and Spinal Cord.
b) Peripheral Nervous System (PNS): Network of nerves connecting CNS to the rest of the body.

2. THE NEURON (NERVE CELL)
The basic structural and functional unit of the nervous system is the neuron.
A neuron has three main parts:
- Cell Body (Soma): Contains the nucleus and cytoplasm.
- Dendrites: Short branched fibers that receive impulses and carry them towards the cell body.
- Axon: Long fiber that carries impulses away from the cell body to other neurons or effector organs.

3. THE HUMAN BRAIN
The brain is enclosed in a bony case called the cranium:
- Forebrain: Cerebrum (thinking, memory, sensory interpretation), Thalamus, Hypothalamus.
- Midbrain: Relay center for visual and auditory impulses.
- Hindbrain: Cerebellum (balance and muscular coordination), Pons, Medulla Oblongata (breathing, heartbeat, swallowing).

4. REFLEX ACTION
An immediate, involuntary response to an external stimulus without conscious thought.
Path of a reflex action is called a Reflex Arc:
Receptor → Sensory Neuron → Interneuron (Spinal Cord) → Motor Neuron → Effector (Muscle).`,
            theoryNotes: `### 1.1 Types of Neurons
* **Sensory Neurons:** Carry impulses from sense organs (receptors) to the CNS.
* **Motor Neurons:** Carry impulses from the CNS to effectors (muscles and glands).
* **Interneurons:** Located inside the brain and spinal cord, linking sensory and motor neurons.

### 1.2 Actions
* **Voluntary Actions:** Under conscious control of brain (writing, walking, speaking).
* **Involuntary Actions:** Not under conscious control (heartbeat, digestion, blinking).`,
            keyFormulas: `* Reflex Arc: Receptor → Sensory Neuron → Spinal Cord → Motor Neuron → Effector
* Brain Divisions: Forebrain (Cerebrum), Midbrain, Hindbrain (Cerebellum, Medulla)`,
            videoUrl: "",
          },
          {
            chapterNumber: 2,
            title: "Heredity in Organisms",
            description: "Cell division, chromosomes, DNA, genes, mitosis vs. meiosis, and transmission of hereditary characteristics.",
            learningObjectives: [
              "Explain the role of chromosomes, DNA, and genes in heredity",
              "Distinguish between mitosis and meiosis in terms of location and daughter cells",
              "Explain dominant and recessive traits in humans",
            ],
            textbookContent: `Chapter 2: Heredity in Organisms

1. HEREDITY
The transmission of characteristics (traits) from parents to offspring is called heredity.
Examples of inheritable traits: eye color, skin complexion, hair texture, height, blood group.

2. CELL DIVISION
Process by which a parent cell divides into two or more daughter cells.
Two main types:
a) Mitosis: Division in somatic (body) cells. A parent cell divides into two identical daughter cells with the same number of chromosomes (diploid, 2n). Essential for growth and tissue repair.
b) Meiosis: Division in germ cells (reproductive cells). A parent cell divides into four daughter cells with half the number of chromosomes (haploid, n). Essential for gamete formation (sperm and egg cells).

3. CHROMOSOMES, DNA AND GENES
- Chromosomes: Thread-like structures located inside the nucleus, visible during cell division. Humans have 46 chromosomes (23 pairs) in each body cell.
- DNA (Deoxyribonucleic Acid): The chemical material of heredity, structured as a double helix.
- Genes: Specific segments of DNA that determine particular hereditary traits.`,
            theoryNotes: `### 2.1 Mitosis vs. Meiosis
* **Mitosis:** 1 division → 2 daughter cells; Chromosome number remains diploid (2n=46); Occurs in body cells.
* **Meiosis:** 2 divisions → 4 daughter cells; Chromosome number reduced to haploid (n=23); Occurs in reproductive cells.

### 2.2 Genes & Alleles
* **Dominant Trait:** A trait that appears in offspring even if only one allele is present (e.g. brown eyes).
* **Recessive Trait:** A trait masked by a dominant allele; only appears when both alleles are recessive (e.g. blue eyes).`,
            keyFormulas: `* Human Chromosomes: 46 (23 pairs in somatic cells)
* Gametes: 23 chromosomes (haploid, n)
* Zygote: 23 + 23 = 46 chromosomes (diploid, 2n)`,
            videoUrl: "",
          },
          {
            chapterNumber: 3,
            title: "Biotechnology",
            description: "Introduction to biotechnology, genetic engineering, cloning, insulin production, and agricultural applications.",
            learningObjectives: [
              "Define biotechnology and describe major techniques of genetic modification",
              "Explain how human insulin is produced using genetically modified bacteria",
              "Discuss applications of biotechnology in agriculture, health, and environment",
            ],
            textbookContent: `Chapter 3: Biotechnology

1. DEFINITION
Biotechnology is the application of living organisms, their biological processes, or biological systems to produce goods, drugs, and services for human welfare.

2. GENETIC ENGINEERING
The direct manipulation of an organism's genes using biotechnology. An organism with an inserted foreign gene is called a Genetically Modified Organism (GMO).

3. PRODUCTION OF HUMAN INSULIN
Insulin is a hormone that controls blood glucose levels. Diabetics cannot produce sufficient insulin.
Steps of insulin production:
1. Isolate the human insulin gene from human pancreas cells using restriction enzyme.
2. Extract plasmid DNA (circular DNA) from bacterium Escherichia coli (E. coli).
3. Cut plasmid DNA with the same restriction enzyme.
4. Join the human insulin gene into the plasmid using DNA ligase enzyme to create Recombinant DNA.
5. Introduce recombinant plasmid into bacterium host cell.
6. Culture bacteria in fermentation tanks where they multiply rapidly and synthesize human insulin.
7. Extract and purify human insulin for medical use.`,
            theoryNotes: `### 3.1 Applications of Biotechnology
* **Medicine:** Vaccines, human insulin, antibiotics, interferon, gene therapy.
* **Agriculture:** Pest-resistant crops (Bt cotton), drought-resistant seeds, golden rice enriched with Vitamin A.
* **Food Processing:** Bread making, cheese production, fermented foods using yeast and bacteria.
* **Environmental Cleaning:** Bioremediation (microorganisms used to clean oil spills and sewage).`,
            keyFormulas: `* Recombinant DNA = Plasmid Vector + Target Human Gene
* Tool Enzymes: Restriction Endonucleases (molecular scissors) and DNA Ligase (molecular glue)`,
            videoUrl: "",
          },
        ],
      },
      {
        name: "Computer Education",
        code: "COMP-8",
        icon: "Cpu",
        color: "cyan",
        bookTitle: "Computer Education for Class VIII",
        chapters: [
          {
            chapterNumber: 1,
            title: "Networks and Communications",
            description: "Computer networks, components, transmission media (guided and unguided), topologies, and communication devices.",
            learningObjectives: [
              "Define computer networks and understand LAN, MAN, and WAN",
              "Compare guided media (twisted pair, coaxial, optical fiber) with unguided media (radio, microwave, satellite)",
              "Identify topologies: bus, star, ring, and mesh",
            ],
            textbookContent: `Chapter 1: Networks and Communications

1. COMPUTER NETWORK
A collection of computers and peripheral devices connected together via communication channels to facilitate data sharing and resource exchange.

2. TYPES OF NETWORKS
- Local Area Network (LAN): Covers a small geographic area like a room, office, or school building.
- Metropolitan Area Network (MAN): Spans a city or large campus (e.g. cable TV network).
- Wide Area Network (WAN): Spans across countries or continents (e.g. the Internet).

3. TRANSMISSION MEDIA
- Guided Media (Wired):
  * Twisted Pair Cable: Inexpensive, used in telephone lines and local Ethernet.
  * Coaxial Cable: Higher bandwidth, shielded against electromagnetic interference.
  * Fiber Optic Cable: Transmits data as light pulses through glass fibers at near speed of light; immune to interference.
- Unguided Media (Wireless):
  * Radio Waves, Microwaves, Infrared, and Satellite communication.

4. NETWORK TOPOLOGIES
The physical layout of network nodes:
- Bus Topology: All devices share a single backbone cable. Simple but cable break halts entire network.
- Star Topology: All nodes connect to a central hub/switch. Most common; fault in one cable does not affect others.
- Ring Topology: Nodes connect in a continuous closed loop.
- Mesh Topology: Every device connects to every other device; highly redundant and reliable.`,
            theoryNotes: `### 1.1 Network Devices
* **NIC (Network Interface Card):** Hardware allowing a computer to connect to a network.
* **Router:** Connects multiple distinct networks and directs packets along optimal paths.
* **Switch:** Connects devices in a LAN and forwards frames based on MAC addresses.
* **Modem (Modulator-Demodulator):** Converts digital data to analog for transmission over telephone lines and vice versa.`,
            keyFormulas: `* LAN < MAN < WAN in physical scale
* Optical fiber transmits data using total internal reflection of light`,
            videoUrl: "",
          },
          {
            chapterNumber: 2,
            title: "Computer Security Threats",
            description: "Viruses, worms, spyware, phishing, hacking, and cyber protection strategies.",
            learningObjectives: [
              "Identify common computer security threats: Viruses, Worms, Trojan Horses, Spyware",
              "Understand modes of virus transmission and methods of safeguarding data",
              "Apply antivirus software, firewall configurations, and strong password policies",
            ],
            textbookContent: `Chapter 2: Computer Security Threats

1. THREATS TO COMPUTER SECURITY
A computer security threat is any potential risk that can steal, damage, or compromise computer systems and data.

2. TYPES OF MALWARE (MALICIOUS SOFTWARE)
- Virus: A program that attaches itself to legitimate files or programs and replicates when the host file is executed.
- Worm: A self-replicating malware that spreads across computer networks without requiring human intervention or host programs.
- Trojan Horse: A program that masquerades as useful software (e.g. a game or utility) while performing malicious background activities.
- Spyware: Software that secretly monitors user behavior, keystrokes, and browsing habits and sends data to third parties.
- Ransomware: Encrypts user files and demands payment (ransom) to restore access.

3. PREVENTATIVE MEASURES
- Install and regularly update Antivirus and Antimalware software.
- Enable Firewalls to inspect and filter incoming and outgoing network traffic.
- Never open unsolicited email attachments or suspicious website links.
- Maintain regular backups of important data on external drives or secure cloud storage.`,
            theoryNotes: `### 2.1 Password Security
* Use at least 12-16 characters including uppercase, lowercase, numbers, and symbols.
* Do not reuse passwords across multiple educational or personal accounts.
* Enable Two-Factor Authentication (2FA) wherever available.`,
            keyFormulas: `* Malware = Malicious Software
* Core Security Triad: Confidentiality, Integrity, Availability (CIA)`,
            videoUrl: "",
          },
        ],
      },
    ],
  },

  // =========================================================================
  // CLASS 9 (Secondary Stage - Matric Part I - STBB Jamshoro)
  // =========================================================================
  {
    grade: 9,
    subjects: [
      {
        name: "Physics",
        code: "PHY-9",
        icon: "Zap",
        color: "blue",
        bookTitle: "Secondary Stage Physics (Class IX)",
        chapters: [
          {
            chapterNumber: 1,
            title: "Physical Quantities and Measurement",
            description: "Introduction to physical quantities, SI base & derived units, scientific notation, and precision instruments.",
            videoUrl: "https://www.youtube.com/watch?v=21X5lGlDOfg",
            learningObjectives: [
              "Distinguish between base and derived physical quantities and their SI units",
              "Demonstrate working and least count of Vernier Calipers and Screw Gauge",
              "Apply significant figures and scientific notation rules",
            ],
            textbookContent: `Unit 1: Physical Quantities and Measurement

In physics, we observe natural phenomena and measure quantities.

1. BASE QUANTITIES AND SI UNITS
There are seven base quantities:
- Length: metre (m)
- Mass: kilogram (kg)
- Time: second (s)
- Electric Current: ampere (A)
- Temperature: kelvin (K)
- Amount of Substance: mole (mol)
- Luminous Intensity: candela (cd)

2. DERIVED QUANTITIES
Quantities defined in terms of base quantities:
- Velocity: m/s
- Acceleration: m/s²
- Force: Newton (N = kg·m/s²)
- Work/Energy: Joule (J = N·m)
- Pressure: Pascal (Pa = N/m²)

3. MEASURING INSTRUMENTS
- Vernier Calipers:
  Least Count = Smallest division on main scale / Total vernier divisions = 1 mm / 10 = 0.1 mm = 0.01 cm.
- Micrometer Screw Gauge:
  Least Count = Pitch / Total circular scale divisions = 0.5 mm / 50 = 0.01 mm = 0.001 cm.`,
            theoryNotes: `### 1.1 Significant Figures
* Non-zero digits are always significant.
* Zeros between non-zero digits are significant (e.g. 2005 has 4 significant figures).
* Leading zeros are never significant (e.g. 0.0025 has 2 significant figures).
* Trailing zeros after decimal point are significant (e.g. 4.500 has 4 significant figures).`,
            keyFormulas: `* Least Count (Vernier) = 0.1 mm = 0.01 cm
* Least Count (Screw Gauge) = 0.01 mm = 0.001 cm
* Density = Mass / Volume (ρ = m / V)`,
          },
          {
            chapterNumber: 2,
            title: "Kinematics",
            description: "Motion of bodies without considering causes, scalars/vectors, velocity, acceleration, and equations of motion.",
            learningObjectives: [
              "Classify types of motion: Translatory, Rotatory, and Vibratory",
              "Derive three equations of uniformly accelerated motion",
              "Solve numericals involving freely falling bodies under gravity",
            ],
            textbookContent: `Chapter 2: Kinematics

1. TYPES OF MOTION
- Translatory Motion: Every particle of body moves along parallel lines (Linear, Circular, Random).
- Rotatory Motion: Motion of a body about an axis passing through it.
- Vibratory Motion: To-and-fro motion about mean position.

2. EQUATIONS OF MOTION
For uniformly accelerated rectilinear motion:
1st Equation: vf = vi + a·t
2nd Equation: s = vi·t + ½·a·t²
3rd Equation: 2·a·s = vf² − vi²

Under gravity (free fall):
Replace acceleration 'a' with gravitational acceleration 'g' = 9.8 m/s² (downward).`,
            theoryNotes: `### 2.1 Velocity and Acceleration
* Speed (v = s/t): Scalar quantity (m/s).
* Velocity (v = d/t): Vector quantity (m/s).
* Acceleration (a = Δv/Δt): Rate of change of velocity (m/s²).`,
            keyFormulas: `* vf = vi + at
* s = vi·t + ½·a·t²
* 2as = vf² − vi²
* g = 9.8 m/s²`,
            videoUrl: "",
          },
          {
            chapterNumber: 3,
            title: "Dynamics",
            description: "Newton's laws of motion, momentum, friction, and centripetal force.",
            learningObjectives: [
              "Understand inertia and state Newton's three laws of motion",
              "Apply law of conservation of momentum",
              "Calculate friction and centripetal force",
            ],
            textbookContent: `Chapter 3: Dynamics

1. NEWTON'S LAWS OF MOTION
- First Law: A body remains at rest or in uniform motion unless acted upon by a net force.
- Second Law: Acceleration is proportional to net force and inversely proportional to mass: F = m·a.
- Third Law: To every action there is an equal and opposite reaction.

2. MOMENTUM
Linear momentum is the quantity of motion: p = m·v (kg·m/s or N·s).
Law of Conservation of Momentum: Total momentum of an isolated system remains constant.

3. FRICTION
Force opposing relative motion between surfaces: f = μ·R.`,
            theoryNotes: `### 3.1 Centripetal Force
Force that keeps a body moving in a circular path:
Fc = (m · v²) / r`,
            keyFormulas: `* F = ma
* p = mv
* F = Δp / Δt
* Fc = mv² / r
* fs = μs · N`,
            videoUrl: "",
          },
          {
            chapterNumber: 4,
            title: "Turning Effect of Forces",
            description: "Torque, center of mass, center of gravity, and conditions of equilibrium.",
            learningObjectives: [
              "Define torque and understand moment arm",
              "State conditions of equilibrium",
              "Classify states of equilibrium: stable, unstable, neutral",
            ],
            textbookContent: `Chapter 4: Turning Effect of Forces

1. TORQUE (MOMENT OF FORCE)
The turning effect produced in a body about an axis of rotation:
τ = F × d (where d is the moment arm). SI unit: N·m.

2. CONDITIONS OF EQUILIBRIUM
- First Condition: Vector sum of all forces must be zero: ΣF = 0 (ΣFx = 0, ΣFy = 0).
- Second Condition: Vector sum of all torques must be zero: Στ = 0.`,
            theoryNotes: `### 4.1 States of Equilibrium
* **Stable Equilibrium:** Body returns to original position after slight displacement.
* **Unstable Equilibrium:** Body does not return to original position.
* **Neutral Equilibrium:** Body remains in new position without tilting.`,
            keyFormulas: `* τ = F × d
* ΣF = 0
* Στ = 0`,
            videoUrl: "",
          },
          {
            chapterNumber: 5,
            title: "Gravitation",
            description: "Newton's law of universal gravitation, mass of Earth, variation of g, and artificial satellites.",
            learningObjectives: [
              "State Newton's Law of Universal Gravitation",
              "Calculate mass of Earth using gravitation law",
              "Calculate orbital speed of artificial satellites",
            ],
            textbookContent: `Chapter 5: Gravitation

1. NEWTON'S LAW OF GRAVITATION
Every particle in universe attracts every other particle with force directly proportional to product of masses and inversely proportional to square of distance:
F = G · (m₁ · m₂) / r²
where G = 6.673 × 10⁻¹¹ N·m²/kg².

2. MASS OF EARTH
Using F = m·g and F = G·m·M / R²:
Me = (g · R²) / G = (9.8 × (6.4 × 10⁶)²) / (6.673 × 10⁻¹¹) ≈ 6.0 × 10²⁴ kg.

3. ARTIFICIAL SATELLITES
Orbital speed required to orbit Earth at radius r:
vo = √(G · M / r) = √(g · R) ≈ 7.9 km/s.`,
            theoryNotes: `### 5.1 Variation of g
g decreases as altitude increases according to:
gh = G · Me / (R + h)²`,
            keyFormulas: `* F = G(m₁m₂) / r²
* G = 6.673 × 10⁻¹¹ N·m²/kg²
* Me = gR² / G ≈ 6.0 × 10²⁴ kg
* vo = √(GM / r)`,
            videoUrl: "",
          },
        ],
      },
      {
        name: "Chemistry",
        code: "CHEM-9",
        icon: "FlaskConical",
        color: "emerald",
        bookTitle: "Secondary Stage Chemistry (Class IX)",
        chapters: [
          {
            chapterNumber: 1,
            title: "Fundamentals of Chemistry",
            description: "Branches of chemistry, atomic mass, molecular mass, mole concept, and Avogadro's number.",
            learningObjectives: [
              "Define chemistry and identify branches",
              "Calculate molecular and formula mass",
              "Solve calculations using mole concept and Avogadro's number",
            ],
            textbookContent: `Chapter 1: Fundamentals of Chemistry

1. BRANCHES OF CHEMISTRY
- Physical Chemistry: Relationship between composition and physical properties of matter.
- Organic Chemistry: Study of covalent compounds of carbon and hydrogen (hydrocarbons).
- Inorganic Chemistry: Study of all elements except hydrocarbons.
- Biochemistry: Chemical reactions within living organisms.

2. MOLE AND AVOGADRO'S NUMBER
A mole is the atomic mass, molecular mass, or formula mass expressed in grams.
One mole contains 6.022 × 10²³ particles (Avogadro's constant, NA).`,
            theoryNotes: `### 1.1 Mole Formulas
Number of Moles = Mass in grams / Molar Mass (g/mol)
Number of Particles = Moles × NA`,
            keyFormulas: `* n = m / M
* N = n × NA (NA = 6.022 × 10²³)
* Molecular Mass = Sum of atomic masses`,
            videoUrl: "",
          },
          {
            chapterNumber: 2,
            title: "Atomic Structure",
            description: "Subatomic particles, Rutherford's and Bohr's atomic models, electronic configuration, and isotopes.",
            learningObjectives: [
              "Describe protons, neutrons, and electrons",
              "Compare Rutherford and Bohr atomic models",
              "Write electronic configuration of elements up to Z = 18",
            ],
            textbookContent: `Chapter 2: Atomic Structure

1. SUBATOMIC PARTICLES
- Proton: In nucleus, charge +1, mass 1 amu.
- Neutron: In nucleus, neutral (0), mass 1 amu.
- Electron: Revolves in shells, charge -1, mass 1/1836 amu.

2. BOHR'S ATOMIC MODEL
Electrons revolve in fixed circular orbits (shells K, L, M, N) without radiating energy.
Capacity of shells = 2n²:
K (n=1) = 2 electrons
L (n=2) = 8 electrons
M (n=3) = 18 electrons`,
            theoryNotes: `### 2.1 Isotopes
Atoms of the same element having same atomic number (Z) but different mass numbers (A).
Examples: Hydrogen (Protium ¹H, Deuterium ²H, Tritium ³H).`,
            keyFormulas: `* Shell capacity: 2n²
* A = Z + N (Mass Number = Protons + Neutrons)`,
            videoUrl: "",
          },
          {
            chapterNumber: 3,
            title: "Periodic Table and Periodicity of Properties",
            description: "Historical development, modern periodic table, groups and periods, and periodic trends.",
            learningObjectives: [
              "State Modern Periodic Law",
              "Describe groups and periods in the modern periodic table",
              "Explain periodic trends in atomic radius, ionization energy, electron affinity, and electronegativity",
            ],
            textbookContent: `Chapter 3: Periodic Table and Periodicity of Properties

1. MODERN PERIODIC LAW (Mosely, 1913)
The physical and chemical properties of elements are periodic functions of their atomic numbers.

2. STRUCTURE OF PERIODIC TABLE
- Periods: 7 horizontal rows.
- Groups: 18 vertical columns (elements in same group have same valence electrons).

3. PERIODIC TRENDS
- Atomic Radius: Decreases across a period (left to right) due to increasing nuclear charge; Increases down a group due to addition of shells.
- Ionization Energy: Energy required to remove an electron from a gaseous atom. Increases across a period; Decreases down a group.
- Electronegativity: Ability of an atom to attract shared electron pair. Increases across a period; Decreases down a group (Fluorine is most electronegative: 4.0).`,
            theoryNotes: `### 3.1 Summary of Periodic Trends
* Across Period (→): Atomic radius decreases; Ionization energy, electron affinity, and electronegativity increase.
* Down Group (↓): Atomic radius increases; Ionization energy, electron affinity, and electronegativity decrease.`,
            keyFormulas: `* Modern Periodic Law: Properties = f(Atomic Number Z)
* Highest Electronegativity: Fluorine (4.0)`,
            videoUrl: "",
          },
        ],
      },
      {
        name: "Mathematics",
        code: "MATH-9",
        icon: "Calculator",
        color: "amber",
        bookTitle: "Secondary Stage Mathematics (Class IX)",
        chapters: [
          {
            chapterNumber: 1,
            title: "Real and Complex Numbers",
            description: "Real number properties, radicals and radicands, complex numbers, algebra of complex numbers.",
            learningObjectives: [
              "Understand real numbers and their properties under addition and multiplication",
              "Simplify radical and exponential expressions using laws of exponents",
              "Perform addition, subtraction, multiplication, and conjugate of complex numbers",
            ],
            textbookContent: `Chapter 1: Real and Complex Numbers

1. COMPLEX NUMBERS (C)
A number of the form z = a + bi, where a, b ∈ R and i = √(-1) is called a complex number.
- a is the Real Part: Re(z) = a
- b is the Imaginary Part: Im(z) = b
- i² = -1, i³ = -i, i⁴ = 1

2. CONJUGATE OF COMPLEX NUMBER
The conjugate of z = a + bi is z̄ = a − bi.
Product: z · z̄ = (a + bi)(a - bi) = a² + b² (always a non-negative real number).`,
            theoryNotes: `### 1.1 Equality of Complex Numbers
a + bi = c + di if and only if a = c and b = d.

### 1.2 Laws of Exponents
* a^m · a^n = a^(m+n)
* a^m / a^n = a^(m-n)
* (a^m)^n = a^(mn)
* (ab)^n = a^n · b^n`,
            keyFormulas: `* i = √(-1), i² = -1
* z = a + bi => z̄ = a − bi
* |z| = √(a² + b²)`,
            videoUrl: "",
          },
          {
            chapterNumber: 2,
            title: "Logarithms",
            description: "Scientific notation, common logarithm, laws of logarithms, and characteristic and mantissa.",
            learningObjectives: [
              "Express numbers in scientific notation and logarithmic notation",
              "Understand characteristic and find mantissa using logarithm tables",
              "Apply four laws of logarithms to solve complex numerical calculations",
            ],
            textbookContent: `Chapter 2: Logarithms

1. DEFINITION
If a^x = y, then x is called the logarithm of y to base a:
log_a(y) = x  (where a > 0, a ≠ 1, y > 0).

2. COMMON LOGARITHM
Logarithms to base 10 are called Common Logarithms (Briggsian logarithms).
log₁₀(x) has two parts:
- Characteristic: Integral part (can be positive, zero, or negative).
- Mantissa: Fractional part (always positive, found from log tables).

3. LAWS OF LOGARITHMS
Law 1: log_a(m · n) = log_a(m) + log_a(n)
Law 2: log_a(m / n) = log_a(m) − log_a(n)
Law 3: log_a(m^n) = n · log_a(m)
Law 4: log_a(n) = log_b(n) / log_b(a) (Change of base formula)`,
            theoryNotes: `### 2.1 Characteristic Rules
* For numbers >= 1: Characteristic = (number of digits before decimal) - 1.
* For numbers < 1: Characteristic = -(number of consecutive zeros after decimal + 1).`,
            keyFormulas: `* a^x = y <=> log_a(y) = x
* log(mn) = log(m) + log(n)
* log(m/n) = log(m) - log(n)
* log(m^n) = n·log(m)`,
            videoUrl: "",
          },
        ],
      },
    ],
  },

  // =========================================================================
  // CLASS 10 (Secondary Stage - Matric Part II - STBB Jamshoro)
  // =========================================================================
  {
    grade: 10,
    subjects: [
      {
        name: "Physics",
        code: "PHY-10",
        icon: "Zap",
        color: "blue",
        bookTitle: "Secondary Stage Physics (Class X)",
        chapters: [
          {
            chapterNumber: 10,
            title: "Simple Harmonic Motion and Waves",
            description: "Mass-spring system, simple pendulum, wave motion, reflection, refraction, and diffraction.",
            learningObjectives: [
              "Understand conditions for SHM (a ∝ -x)",
              "Calculate time period of simple pendulum and mass-spring oscillator",
              "Apply wave equation v = f·λ",
            ],
            textbookContent: `Chapter 10: Simple Harmonic Motion and Waves

1. SIMPLE HARMONIC MOTION (SHM)
SHM occurs when acceleration is directly proportional to displacement from equilibrium position and directed towards mean position:
a ∝ -x.

2. SIMPLE PENDULUM
Consists of a small heavy bob of mass m suspended by a light inextensible string of length L.
Time period: T = 2π √(L / g).
Note: Time period is independent of mass of bob and amplitude (for small angles).

3. WAVE MOTION
A disturbance in a medium that transfers energy from one point to another without transferring matter.
Wave equation: v = f · λ (where v = speed, f = frequency, λ = wavelength).`,
            theoryNotes: `### 10.1 Wave Properties
* **Reflection:** Waves bounce back upon hitting a surface.
* **Refraction:** Change in direction of waves when passing from one medium to another.
* **Diffraction:** Bending of waves around the corners of an obstacle.`,
            keyFormulas: `* T = 2π√(L/g)
* T = 2π√(m/k)
* v = f · λ
* f = 1 / T`,
            videoUrl: "",
          },
          {
            chapterNumber: 11,
            title: "Sound",
            description: "Sound waves, speed of sound, characteristics of sound (loudness, pitch, quality), and ultrasound.",
            learningObjectives: [
              "Explain longitudinal nature of sound waves requiring a material medium",
              "Differentiate loudness, pitch, and quality of sound",
              "Calculate speed of sound and explain ultrasound applications",
            ],
            textbookContent: `Chapter 11: Sound

1. NATURE OF SOUND
Sound is a mechanical longitudinal wave produced by vibrating bodies. It requires a material medium to propagate and cannot travel through vacuum.

2. CHARACTERISTICS OF SOUND
- Loudness: Depends on amplitude of vibration, area of vibrating body, and distance from source.
- Pitch: Distinguishes shrill from grave sounds; depends on frequency.
- Quality (Timbre): Distinguishes two sounds of same loudness and pitch.

3. SPEED OF SOUND
Speed of sound in air at 0°C is 331 m/s and increases by 0.6 m/s for every 1°C rise in temperature.
v = 331 + 0.6·T (°C).`,
            theoryNotes: `### 11.1 Ultrasound
Sound waves with frequencies higher than 20,000 Hz (inaudible to human ears).
Applications: Medical imaging (sonography), breaking kidney stones (lithotripsy), non-destructive material testing, SONAR.`,
            keyFormulas: `* v = 2d / t (for Echo)
* β = 10 log(I / I₀) dB
* v_air ≈ 343 m/s at 20°C`,
            videoUrl: "",
          },
          {
            chapterNumber: 12,
            title: "Geometrical Optics",
            description: "Reflection of light, spherical mirrors, refraction, Snell's law, lenses, and optical instruments.",
            learningObjectives: [
              "State laws of reflection and refraction of light",
              "Use mirror and lens formulas to solve image distance and magnification",
              "Explain total internal reflection, critical angle, and optical fibers",
            ],
            textbookContent: `Chapter 12: Geometrical Optics

1. SPHERICAL MIRRORS
- Concave Mirror: Reflecting surface curves inward; converges light rays.
- Convex Mirror: Reflecting surface curves outward; diverges light rays.
Mirror Formula: 1/f = 1/p + 1/q
Magnification: M = q/p = h_image / h_object.

2. REFRACTION OF LIGHT AND SNELL'S LAW
When light passes from one transparent medium to another, it bends due to speed change.
Snell's Law: n₁ · sin(θ₁) = n₂ · sin(θ₂)
Refractive index: n = c / v.

3. TOTAL INTERNAL REFLECTION
When light travels from denser to rarer medium at angle of incidence greater than critical angle, all light reflects back into denser medium.
Critical angle formula: sin(θc) = 1 / n.`,
            theoryNotes: `### 12.1 Lenses
* **Convex Lens (Converging):** Thicker in middle, real and inverted images (except when object is between F and optical center).
* **Concave Lens (Diverging):** Thinner in middle, always forms virtual, erect, and diminished images.
* Lens Formula: 1/f = 1/p + 1/q (Sign conventions apply).`,
            keyFormulas: `* 1/f = 1/p + 1/q
* M = q / p
* n = sin(i) / sin(r)
* sin(θc) = 1 / n
* Power of Lens: P = 1 / f (in metres, unit: Dioptre D)`,
            videoUrl: "",
          },
        ],
      },
      {
        name: "Chemistry",
        code: "CHEM-10",
        icon: "FlaskConical",
        color: "emerald",
        bookTitle: "Secondary Stage Chemistry (Class X)",
        chapters: [
          {
            chapterNumber: 1,
            title: "Chemical Equilibrium",
            description: "Reversible reactions, dynamic equilibrium, Law of Mass Action, equilibrium constant Kc, and Le Chatelier's principle.",
            learningObjectives: [
              "Differentiate between reversible and irreversible reactions",
              "State Law of Mass Action and derive expression for equilibrium constant Kc",
              "Predict direction of reaction using reaction quotient Qc and Kc",
            ],
            textbookContent: `Chapter 1: Chemical Equilibrium

1. REVERSIBLE REACTIONS AND DYNAMIC EQUILIBRIUM
- Reversible Reaction: A reaction in which products can react back to form original reactants: aA + bB ⇌ cC + dD.
- Dynamic Equilibrium: The state in which rate of forward reaction equals rate of reverse reaction, while concentrations of reactants and products remain constant.

2. LAW OF MASS ACTION (Guldberg and Waage, 1864)
The rate at which a substance reacts is directly proportional to its active mass, and the rate of a chemical reaction is directly proportional to the product of active masses of reacting substances.
For general reaction: aA + bB ⇌ cC + dD
Equilibrium Constant: Kc = ([C]^c · [D]^d) / ([A]^a · [B]^b).`,
            theoryNotes: `### 1.1 Significance of Kc
* Very large Kc: Reaction is almost complete (products favored).
* Very small Kc: Reaction hardly proceeds (reactants favored).
* If Qc < Kc: Reaction proceeds in forward direction.
* If Qc > Kc: Reaction proceeds in reverse direction.
* If Qc = Kc: System is at equilibrium.`,
            keyFormulas: `* Kc = [Products]^coefficients / [Reactants]^coefficients
* If Qc < Kc -> Forward reaction
* If Qc > Kc -> Reverse reaction`,
            videoUrl: "",
          },
          {
            chapterNumber: 2,
            title: "Acids, Bases and Salts",
            description: "Theories of acids and bases (Arrhenius, Brønsted-Lowry, Lewis), pH scale, and salt preparation.",
            learningObjectives: [
              "Compare Arrhenius, Brønsted-Lowry, and Lewis concepts of acids and bases",
              "Define pH and pOH and solve calculations",
              "Classify salts and describe their preparation and uses",
            ],
            textbookContent: `Chapter 2: Acids, Bases and Salts

1. THEORIES OF ACIDS AND BASES
- Arrhenius Concept:
  * Acid: Produces H⁺ ions in aqueous solution (e.g. HCl → H⁺ + Cl⁻).
  * Base: Produces OH⁻ ions in aqueous solution (e.g. NaOH → Na⁺ + OH⁻).
- Brønsted-Lowry Concept:
  * Acid: Proton (H⁺) donor.
  * Base: Proton (H⁺) acceptor.
- Lewis Concept:
  * Acid: Electron pair acceptor (e.g. BF₃, AlCl₃).
  * Base: Electron pair donor (e.g. NH₃, H₂O).

2. pH AND pOH SCALE
pH = -log[H⁺]
pOH = -log[OH⁻]
In pure water at 25°C: [H⁺][OH⁻] = Kw = 1.0 × 10⁻¹⁴
pH + pOH = 14.
- Neutral: pH = 7
- Acidic: pH < 7
- Basic: pH > 7`,
            theoryNotes: `### 2.1 Types of Salts
* **Normal Salts:** Formed by complete neutralization of an acid by a base (e.g. NaCl, K₂SO₄).
* **Acidic Salts:** Formed by partial neutralization of a polyprotic acid (e.g. NaHCO₃, NaHSO₄).
* **Basic Salts:** Formed by incomplete neutralization of a polyhydroxy base (e.g. Pb(OH)Cl).`,
            keyFormulas: `* pH = -log₁₀[H⁺]
* pOH = -log₁₀[OH⁻]
* pH + pOH = 14
* Kw = [H⁺][OH⁻] = 1.0 × 10⁻¹⁴ (at 25°C)`,
            videoUrl: "",
          },
        ],
      },
      {
        name: "Mathematics",
        code: "MATH-10",
        icon: "Calculator",
        color: "amber",
        bookTitle: "Secondary Stage Mathematics (Class X)",
        chapters: [
          {
            chapterNumber: 1,
            title: "Sets and Functions",
            description: "Operations on sets, Venn diagrams, Cartesian products, binary relations, and function classifications.",
            learningObjectives: [
              "Perform set operations and verify distributive and De Morgan's laws",
              "Define Cartesian product and binary relations",
              "Differentiate injective (into), surjective (onto), and bijective (one-to-one correspondence) functions",
            ],
            textbookContent: `Chapter 1: Sets and Functions

1. CARTESIAN PRODUCT
The Cartesian product of two non-empty sets A and B, denoted by A × B, is the set of all ordered pairs (a, b) such that a ∈ A and b ∈ B:
A × B = {(a, b) | a ∈ A, b ∈ B}.
If n(A) = p and n(B) = q, then n(A × B) = p · q.

2. BINARY RELATIONS
Any subset R ⊆ A × B is called a binary relation from A into B.

3. FUNCTIONS (MAPPINGS)
A relation f from A to B is a function (written f: A → B) if:
1. Domain of f = A
2. For every x ∈ A, there is a unique y ∈ B such that (x, y) ∈ f.
Types:
- One-to-One (Injective): Different elements of A have different images in B.
- Onto (Surjective): Range of f = B (co-domain).
- Bijective: Both one-to-one and onto.`,
            theoryNotes: `### 1.1 De Morgan's Laws
* (A ∪ B)' = A' ∩ B'
* (A ∩ B)' = A' ∪ B'`,
            keyFormulas: `* n(A × B) = n(A) · n(B)
* Number of binary relations on A = 2^(n(A)²)
* Bijective = Injective + Surjective`,
            videoUrl: "",
          },
        ],
      },
    ],
  },

  // =========================================================================
  // CLASS 11 (Intermediate Part I - HSSC Part I - STBB Jamshoro)
  // =========================================================================
  {
    grade: 11,
    subjects: [
      {
        name: "Physics",
        code: "PHY-11",
        icon: "Zap",
        color: "blue",
        bookTitle: "Physics for Class XI (Higher Secondary Stage)",
        chapters: [
          {
            chapterNumber: 1,
            title: "Scope of Physics and Measurements",
            description: "Units, dimensions, errors, uncertainties, and dimensional analysis.",
            learningObjectives: [
              "Understand scientific notation, fractional and percentage uncertainty",
              "Perform dimensional analysis to check equation homogeneity",
              "Derive physical formulas using dimensions",
            ],
            textbookContent: `Chapter 1: Scope of Physics and Measurements

1. PHYSICAL DIMENSIONS
Dimensions represent the physical nature of a quantity:
- Mass: [M]
- Length: [L]
- Time: [T]
- Velocity: [L T⁻¹]
- Acceleration: [L T⁻²]
- Force: [M L T⁻²]
- Work / Energy: [M L² T⁻²]
- Power: [M L² T⁻³]
- Pressure: [M L⁻¹ T⁻²]

2. PRINCIPLE OF HOMOGENEITY
A physical equation is correct only if dimensions of all terms on both sides of the equation are identical.`,
            theoryNotes: `### 1.1 Uncertainty in Calculations
* In addition/subtraction: Absolute uncertainties are added.
* In multiplication/division: Percentage uncertainties are added.
* For power factor: Percentage uncertainty is multiplied by power.`,
            keyFormulas: `* % Uncertainty = (Absolute Uncertainty / Measured Value) × 100%
* Dimensions of G: [M⁻¹ L³ T⁻²]
* Dimensions of h (Planck's constant): [M L² T⁻¹]`,
            videoUrl: "",
          },
          {
            chapterNumber: 2,
            title: "Scalars and Vectors",
            description: "Vector addition by rectangular components, scalar product, vector product, and torque.",
            learningObjectives: [
              "Resolve vectors into rectangular components in 2D and 3D",
              "Compute scalar (dot) and vector (cross) products with properties",
              "Determine torque and equilibrium conditions",
            ],
            textbookContent: `Chapter 2: Scalars and Vectors

1. RECTANGULAR COMPONENTS
Resolving vector A in Cartesian coordinates:
Ax = A cos(θ)
Ay = A sin(θ)
Magnitude: A = √(Ax² + Ay²)
Direction: θ = tan⁻¹(Ay / Ax)

2. SCALAR (DOT) PRODUCT
A · B = |A||B| cos(θ)
Properties:
- Commutative: A · B = B · A
- i · i = j · j = k · k = 1
- i · j = j · k = k · i = 0
- Work done: W = F · d

3. VECTOR (CROSS) PRODUCT
A × B = |A||B| sin(θ) n̂
Properties:
- Anti-commutative: A × B = -(B × A)
- i × i = j × j = k × k = 0
- i × j = k, j × k = i, k × i = j`,
            theoryNotes: `### 2.1 Torque
τ = r × F = |r||F| sin(θ) n̂`,
            keyFormulas: `* A · B = AxBx + AyBy + AzBz
* cos(θ) = (A · B) / (|A||B|)
* A × B = det([i, j, k; Ax, Ay, Az; Bx, By, Bz])
* τ = r × F`,
            videoUrl: "",
          },
          {
            chapterNumber: 3,
            title: "Motion in One and Two Dimensions",
            description: "Projectile motion, maximum height, time of flight, horizontal range, and trajectory.",
            learningObjectives: [
              "Analyze projectile motion in horizontal and vertical components",
              "Derive formulas for time of flight, maximum height, and horizontal range",
              "Identify angle of projection for maximum range (45°)",
            ],
            textbookContent: `Chapter 3: Motion in One and Two Dimensions

1. PROJECTILE MOTION
Two-dimensional motion under constant acceleration due to gravity:
- Horizontal Component: ax = 0 => vx = vi cos(θ) (constant velocity).
- Vertical Component: ay = -g => vy = vi sin(θ) − gt (constant acceleration).

2. KEY PROJECTILE FORMULAS
- Maximum Height (H):
  H = (vi² · sin²θ) / (2g)
- Time to reach top:
  t = (vi · sinθ) / g
- Total Time of Flight (T):
  T = (2 · vi · sinθ) / g
- Horizontal Range (R):
  R = (vi² · sin 2θ) / g
  Maximum range occurs at θ = 45°, where sin 2(45°) = sin 90° = 1:
  R_max = vi² / g.`,
            theoryNotes: `### 3.1 Trajectory Equation
The path followed by a projectile is a parabola:
y = x · tan(θ) − [g · x²] / [2 · vi² · cos²(θ)]`,
            keyFormulas: `* H = (vi² sin²θ) / 2g
* T = (2 vi sinθ) / g
* R = (vi² sin 2θ) / g
* R_max = vi² / g (at θ = 45°)`,
            videoUrl: "",
          },
        ],
      },
      {
        name: "Chemistry",
        code: "CHEM-11",
        icon: "FlaskConical",
        color: "emerald",
        bookTitle: "Chemistry for Class XI (Higher Secondary Stage)",
        chapters: [
          {
            chapterNumber: 1,
            title: "Stoichiometry",
            description: "Mole concept, molar volume, stoichiometry calculations, limiting reactant, and percentage yield.",
            learningObjectives: [
              "Perform calculations involving mole, mass, volume, and number of particles",
              "Identify limiting reactant in chemical reactions",
              "Calculate theoretical yield, actual yield, and percentage yield",
            ],
            textbookContent: `Chapter 1: Stoichiometry

1. STOICHIOMETRY
The branch of chemistry that deals with quantitative relationships between reactants and products in a balanced chemical equation.
Conditions:
- Balanced chemical equation must be known.
- Reactants completely convert to products.
- Law of Conservation of Mass and Law of Definite Proportions are obeyed.

2. LIMITING REACTANT
The reactant that is completely consumed first in a chemical reaction and limits the amount of product formed.
Steps to identify limiting reactant:
1. Calculate moles of each reactant.
2. Determine moles of product each reactant can produce.
3. The reactant producing the smallest amount of product is the limiting reactant.

3. PERCENTAGE YIELD
Percentage Yield = (Actual Yield / Theoretical Yield) × 100%`,
            theoryNotes: `### 1.1 Molar Volume
One mole of any ideal gas at STP (0°C / 273 K and 1 atm pressure) occupies 22.414 dm³ (liters).`,
            keyFormulas: `* Moles = Mass (g) / Molar Mass (g/mol)
* Volume of gas at STP = Moles × 22.414 dm³
* % Yield = (Actual Yield / Theoretical Yield) × 100%`,
            videoUrl: "",
          },
          {
            chapterNumber: 2,
            title: "Atomic Structure and Quantum Numbers",
            description: "Bohr's theory, de Broglie hypothesis, Heisenberg uncertainty principle, and quantum numbers.",
            learningObjectives: [
              "Explain Bohr's model of hydrogen atom and its limitations",
              "Understand quantum numbers: n, l, m, s",
              "Apply Aufbau principle, Pauli exclusion principle, and Hund's rule",
            ],
            textbookContent: `Chapter 2: Atomic Structure

1. QUANTUM NUMBERS
Four quantum numbers completely describe the state of an electron in an atom:
- Principal Quantum Number (n): Main energy level / shell (n = 1, 2, 3, 4...).
- Azimuthal Quantum Number (l): Subshell and orbital shape (l = 0 to n-1).
  l=0 (s, spherical), l=1 (p, dumbbell), l=2 (d, double dumbbell), l=3 (f).
- Magnetic Quantum Number (m): Spatial orientation of orbital (m = -l to +l).
- Spin Quantum Number (s): Direction of electron spin (s = +½ or -½).

2. ELECTRONIC CONFIGURATION RULES
- Aufbau Principle: Electrons fill subshells in order of increasing (n + l) energy.
- Pauli's Exclusion Principle: No two electrons in an atom can have the same set of four quantum numbers.
- Hund's Rule: Electrons occupy degenerate orbitals singly with parallel spins before pairing up.`,
            theoryNotes: `### 2.1 Planck's Quantum Theory
Energy of a photon: E = h·ν = h·c / λ
where h = 6.626 × 10⁻³⁴ J·s.`,
            keyFormulas: `* E = hν = hc / λ
* de Broglie: λ = h / (mv)
* Heisenberg: Δx · Δp ≥ h / (4π)`,
            videoUrl: "",
          },
        ],
      },
      {
        name: "Mathematics",
        code: "MATH-11",
        icon: "Calculator",
        color: "amber",
        bookTitle: "Mathematics Part I (Class XI)",
        chapters: [
          {
            chapterNumber: 1,
            title: "Complex Numbers",
            description: "Real and imaginary numbers, geometric representation in Argand diagram, modulus, and De Moivre's theorem.",
            learningObjectives: [
              "Represent complex numbers geometrically on the Argand plane",
              "Find modulus and argument of complex numbers in polar form",
              "Apply De Moivre's Theorem: (cos θ + i sin θ)^n = cos(nθ) + i sin(nθ)",
            ],
            textbookContent: `Chapter 1: Complex Numbers

1. POLAR FORM OF COMPLEX NUMBER
Let z = x + yi.
x = r cos(θ), y = r sin(θ)
Modulus: r = |z| = √(x² + y²)
Argument: θ = arg(z) = tan⁻¹(y / x)
Polar Form: z = r (cos θ + i sin θ) = r · cis(θ) = r · e^(iθ).

2. DE MOIVRE'S THEOREM
For any real number θ and integer n:
[r(cos θ + i sin θ)]^n = r^n [cos(nθ) + i sin(nθ)].`,
            theoryNotes: `### 1.1 Properties of Modulus
* |z₁ · z₂| = |z₁| · |z₂|
* |z₁ / z₂| = |z₁| / |z₂|
* |z₁ + z₂| ≤ |z₁| + |z₂| (Triangle Inequality)`,
            keyFormulas: `* z = r(cos θ + i sin θ)
* r = √(x² + y²)
* De Moivre: (cos θ + i sin θ)^n = cos(nθ) + i sin(nθ)`,
            videoUrl: "",
          },
          {
            chapterNumber: 2,
            title: "Matrices and Determinants",
            description: "Matrix algebra, determinant properties, adjoint, inverse, and Cramer's rule for linear systems.",
            learningObjectives: [
              "Evaluate determinants of 3×3 matrices using row/column expansion and properties",
              "Find adjoint and inverse of 3×3 square matrices",
              "Solve systems of non-homogeneous linear equations using Cramer's rule",
            ],
            textbookContent: `Chapter 2: Matrices and Determinants

1. INVERSE OF A MATRIX
For a non-singular matrix A (|A| ≠ 0):
A⁻¹ = adj(A) / |A|
where adj(A) is the transpose of cofactor matrix.

2. CRAMER'S RULE
For a system of 3 linear equations:
a₁x + b₁y + c₁z = d₁
a₂x + b₂y + c₂z = d₂
a₃x + b₃y + c₃z = d₃

Let D = |A|.
If D ≠ 0:
x = Dx / D,  y = Dy / D,  z = Dz / D.`,
            theoryNotes: `### 2.1 Properties of Determinants
* If any row or column is all zeros, |A| = 0.
* If two rows or columns are identical, |A| = 0.
* Interchanging any two rows or columns changes sign of determinant: |A'| = -|A|.`,
            keyFormulas: `* A⁻¹ = adj(A) / det(A)
* Cramer's Rule: x = Dx/D, y = Dy/D, z = Dz/D
* det(AB) = det(A) · det(B)`,
            videoUrl: "",
          },
        ],
      },
    ],
  },

  // =========================================================================
  // CLASS 12 (Intermediate Part II - HSSC Part II - STBB Jamshoro)
  // =========================================================================
  {
    grade: 12,
    subjects: [
      {
        name: "Physics",
        code: "PHY-12",
        icon: "Zap",
        color: "blue",
        bookTitle: "Physics for Class XII (Higher Secondary Stage)",
        chapters: [
          {
            chapterNumber: 11,
            title: "Heat and Thermodynamics",
            description: "Kinetic theory of gases, First and Second laws of thermodynamics, Carnot cycle, and entropy.",
            learningObjectives: [
              "Derive pressure of gas from kinetic theory: P = (1/3)ρ<c²>",
              "Apply First Law of Thermodynamics: ΔQ = ΔU + ΔW to isobaric, isothermal, and adiabatic processes",
              "Calculate maximum thermal efficiency of Carnot engine",
            ],
            textbookContent: `Chapter 11: Heat and Thermodynamics

1. KINETIC THEORY OF GASES
Pressure exerted by an ideal gas:
P = ⅓ · ρ · <v²> = ⅔ · (N/V) · [½ · m · <v²>]
Average translational kinetic energy per molecule:
<KE> = (3/2) · kB · T

2. FIRST LAW OF THERMODYNAMICS
Energy added to system as heat (ΔQ) equals increase in internal energy (ΔU) plus work done by system (ΔW):
ΔQ = ΔU + P·ΔV
- Isothermal process (T constant): ΔU = 0 => ΔQ = ΔW = nRT ln(V₂/V₁).
- Adiabatic process (ΔQ = 0): ΔW = -ΔU => PV^γ = constant.
- Isochoric process (V constant): ΔW = 0 => ΔQ = ΔU = nCvΔT.
- Isobaric process (P constant): ΔQ = ΔU + PΔV = nCpΔT.

3. CARNOT ENGINE AND SECOND LAW
Maximum possible efficiency of an engine operating between temperatures T₁ (hot) and T₂ (cold):
η = (T₁ − T₂) / T₁ = 1 − (T₂ / T₁) (Temperatures in Kelvin).`,
            theoryNotes: `### 11.1 Entropy (S)
Measure of molecular disorder or randomness in a system:
ΔS = ΔQ / T.
In any natural spontaneous process, entropy of the universe always increases (Second Law).`,
            keyFormulas: `* PV = nRT = N·kB·T
* ΔQ = ΔU + W
* Carnot: η = 1 − (T₂ / T₁)
* Cp − Cv = R`,
            videoUrl: "",
          },
          {
            chapterNumber: 12,
            title: "Electrostatics",
            description: "Coulomb's law, electric field intensity, Gauss's law and applications, capacitors and energy storage.",
            learningObjectives: [
              "Apply Coulomb's Law in vector form for point charges",
              "Calculate electric field and potential due to point and continuous charge distributions",
              "Apply Gauss's Law to find field of infinite sheet and spherical shell",
              "Calculate equivalent capacitance in series and parallel combinations",
            ],
            textbookContent: `Chapter 12: Electrostatics

1. COULOMB'S LAW
The electrostatic force between two point charges q₁ and q₂ separated by distance r:
F = (1 / 4πε₀) · (q₁ · q₂) / r² = k · (q₁ · q₂) / r²
where k = 9.0 × 10⁹ N·m²/C² and ε₀ = 8.85 × 10⁻¹² C²/(N·m²).

2. ELECTRIC FIELD AND GAUSS'S LAW
- Electric field intensity: E = F / q₀ (N/C or V/m).
- Electric potential: V = k · q / r (Volts).
- Gauss's Law: Total electric flux through any closed surface is 1/ε₀ times the total charge enclosed:
  Φ = ∮ E · dA = Q_enclosed / ε₀.

3. CAPACITANCE
C = Q / V.
Parallel Plate Capacitor: C = (ε₀ · εr · A) / d.
- Capacitors in Series: 1/Ceq = 1/C₁ + 1/C₂ + 1/C₃
- Capacitors in Parallel: Ceq = C₁ + C₂ + C₃
Energy stored in capacitor: U = ½ · C · V² = ½ · Q · V = ½ · (Q² / C).`,
            theoryNotes: `### 12.1 Electric Potential vs Electric Field
E = - dV / dr (Electric field is the negative gradient of potential).`,
            keyFormulas: `* F = k(q₁q₂) / r²
* E = kq / r²
* V = kq / r
* C = Q / V = ε₀A / d
* U = ½CV²`,
            videoUrl: "",
          },
          {
            chapterNumber: 13,
            title: "Current Electricity",
            description: "Ohm's law, temperature coefficient of resistance, Kirchhoff's rules, and Wheatstone bridge.",
            learningObjectives: [
              "Understand drift velocity and microscopic model of conduction",
              "State and apply Kirchhoff's Current Law (KCL) and Voltage Law (KVL)",
              "Explain Wheatstone bridge balance condition and potentiometer applications",
            ],
            textbookContent: `Chapter 13: Current Electricity

1. OHM'S LAW AND RESISTIVITY
V = I · R
R = ρ · (L / A)
where ρ is the resistivity of the material (Ω·m).
Temperature dependence of resistance:
Rt = R₀ (1 + α · ΔT)
where α is the temperature coefficient of resistance.

2. KIRCHHOFF'S RULES
- Kirchhoff's Current Rule (Junction Rule): Sum of all currents meeting at a junction is zero (Conservation of Charge):
  ΣI_in = ΣI_out.
- Kirchhoff's Voltage Rule (Loop Rule): In any closed loop, the algebraic sum of potential differences (including EMFs) is zero (Conservation of Energy):
  ΣV = 0.

3. WHEATSTONE BRIDGE
Four resistors P, Q, R, S connected in a diamond bridge with galvanometer:
When no current flows through galvanometer (bridge balanced):
P / Q = R / S.`,
            theoryNotes: `### 13.1 Potentiometer
An instrument that measures unknown potential difference without drawing any current from the circuit (ideal voltmeter):
E₁ / E₂ = L₁ / L₂.`,
            keyFormulas: `* V = IR
* R = ρL / A
* Rt = R₀(1 + αΔT)
* Wheatstone: P/Q = R/S
* P = VI = I²R = V²/R`,
            videoUrl: "",
          },
        ],
      },
      {
        name: "Chemistry",
        code: "CHEM-12",
        icon: "FlaskConical",
        color: "emerald",
        bookTitle: "Chemistry for Class XII (Higher Secondary Stage)",
        chapters: [
          {
            chapterNumber: 1,
            title: "Periodic Classification of Elements and Periodicity",
            description: "Modern periodic table, s, p, d, f blocks, electronic configurations, and periodic trends in properties.",
            learningObjectives: [
              "Classify elements into s, p, d, and f blocks based on electronic configuration",
              "Discuss trends in atomic and ionic radii, ionization energy, and electron affinity",
              "Explain hydration energy and oxidation states across periods and down groups",
            ],
            textbookContent: `Chapter 1: Periodic Classification of Elements and Periodicity

1. CLASSIFICATION BY ORBITAL BLOCKS
- s-Block: Groups 1 and 2 (Alkali and Alkaline Earth metals). General configuration: ns¹⁻².
- p-Block: Groups 13 to 18 (Boron, Carbon, Nitrogen, Oxygen, Halogens, Noble gases). General configuration: ns² np¹⁻⁶.
- d-Block: Groups 3 to 12 (Transition elements). General configuration: (n-1)d¹⁻¹⁰ ns¹⁻².
- f-Block: Lanthanides and Actinides (Inner transition elements). General configuration: (n-2)f¹⁻¹⁴ (n-1)d⁰⁻¹ ns².

2. PERIODIC TRENDS
- Oxidation States: s-block elements show fixed oxidation states (+1 for alkali, +2 for alkaline earth). Transition elements show variable oxidation states.
- Hydration Energy: Heat released when 1 mole of gaseous ions dissolve in water. Decreases down group as ionic radius increases: ΔH_hyd ∝ (charge / radius).`,
            theoryNotes: `### 1.1 Diagonal Relationships
Similarity between pairs of diagonally adjacent elements in second and third periods (Li-Mg, Be-Al, B-Si) due to similar charge-to-size ratios.`,
            keyFormulas: `* Hydration Energy ∝ Charge / Ionic Radius
* Effective Nuclear Charge: Z_eff = Z − S (Slater's rule)`,
            videoUrl: "",
          },
          {
            chapterNumber: 2,
            title: "Fundamental Principles of Organic Chemistry",
            description: "Catenation, hybridization in carbon, functional groups, and structural and geometric isomerism.",
            learningObjectives: [
              "Explain sp³, sp², and sp hybridization in carbon with molecular geometry",
              "Classify organic compounds by functional groups and homologous series",
              "Distinguish between structural isomerism (chain, position, functional) and geometric (cis-trans) isomerism",
            ],
            textbookContent: `Chapter 2: Fundamental Principles of Organic Chemistry

1. SPECIAL NATURE OF CARBON
- Catenation: The unique ability of carbon atoms to form strong covalent bonds with other carbon atoms, forming long chains, branches, and rings.
- Hybridization:
  * sp³ Hybridization: Tetrahedral geometry (109.5°), 4 sigma bonds (e.g. Methane CH₄, Ethane C₂H₆).
  * sp² Hybridization: Trigonal planar geometry (120°), 3 sigma bonds + 1 pi bond (e.g. Ethene C₂H₄).
  * sp Hybridization: Linear geometry (180°), 2 sigma bonds + 2 pi bonds (e.g. Ethyne C₂H₂).

2. ISOMERISM
Compounds with the same molecular formula but different structural arrangements or spatial orientations:
- Structural Isomerism:
  * Chain Isomerism (e.g. n-butane and isobutane)
  * Position Isomerism (e.g. 1-propanol and 2-propanol)
  * Functional Group Isomerism (e.g. ethanol and dimethyl ether)
- Stereoisomerism:
  * Geometric (cis-trans) Isomerism: Due to restricted rotation around C=C double bond.`,
            theoryNotes: `### 2.1 Functional Groups Overview
* Alcohol: -OH
* Aldehyde: -CHO
* Ketone: -CO-
* Carboxylic Acid: -COOH
* Ester: -COOR
* Ether: -O-
* Amine: -NH₂`,
            keyFormulas: `* General alkane: CnH2n+2
* General alkene: CnH2n
* General alkyne: CnH2n-2`,
            videoUrl: "",
          },
        ],
      },
      {
        name: "Mathematics",
        code: "MATH-12",
        icon: "Calculator",
        color: "amber",
        bookTitle: "Mathematics Part II (Class XII)",
        chapters: [
          {
            chapterNumber: 1,
            title: "Functions and Limits",
            description: "Concept of function, domain and range, evaluation of limits, Sandwich theorem, and continuity.",
            learningObjectives: [
              "Determine domain and range of algebraic, rational, and trigonometric functions",
              "Evaluate limits using algebraic techniques and Sandwich Theorem",
              "State and prove limit as x->0 of (sin x)/x = 1 (in radians)",
            ],
            textbookContent: `Chapter 1: Functions and Limits

1. FUNCTIONS
A rule that assigns to each element x in set X exactly one element y in set Y: y = f(x).
- Domain: Set of all permissible input values.
- Range: Set of all actual output values.

2. IMPORTANT LIMIT THEOREMS
- lim_{x→a} [f(x) ± g(x)] = lim f(x) ± lim g(x)
- lim_{x→a} [f(x) · g(x)] = lim f(x) · lim g(x)
- lim_{x→0} [sin(x) / x] = 1 (where x is in radians)
- lim_{n→∞} [1 + 1/n]^n = e ≈ 2.71828...
- lim_{x→0} [1 + x]^(1/x) = e
- lim_{x→0} [(a^x − 1) / x] = ln(a)`,
            theoryNotes: `### 1.1 Continuity at a Point
A function f(x) is continuous at x = c if:
1. f(c) is defined.
2. lim_{x→c} f(x) exists (Left hand limit = Right hand limit).
3. lim_{x→c} f(x) = f(c).`,
            keyFormulas: `* lim_{x→0} (sin x)/x = 1
* lim_{n→∞} (1 + 1/n)^n = e
* lim_{x→0} (a^x − 1)/x = ln a`,
            videoUrl: "",
          },
          {
            chapterNumber: 2,
            title: "Differentiation",
            description: "Derivative definition, power rule, product rule, quotient rule, chain rule, and derivatives of trigonometric functions.",
            learningObjectives: [
              "Define derivative as limit of difference quotient: f'(x) = lim_{h->0} [f(x+h) - f(x)] / h",
              "Apply product, quotient, and chain rules to differentiate composite functions",
              "Find equations of tangent and normal to curves and calculate extrema",
            ],
            textbookContent: `Chapter 2: Differentiation

1. DEFINITION OF DERIVATIVE
The derivative of f(x) with respect to x:
f'(x) = dy/dx = lim_{Δx→0} [f(x + Δx) − f(x)] / Δx.

2. DIFFERENTIATION RULES
- Power Rule: d/dx (x^n) = n · x^(n-1)
- Constant Multiple: d/dx [c · f(x)] = c · f'(x)
- Sum/Difference: d/dx [f(x) ± g(x)] = f'(x) ± g'(x)
- Product Rule: d/dx [u · v] = u · (dv/dx) + v · (du/dx)
- Quotient Rule: d/dx [u / v] = [v · (du/dx) − u · (dv/dx)] / v²
- Chain Rule: dy/dx = (dy/du) · (du/dx)

3. DERIVATIVES OF TRIGONOMETRIC FUNCTIONS
- d/dx (sin x) = cos x
- d/dx (cos x) = -sin x
- d/dx (tan x) = sec² x
- d/dx (sec x) = sec x tan x
- d/dx (csc x) = -csc x cot x
- d/dx (cot x) = -csc² x`,
            theoryNotes: `### 2.1 Maxima and Minima
* Critical points: f'(x) = 0 or f'(x) does not exist.
* Second Derivative Test:
  - If f'(c) = 0 and f''(c) < 0 => Relative Maximum at x = c.
  - If f'(c) = 0 and f''(c) > 0 => Relative Minimum at x = c.`,
            keyFormulas: `* d/dx(x^n) = n x^(n-1)
* d/dx(uv) = u v' + v u'
* d/dx(u/v) = (v u' − u v') / v²
* d/dx(e^x) = e^x, d/dx(ln x) = 1/x`,
            videoUrl: "",
          },
          {
            chapterNumber: 3,
            title: "Integration",
            description: "Indefinite and definite integrals, integration by substitution, integration by parts, and area under curve.",
            learningObjectives: [
              "Understand integration as anti-differentiation",
              "Apply integration by parts: ∫ u dv = uv - ∫ v du",
              "Evaluate definite integrals and calculate area under curve",
            ],
            textbookContent: `Chapter 3: Integration

1. INDEFINITE INTEGRATION
Integration is the reverse process of differentiation:
If d/dx [F(x)] = f(x), then ∫ f(x) dx = F(x) + c (where c is the constant of integration).

2. BASIC INTEGRATION FORMULAS
- ∫ x^n dx = [x^(n+1)] / (n + 1) + c (n ≠ -1)
- ∫ (1/x) dx = ln|x| + c
- ∫ e^(kx) dx = [e^(kx)] / k + c
- ∫ sin(x) dx = -cos(x) + c
- ∫ cos(x) dx = sin(x) + c
- ∫ sec²(x) dx = tan(x) + c

3. INTEGRATION BY PARTS
For two functions u and v:
∫ u · (dv/dx) dx = u · v − ∫ v · (du/dx) dx
Choice of u follows ILATE rule:
Inverse trigonometric, Logarithmic, Algebraic, Trigonometric, Exponential.`,
            theoryNotes: `### 3.1 Fundamental Theorem of Calculus
If f(x) is continuous on [a, b] and F'(x) = f(x):
∫_a^b f(x) dx = F(b) − F(a).
Represents the area bounded by y = f(x), x-axis, and lines x = a and x = b.`,
            keyFormulas: `* ∫ x^n dx = x^(n+1)/(n+1) + c
* ∫ u v' dx = uv − ∫ v u' dx
* Area = ∫_a^b y dx`,
            videoUrl: "",
          },
        ],
      },
    ],
  },
];
